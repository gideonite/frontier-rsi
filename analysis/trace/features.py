"""Per-trial behavioural features for claude-code-harness traces. Every count carries step_ids for provenance.
Missing != zero: None is used when a quantity cannot be measured."""
import sys, re, json, collections
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace')
import load, outcome
M = outcome.task_meta()
EXP_RE = re.compile(r'(bench|train|sweep|develop|run_candidate|eval|pytest|verify|grade|score|torchrun|accelerate|measure|profile|timeit|compare|check_|test_|run_)', re.I)
RUN_RE = re.compile(r'(^|[;&|\s])(python3?|torchrun|pytest|bash|sh|\./|make|nvcc|uv run|accelerate)\b')
EDIT_RE = re.compile(r"(cat\s*>|tee\s|sed -i|patch\b|apply_patch|>>\s*\S+\.(py|cu|cpp|sh)|git apply)")
HEREDOC = re.compile(r"(python3?|bash|sh)\s+-?\s*<<")
TIMING = re.compile(r'(perf_counter|synchronize|elapsed|benchmark|speedup|tok/s|tokens/s|throughput|time\.time\(\)|\bloss\b|accuracy|pass_rate|torch\.cuda\.Event)', re.I)
def is_exp(c, g):
    """Experiment = (a) long step (>=60s wall gap), or (b) runs a script file whose name/args look like bench/train/eval/test,
    or (c) a heredoc script that contains timing/metric code. Pure inspection heredocs are NOT experiments."""
    if 'timer.sh' in c and not re.search(r'(python3?|torchrun|pytest)\s', c): return False
    if g is not None and g >= 60: return True
    if HEREDOC.search(c): return bool(TIMING.search(c))
    return bool(RUN_RE.search(c) and EXP_RE.search(c) and not re.match(r'\s*(cat|ls|grep|sed|head|find)\b', c))
def norm_cmd(c): return re.sub(r'\s+', ' ', re.sub(r'\d+(\.\d+)?', 'N', c))[:200]

def trial_features(row):
    d, ev, t0 = load.events(row)
    steps = d['steps']; tl = load.ts(steps[-1].get('timestamp'))
    if t0 is None: return None  # no timestamps (grok-build)
    # per-step wall gap (to next agent/user step)
    st_t = [(int(s['step_id']), load.ts(s.get('timestamp'))) for s in steps if s.get('timestamp')]
    gap = {}
    for (a, ta), (b, tb) in zip(st_t, st_t[1:]): gap[a] = (tb - ta).total_seconds()
    budget_min = M[row['task']]['hours'] * 60
    f = dict(trial_id=row['trial_id'], task=row['task'], model=row['model'], q=outcome.q(row, M), reward=row['reward'],
             ambiguous=row['raw_score_ambiguous'], dur_min=(tl - t0).total_seconds() / 60, budget_min=budget_min,
             n_steps=len(steps), cost=row['cost_usd'])
    f['frac_budget'] = f['dur_min'] / budget_min
    cats = collections.defaultdict(list)  # category -> [(step_id, gap_s)]
    first_exp = None; timer = []; errs = 0; cmds = collections.Counter(); subag = 0; ncalls = 0; last_step_seen = set()
    for e in ev:
        if e['tool'] is None: continue
        ncalls += 1; sid = int(e['step_id']); g = gap.get(sid)
        a = e['args']; tool = e['tool']
        if tool == 'Bash':
            c = a.get('command', '')
            if 'timer.sh' in c or 'Remaining time' in (e['out'] or ''): timer.append(sid)
            if EDIT_RE.search(c): cat = 'edit'
            elif is_exp(c, g): cat = 'exp'
            elif re.match(r'\s*(ls|cat|head|tail|grep|find|sed -n|nvidia-smi|pwd|wc|echo|sleep|which|stat|df|ps)\b', c): cat = 'inspect'
            elif RUN_RE.search(c): cat = 'run_other'
            else: cat = 'other_bash'
            cmds[norm_cmd(c)] += 1
        elif tool in ('Write', 'Edit', 'MultiEdit', 'NotebookEdit'): cat = 'edit'
        elif tool in ('Read', 'Grep', 'Glob', 'LS'): cat = 'inspect'
        elif tool == 'Agent': cat = 'subagent'; subag += 1
        else: cat = 'other_tool'
        if e['out'] and ('[error]' in e['out'] or e['out'].startswith('Exit code')): errs += 1
        if sid not in last_step_seen:  # count each step's gap once
            last_step_seen.add(sid); cats[cat].append((sid, g, (e['t'] - t0).total_seconds() / 60))
    f['n_calls'] = ncalls
    for c in ['edit', 'inspect', 'exp', 'run_other', 'other_bash', 'subagent', 'other_tool']:
        xs = cats.get(c, []); f['n_' + c] = len(xs)
        f['t_' + c] = sum(g for _, g, _ in xs if g is not None) / 60
    tot = sum(f['t_' + c] for c in ['edit', 'inspect', 'exp', 'run_other', 'other_bash', 'subagent', 'other_tool']) or None
    f['exp_time_frac'] = f['t_exp'] / tot if tot else None
    f['t_first_exp_min'] = min((m for _, _, m in cats.get('exp', [])), default=None)  # None = never ran an experiment
    f['n_long_runs'] = sum(1 for xs in cats.values() for _, g, _ in xs if g is not None and g >= 120)
    f['n_timer_checks'] = len(timer); f['n_err_obs'] = errs; f['err_frac'] = errs / ncalls if ncalls else None
    f['dup_cmd_frac'] = sum(v - 1 for v in cmds.values()) / sum(cmds.values()) if cmds else None
    f['n_subagent_calls'] = subag
    f['steps_exp'] = [s for s, _, _ in cats.get('exp', [])]
    return f
