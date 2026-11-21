"""Per-trial harness-agnostic behaviour features for all 486 traces -> analysis/out/cluster_features.json.
Positions use the normalised call index (0..1) so grok-build (no timestamps) is included. python3 -I analysis/cluster/features.py"""
import sys, json, re, math, collections
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); sys.path.insert(0, '/home/user/frontier-rsi/analysis/cluster')
import load, outcome, normalize as N
M = outcome.task_meta()
AREA = lambda t: 'kernels' if t.startswith('kernel-') else 'posttrain' if (t.startswith('pt-') or t.endswith('-harness')) else 'pretrain' if t in (
    'model-shape-efficiency', 'language-model-optimizer', 'training-objective-design', 'speculative-draft-training', 'long-sequence-computation') else 'inference'
CATS = ['inspect', 'edit', 'run', 'wait', 'plan', 'subagent', 'other']
out = []
for r in load.trials():
    d = load.load_traj(r); seq = []; n_steps = 0; off = bg = 0; agent_msgs = 0
    for s in d['steps']:
        if s['source'] != 'agent': continue
        n_steps += 1; agent_msgs += bool((s.get('message') or '').strip())
        for t in s.get('tool_calls') or []:
            for cat, txt in N.calls(r['agent'], t.get('function_name'), t.get('arguments')):
                seq.append(cat)
                if txt and cat == 'run':
                    off += bool(N.OFFICIAL.search(txt)); bg += bool(N.BG.search(txt))
    n = len(seq)
    if n < 5: continue
    c = collections.Counter(seq)
    f = dict(trial_id=r['trial_id'], model=r['model'], agent=r['agent'], task=r['task'], area=AREA(r['task']), q=outcome.q(r, M),
             reward=r['reward'], ambiguous=r['raw_score_ambiguous'], n_calls=n, log_calls=math.log(n), calls_per_step=n / max(1, n_steps))
    for k in CATS: f['f_' + k] = c[k] / n
    pos = lambda k: [i / (n - 1) for i, x in enumerate(seq) if x == k]
    for k in ('edit', 'run'):
        p = pos(k); f['pos_' + k] = sum(p) / len(p) if p else None          # None = never did it (not 0)
    f['f_edit_first_third'] = sum(1 for x in seq[:n // 3] if x == 'edit') / max(1, c['edit']) if c['edit'] else None
    f['inspect_head10'] = sum(1 for x in seq[:max(1, n // 10)] if x == 'inspect') / max(1, n // 10)
    f['official_share_of_runs'] = off / c['run'] if c['run'] else None
    f['bg_share_of_runs'] = bg / c['run'] if c['run'] else None
    # switching: how often consecutive calls change category (fragmented vs long homogeneous blocks)
    f['switch_rate'] = sum(1 for a, b in zip(seq, seq[1:]) if a != b) / (n - 1)
    out.append(f)
json.dump(out, open('/home/user/frontier-rsi/analysis/out/cluster_features.json', 'w'))
print(len(out), 'trials')
by = collections.defaultdict(list)
for f in out: by[f['agent']].append(f)
for a, fs in by.items():
    print(f"{a:16s} n={len(fs)} " + ' '.join(f"{k}={sum(x['f_'+k] for x in fs)/len(fs):.2f}" for k in CATS))
