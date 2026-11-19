"""Additive-offset vs multiplicative-ratio model for official = f(dev) in kernel tasks. python3 -I analysis/kernel_offset.py"""
import json, statistics as st, collections
R = [x for x in json.load(open('/home/user/frontier-rsi/analysis/out/selfreport_gap_kernels.json')) if x['claimed_ms'] and not x['ambiguous']]
by = collections.defaultdict(list)
for x in R: by[x['task']].append(x)
def cv(v): return st.pstdev(v) / st.mean(v) if len(v) > 1 and st.mean(v) else float('nan')
print(f"{'task':34s} n  dev_ms(range)        official(range)       CV(dev) CV(official)  offset=off-dev median [min,max]   CV(offset)  CV(ratio)")
tab = {}
for t, xs in sorted(by.items()):
    if len(xs) < 3: print(f'{t[7:]:34s} n={len(xs)} (too few non-ambiguous)'); continue
    dev = [x['claimed_ms'] for x in xs]; off = [x['official_ms'] for x in xs]; diff = [o - d for o, d in zip(off, dev)]; ratio = [o / d for o, d in zip(off, dev)]
    print(f"{t[7:]:34s} {len(xs)}  {min(dev):6.2f}-{max(dev):6.2f}  {min(off):7.2f}-{max(off):7.2f}   {cv(dev):5.2f}  {cv(off):5.2f}   {st.median(diff):7.2f} [{min(diff):.2f},{max(diff):.2f}]   {cv(diff):5.2f}   {cv(ratio):5.2f}")
    tab[t] = dict(n=len(xs), cv_dev=cv(dev), cv_off=cv(off), cv_offset=cv(diff), cv_ratio=cv(ratio), offset_median=st.median(diff))
json.dump(tab, open('/home/user/frontier-rsi/analysis/out/kernel_offset.json', 'w'), indent=1)
print('tasks where CV(offset) < CV(ratio):', sum(v['cv_offset'] < v['cv_ratio'] for v in tab.values()), 'of', len(tab))
