"""Re-run headline statistics with ambiguous-raw trials (both trials of a tied-reward cell) excluded. python3 -I analysis/robustness.py"""
import sys, json, collections, statistics as st
sys.path.insert(0, '/home/user/frontier-rsi/analysis'); sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace')
import compare, outcome
OR = {o['trial_id']: o for o in json.load(open('/home/user/frontier-rsi/analysis/out/official_runs.json'))}
M = outcome.task_meta()
rows_all = []
for f in compare.F:
    g = dict(f); o = OR[f['trial_id']]
    g['n_official_runs'] = o['n_official_runs']; g['runs_per_hour'] = o['runs_per_hour']; g['first_official_min'] = o['first_official_min']; rows_all.append(g)
rows_na = [r for r in rows_all if not r['ambiguous']]
print(f'trials with q: all={len(rows_all)}, non-ambiguous={len(rows_na)}; cells (model,task) complete with both non-ambiguous: {len({(r["task"], r["model"]) for r in rows_na})}')
def row(label, rows, k, grp):
    xs, ys, gs = compare.within(rows, k, grp)
    if len(xs) < 10: print(f'  {label:28s} {k:20s} n={len(xs)} (too few)'); return
    rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=1000)
    print(f'  {label:28s} {k:20s} n={len(xs):3d} rho={rho:+.2f} [{lo:+.2f},{hi:+.2f}]')
for k in ['runs_per_hour', 'first_official_min', 'n_official_runs', 'frac_budget', 'n_inspect']:
    print(k)
    for nm, rs in [('ALL', rows_all), ('NON-AMBIGUOUS', rows_na)]:
        row(nm + ' within task', rs, k, lambda r: r['task']); row(nm + ' within model×task', rs, k, lambda r: (r['task'], r['model']))
print('\nmedian q / median official runs by model')
for nm, rs in [('ALL', rows_all), ('NON-AMB', rows_na)]:
    for m in sorted({r['model'] for r in rs}):
        g = [r for r in rs if r['model'] == m]
        print(f"  {nm:8s} {m:28s} n={len(g):3d} median q={st.median(r['q'] for r in g):.2f} median official runs={st.median(r['n_official_runs'] for r in g)}")
print('\nearly stop (<40% budget) mean q, non-ambiguous:')
for m in sorted({r['model'] for r in rows_na}):
    g = [r for r in rows_na if r['model'] == m]; e = [r['q'] for r in g if r['frac_budget'] < .4]; l = [r['q'] for r in g if r['frac_budget'] >= .4]
    print(f"  {m:28s} early n={len(e)} mean={sum(e)/len(e) if e else float('nan'):.2f}  late n={len(l)} mean={sum(l)/len(l):.2f}")
# kernel self-report gap
R = [x for x in json.load(open('/home/user/frontier-rsi/analysis/out/selfreport_gap_kernels.json')) if x['claimed_ms']]
for nm, rs in [('ALL', R), ('NON-AMBIGUOUS', [x for x in R if not x['ambiguous']])]:
    for x in rs: x['q'] = M[x['task']]['best'] / x['official_ms']; x['c'] = x['claimed_ms']
    xs, ys, gs = compare.within(rs, 'c', lambda r: r['task']); rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=1000)
    print(f'\nkernel claimed-ms vs official q [{nm}] n={len(xs)} rho={rho:+.2f} [{lo:+.2f},{hi:+.2f}]')
    by = collections.defaultdict(list)
    for x in rs: by[x['task']].append(x['ratio'])
    print('  median official/claimed ratio per task:', {t[7:30]: round(sorted(v)[len(v)//2], 1) for t, v in sorted(by.items())})
    lg = [x for x in rs if x['task'] == 'kernel-logit-selection']
    print('  logit-selection claimed range', [round(x['claimed_ms'], 2) for x in lg], 'official', [round(x['official_ms'], 2) for x in lg])
