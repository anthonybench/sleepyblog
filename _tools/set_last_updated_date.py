#!/usr/bin/env python

# ./_tools/set_last_updated_date.py

import subprocess
import json
from typing import Dict, List
from sys import exit

def shellExec(command:str, shell:str='/bin/bash') -> Dict[str,any]|str:
  '''Shell Exec
  
  Run a shell command in python as simply as `shellExec('echo dingus')`
  '''
  result = subprocess.run(command, shell=True, capture_output=True, text=True, executable=shell)
  if result.returncode == 0:
    return result.stdout
  else:
    return f'Error: {result.stderr}'

try:
  old_dirty_list:List[str] = shellExec('git diff --name-only').split('\n')[:-1]
except Exception as e:
  print(f'Error getting git status for {__file__}\n{e}')
  exit(1)

try:
  response = shellExec(f'''
  curl -L \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer $GH_TOKEN" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/repos/anthonybench/sleepyblog/branches/main
  ''')
  response = json.loads(response)
  last_updated_date = response['commit']['commit']['committer']['date'].split('T')[0]
except Exception as e:
  print(f'Error calling github api\n{e}')
  exit(1)

try:
  with open('app/last-updated-date.ts', 'w') as f:
    f.write(f'''// yyyy-mm-dd
export const lastUpdatedDate: string = "{last_updated_date}";''')
except Exception as e:
  print(f'Error modifying app/last-updated-date.ts file\n{e}')
  exit(1)

try:
  new_dirty_list:List[str] = shellExec('git diff --name-only').split('\n')[:-1]
  files_to_stage = set(new_dirty_list) - set(old_dirty_list)
  print(f"git add {' '.join(files_to_stage)}")
  shellExec(f"git add {' '.join(files_to_stage)}")
except Exception as e:
  print(f'Error getting git status for {__file__}\n{e}')
  exit(1)

exit(0)