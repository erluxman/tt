#!/bin/bash

# GitHub repository info
REPO_OWNER="erluxman"
REPO_NAME="tt"
BRANCH="feature/ci-cd-and-architecture-refactor"
BASE_BRANCH="main"

# PR details
TITLE="feat: Add CI/CD pipeline and refactor to SOLID architecture"
BODY="## Summary
This PR implements a complete CI/CD setup and refactors the codebase to follow SOLID principles with proper separation of concerns.

## Changes

### Architecture Refactoring
- ✅ Extracted types to \`lib/types/todo.ts\`
- ✅ Created repository layer (\`lib/repositories/todoRepository.ts\`) for data access
- ✅ Created service layer (\`lib/services/todoService.ts\`) for business logic
- ✅ Created custom hook (\`hooks/useTodos.ts\`) for state management
- ✅ Split UI into smaller components (TodoForm, TodoItem, TodoList)
- ✅ Refactored API route to use service layer
- ✅ Refactored main page to use new components and hooks

### Testing Infrastructure
- ✅ Set up Jest and React Testing Library
- ✅ Added comprehensive test coverage (66 tests, all passing)
  - Repository layer tests
  - Service layer tests
  - Component tests
  - API route integration tests

### CI/CD Pipeline
- ✅ Created GitHub Actions workflow (\`.github/workflows/ci.yml\`)
  - Runs on all pushes and pull requests
  - Executes: linting, type checking, tests, and build verification
- ✅ Added branch protection documentation (\`.github/BRANCH_PROTECTION.md\`)

## Testing
- ✅ All 66 tests passing
- ✅ Type checking: ✅ Pass
- ✅ Linting: ✅ Pass
- ✅ Build: ✅ Successful

## Next Steps
After merging, follow the instructions in \`.github/BRANCH_PROTECTION.md\` to set up branch protection rules in GitHub."

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
    echo "GITHUB_TOKEN environment variable is not set."
    echo "Please set it with: export GITHUB_TOKEN=your_token_here"
    echo ""
    echo "Or run: gh auth login"
    echo ""
    echo "Alternatively, you can create the PR manually at:"
    echo "https://github.com/$REPO_OWNER/$REPO_NAME/pull/new/$BRANCH"
    exit 1
fi

# Create PR using GitHub API
echo "Creating pull request..."
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls" \
  -d "{
    \"title\": \"$TITLE\",
    \"body\": \"$BODY\",
    \"head\": \"$BRANCH\",
    \"base\": \"$BASE_BRANCH\"
  }")

# Check if PR was created successfully
PR_URL=$(echo "$RESPONSE" | grep -o '"html_url":"[^"]*"' | cut -d'"' -f4)

if [ -n "$PR_URL" ]; then
    echo "✅ Pull request created successfully!"
    echo "PR URL: $PR_URL"
else
    echo "❌ Failed to create pull request."
    echo "Response: $RESPONSE"
    echo ""
    echo "You can create it manually at:"
    echo "https://github.com/$REPO_OWNER/$REPO_NAME/pull/new/$BRANCH"
fi

