"""Within-task / within-(model,task) association of behavioural features with outcome q. Run: python3 -I analysis/compare.py"""
import json, random, collections, math
F = [f for f in json.load(open('/home/user/frontier-rsi/analysis/out/features_claude_code.json')) if f['q'] is not None]
FEATS = ['frac_budget', 'dur_min', 'n_steps', 'cost', 'n_exp', 'exp_time_frac', 't_first_exp_min', 'n_edit', 'n_inspect', 'n_subagent_calls',
         'n_timer_checks', 'err_frac', 'dup_cmd_frac', 'n_long_runs']
def rank(xs):
    o = sorted(range(len(xs)), key=lambda i: xs[i]); r = [0.0] * len(xs); i = 0
    while i < len(o):
        j = i
        while j + 1 < len(o) and xs[o[j + 1]] == xs[o[i]]: j += 1
        for k in range(i, j + 1): r[o[k]] = (i + j) / 2 + 1
        i = j + 1
    return r
def spearman(x, y):
    if len(x) < 4: return float('nan')
    rx, ry = rank(x), rank(y); mx, my = sum(rx) / len(rx), sum(ry) / len(ry)
    sx = math.sqrt(sum((a - mx) ** 2 for a in rx)); sy = math.sqrt(sum((b - my) ** 2 for b in ry))
    return sum((a - mx) * (b - my) for a, b in zip(rx, ry)) / (sx * sy) if sx and sy else float('nan')
def within(rows, key, group):
    """Center rank of feature & q inside group (task or model×task) so only within-group variation remains."""
    g = collections.defaultdict(list)
    for r in rows:
        if r.get(key) is not None: g[group(r)].append(r)
    xs, ys, gs = [], [], []
    for k, rs in g.items():
        if len(rs) < 2: continue
        fx = rank([r[key] for r in rs]); fy = rank([r['q'] for r in rs]); n = len(rs)
        for a, b in zip(fx, fy): xs.append((a - (n + 1) / 2) / n); ys.append((b - (n + 1) / 2) / n); gs.append(k)
    return xs, ys, gs
def boot(xs, ys, gs, B=2000, seed=0):
    rnd = random.Random(seed); idx = collections.defaultdict(list)
    for i, g in enumerate(gs): idx[g].append(i)
    keys = list(idx); out = []
    for _ in range(B):
        sel = [i for k in (rnd.choice(keys) for _ in keys) for i in idx[k]]
        out.append(spearman([xs[i] for i in sel], [ys[i] for i in sel]))
    out = sorted(v for v in out if v == v); return out[int(.025 * len(out))], out[int(.975 * len(out))]
def run(rows, group, label):
    print(f'\n## {label}  (n={len(rows)})'); res = []
    for k in FEATS:
        xs, ys, gs = within(rows, k, group)
        if len(xs) < 10: continue
        rho = spearman(xs, ys); lo, hi = boot(xs, ys, gs); res.append((k, len(xs), rho, lo, hi))
        print(f'{k:18s} n={len(xs):3d} rho={rho:+.2f}  95% CI [{lo:+.2f},{hi:+.2f}]')
    return res
if __name__ == '__main__':
    r1 = run(F, lambda r: r['task'], 'within-task (pooled models)')
    r2 = run([f for f in F if not f['ambiguous']], lambda r: r['task'], 'within-task, non-ambiguous raw only')
    r3 = run(F, lambda r: (r['task'], r['model']), 'within model×task pairs')
    json.dump(dict(task=r1, nonamb=r2, pair=r3), open('/home/user/frontier-rsi/analysis/out/assoc.json', 'w'))
