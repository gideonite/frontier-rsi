"""Chronological action/feedback/performance figure. python3 -I analysis/timeline.py"""
import sys, re
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace')
import load, features, outcome
import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
M = outcome.task_meta()
COL = dict(edit='#d95f02', inspect='#999999', exp='#1b9e77', other='#7570b3', subagent='#e7298a')
TPS = re.compile(r'(?:output_tokens_per_second|tokens/s|tok/s)["\s:=]+([0-9.]+)')
def series(row, rx):
    d, ev, t0 = load.events(row); pts = []; acts = []; incorrect = []
    for e in ev:
        if e['tool'] is None: continue
        m = (e['t'] - t0).total_seconds() / 60; o = e['out'] or ''
        a = e['args']; c = a.get('command', '') if e['tool'] == 'Bash' else ''
        if e['tool'] in ('Write', 'Edit', 'MultiEdit') or features.EDIT_RE.search(c): k = 'edit'
        elif e['tool'] == 'Agent': k = 'subagent'
        elif e['tool'] == 'Bash' and features.is_exp(c, None): k = 'exp'
        elif e['tool'] in ('Read', 'Grep', 'Glob') or re.match(r'\s*(ls|cat|head|tail|grep|find|sed -n|nvidia-smi)\b', c): k = 'inspect'
        else: k = 'other'
        acts.append((m, k, e['step_id']))
        for v in rx.findall(o): pts.append((m, float(v), e['step_id']))
        if re.search(r'Incorrect output at request \d+; got', o) and 'develop' in c + o[:0]: incorrect.append((m, e['step_id']))
    return d, acts, pts, incorrect, (load.ts(d['steps'][-1]['timestamp']) - t0).total_seconds() / 60
def plot(trial_ids, rx, ylabel, fname, budget_min, title):
    rows = {r['trial_id']: r for r in load.trials()}
    fig, axs = plt.subplots(len(trial_ids), 1, figsize=(11, 2.6 * len(trial_ids)), sharex=True)
    for ax, tid in zip(axs, trial_ids):
        r = rows[tid]; d, acts, pts, inc, end = series(r, rx)
        ax.set_yscale('log'); ymin = min([p[1] for p in pts], default=1) / 1.8
        for m, k, _ in acts: ax.axvline(m, ymax=0.12, color=COL[k], lw=1.2, alpha=.9)
        if pts: ax.plot([p[0] for p in pts], [p[1] for p in pts], 'o-', color='k', ms=4, lw=.8)
        for m, _ in inc: ax.plot(m, ymin * 1.05, 'rx', ms=7)
        ax.axvline(end, color='r', ls=':'); ax.axvline(budget_min, color='b', ls='--', lw=.8)
        q = outcome.q(r, M); ax.set_title(f"{r['model'].split('/')[1]} | {tid[-3:]} | official raw={r['raw_score']:.0f} (q={q:.2f}) | {len(d['steps'])} steps, ended at {end:.0f} of {budget_min:.0f} min", fontsize=9, loc='left')
        ax.set_ylabel(ylabel, fontsize=8)
    axs[-1].set_xlabel('minutes since first step   (ticks at bottom: ' + ', '.join(f'{k}' for k in COL) + '; red x = correctness failure; dashed blue = budget; dotted red = last step)', fontsize=8)
    from matplotlib.lines import Line2D
    axs[0].legend(handles=[Line2D([0], [0], color=c, lw=3, label=k) for k, c in COL.items()], ncol=5, fontsize=7, loc='upper left')
    fig.suptitle(title, fontsize=10); fig.tight_layout(); fig.savefig('/home/user/frontier-rsi/figures/' + fname, dpi=130); print('wrote', fname)
if __name__ == '__main__':
    plot(['bulk-inference-aa835ab8-139', 'bulk-inference-aa835ab8-140', 'bulk-inference-aa835ab8-150', 'bulk-inference-aa835ab8-149'], TPS,
         'dev tok/s (log)', 'timeline_bulk_inference.png', 120,
         'bulk-inference: agent actions and measured throughput over time (dev-harness numbers are on a 100-prompt sample; official score is on a held-out workload)')
