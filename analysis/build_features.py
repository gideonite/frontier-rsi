"""Build per-trial features for the claude-code subset. python3 -I analysis/build_features.py"""
import sys, json
sys.path.insert(0, '/home/user/frontier-rsi/analysis/trace')
import features, load
out = [f for f in (features.trial_features(r) for r in load.trials() if r['agent'] == 'claude-code') if f]
json.dump(out, open('/home/user/frontier-rsi/analysis/out/features_claude_code.json', 'w')); print(len(out), 'trials')
