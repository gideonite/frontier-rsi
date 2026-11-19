"""Precise experiment proxy: invocations of the task's official tools (develop.py / score.py / train_rl.py / probe.py).
Counts Bash commands containing the tool name AND a launcher (python|nohup|bash) — excludes cat/grep/sed reads of the file.
python3 -I analysis/official_runs.py"""
import sys, re, json, collections
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); sys.path.insert(0, '/home/user/frontier-rsi/analysis')
import load, outcome, compare
M = outcome.task_meta()
TOOL = re.compile(r'(develop\.py|score\.py|train_rl\.py|probe\.py)')
LAUNCH = re.compile(r'(python3?|nohup|torchrun)\s+[^|;&]*' + TOOL.pattern)
READ = re.compile(r'^\s*(cat|head|tail|grep|sed -n|ls|wc)\b')
out = []
for r in load.trials():
    if r['agent'] != 'claude-code': continue
    d, ev, t0 = load.events(r); steps = []
    for e in ev:
        if e['tool'] == 'Bash':
            c = e['args'].get('command', '')
            if LAUNCH.search(c) and not READ.match(c): steps.append(((e['t'] - t0).total_seconds() / 60, e['step_id']))
    tl = (load.ts(d['steps'][-1]['timestamp']) - t0).total_seconds() / 60
    out.append(dict(trial_id=r['trial_id'], task=r['task'], model=r['model'], q=outcome.q(r, M), ambiguous=r['raw_score_ambiguous'], dur_min=tl,
                    n_official_runs=len(steps), first_official_min=steps[0][0] if steps else None, official_steps=[s for _, s in steps],
                    runs_per_hour=len(steps) / (tl / 60) if tl else None))
json.dump(out, open('/home/user/frontier-rsi/analysis/out/official_runs.json', 'w'))
rows = [o for o in out if o['q'] is not None]
print('trials with zero official-tool runs:', sum(o['n_official_runs'] == 0 for o in out), 'of', len(out), '(None = never ran)')
for k in ['n_official_runs', 'runs_per_hour', 'first_official_min']:
    for nm, g in [('within task', lambda r: r['task']), ('within model×task', lambda r: (r['task'], r['model']))]:
        xs, ys, gs = compare.within(rows, k, g); rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=1000)
        print(f"{k:20s} {nm:18s} n={len(xs)} rho={rho:+.2f} [{lo:+.2f},{hi:+.2f}]")
by = collections.defaultdict(list)
for o in rows: by[o['model']].append(o)
for m, os_ in by.items():
    n = sorted(o['n_official_runs'] for o in os_); print(m, 'median official runs', n[len(n) // 2], 'IQR', n[len(n) // 4], n[3 * len(n) // 4])
