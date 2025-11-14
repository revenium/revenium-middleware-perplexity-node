#!/usr/bin/env bash
set -euo pipefail

# Usage: ./publish_public_repo_first_time.sh <release-version> <public-repo-url>
RELEASE_VERSION="$1"
PUBLIC_REPO_URL="$2"

git init
git add .

git commit -S -m "Initial open-source release (v$RELEASE_VERSION)"   # match current PyPI/npm version
git branch -M main
# Create repo on GitHub as PRIVATE - only human reviewer can make it public
gh repo create $PUBLIC_REPO_URL --private --source=. --remote=origin --push
# Tag with current package version
git tag -s v$RELEASE_VERSION -m "Release v$RELEASE_VERSION"
git push origin main --tags
