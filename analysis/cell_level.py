"""Swap-invariant analysis: average the two trials of each (model, task) cell. A swap of raw values between the two trials of a tied cell leaves
the cell mean q (and cell-mean features) unchanged, so this uses all data without the ambiguity problem. python3 -I analysis/cell_level.py"""
import sys, json, collections, statistics as st
sys.path.insert(0, '/home/user/frontier-rsi/analysis'); sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace')
import compare
OR = {o['trial_id']: o for o in json.load(open('/home/user/frontier-rsi/analysis/out/official_runs.json'))}
cells = collections.defaultdict(list)
for f in compare.F:
    g = dict(f); o = OR[f['trial_id']]; g['runs_per_hour'] = o['runs_per_hour']; g['first_official_min'] = o['first_official_min']; g['n_official_runs'] = o['n_official_runs']
    cells[(f['task'], f['model'])].append(g)
KEYS = ['frac_budget', 'runs_per_hour', 'first_official_min', 'n_official_runs', 'n_steps', 'cost', 'n_exp', 'n_inspect', 'err_frac', 'dup_cmd_frac']
rows = []
for (t, m), gs in cells.items():
    if len(gs) < 2: continue                                  # need both trials to make the cell mean swap-invariant
    r = dict(task=t, model=m, q=sum(g['q'] for g in gs) / 2, ambiguous=gs[0]['ambiguous'])
    for k in KEYS:
        v = [g[k] for g in gs if g[k] is not None]; r[k] = sum(v) / len(v) if v else None
    rows.append(r)
print(f'cells with both trials scored: {len(rows)} (ambiguous cells: {sum(r["ambiguous"] for r in rows)})')
print('\ncell-mean q by model (swap-invariant):')
for m in sorted({r['model'] for r in rows}):
    qs = [r['q'] for r in rows if r['model'] == m]; print(f'  {m:28s} cells={len(qs):2d} median={st.median(qs):.2f} mean={st.mean(qs):.2f}')
print('\nwithin-task, across models (cell level):')
for k in KEYS:
    xs, ys, gs = compare.within(rows, k, lambda r: r['task'])
    if len(xs) < 10: continue
    rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=2000); print(f'  {k:20s} n={len(xs):3d} rho={rho:+.2f} [{lo:+.2f},{hi:+.2f}]')
print('\nwithin model (across tasks, task-centred; cell level):')
for m in sorted({r['model'] for r in rows}):
    sub = [r for r in rows if r['model'] == m]
    out = []
    for k in ['runs_per_hour', 'frac_budget']:
        xs, ys, gs = compare.within(sub, k, lambda r: r['task'])      # one cell per task per model -> no within-task variation; use pooled rank instead
        out.append(k)
    # simple pooled Spearman across tasks (no task-centering possible with one cell/task/model)
    for k in ['runs_per_hour', 'frac_budget']:
        xs = [r[k] for r in sub if r[k] is not None]; ys = [r['q'] for r in sub if r[k] is not None]
        print(f'  {m:28s} {k:14s} n={len(xs)} pooled rho(across tasks)={compare.spearman(xs, ys):+.2f}  (task difficulty is NOT controlled here)')
json.dump(rows, open('/home/user/frontier-rsi/analysis/out/cell_level.json', 'w'))
