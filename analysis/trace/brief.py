"""One line per agent step: time, tools, and the agent's own message (deduped). For manual reading."""
import sys; sys.path.insert(0,'/home/user/frontier-rsi/analysis/trace')
import load
def brief(tid, start=0, end=10**9, w=260, outw=0):
    r=[x for x in load.trials() if x['trial_id'].endswith(tid)][0]
    d,ev,t0=load.events(r); seen=set()
    for s in d['steps']:
        n=int(s['step_id'])
        if n<start or n>end or s['source']!='agent': continue
        t=(load.ts(s['timestamp'])-t0).total_seconds()/60
        tools=[(c['function_name'], str(c['arguments'].get('command') or c['arguments'].get('file_path') or '')[:70].replace('\n',' ')) for c in s.get('tool_calls') or []]
        msg=(s.get('message') or '').strip().replace('\n',' ')[:w]
        print(f"[{n:>3} {t:6.1f}m] {'; '.join(f'{a}:{b}' for a,b in tools[:2])[:150]}")
        if msg: print('     >',msg)
        if outw:
            o=load.obs_text(s)
            if o: print('     =',o[-outw:].replace('\n',' | '))
if __name__=='__main__':
    a=sys.argv; brief(a[1], int(a[2]) if len(a)>2 else 0, int(a[3]) if len(a)>3 else 10**9, outw=int(a[4]) if len(a)>4 else 0)
