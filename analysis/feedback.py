"""Action-level feedback-use measures (no reasoning text needed). python3 -I analysis/feedback.py
Sequence of per-step categories -> (a) iteration cycles edit->exp, (b) P(next=edit | exp), (c) exp re-run with no edit between,
(d) whether the last edit was followed by an experiment (final state validated)."""
import sys, json, collections, re
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); sys.path.insert(0, '/home/user/frontier-rsi/analysis')
import load, features, outcome, compare
M = outcome.task_meta()
def cat_seq(row):
    d, ev, t0 = load.events(row); seq = []; seen = set()
    for e in ev:
        if e['tool'] is None or e['step_id'] in seen: continue
        seen.add(e['step_id']); a = e['args']; c = a.get('command', '') if e['tool'] == 'Bash' else ''
        if e['tool'] in ('Write', 'Edit', 'MultiEdit') or features.EDIT_RE.search(c): k = 'E'
        elif e['tool'] == 'Bash' and features.is_exp(c, None): k = 'X'
        else: k = 'o'
        seq.append((int(e['step_id']), k))
    return seq
out = []
for r in load.trials():
    if r['agent'] != 'claude-code' or r['raw_score'] is None: continue
    s = cat_seq(r); ks = ''.join(k for _, k in s)
    cycles = len(re.findall(r'E[^X]*X', ks)); n_x = ks.count('X'); n_e = ks.count('E')
    after_x = [ks[i + 1] for i in range(len(ks) - 1) if ks[i] == 'X']
    p_edit = sum(a == 'E' for a in after_x) / len(after_x) if after_x else None
    reruns = len(re.findall(r'X[o]*X', re.sub('E', 'E', ks))) if False else sum(1 for m in re.finditer(r'X(?:o*X)+', ks))
    lastE = ks.rfind('E'); validated = (ks.find('X', lastE) != -1) if lastE != -1 else None
    out.append(dict(trial_id=r['trial_id'], task=r['task'], model=r['model'], q=outcome.q(r, M), ambiguous=r['raw_score_ambiguous'],
                    n_cycles=cycles, p_edit_after_exp=p_edit, n_exp_streaks=reruns, last_edit_validated=validated, n_E=n_e, n_X=n_x))
json.dump(out, open('/home/user/frontier-rsi/analysis/out/feedback.json', 'w'))
rows = [o for o in out if o['q'] is not None]
for k in ['n_cycles', 'p_edit_after_exp', 'n_exp_streaks']:
    for name, grp in [('within model×task', lambda r: (r['task'], r['model']))]:
        xs, ys, gs = compare.within(rows, k, grp); rho = compare.spearman(xs, ys); lo, hi = compare.boot(xs, ys, gs, B=1000)
        print(f"{k:18s} {name}: n={len(xs)} rho={rho:+.2f} [{lo:+.2f},{hi:+.2f}]")
v = [o for o in rows if o['last_edit_validated'] is not None]
for flag in (True, False):
    g = [o['q'] for o in v if o['last_edit_validated'] == flag]
    print(f"last edit followed by an experiment = {flag}: n={len(g)} mean q={sum(g)/len(g):.2f}")
by = collections.defaultdict(list)
for o in rows: by[o['model']].append(o)
for m, os_ in by.items():
    pe = [o['p_edit_after_exp'] for o in os_ if o['p_edit_after_exp'] is not None]
    print(m, 'mean P(next step is an edit | experiment) = %.2f' % (sum(pe) / len(pe)), 'unvalidated final edit: %d/%d' % (sum(o['last_edit_validated'] is False for o in os_), len(os_)))
