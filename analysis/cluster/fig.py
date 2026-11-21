"""PCA map of task-centred behaviour features, coloured by model. python3 -I analysis/cluster/fig.py"""
import sys, json, collections
import numpy as np
sys.path.insert(0, '/home/user/frontier-rsi/analysis/cluster'); import cluster as C
from sklearn.decomposition import PCA
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
F = C.F; X = C.X_of(F, resid_by='task'); pca = PCA(2).fit(X); Z = pca.transform(X)
models = sorted({f['model'] for f in F}); cm = plt.get_cmap('tab10')
fig, (a, b) = plt.subplots(1, 2, figsize=(12, 5.2))
for i, m in enumerate(models):
    idx = [j for j, f in enumerate(F) if f['model'] == m]
    a.scatter(Z[idx, 0], Z[idx, 1], s=12, color=cm(i), alpha=.6, label=m.split('/')[1])
    a.scatter(Z[idx, 0].mean(), Z[idx, 1].mean(), s=160, color=cm(i), edgecolors='k', marker='*')
a.set_xlabel(f'PC1 ({pca.explained_variance_ratio_[0]:.0%})'); a.set_ylabel(f'PC2 ({pca.explained_variance_ratio_[1]:.0%})')
a.legend(fontsize=7, ncol=2); a.set_title('Behaviour (centred within task): each model has a signature\n(stars = model means; harness confounded with model)', fontsize=9)
load = pca.components_
for j, k in enumerate(C.FEATS):
    b.arrow(0, 0, load[0, j], load[1, j], head_width=.02, color='#555'); b.text(load[0, j] * 1.12, load[1, j] * 1.12, k.replace('f_', ''), fontsize=7, ha='center')
b.set_xlim(-.7, .7); b.set_ylim(-.7, .7); b.axhline(0, color='#ddd'); b.axvline(0, color='#ddd'); b.set_title('Feature loadings', fontsize=9)
fig.tight_layout(); fig.savefig('/home/user/frontier-rsi/figures/behaviour_map.png', dpi=130); print('ok', pca.explained_variance_ratio_[:2])
