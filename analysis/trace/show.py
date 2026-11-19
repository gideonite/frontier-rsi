import sys; sys.path.insert(0,'/home/user/frontier-rsi/analysis/trace')
import load
def show(tid, maxc=140, outc=0, start=0, end=10**9):
    r=[x for x in load.trials() if x['trial_id'].endswith(tid) or x['trial_id']==tid][0]
    d,ev,t0=load.events(r)
    for e in ev:
        n=int(e['step_id'])
        if n<start or n>end: continue
        mins=(e['t']-t0).total_seconds()/60 if e['t'] else -1
        a=e['args'].get('command') or e['args'].get('file_path') or str(e['args'])
        print(f"[{e['step_id']:>3} {mins:6.1f}m] {e['tool']}: {str(a)[:maxc]!r}")
        if e['msg'].strip(): print('      MSG:',e['msg'].strip()[:maxc*2].replace('\n',' '))
        if outc and e['out']: print('      OUT:',e['out'][-outc:].replace('\n',' | '))
if __name__=='__main__':
    show(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]) if len(sys.argv)>4 else 0, int(sys.argv[5]) if len(sys.argv)>5 else 10**9)
