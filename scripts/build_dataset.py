"""Join HF trajectory manifest with leaderboard scores -> data/trials.jsonl.
Run: python3 -I scripts/build_dataset.py   (from repo root)
Join: trajectory trial <-> leaderboard trial within (model, task) by reward;
if both trials tie on reward, the order is ambiguous -> raw_score_ambiguous=True
(raw is then assigned by trial-id order and should be treated as uncertain)."""
import json, re, collections
def load_js(p):
    s = open(p).read(); return json.loads(s[s.index('{'):s.rindex('}') + 1])
D = load_js('data/leaderboard_data.js')
rows = [json.loads(l) for l in open('data/hf/manifest.jsonl')]
norm = lambda x: re.sub(r'[^a-z0-9]', '', x.lower())
MODEL_MAP = {'anthropic/claude-fable-5-2': 'claudefable52', 'anthropic/claude-opus-5-5': 'claudeopus55',
  'openai/gpt-6-astra': 'gpt6astra', 'openai/gpt-6.1-sol': 'gpt61sol', 'gemini/gemini-4-carbon': 'gemini4carbon',
  'gemini/gemini-4-argon': 'gemini4argon', 'xai-public/grok-4.7': 'grok47', 'fireworks/kimi-k3p1-pro': 'kimik31pro',
  'meta-public/muse-wonder-1.0': 'musewonder10'}
lb = {}
for t in D['tasks']:
    for m in t['models']:
        lb[(norm(m['model']), t['id'])] = m
def tid(task): return re.sub(r'-[0-9a-f]{8}$', '', task)
groups = collections.defaultdict(list)
for r in rows:
    tm = r['trial_meta']; groups[(tm['model'], tm['task_id'])].append(r)
out, amb, miss = [], 0, 0
for (model, task), rs in groups.items():
    rs.sort(key=lambda r: int(r['trial_id'].rsplit('-', 1)[1]))
    key = (norm(model.split('/')[1]), tid(task))
    cand = lb.get((MODEL_MAP[model], key[1]))
    trials = list(cand['trials']) if cand else []
    for r in rs:
        tm = r['trial_meta']; raw = None; ambiguous = False
        match = [t for t in trials if t['reward'] == tm['reward']]
        if match:
            ambiguous = len({t['raw'] for t in match}) > 1
            raw = match[0]['raw']; trials.remove(match[0])
        elif trials:  # reward mismatch: fall back to remaining leaderboard trial, flagged
            raw = trials.pop(0)['raw']; ambiguous = True; miss += 1
        else: miss += 1
        amb += ambiguous
        out.append(dict(trial_id=r['trial_id'], model=model, agent=tm['agent'], effort=tm['reasoning_effort'],
            task=tid(task), task_full=task, status=tm['status'], reward=tm['reward'], outcome=tm['outcome'],
            raw_score=raw, raw_score_ambiguous=ambiguous, input_tokens=tm['input_tokens'], output_tokens=tm['output_tokens'],
            cost_usd=tm['cost_usd'], started_at=tm['started_at'], finished_at=tm['finished_at'],
            trajectory_path='data/hf/' + r['path'], sha256=r['sha256']))
with open('data/trials.jsonl', 'w') as f:
    for o in out: f.write(json.dumps(o) + '\n')
print(len(out), 'trials; reward unmatched:', miss, 'ambiguous raw:', amb, 'missing raw:', sum(o['raw_score'] is None for o in out))
