"""Data-availability and environment-error signatures by model. python3 -I analysis/data_quality.py"""
import sys, collections, json, re
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); import load
avail = collections.defaultdict(lambda: collections.Counter()); sig = collections.defaultdict(lambda: collections.Counter())
SIG = {'cmd_not_found': r'command not found', 'oom': r'out of memory|OutOfMemory', 'timeout': r'timed out|TimeoutExpired|timedOutAfterMs',
       'traceback': r'Traceback \(most recent', 'tool_use_error': r'tool_use_error', 'killed': r'Killed|exit code 137|Exit code 137'}
for r in load.trials():
    d = load.load_traj(r); m = r['model']
    avail[m]['trials'] += 1
    for s in d['steps']:
        if s['source'] != 'agent': continue
        a = avail[m]; a['agent_steps'] += 1
        a['with_message'] += bool((s.get('message') or '').strip()); a['with_reasoning_content'] += bool(s.get('reasoning_content'))
        tt = (((s.get('metrics') or {}).get('extra') or {}).get('output_tokens_details') or {}).get('thinking_tokens')
        a['thinking_tokens_field_present'] += tt is not None; a['thinking_tokens_gt0'] += bool(tt)
        a['with_timestamp'] += bool(s.get('timestamp'))
        o = load.obs_text(s) or ''
        for k, rx in SIG.items(): sig[m][k] += bool(re.search(rx, o))
out = {m: dict(a) for m, a in avail.items()}
for m in sorted(out):
    a = out[m]; n = a['agent_steps']
    print(f"{m:30s} trials={a['trials']:2d} steps={n:6d} msg={a['with_message']/n:.2f} reasoning_content={a['with_reasoning_content']/n:.2f} thinking_field={a['thinking_tokens_field_present']/n:.2f} ts={a['with_timestamp']/n:.2f} | err/100 steps:",
          {k: round(100 * v / n, 1) for k, v in sig[m].items()})
json.dump(dict(avail=out, sig={m: dict(s) for m, s in sig.items()}), open('/home/user/frontier-rsi/analysis/out/data_quality.json', 'w'), indent=1)
