#!/bin/bash
# Quick PR creation - tries multiple methods

echo "Attempting to create PR..."

# Method 1: Try gh CLI if available
if command -v gh &> /dev/null; then
    echo "Using GitHub CLI..."
    gh pr create --title "feat: Add CI/CD pipeline and refactor to SOLID architecture" --body-file PR_DESCRIPTION.md --base main && exit 0
fi

# Method 2: Use Node.js script with token prompt
if [ -z "$GITHUB_TOKEN" ]; then
    echo ""
    echo "To create PR automatically, you need a GitHub token:"
    echo "1. Get token from: https://github.com/settings/tokens"
    echo "2. Run: export GITHUB_TOKEN=your_token"
    echo "3. Run: node create-pr.js"
    echo ""
    echo "OR create manually at:"
    echo "https://github.com/erluxman/tt/pull/new/feature/ci-cd-and-architecture-refactor"
    echo ""
    read -p "Do you have a GitHub token? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -sp "Enter your GitHub token: " GITHUB_TOKEN
        export GITHUB_TOKEN
        echo ""
        node create-pr.js
    else
        echo "Opening browser for manual PR creation..."
        xdg-open "https://github.com/erluxman/tt/pull/new/feature/ci-cd-and-architecture-refactor" 2>/dev/null || \
        open "https://github.com/erluxman/tt/pull/new/feature/ci-cd-and-architecture-refactor" 2>/dev/null || \
        echo "Please visit: https://github.com/erluxman/tt/pull/new/feature/ci-cd-and-architecture-refactor"
    fi
else
    node create-pr.js
fi
