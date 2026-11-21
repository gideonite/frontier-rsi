"""For all 90 post-training trials: final report text, replicate/single-run language, and a heuristic candidate for the agent's
claimed trained-model solve rate (to be checked by hand). python3 -I analysis/pt_final_reports.py"""
import sys, re, json
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace'); import load, outcome
M = outcome.task_meta()
REPL = re.compile(r'(trained (this|the same|that) [^.]{0,40}twice|twice|two (training )?runs of|second (full )?run of the same|re-?ran|re-?run|replicat\w*|repeat(ed)? (the )?(same|full|training) run|across (two|three|\d) (seeds|runs)|run-to-run|seed(s)? \d+ and \d+)', re.I)
SINGLE = re.compile(r'(single (validation |training |full )?run|one (full |training )?run of|only one (full )?run|no second run|no measure of run-to-run|not (been )?replicated|one run per config|did not (re)?run)', re.I)
NUM = re.compile(r'(\d{1,3}(?:\.\d+)?)\s*%|\b(0\.\d{2,4})\b|\b(\d{1,3})\s*/\s*(\d{1,3})\b')
POS = re.compile(r'(trained|hand-?in|after|this pool|selected|final|checkpoint|fine-?tuned|our|candidate|→|->|to )', re.I)
NEGW = re.compile(r'(base|original|untrained|baseline|before|starting)', re.I)
out = []
for r in load.trials():
    if not r['task'].startswith('pt-'): continue
    d = load.load_traj(r)
    msgs = [s for s in d['steps'] if s['source'] == 'agent' and (s.get('message') or '').strip()]
    fin = msgs[-1]['message'] if msgs else ''
    cands = []
    for line in re.split(r'(?<=[.\n|])', fin):
        if not POS.search(line): continue
        for m in NUM.finditer(line):
            v = float(m.group(1)) / 100 if m.group(1) else float(m.group(2)) if m.group(2) else (int(m.group(3)) / int(m.group(4)) if int(m.group(4)) else None)
            if v is not None and 0 < v <= 1: cands.append((v, line.strip()[:160]))
    best = max(cands, key=lambda x: x[0]) if cands else (None, '')
    out.append(dict(trial_id=r['trial_id'], model=r['model'], task=r['task'], raw=r['raw_score'], ambiguous=r['raw_score_ambiguous'], nop=M[r['task']]['nop'],
                    repl=[m.group(0) for m in REPL.finditer(fin)][:4], single=[m.group(0) for m in SINGLE.finditer(fin)][:3],
                    claim_auto=best[0], claim_ctx=best[1], final_len=len(fin)))
json.dump(out, open('/home/user/frontier-rsi/analysis/out/pt_final_reports.json', 'w'), indent=1)
for o in out:
    print(f"{o['model'].split('/')[1][:12]:12s} {o['task'][3:22]:19s} {o['trial_id'][-4:]} raw={o['raw'] if o['raw'] is None else round(o['raw'],3)!s:6s} amb={int(o['ambiguous'])} claim={o['claim_auto'] if o['claim_auto'] is None else round(o['claim_auto'],3)!s:6s} repl={o['repl'][:2]} single={o['single'][:1]}")
