#!/bin/bash
# Manual trigger for jules-needs-help workflow
# This bypasses certificate issues by using gh CLI with proper auth

set -e

# Branch that's stuck
BRANCH="feat/124-lovelace-phase-2-stuck-5176018683744137250"
REPO="liptonj/meraki-homeassistant"

echo "🔍 Finding PR for branch: $BRANCH"

# Try to get PR number with gh CLI (with SSL_CERT_FILE override if needed)
export SSL_CERT_FILE=""
export GIT_SSL_NO_VERIFY=true

PR_INFO=$(gh pr list --repo "$REPO" --head "$BRANCH" --json number,title,body --limit 1 2>/dev/null || echo "[]")

if [[ "$PR_INFO" == "[]" ]]; then
  echo "❌ Could not find PR for branch $BRANCH"
  echo "Available branches with 'lovelace' or 'stuck':"
  gh pr list --repo "$REPO" --json number,headRefName,title,labels --limit 20 | \
    jq -r '.[] | select(.headRefName | test("lovelace|stuck")) | "\(.number): \(.headRefName) - \(.title[:60])"'
  exit 1
fi

PR_NUMBER=$(echo "$PR_INFO" | jq -r '.[0].number')
PR_TITLE=$(echo "$PR_INFO" | jq -r '.[0].title')

echo "✅ Found PR #$PR_NUMBER: $PR_TITLE"

# Extract issue number from title or body if it exists
ISSUE_NUM=$(echo "$PR_TITLE" | grep -oE '#[0-9]+' | head -1 | tr -d '#' || echo "")
if [[ -z "$ISSUE_NUM" ]]; then
  ISSUE_NUM=$(echo "$PR_INFO" | jq -r '.[0].body' | grep -oE 'Closes #[0-9]+|Fixes #[0-9]+|#[0-9]+' | head -1 | tr -d '#' || echo "$PR_NUMBER")
fi

echo "📋 Issue number: $ISSUE_NUM"
echo "🚀 Triggering jules-needs-help workflow..."

# Trigger repository_dispatch
gh api "repos/$REPO/dispatches" \
  --method POST \
  -f event_type='jules-needs-help' \
  -f "client_payload[pr_number]=$PR_NUMBER" \
  -f "client_payload[branch]=$BRANCH" \
  -f "client_payload[issue_number]=$ISSUE_NUM"

echo "✅ Workflow triggered successfully!"
echo ""
echo "🔗 Monitor workflow runs: https://github.com/$REPO/actions/workflows/jules-needs-help.yaml"
echo "🔗 View PR: https://github.com/$REPO/pull/$PR_NUMBER"
