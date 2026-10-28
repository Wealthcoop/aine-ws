#!/bin/zsh
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"
export HOME="/Users/a"

DIR="/Users/a/Downloads/Documents:Local SEO Maps/aine-ws"
cd "$DIR" || exit 1

LOG="$DIR/scripts/wire_cron.log"
echo "==========================================================" >> "$LOG"
echo "[*] Triggering AINE.WS Autonomous Wire Pipeline at $(date)" >> "$LOG"
echo "==========================================================" >> "$LOG"

# 1. Run breaking news ingestion + daily author column
/usr/bin/python3 "$DIR/scripts/youcom_breaking_wire.py" --wire-limit 3 --with-column >> "$LOG" 2>&1

# 2. Check if git has changes
if [[ -n $(git status --porcelain) ]]; then
  echo "[*] Changes detected. Staging, committing, and pushing to Vercel..." >> "$LOG"
  git add src/ public/news/editorial/ scripts/ next.config.mjs >> "$LOG" 2>&1
  git commit -m "chore(wire): autonomous news ingestion & rotating author column [skip ci]" >> "$LOG" 2>&1
  git push origin main >> "$LOG" 2>&1
  echo "[+] Git push complete. Vercel deployment triggered!" >> "$LOG"
else
  echo "[*] No new changes to push." >> "$LOG"
fi

echo "[*] Finished wire run at $(date)" >> "$LOG"
