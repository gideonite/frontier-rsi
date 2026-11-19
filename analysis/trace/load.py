"""Minimal trace loader. Each event keeps (trial_id, step_id, call_id) as provenance."""
import json, re, datetime as dt
ROOT = '/home/user/frontier-rsi/'

def trials():
    return [json.loads(l) for l in open(ROOT + 'data/trials.jsonl')]

def load_traj(row):
    return json.load(open(ROOT + row['trajectory_path']))

def ts(s):
    return dt.datetime.fromisoformat(s.replace('Z', '+00:00')) if s else None

def obs_text(step, call_id=None):
    """Return observation text for a step (all results, or the one matching call_id). None if absent (!= '')."""
    ob = step.get('observation')
    if not ob: return None
    res = ob.get('results') or []
    out = []
    for r in res:
        if call_id is None or r.get('source_call_id') == call_id:
            c = r.get('content')
            out.append(c if isinstance(c, str) else json.dumps(c))
    return '\n'.join(out) if out else None

def events(row):
    """Flatten to one event per tool call: dict(trial_id, step_id, call_id, t, tool, args, out, think_tokens)."""
    d = load_traj(row); ev = []
    t0 = None
    for s in d['steps']:
        t = ts(s.get('timestamp'))
        if t and t0 is None: t0 = t
        if s['source'] != 'agent': continue
        m = s.get('metrics') or {}
        tt = ((m.get('extra') or {}).get('output_tokens_details') or {}).get('thinking_tokens')
        calls = s.get('tool_calls') or []
        for c in calls:
            ev.append(dict(trial_id=row['trial_id'], step_id=s['step_id'], call_id=c.get('tool_call_id'), t=t,
                           tool=c.get('function_name'), args=c.get('arguments') or {}, out=obs_text(s, c.get('tool_call_id')),
                           msg=s.get('message') or '', think_tokens=tt))
        if not calls:
            ev.append(dict(trial_id=row['trial_id'], step_id=s['step_id'], call_id=None, t=t, tool=None, args={},
                           out=None, msg=s.get('message') or '', think_tokens=tt))
    return d, ev, t0
