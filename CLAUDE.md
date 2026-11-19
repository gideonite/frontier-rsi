# Notes for future sessions

## Trajectory + score data (don't re-dig for it)
- Source of truth: private HF dataset `gideonite/frontier-rsi-bench-trajectories` (mirror of the oddish public share
  linked from frontier-rsi.org). 486 trajectories (9 models x 27 tasks x 2 trials), ATIF-v1.7, ~913 MB, plus
  `manifest.jsonl` (trial_meta incl. reward/outcome/tokens/cost, sha256) and `aggregate/data.js` (leaderboard).
  The repo itself has only 8 of the 27 task definitions and no results.
- Local copy: `data/hf/raw/<model>/<task>/<trial>.json` (gitignored, re-download from HF; verify with manifest sha256).
  `data/hf/manifest.jsonl`, `data/leaderboard_data.js`, `data/oddish_trials_meta.json` are committed.
- Unified table: `data/trials.jsonl` (one row per trial: model, task, reward, outcome, raw_score, tokens, cost,
  trajectory_path). Rebuild: `python3 -I scripts/build_dataset.py` from repo root.
- Caveats: `reward` is exact (from oddish). `raw_score` comes from the leaderboard and is joined by (model, task,
  reward); `raw_score_ambiguous=True` means two trials tied on reward so the raw value may be swapped. 13 trials
  have no raw (invalid/failed). The 28 nop_oracle baseline trials have no trajectories. grok-4.7 steps lack timestamps.
- Download gotcha: HF `resolve/main/...` redirects large files to `us.aws.cdn.hf.co`; use `curl -L`, and that host
  must be in the environment network allowlist (already added to env `frontier-rsi`). HF auth is injected by the proxy
  as a network secret (no token needed in curl).
- oddish API (public share token in README of the HF dataset): `/api/public/experiments/<share>/results` and
  `/api/public/experiments/<share>/trials/<id>/trajectory`.
