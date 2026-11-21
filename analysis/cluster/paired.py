"""Within-cell contrasts using the EXACT outcome: in (model, task) cells where one trial has reward>0 and the other reward==0
(or where rewards differ at all), compare behaviour features between the better and the worse trial. Sign test + mean diff.
python3 -I analysis/cluster/paired.py"""
import json, collections, math
F = json.load(open('/home/user/frontier-rsi/analysis/out/cluster_features.json'))
FEATS = ['f_inspect', 'f_edit', 'f_run', 'f_wait', 'log_calls', 'calls_per_step', 'pos_edit', 'pos_run', 'inspect_head10', 'official_share_of_runs', 'bg_share_of_runs', 'switch_rate']
cells = collections.defaultdict(list)
for f in F: cells[(f['model'], f['task'])].append(f)
pairs = [sorted(v, key=lambda f: f['reward']) for v in cells.values() if len(v) == 2 and abs(v[0]['reward'] - v[1]['reward']) > 1e-9]
print(f'cells with different (exact) rewards: {len(pairs)} of {len(cells)}')
def binom_two_sided(k, n):
    p = sum(math.comb(n, i) for i in range(0, min(k, n - k) + 1)) / 2 ** n; return min(1.0, 2 * p)
res = []
for k in FEATS:
    d = [(b[k] - a[k]) for a, b in pairs if a[k] is not None and b[k] is not None]
    pos = sum(x > 0 for x in d); neg = sum(x < 0 for x in d); n = pos + neg
    res.append((k, len(d), pos, neg, binom_two_sided(pos, n) if n else 1.0, sum(d) / len(d) if d else float('nan')))
print(f"{'feature':24s} n  better>worse  better<worse  sign-test p   mean(better-worse)")
for k, n, p, m, pv, md in res: print(f'{k:24s} {n:3d}  {p:4d}          {m:4d}          {pv:6.3f}       {md:+.3f}')
print('(12 features tested; Bonferroni threshold 0.05/12 = 0.004)')
