"""List train_rl.py / score.py invocations (with outputs' headline numbers) in a trace. python3 -I analysis/pt_runs.py <trial_suffix>"""
import sys, re
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); import load
def runs(suffix):
    r = [x for x in load.trials() if x['trial_id'].endswith(suffix)][0]; d, ev, t0 = load.events(r)
    for e in ev:
        if e['tool'] != 'Bash': continue
        c = e['args'].get('command', '')
        if re.search(r'(python3?|nohup)\s[^|;&]*(train_rl|score)\.py', c) and not re.match(r'\s*(cat|head|grep|sed)', c):
            o = (e['out'] or '')
            nums = re.findall(r'(?:solved|mean reward|reward|acc(?:uracy)?)[^\n]{0,40}?(\d\.\d+|\d+/\d+)', o)[:4]
            print(f"[{e['step_id']:>3} {(e['t']-t0).total_seconds()/60:6.1f}m] {c[:230]!r}\n      nums={nums}")
if __name__ == '__main__': runs(sys.argv[1])
