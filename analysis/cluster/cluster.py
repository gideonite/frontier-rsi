"""Cluster all traces by harness-agnostic behaviour. python3 -I analysis/cluster/cluster.py
Outcomes: (a) reward>0 (exact per trial), (b) swap-invariant cell-mean percentile of q within task."""
import json, collections, math, sys
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
F = json.load(open('/home/user/frontier-rsi/analysis/out/cluster_features.json'))
FEATS = ['f_inspect', 'f_edit', 'f_run', 'f_wait', 'log_calls', 'calls_per_step', 'pos_edit', 'pos_run', 'inspect_head10',
         'official_share_of_runs', 'bg_share_of_runs', 'switch_rate']
FILL = {'pos_edit': 0.5, 'pos_run': 0.5, 'official_share_of_runs': 0.0, 'bg_share_of_runs': 0.0}
# outcome b: percentile of q within task over the 18 trials, averaged within (model, task) cell -> swap-invariant
bytask = collections.defaultdict(list)
for f in F: bytask[f['task']].append(f)
for t, fs in bytask.items():
    qs = sorted(f['q'] for f in fs if f['q'] is not None)
    for f in fs: f['pct'] = (sum(x < f['q'] for x in qs) + 0.5 * sum(x == f['q'] for x in qs)) / len(qs) if f['q'] is not None else 0.0  # invalid run = bottom
cell = collections.defaultdict(list)
for f in F: cell[(f['model'], f['task'])].append(f['pct'])
for f in F: f['cell_pct'] = sum(cell[(f['model'], f['task'])]) / len(cell[(f['model'], f['task'])]); f['rew_pos'] = float(f['reward'] > 0)
def X_of(rows, resid_by=None):
    X = np.array([[r[k] if r[k] is not None else FILL.get(k, 0.0) for k in FEATS] for r in rows], float)
    if resid_by:
        g = collections.defaultdict(list)
        for i, r in enumerate(rows): g[r[resid_by]].append(i)
        for idx in g.values(): X[idx] -= X[idx].mean(0)
    return StandardScaler().fit_transform(X)
def cramers_v(a, b):
    ta, tb = sorted(set(a)), sorted(set(b)); n = len(a)
    O = np.array([[sum(1 for x, y in zip(a, b) if x == i and y == j) for j in tb] for i in ta], float)
    E = O.sum(1, keepdims=True) * O.sum(0, keepdims=True) / n
    chi = ((O - E) ** 2 / np.where(E > 0, E, 1)).sum(); return math.sqrt(chi / (n * (min(len(ta), len(tb)) - 1)))
def run(rows, label, resid_by=None, seed=0):
    X = X_of(rows, resid_by)
    sil = {k: silhouette_score(X, KMeans(k, n_init=20, random_state=seed).fit_predict(X)) for k in range(2, 9)}
    k = max(sil, key=sil.get); lab = KMeans(k, n_init=50, random_state=seed).fit_predict(X)
    # stability: agreement of labels across seeds (adjusted rand)
    from sklearn.metrics import adjusted_rand_score
    ari = np.mean([adjusted_rand_score(lab, KMeans(k, n_init=50, random_state=s).fit_predict(X)) for s in range(1, 6)])
    print(f'\n### {label}: n={len(rows)}  silhouette by k={ {kk: round(v, 3) for kk, v in sil.items()} } -> k={k}, seed-stability ARI={ari:.2f}')
    print(f"Cramer's V(cluster, model)={cramers_v(lab, [r['model'] for r in rows]):.2f}  (harness)={cramers_v(lab, [r['agent'] for r in rows]):.2f}  "
          f"(task area)={cramers_v(lab, [r['area'] for r in rows]):.2f}  (task)={cramers_v(lab, [r['task'] for r in rows]):.2f}")
    raw = np.array([[r[k] if r[k] is not None else FILL.get(k, 0.0) for k in FEATS] for r in rows], float)
    for c in range(k):
        m = lab == c; rs = [r for r, mm in zip(rows, m) if mm]
        top = collections.Counter(r['model'].split('/')[1] for r in rs).most_common(3)
        areas = collections.Counter(r['area'] for r in rs).most_common(2)
        prof = ' '.join(f'{FEATS[j].replace("f_","")}={raw[m, j].mean():.2f}' for j in range(len(FEATS)))
        print(f'  cluster {c}: n={m.sum():3d}  reward>0={np.mean([r["rew_pos"] for r in rs]):.2f}  cell-pct={np.mean([r["cell_pct"] for r in rs]):.2f}  models={top}  areas={areas}')
        print(f'      {prof}')
    return lab
if __name__ == '__main__':
    lab_all = run(F, 'ALL traces, raw features')
    lab_res = run(F, 'ALL traces, features centred within MODEL (style relative to own model)', resid_by='model')
    lab_res2 = run(F, 'ALL traces, features centred within TASK (style relative to the task)', resid_by='task')
    json.dump([dict(trial_id=f['trial_id'], c_all=int(a), c_model=int(b), c_task=int(c)) for f, a, b, c in zip(F, lab_all, lab_res, lab_res2)],
              open('/home/user/frontier-rsi/analysis/out/cluster_labels.json', 'w'))
