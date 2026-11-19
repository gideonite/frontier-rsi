# FINDINGS: how LLM agents conduct research on FrontierRSI (initial pass)

> **UPDATE (see `MEMO.md` §0-§2).** This first pass contained an error and three claims that were revised: (1) ambiguous raw scores are **268 trials / 134 cells**, not 134 trials (both trials of a tied cell are ambiguous); numbers below that say "non-ambiguous" were recomputed in `MEMO.md`/`analysis/robustness.py`. (2) Finding 1's *within-model* null is under-powered (42 cells), the between-model association survives a swap-invariant cell-level test. (3) Finding 2's explanation ("validation representativeness") is **retracted**: the traces support "one unobserved training run per candidate" instead. (4) Finding 3 is refined: official = dev + a per-task constant in 5 tasks, which compresses rewards. The text below is left as originally written except for this banner.

Scope: 162 `claude-code`-harness trajectories (Fable 5.2, Opus 5.5, Kimi K3.1 Pro; 27 tasks x 2 trials each) with outcome `q` = closeness to best raw score (see `DATA_SUMMARY.md`).
Other harnesses were not analysed. n=2 per (model, task); all CIs are task-cluster bootstrap. Observation, inference and speculation are labelled. Evidence cited as `trial_id#step` (`analysis/trace/brief.py`).
**No LLM-judge annotation was run** (see Phase 5 below); all qualitative readings are mine and are hypotheses.

## Summary of the three most interesting findings
1. **Experiment volume and effort do not predict research quality once the model is held fixed; the apparent signals are model composition.** Pooled within-task, "more official-tool runs per hour" correlates with *worse* outcomes (rho -0.35, CI [-0.48,-0.20]) and "first official run later" with better (+0.33 [+0.13,+0.51]); holding (model, task) fixed both vanish (-0.10 [-0.32,+0.13]; -0.07 [-0.28,+0.16]). Kimi runs ~2x as many official-tool experiments as the Claude models (median 16 vs 8 / 7) yet has the lowest median q (0.75 vs 0.89 / 0.91). `figures/feature_associations.png`.
2. **Self-validation fidelity separates runs better than anything we measured about process.** In `pt-multifile-rl`, the two collapsed trials reported 0.75 and 0.83 solved on their own held-out sets but scored 0.087 and 0.147 officially (the untrained baseline is 0.543); the two good trials reported 0.815 / 0.863 and scored 0.77 / 0.82. n=4, mechanism unresolved (below).
3. **In kernel tasks the agent's own dev measurement is on a different scale from the official score, by a task-specific factor of 2-24x, and in some tasks it saturates**: all six `kernel-logit-selection` trials report 0.68-0.91 ms (a 1.3x range) while their official scores span 2.6-13.0 ms (5x). Within-task, the dev number still ranks trials partly correctly (rho -0.43 [-0.70,-0.11], n=53). `figures/selfreport_vs_official_kernels.png`.

Strongest limitations: n=2 per cell; model confounded with harness; 268/486 raw scores are tie-ambiguous; reasoning text absent for Fable (1% of steps have any message); our experiment classifier is ~2/3 precise; no causal manipulation.
Highest-value next experiment: see Q5.

---
## Q1. What distinguishes successful from unsuccessful trajectories?
**Observed (quantitative, `analysis/compare.py`, `official_runs.py`).** With model fixed (within model x task pairs, n~154), no process feature has a CI excluding 0 except `n_inspect` (rho -0.23 [-0.44,-0.01], i.e. more read/inspect steps -> slightly worse; fragile, one of 11 tested). Features tested: fraction of budget used, steps, cost, official-tool runs, runs/hour, time to first run, experiment count/time share, error fraction, repeated-command fraction, edit->run cycles, P(edit after experiment). Pooled-across-models, several are "significant" (cost +0.25, steps -0.25, runs/hour -0.35) but the sign flips or vanishes within model; this is composition, not behaviour.
**Observed (early stopping).** Using <40% of the time budget does not predict worse q: Opus early stoppers mean q 0.93 (n=10) vs 0.80 (n=42); Kimi 0.62 (n=25) vs 0.69 (n=27); within-model rho(frac_budget, q) is -0.30 [-0.63,+0.08] (Fable), -0.12 (Opus), -0.20 (Kimi) (`early_stop.py`). Examples of early stops at low q: `branch-sharing-generation-...-232` (Kimi) ended at 12% of budget at 3.59 s vs best 1.06 s (baseline 28.35 s); `long-sequence-computation-...-598` (Kimi) at 13%.
**Inference (not tested):** what differs is the choice of *what to optimise* (e.g. which approach) and the representativeness of validation, neither of which our features capture. See Q2.

## Q2. Most common identifiable failure modes (hand-read; n small, so "common" means "recurring in the sample", not a rate)
| # | Mode | Evidence (observed) | Not shown |
|---|---|---|---|
| A | **Own-validation not predictive of official score** | `pt-multifile-rl-...-123#423`: "0.750 vs 0.455" on 112 projects (40 provided samples + 72 self-generated) -> official raw 0.0867; `...-115#261`: 83% on 280 self-generated projects ("all these scores come from my own generator ... no clean test") -> official 0.147. Contrast `...-127#320` (0.815 on 480 held-out incl. 40 samples; "on the 40 samples alone 0.75") -> official 0.77; `...-126#223` (0.863) -> 0.82. Kernel tasks: see Finding 3 | Whether the cause is train/validation distribution overlap, a different training seed in the grader's run (the graded run is not in the trace), or training instability: **cannot be separated with these data** |
| B | **Single unreplicated stochastic run used as evidence** | `...-123#423` "Single validation run ... no measure of run-to-run variation"; `pt-multifile-numpy-...-119` "trained this exact pool and config twice, and one run improved clearly while the other ended level" -> official 0.25 | |
| C | **Training instability the agent itself observed** | `pt-multifile-rl-...-115#261`: policy entropy 0.002-0.005 from step 36 ("collapse"); `...-126#223`: at 64 episodes/step "training lost its learning signal after about 25 steps", fixed at 128 (this agent was a success) | |
| D | **Sparse measurement before stopping** | Kimi `bulk-inference-...-150`: exactly one throughput measurement (230.97 tok/s, step 111, 37.2 min), correctness failures in steps 2-22, stop at 40 of 120 min, official 434 tok/s vs 4454 best; Kimi `-149`: three measurements (26.7, 20.8, 62.8 tok/s). Fable `-139`: 9 measurements; 111 tok/s at step 67 (65.7 min) -> 1111 at step 80 (75.1 min) | A causal claim that sparse measurement caused the low score |
| E | **Stopping on baseline-relative gain** | final reports cite speedups over the *starter* (Kimi logit-selection `-76`: "19.7x faster", stopped at 31% budget, official 13.0 ms vs best 1.95; Kimi long-sequence `-598`: "3.78x", 13% budget, official 53.1 vs best 13.7) | Agents' motives; headroom was not stated in these reports (inferred from absence) |
| F | **Environment friction** | `python: command not found` (Kimi `bulk-inference-...-150#3`, `#15`) but error-signature rates per 100 steps are similar across models (traceback 2.0-3.1, timeout 1.4-2.2, `data_quality.py`); not a differentiator | |
Categories from the prompt not observed or not testable here: *premature abandonment of a promising approach* (needs hypothesis text, absent for Fable), *incorrect interpretation of results* (only suggestive via A), *failure to establish a baseline* (the few traces I read ran the baseline early, e.g. `bulk-inference-...-150#2`).

## Q3. What can be measured reliably?
- Reliable: wall-clock timeline, budget use, step/tool counts, official-tool invocation counts (`official_runs.py`), cost/tokens, final scores (`reward` exact), parsed dev-metric time series when the tool prints a stable key (bulk-inference tok/s), final-message self-reports (existence).
- Noisy: experiment vs implementation split (`is_exp`, ~2/3 precision), per-step time (gap includes model latency), `raw_score` for 134 tie-ambiguous rows, regex-extracted self-reports.
- Not measurable now: hypotheses and their revision (text missing for Fable/Opus), whether results were *used* (we only have action sequences: P(next step is an edit | experiment)=0.23 for all three models, no relation to q), compute spent on failed experiments (no per-experiment outcome labels).

## Q4. Conclusions needing more data or controlled experiments
- Any claim about hypothesis revision/feedback use (needs reasoning text or an instrumented harness).
- Whether validation mismatch (A) *causes* failure; needs the grader's training logs or re-running graded training with several seeds.
- Cause of the dev-vs-official gap in kernels (different seeds/shapes, timing protocol, or overfitting to the practice sweep). The repo's causal-attention grader shows 5 scored seeds, median full-sweep ms (`tests/test_performance_target.json`) vs the practice `--seed 101`; the mismatch is plausible but untested.
- Model effects (harness confound), anything about non-claude-code harnesses.

## Q5. Three follow-up questions
1. **Does validation representativeness predict outcome?** Pre-register a rubric (is the agent's final validation set independent of its training data and anchored to provided real samples? is it replicated across seeds?) and have two annotators label all 162 final reports/traces blind to score; test against q within model x task. Highest value: it targets Finding 2 and can be done on existing data.
2. **Dev-to-official transfer in kernels**: re-grade each agent's final `candidate.py` (needs GPU; the submissions are not in these traces, only recoverable from Write/Edit calls) on fresh seeds and on the practice seed; does the gap track q?
3. **Is stopping early a decision about headroom?** Intervention study: tell agents the best known score (or a headroom estimate) mid-run and measure continuation and final q.

## Phase 5: LLM-assisted annotation: designed, not run
No paid calls were made. Proposed protocol: decision points = each step following an experiment with a parseable result (~40/trial); annotator sees only events up to that step (truncate observations to 1.5k chars, strip final report and score) and returns JSON {hypothesis, evidence_available, action, justified in {yes, partly, no, insufficient_evidence}, confidence 0-1, missed_opportunity|null}. For 20 trials x 40 decision points = 800 calls x ~8k input + ~0.5k output tokens = ~6.4M input / 0.4M output tokens; apply current per-token pricing before approval. Validate 10% manually; report Cohen's kappa vs my labels and the "insufficient evidence" rate. Annotator outputs are hypotheses, not ground truth. Awaiting approval; the Fable results caveat (no reasoning text) makes the "hypothesis" field mostly inferential for the best model.

## Figures
- `figures/timeline_bulk_inference.png`: actions (edit/inspect/experiment/other), measured dev throughput, correctness failures, budget and stop time for 2 good and 2 poor `bulk-inference` runs. Note the dev harness uses a 100-prompt sample (about 1.1k tok/s for the best) while the official score (4.4k tok/s) is on a different workload.
- `figures/feature_associations.png`: Finding 1.
- `figures/selfreport_vs_official_kernels.png`: Finding 3.
