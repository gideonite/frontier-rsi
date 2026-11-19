"""Extract GRPO step logs ({"step":..,"reward":..,"mixed":..}) printed in tool outputs, grouped by the run directory named in the command.
python3 -I analysis/pt_curves.py <trial_suffix>"""
import sys, re, json, collections
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); import load
STEP = re.compile(r'\{"step": (\d+), "elapsed_s": ([0-9.]+)[^}]*?"reward": ([0-9.]+)[^}]*?"all_correct": ([0-9.]+), "all_wrong": ([0-9.]+), "mixed": ([0-9.]+)\}')
def curves(suffix):
    r = [x for x in load.trials() if x['trial_id'].endswith(suffix)][0]; d, ev, t0 = load.events(r)
    runs = collections.defaultdict(dict)
    for e in ev:
        o = e['out'] or ''; c = e['args'].get('command', '') if e['tool'] == 'Bash' else str(e['args'].get('file_path', ''))
        if '"step"' not in o: continue
        m = re.findall(r'([\w./-]+?)(?:_work)?/log/steps\.jsonl', c) or re.findall(r'(?:runs|work|tmp/work)/([\w-]+)', c)
        name = m[-1].split('/')[-1] if m else '?'
        for s in STEP.finditer(o):
            runs[name][int(s.group(1))] = tuple(float(x) for x in s.groups()[1:])
    return r, runs
if __name__ == '__main__':
    r, runs = curves(sys.argv[1])
    for name, st in runs.items():
        ks = sorted(st)
        if len(ks) < 3: continue
        last = st[ks[-1]]
        rew = [round(st[k][1], 2) for k in ks]
        print(f'{name:22s} steps {ks[0]}-{ks[-1]} ({len(ks)} logged) elapsed {last[0]/60:.0f} min | reward: {rew[:6]} ... {rew[-6:]} | last mixed={last[4]:.2f} all_correct={last[2]:.2f} all_wrong={last[3]:.2f}')
