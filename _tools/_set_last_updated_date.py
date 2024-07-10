#!/usr/bin/env python

# ./_tools/_set_last_updated_date.py

import subprocess
import json
from typing import Dict, List
from sys import exit
from zoneinfo import ZoneInfo
from datetime import datetime


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


# get current date string
try:
    last_updated_date = datetime.now(ZoneInfo("America/Los_Angeles")).strftime(
        "%Y-%m-%d"
    )
except Exception as e:
    print(f"Error getting current date\n{e}")
    exit(1)

# get list of dirty files before affecting change
try:
    old_dirty_list: List[str] = shellExec("git diff --name-only").split("\n")[:-1]
except Exception as e:
    print(f"Error getting git status for {__file__}\n{e}")
    exit(1)

# updated last-updated-date.ts file
try:
    with open("app/last-updated-date.ts", "w") as f:
        f.write(
            f"""// yyyy-mm-dd
export const lastUpdatedDate: string = "{last_updated_date}";"""
        )
except Exception as e:
    print(f"Error modifying app/last-updated-date.ts file\n{e}")
    exit(1)

# stage only files affected by this script
try:
    new_dirty_list: List[str] = shellExec("git diff --name-only").split("\n")[:-1]
    files_to_stage = set(new_dirty_list) - set(old_dirty_list)
    consequential_command = f"git add {' '.join(files_to_stage)}"
    print(consequential_command)
    shellExec(consequential_command)
except Exception as e:
    print(f"Error getting git status for {__file__}\n{e}")
    exit(1)

exit(0)
