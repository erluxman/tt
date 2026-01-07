# Branch Protection Setup Guide

This guide explains how to set up branch protection rules in GitHub to enforce code review requirements and ensure code quality.

## Overview

Branch protection rules ensure that:
- All changes to the main branch must go through a Pull Request
- Automated tests must pass before merging
- Code reviews are required from specific reviewers
- Direct pushes to protected branches are prevented

## Setup Instructions

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository
2. Click on **Settings** (top navigation bar)
3. Click on **Branches** in the left sidebar

### Step 2: Add Branch Protection Rule

1. Under **Branch protection rules**, click **Add rule** or **Add branch protection rule**
2. In the **Branch name pattern** field, enter: `main` (or `master` if that's your default branch)

### Step 3: Configure Protection Settings

Enable the following settings:

#### Required Settings

- ✅ **Require a pull request before merging**
  - Check: "Require approvals" and set to **1** (or more as needed)
  - Check: "Require review from Code Owners" (if you have a CODEOWNERS file)
  - Optionally: "Dismiss stale pull request approvals when new commits are pushed"

- ✅ **Require status checks to pass before merging**
  - Check: "Require branches to be up to date before merging"
  - Under "Status checks that are required", select:
    - `test` (from the CI workflow)
    - Any other checks you want to require

- ✅ **Require conversation resolution before merging**
  - This ensures all PR comments are addressed

#### Recommended Settings

- ✅ **Do not allow bypassing the above settings**
  - Prevents administrators from bypassing protection rules

- ✅ **Restrict who can push to matching branches**
  - Leave empty to allow all collaborators, or specify teams/users

- ✅ **Require linear history**
  - Ensures a clean, linear git history (optional but recommended)

- ✅ **Include administrators**
  - Ensures even admins follow the same rules

### Step 4: Configure Required Reviewers

1. Scroll to **Restrict who can dismiss pull request reviews**
2. Optionally specify who can dismiss reviews (leave empty for default behavior)

3. To require specific reviewers:
   - Create a `CODEOWNERS` file in `.github/` directory (see below)
   - Or manually select reviewers for each PR

### Step 5: Save the Rule

Click **Create** or **Save changes** to apply the branch protection rule.

## CODEOWNERS File (Optional)

Create a `.github/CODEOWNERS` file to automatically request reviews from specific users or teams:

```
# Default owners for everything in the repo
* @your-username

# Specific paths
/app/ @frontend-team
/lib/ @backend-team
/.github/ @devops-team
```

## Workflow

Once branch protection is enabled:

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit:**
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

3. **Push to GitHub:**
   ```bash
   git push origin feature/my-feature
   ```

4. **Create a Pull Request:**
   - GitHub will automatically run the CI workflow
   - Tests must pass before the PR can be merged
   - Required reviewers must approve the PR

5. **Merge after approval:**
   - Once all checks pass and reviews are approved, you can merge the PR
   - Direct pushes to `main` will be blocked

## CI Workflow Status Checks

The CI workflow (`/.github/workflows/ci.yml`) runs the following checks:
- **Linter**: ESLint checks
- **Type Check**: TypeScript type checking
- **Tests**: Jest test suite with coverage
- **Build**: Next.js build verification

All of these must pass before a PR can be merged.

## Troubleshooting

### "Required status check is missing"
- Make sure the CI workflow has run at least once on a branch
- The status check name must match exactly (case-sensitive)
- Wait for the workflow to complete

### "Review required but no reviewers available"
- Add collaborators to your repository
- Or disable the review requirement temporarily
- Or use CODEOWNERS file for automatic assignment

### "Branch is out of date"
- Update your branch with the latest changes from main:
  ```bash
  git checkout main
  git pull
  git checkout your-branch
  git merge main
  # or: git rebase main
  ```

## Additional Resources

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [CODEOWNERS File Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)

