"""Raw-score join ambiguity: (1) can it be resolved deterministically? (2) sensitivity of headline results to the best heuristic.
python3 -I analysis/ambiguity.py"""
import sys, re, json, collections
sys.path.insert(0, '/home/user/frontier-rsi/analysis'); sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace')
import load, outcome, compare
M = outcome.task_meta()
s = open('/home/user/frontier-rsi/data/leaderboard_data.js').read(); D = json.loads(s[s.index('{'):s.rindex('}') + 1])
MAP = {'anthropic/claude-fable-5-2': 'Claude Fable 5.2', 'anthropic/claude-opus-5-5': 'Claude Opus 5.5', 'openai/gpt-6-astra': 'GPT-6 Astra', 'openai/gpt-6.1-sol': 'GPT-6.1 Sol',
       'gemini/gemini-4-carbon': 'Gemini 4 Carbon', 'gemini/gemini-4-argon': 'Gemini 4 Argon', 'xai-public/grok-4.7': 'Grok 4.7', 'fireworks/kimi-k3p1-pro': 'Kimi K3.1 Pro', 'meta-public/muse-wonder-1.0': 'Muse Wonder 1.0'}
lb = {(m['model'], t['id']): m['trials'] for t in D['tasks'] for m in t['models']}
T = load.trials(); cells = collections.defaultdict(list)
for r in T: cells[(r['model'], r['task'])].append(r)
num = lambda r: int(r['trial_id'].rsplit('-', 1)[1])
# (1) does leaderboard trial order follow trial-id order? test on cells whose pairing is known (rewards differ)
ok = n = 0; amb_cells = 0; amb_raw_differs = 0
for (model, task), rs in cells.items():
    tr = lb[(MAP[model], re.sub(r'-[0-9a-f]{8}$', '', task))]; a, b = sorted(rs, key=num)
    if abs(tr[0]['reward'] - tr[1]['reward']) > 1e-9:
        n += 1; ok += abs(tr[0]['reward'] - a['reward']) < abs(tr[1]['reward'] - a['reward'])
    else:
        amb_cells += 1; amb_raw_differs += (tr[0]['raw'] != tr[1]['raw'])
print(f'cells total={len(cells)}; reward-distinguishable (pairing known)={n}; trial-id-order rule correct in {ok}/{n} = {ok/n:.1%}')
print(f'reward-tied cells={amb_cells}, of which raw values differ (truly ambiguous)={amb_raw_differs}')
# 95% Wilson interval for the rule's accuracy
p = ok / n; z = 1.96; den = 1 + z * z / n; c = (p + z * z / (2 * n)) / den; h = z * ((p * (1 - p) / n + z * z / (4 * n * n)) ** .5) / den
print(f'Wilson 95% CI for rule accuracy: [{c-h:.3f}, {c+h:.3f}]')
# (2) sensitivity: re-assign raw in ambiguous cells by id-order, recompute q, rerun headline within-pair/task associations
alt_raw = {}
for (model, task), rs in cells.items():
    tr = lb[(MAP[model], re.sub(r'-[0-9a-f]{8}$', '', task))]
    for r, t in zip(sorted(rs, key=num), tr): alt_raw[r['trial_id']] = t['raw']
OR = {o['trial_id']: o for o in json.load(open('/home/user/frontier-rsi/analysis/out/official_runs.json'))}
rows = []
for f in compare.F:
    g = dict(f); o = OR[f['trial_id']]; g['runs_per_hour'] = o['runs_per_hour']; g['first_official_min'] = o['first_official_min']
    row = [r for r in T if r['trial_id'] == f['trial_id']][0]; row2 = dict(row, raw_score=alt_raw[f['trial_id']])
    g['q'] = outcome.q(row2, M); rows.append(g)
rows = [g for g in rows if g['q'] is not None]
print(f'\nSensitivity (ambiguous cells resolved by trial-id order; n={len(rows)}):')
for k in ['runs_per_hour', 'first_official_min']:
    for nm, grp in [('within task', lambda r: r['task']), ('within model×task', lambda r: (r['task'], r['model']))]:
        xs, ys, gs = compare.within(rows, k, grp); rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=1000)
        print(f'  {k:20s} {nm:18s} n={len(xs)} rho={rho:+.2f} [{lo:+.2f},{hi:+.2f}]')
