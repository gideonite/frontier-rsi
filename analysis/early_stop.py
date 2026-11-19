"""Does stopping early (unused budget) relate to outcome? Within task, per model. python3 -I analysis/early_stop.py"""
import json, sys, collections, random
sys.path.insert(0, '/home/user/frontier-rsi/analysis'); import compare
F = [f for f in compare.F]
for name, sub in [('all', F)] + [(m, [f for f in F if f['model'] == m]) for m in sorted({f['model'] for f in F})]:
    xs, ys, gs = compare.within(sub, 'frac_budget', lambda r: r['task'])
    rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=1000)
    early = [f for f in sub if f['frac_budget'] < 0.4]; late = [f for f in sub if f['frac_budget'] >= 0.4]
    mean = lambda L: sum(f['q'] for f in L) / len(L) if L else float('nan')
    print(f"{name:30s} n={len(sub):3d} within-task rho(frac_budget,q)={rho:+.2f} [{lo:+.2f},{hi:+.2f}]  early(<40% budget) n={len(early)} mean q={mean(early):.2f}  vs n={len(late)} mean q={mean(late):.2f}")
