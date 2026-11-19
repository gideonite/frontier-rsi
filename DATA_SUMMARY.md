# FrontierRSI trace data: inventory, schema, limitations

Source: private HF mirror `gideonite/frontier-rsi-bench-trajectories` of the public oddish share (see `CLAUDE.md`). Nothing was re-fetched for this analysis;
everything reads `data/trials.jsonl` (one row/trial, built by `scripts/build_dataset.py`) and `data/hf/raw/**.json` (ATIF-v1.7 trajectories, gitignored).

## Coverage
- **486 trajectories = 9 models x 27 tasks x 2 trials** (every cell has exactly 2). 101,079 agent+user steps, ~0.9 GB.
- Models -> harness: Claude Fable 5.2 / Claude Opus 5.5 / Kimi K3.1 Pro -> `claude-code` (162 trials); GPT-6 Astra, GPT-6.1 Sol -> `codex`; Gemini 4 Carbon/Argon -> `antigravity-cli`;
  Grok 4.7 -> `grok-build`; Muse Wonder 1.0 -> `muse-code`. **Model is confounded with harness** (each harness has different tool names, message habits and logging).
- Tasks (27): pretraining (model-shape-efficiency, language-model-optimizer, training-objective-design, speculative-draft-training, long-sequence-computation), post-training RL-data design
  (pt-*, 5 tasks) and harness-building (swe-bench, bfcl, webarena), inference/serving (6), GPU kernels (9). Budgets 0.75-8 h; one H100 (two for disaggregated serving). The repo contains task definitions for only 8 of them.
- **Quantitative analysis here uses the `claude-code` subset (162 trials, 3 models, one tool schema: Bash/Read/Write/Edit/Agent)**. The other harnesses were inventoried but not analysed.

## Outcome measures
| field | meaning | caveat |
|---|---|---|
| `reward` | official FrontierRSI reward (relative to best valid trial from any model) | **zero-inflated**: 322/486 exactly 0, 28 exactly 1; useless for ranking weak runs |
| `raw_score` | task metric (ms, tok/s, loss, fraction solved...) | not in the oddish trial rows; joined from the leaderboard `data.js` by (model, task, reward). **268 rows `raw_score_ambiguous=True` (134 cells; corrected from an earlier 134)**: both trials of a cell tie on reward and have different raw values, so the two raw values may be swapped between them. Not resolvable deterministically (id-order heuristic right in 92% of checkable cells); excluding them conditions on outcome, so prefer the swap-invariant cell-mean analysis (`analysis/cell_level.py`); **13 rows have no raw (None, i.e. invalid/failed, not 0)** |
| `q` (ours, `analysis/trace/outcome.py`) | closeness to best raw in [0,1]: best/raw (minimise) or raw/best (maximise) | undefined when raw is None; "best" is the best across all models so q is relative to this leaderboard, not to a true optimum |
| `status`, `outcome` | harbor stage / pass-fail | 3 trials have harbor status `failed` (cause not recorded), trajectories still present |
| tokens, `cost_usd` | per trial | Kimi costs are estimated, not billed |

Not available: grader logs, hidden-eval outputs, per-trial intermediate scores, the graded training run for post-training tasks (the agent submits data; the grader trains afterwards).

## What a trace contains
Per trajectory: `agent{name,version,model_name}`, `steps[]`, `final_metrics`. Step: `step_id`, `timestamp`, `source` (user/agent/system), `message`, `reasoning_content`, `tool_calls[]` (id, function_name, arguments),
`observation.results[]` (content keyed by `source_call_id`), `metrics` (prompt/completion/cached tokens, thinking tokens for some), `extra`.
Parallel tool calls share one step. **A step's wall time = gap to the next step's timestamp** (execution + model latency are not separable; background jobs make the gap uninformative).
Code edits are visible only as Write/Edit arguments or heredoc/sed text inside Bash commands; there is no diff object.

| model | agent steps | has `message` | has `reasoning_content` | timestamps |
|---|---|---|---|---|
| Claude Fable 5.2 | 11,481 | **1%** | **0%** | 100% |
| Claude Opus 5.5 | 10,749 | 12% | 2% | 100% |
| Kimi K3.1 Pro | 9,446 | 35% | 86% | 100% |
| Gemini 4 Argon / Carbon | 8,391 / 5,463 | 21% / 19% | 58% / 72% | 100% |
| Muse Wonder | 4,798 | 23% | 31% | 100% |
| GPT-6 Astra / 6.1 Sol | 13,253 / 17,561 | 36% / 31% | 0% | 100% |
| Grok 4.7 | 15,409 | 90% | 32% | **0%** |
(`analysis/data_quality.py`.) **Consequence: stated hypotheses can only be read for a minority of steps, and almost never for Fable.** Hypothesis-revision analysis from text is therefore not reliable for the best-scoring model.

## Comparability across attempts
Yes within a (model, task) cell (2 trials, same prompt/budget/hardware) and across models within a task (same prompt), subject to the harness confound. n=2 per cell means within-cell contrasts are anecdotal; pooled analyses use task-clustered bootstrap.

## Reproduce
```
python3 -I scripts/build_dataset.py        # data/trials.jsonl
python3 -I analysis/data_quality.py        # field availability, error signatures
python3 -I analysis/build_features.py       # analysis/out/features_claude_code.json
python3 -I analysis/compare.py             # within-task / within-pair associations
python3 -I analysis/official_runs.py       # precise experiment proxy (official-tool invocations)
python3 -I analysis/early_stop.py ; python3 -I analysis/selfreport_gap.py ; python3 -I analysis/feedback.py
python3 -I analysis/timeline.py ; python3 -I analysis/figs.py      # figures/
```
Provenance: every event keeps `(trial_id, step_id, call_id)` (`analysis/trace/load.py`); `analysis/trace/brief.py <trial_suffix> <start> <end> [outchars]` prints a trace for manual reading.
Missing vs zero: unmeasurable quantities are `None` (e.g. `t_first_exp_min`, `raw_score`), never 0.

## Known measurement weaknesses (of our own pipeline)
- **Experiment classifier** (`features.is_exp`: step >=60 s, or script name looks like bench/train/eval/test, or heredoc with timing keywords) was hand-checked on a 22-command sample: roughly **two-thirds precision**, and it misses commands where a heredoc follows a real run. Counts of `n_exp` are noisy; this attenuates associations toward 0. The cleaner proxy is `official_runs.py` (invocations of each task's own develop.py/score.py/train_rl.py/probe.py).
- "Last edit validated by an experiment" (`feedback.py`) disagreed with manual reading (reports Fable validating its final edit in only 9/54 trials); **treat as invalid and do not cite**.
- Self-reported numbers are regex-extracted from the final message (`selfreport_gap.py`) and were manually verified only for kernel-logit-selection.
