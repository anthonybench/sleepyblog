#!/usr/bin/env python

# ./_tools/set_last_updated_date.py

import subprocess
import json
from typing import Dict, List
from sys import exit


def shellExec(command: str, shell: str = "/bin/bash") -> Dict[str, any] | str:
    """Shell Exec

    Run a shell command in python as simply as `shellExec('echo dingus')`
    """
    result = subprocess.run(
        command, shell=True, capture_output=True, text=True, executable=shell
    )
    if result.returncode == 0:
        return result.stdout
    else:
        return f"Error: {result.stderr}"


# get list of dirty files before affecting change
try:
    old_dirty_list: List[str] = shellExec("git diff --name-only").split("\n")[:-1]
except Exception as e:
    print(f"Error getting git status for {__file__}\n{e}")
    exit(1)

# run formatters
try:
    shellExec("black _tools/")
    shellExec("prettier -w /Users/sleepyboy/Desktop/Repos/Me/sleepyblog")
except Exception as e:
    print(f"Error getting git status for {__file__}\n{e}")
    exit(1)

# stage only files affected by this script
try:
    new_dirty_list: List[str] = shellExec("git diff --name-only").split("\n")[:-1]
    files_to_stage = set(new_dirty_list) - set(old_dirty_list)
    print(f"git add {' '.join(files_to_stage)}")
    shellExec(f"git add {' '.join(files_to_stage)}")
except Exception as e:
    print(f"Error getting git status for {__file__}\n{e}")
    exit(1)

exit(0)
