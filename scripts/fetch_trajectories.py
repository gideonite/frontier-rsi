"""Download the public FrontierRSI trial index and trajectories from Oddish.

Usage: python3 scripts/fetch_trajectories.py [OUT_DIR] [--workers N]

Writes:
  OUT_DIR/experiment.json       share settings and metadata
  OUT_DIR/results.ndjson        raw index (experiment, task and trial rows)
  OUT_DIR/trials.jsonl          one trial row per line (convenience copy)
  OUT_DIR/tasks.jsonl           one task row per line
  OUT_DIR/trajectories/<trial_id>.json.gz   ATIF trajectory per trial

Resumable: existing trajectory files are skipped. Re-run to fill gaps.
Uses only the public, unauthenticated share endpoints.
"""

import argparse
import concurrent.futures as cf
import gzip
import json
import os
import sys
import time
import urllib.error
import urllib.request

BASE = "https://www.oddish.app/api/public/experiments"
TOKEN = "rMZ7IAhVm7KezyUIqOXWoxbn84mPwvQaKfcqrvLq784"
UA = "frontier-rsi-trajectory-fetch/1.0"


def get(url, retries=5, timeout=300):
    delay = 2.0
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return resp.read()
        except urllib.error.HTTPError as e:
            if e.code in (404, 410, 403):
                raise
            err = e
        except (urllib.error.URLError, TimeoutError, ConnectionError) as e:
            err = e
        if attempt < retries - 1:
            time.sleep(delay)
            delay *= 2
    raise err


def write_atomic(path, data):
    tmp = path + ".part"
    with open(tmp, "wb") as f:
        f.write(data)
    os.replace(tmp, path)


def fetch_trajectory(out_dir, trial_id):
    path = os.path.join(out_dir, "trajectories", f"{trial_id}.json.gz")
    if os.path.exists(path):
        return trial_id, "skip", 0
    try:
        raw = get(f"{BASE}/{TOKEN}/trials/{trial_id}/trajectory")
    except urllib.error.HTTPError as e:
        return trial_id, f"http {e.code}", 0
    except Exception as e:  # noqa: BLE001
        return trial_id, f"error {type(e).__name__}: {e}", 0
    json.loads(raw)  # validate before saving
    write_atomic(path, gzip.compress(raw, compresslevel=6))
    return trial_id, "ok", len(raw)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("out_dir", nargs="?", default="data/oddish")
    ap.add_argument("--workers", type=int, default=4)
    args = ap.parse_args()
    out = args.out_dir
    os.makedirs(os.path.join(out, "trajectories"), exist_ok=True)

    write_atomic(os.path.join(out, "experiment.json"), get(f"{BASE}/{TOKEN}"))
    raw = get(f"{BASE}/{TOKEN}/results")
    write_atomic(os.path.join(out, "results.ndjson"), raw)

    rows = [json.loads(l) for l in raw.decode().splitlines() if l.strip()]
    trials = [r["trial"] for r in rows if r.get("type") == "trial"]
    tasks = [r["task"] for r in rows if r.get("type") == "task"]
    with open(os.path.join(out, "trials.jsonl"), "w") as f:
        f.writelines(json.dumps(t) + "\n" for t in trials)
    with open(os.path.join(out, "tasks.jsonl"), "w") as f:
        f.writelines(json.dumps(t) + "\n" for t in tasks)

    todo = [t["id"] for t in trials if t.get("has_trajectory")]
    print(f"{len(trials)} trials, {len(tasks)} tasks, {len(todo)} with trajectories", flush=True)

    done = failed = 0
    total_bytes = 0
    failures = []
    with cf.ThreadPoolExecutor(max_workers=args.workers) as ex:
        futs = [ex.submit(fetch_trajectory, out, tid) for tid in todo]
        for i, fut in enumerate(cf.as_completed(futs), 1):
            tid, status, n = fut.result()
            if status in ("ok", "skip"):
                done += 1
                total_bytes += n
            else:
                failed += 1
                failures.append((tid, status))
            if status != "skip" or i % 50 == 0:
                print(f"[{i}/{len(todo)}] {status:8s} {tid} {n/1e6:.1f}MB", flush=True)

    with open(os.path.join(out, "failures.json"), "w") as f:
        json.dump(failures, f, indent=1)
    print(f"done: {done} ok/skipped, {failed} failed, {total_bytes/1e9:.2f} GB downloaded this run")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
