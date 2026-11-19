"""Training launches, hand-in writes and score runs per trace (compact research log). python3 -I analysis/pt_timeline.py <suffix>"""
import sys, re
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); import load
def tl(suffix):
    r = [x for x in load.trials() if x['trial_id'].endswith(suffix)][0]; d, ev, t0 = load.events(r)
    end = (load.ts(d['steps'][-1]['timestamp']) - t0).total_seconds() / 60
    print(f"== {r['trial_id']} ({r['model'].split('/')[1]}) official={r['raw_score']:.3f} session={end:.0f} min")
    for e in ev:
        if e['tool'] != 'Bash': continue
        c = e['args'].get('command', ''); m = (e['t'] - t0).total_seconds() / 60
        launch = re.search(r'(train_rl\.py|train_ck\d?\.py|run_trial\.sh|queue\.sh)[^\n|;&]*', c)
        if launch and '--check' not in c and '--help' not in c and not re.match(r'\s*(cat|grep|sed|head|tail|ps|pgrep)\b', c):
            lr = re.findall(r'learning_rate"?:?\s*([0-9.e-]+)|--lr\s+([0-9.e-]+)', c)
            print(f"  [{e['step_id']:>3} {m:5.0f}m] TRAIN  {launch.group(0)[:110]}  lr={[a or b for a, b in lr][:2]}")
        if re.search(r'(cp|mv|ln)[^\n;&]*/app/rl_pool/', c):
            print(f"  [{e['step_id']:>3} {m:5.0f}m] HANDIN {c[:120]!r}")
        for x in re.finditer(r'TRAIN_DONE \{"steps": (\d+), "elapsed_s": (\d+)', e['out'] or ''):
            print(f"  [{e['step_id']:>3} {m:5.0f}m] DONE   steps={x.group(1)} elapsed={int(x.group(2))/60:.0f} min"); break
if __name__ == '__main__': tl(sys.argv[1])
