"""Comparative figures. python3 -I analysis/figs.py"""
import sys, json
sys.path.insert(0, '/home/user/frontier-rsi/analysis')
import compare
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
OR = {o['trial_id']: o for o in json.load(open('/home/user/frontier-rsi/analysis/out/official_runs.json'))}
rows = []
for f in compare.F:
    g = dict(f); o = OR.get(f['trial_id'])
    if o: g['n_official_runs'] = o['n_official_runs']; g['runs_per_hour'] = o['runs_per_hour']; g['first_official_min'] = o['first_official_min']
    rows.append(g)
feats = ['frac_budget', 'n_steps', 'cost', 'n_official_runs', 'runs_per_hour', 'first_official_min', 'n_exp', 'exp_time_frac', 'n_inspect', 'err_frac', 'dup_cmd_frac']
compare.FEATS = feats
fig, ax = plt.subplots(figsize=(8, 5))
for off, (nm, grp, col) in zip([-0.15, 0.15], [('within task (models pooled)', lambda r: r['task'], '#d95f02'), ('within model×task pair', lambda r: (r['task'], r['model']), '#1b9e77')]):
    for i, k in enumerate(feats):
        xs, ys, gs = compare.within(rows, k, grp)
        if len(xs) < 10: continue
        rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=1000)
        ax.errorbar(rho, i + off, xerr=[[rho - lo], [hi - rho]], fmt='o', color=col, label=nm if i == 0 else None, capsize=2)
ax.axvline(0, color='k', lw=.8); ax.set_yticks(range(len(feats))); ax.set_yticklabels(feats); ax.invert_yaxis()
ax.set_xlabel('Spearman rho with outcome q (95% task-cluster bootstrap CI)')
ax.set_title('Behavioural features vs outcome (claude-code harness, n≈158 trials)\nassociations shrink toward 0 once model identity is held fixed', fontsize=9)
ax.legend(fontsize=8); fig.tight_layout(); fig.savefig('/home/user/frontier-rsi/figures/feature_associations.png', dpi=130)
# scatter: self-reported vs official (kernels)
R = [x for x in json.load(open('/home/user/frontier-rsi/analysis/out/selfreport_gap_kernels.json')) if x['claimed_ms']]
fig, ax = plt.subplots(figsize=(6.5, 5.5)); tasks = sorted({x['task'] for x in R}); cm = plt.get_cmap('tab10')
for i, t in enumerate(tasks):
    xs = [x for x in R if x['task'] == t]
    ax.scatter([x['claimed_ms'] for x in xs], [x['official_ms'] for x in xs], color=cm(i), label=t.replace('kernel-', ''), s=28)
lim = [0.15, 70]; ax.plot(lim, lim, 'k--', lw=.8); ax.set_xscale('log'); ax.set_yscale('log')
ax.set_xlabel("agent's own final-report sweep time (ms, regex-extracted)"); ax.set_ylabel('official score (ms)')
ax.set_title('GPU-kernel tasks: self-measured vs official time (dashed: equal)\nofficial is slower by 2–24× in 7 of 9 tasks', fontsize=9); ax.legend(fontsize=7)
fig.tight_layout(); fig.savefig('/home/user/frontier-rsi/figures/selfreport_vs_official_kernels.png', dpi=130); print('ok')
