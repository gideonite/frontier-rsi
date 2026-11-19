"""Kernel tasks: agent's self-reported sweep time (regex on final message; MANUAL CHECK needed) vs official raw (ms).
python3 -I analysis/selfreport_gap.py"""
import sys, re, json, collections
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace')
import load, outcome
M = outcome.task_meta()
NUM = r'(\d+(?:\.\d+)?)\s*(ms|µs|us)\b'
def claimed(msg):
    cands = []
    for m in re.finditer(r'sweep[^.\n]{0,100}?' + NUM, msg, re.I): cands.append((m.start(), float(m.group(1)) * (1e-3 if m.group(2) in ('µs', 'us') else 1)))
    if not cands:
        for m in re.finditer(NUM, msg): cands.append((m.start(), float(m.group(1)) * (1e-3 if m.group(2) in ('µs', 'us') else 1)))
    return cands[0][1] if cands else None
rows = []
for r in load.trials():
    if r['agent'] != 'claude-code' or not r['task'].startswith('kernel-') or r['raw_score'] is None: continue
    d = load.load_traj(r); msgs = [s['message'] for s in d['steps'] if s['source'] == 'agent' and (s.get('message') or '').strip()]
    c = claimed(msgs[-1]) if msgs else None
    rows.append(dict(trial_id=r['trial_id'], task=r['task'], model=r['model'], claimed_ms=c, official_ms=r['raw_score'], ambiguous=r['raw_score_ambiguous'],
                     ratio=(r['raw_score'] / c) if c else None))
json.dump(rows, open('/home/user/frontier-rsi/analysis/out/selfreport_gap_kernels.json', 'w'), indent=1)
by = collections.defaultdict(list)
for x in rows: by[x['task']].append(x)
for t, xs in sorted(by.items()):
    rs = [x['ratio'] for x in xs if x['ratio']]
    print(f"{t[:36]:36s} n={len(xs)} claimed={[round(x['claimed_ms'],3) if x['claimed_ms'] else None for x in xs]} official={[round(x['official_ms'],2) for x in xs]}")

# ---- does the agent's own final dev measurement rank trials like the official score does? (within task)
import math, random
sys.path.insert(0, '/home/user/frontier-rsi/analysis'); import compare
ok = [x for x in rows if x['claimed_ms']]
print('\nratio official/claimed per task (median, max/min):')
for t, xs in sorted(by.items()):
    rs = sorted(x['ratio'] for x in xs if x['ratio'])
    print(f"  {t[:36]:36s} median={rs[len(rs)//2]:.1f}x  max/min={rs[-1]/rs[0]:.1f}")
for x in ok: x['q'] = M[x['task']]['best'] / x['official_ms']; x['c'] = x['claimed_ms']
xs, ys, gs = compare.within(ok, 'c', lambda r: r['task'])
# lower claimed ms = better; lower official ms = higher q, so expect NEGATIVE rho between claimed_ms and q
rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=2000)
print(f"\nwithin-task Spearman(claimed_ms, official q) = {rho:+.2f} [{lo:+.2f},{hi:+.2f}] n={len(xs)}  (expected sign if dev metric tracked official: negative)")
