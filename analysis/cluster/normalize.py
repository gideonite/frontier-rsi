"""Harness-agnostic action categories for all 5 harnesses. Each tool call -> one of
inspect / edit / run / wait / plan / subagent / other. Shell commands are classified by their text."""
import re, json
INSPECT = re.compile(r'^\s*(cd [^;&|]+(&&|;)\s*)?(ls|cat|head|tail|grep|rg|find|sed -n|nvidia-smi|ps|pgrep|wc|du|df|stat|file|tree|git (status|diff|log|show)|nl|less|diff|cmp|md5sum|sha256sum|which|echo|pwd|date|bash /app/timer\.sh)\b')
WAIT = re.compile(r'^\s*(sleep\b|until\b|while\b.*sleep|timeout \d+ bash -c .until|wait\b)')
EDIT = re.compile(r"(\bcat\s*>+\s*\S+\s*<<|\btee\s+\S+\s*<<|\bsed -i\b|apply_patch|\bpatch\b|\bcp\s+\S+\s+/app/submission|> *\S+\.(py|cu|json|jsonl|sh)\s*<<)")
RUN = re.compile(r'(^|[;&|(\s])(\S*/)?(python3?|torchrun|pytest|bash|sh|\./\S+|make|nvcc|uv run|accelerate|nohup|timeout)\b')
OFFICIAL = re.compile(r'(develop\.py|score\.py|train_rl\.py|probe\.py|run_candidate|evaluate\.py|benchmark\.py|grade)')
BG = re.compile(r'(nohup|&\s*$|&\s*\n|disown|setsid)')
def shell_cat(c):
    if not c: return 'other'
    if WAIT.search(c): return 'wait'
    if EDIT.search(c): return 'edit'
    if INSPECT.search(c) and not re.search(r'(python3?|torchrun|pytest)\s', c): return 'inspect'
    if RUN.search(c): return 'run'
    return 'other'
CODEX_CMD = re.compile(r'cmd:\s*"((?:[^"\\]|\\.)*)"', re.S)
def calls(agent, tool, a):
    """Return list of (category, shell_text_or_None)."""
    a = a if isinstance(a, dict) else {}
    if agent == 'codex':
        if tool in ('sleep', 'wait'): return [('wait', None)]
        s = a.get('input', '') or ''
        out = []
        if 'apply_patch' in s: out.append(('edit', None))
        if 'write_stdin' in s and 'exec_command' not in s: out.append(('wait', None))
        for m in CODEX_CMD.finditer(s):
            c = bytes(m.group(1), 'utf-8').decode('unicode_escape', errors='ignore'); out.append((shell_cat(c), c))
        return out or [('other', None)]
    shell_key = {'claude-code': ('Bash', 'command'), 'grok-build': ('run_terminal_command', 'command'),
                 'antigravity-cli': ('run_command', 'CommandLine'), 'muse-code': ('bash', 'command')}[agent]
    if tool == shell_key[0]:
        c = a.get(shell_key[1], '') or ''
        return [(shell_cat(c), c)]
    t = tool.lower() if tool else ''
    if t in ('read', 'read_file', 'grep', 'glob', 'list_dir', 'find_by_name', 'search', 'ls'): return [('inspect', None)]
    if t in ('edit', 'write', 'multiedit', 'write_file', 'edit_file', 'search_replace', 'notebookedit'): return [('edit', None)]
    if t in ('monitor', 'taskstop', 'get_command_or_subagent_output', 'kill_command_or_subagent', 'bash_input', 'schedule', 'manage_task'): return [('wait', None)]
    if t in ('todo_write', 'write_todos', 'work_list', 'work_status'): return [('plan', None)]
    if t in ('agent', 'spawn_subagent', 'invoke_subagent', 'manage_subagents', 'sendmessage', 'listagents'): return [('subagent', None)]
    return [('other', None)]
