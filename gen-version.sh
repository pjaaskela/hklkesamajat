#!/bin/bash
# Generate version.js + version-history.json from git state. Run before commit or deploy.
cd "$(dirname "$0")"
HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "dev")
COUNT=$(git rev-list --count HEAD 2>/dev/null || echo "0")
DATE=$(date +%Y-%m-%d)
TIME=$(date +%H:%M)
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

cat > version.js << EOF
window.HKL_VERSION = {
  hash: "${HASH}",
  build: ${COUNT},
  date: "${DATE}",
  time: "${TIME}",
  branch: "${BRANCH}",
  label: "v1.${COUNT}"
};
EOF

# Generate version history (last 30 commits with changed files)
git log --pretty=format:'{"hash":"%h","date":"%ci","msg":"%s","author":"%an"}' -30 2>/dev/null | \
  python3 -c "
import sys, json
commits = []
for line in sys.stdin:
    line = line.strip()
    if not line: continue
    try:
        d = json.loads(line)
        d['date'] = d['date'][:16]
        commits.append(d)
    except: pass
print(json.dumps(commits, ensure_ascii=False))
" > version-history.json 2>/dev/null || echo "[]" > version-history.json

echo "Generated version.js: v1.${COUNT} (${HASH}, ${DATE} ${TIME})"
