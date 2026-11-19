"""Outcome q in [0,1]: closeness to best raw (direction-aware); None if raw missing (kept distinct from 0)."""
import json
def task_meta():
    s = open('/home/user/frontier-rsi/data/leaderboard_data.js').read()
    D = json.loads(s[s.index('{'):s.rindex('}') + 1])
    return {t['id']: dict(direction=t['direction'], best=t['best_raw'], metric=t['metric'], hours=t['hours'], nop=t['nop']['raw'], title=t['title']) for t in D['tasks']}
def q(row, meta):
    m = meta[row['task']]; r = row['raw_score']
    if r is None: return None
    if m['direction'] == 'minimize': return min(1.0, m['best'] / r) if r > 0 else None
    return min(1.0, r / m['best']) if m['best'] else None
