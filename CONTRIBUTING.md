# Development Workflow

## 🌳 Git Flow Requirements
- **main**: Production-ready code only.
- **develop**: Integration branch for the current sprint.
- **Naming Convention**:
    - Features: `feature/US-[ID]-description`
    - Bugfixes: `fix/US-[ID]-description`

## 💬 Commit Message Convention
We strictly follow **Conventional Commits**:
- `feat:` New features (e.g., `feat: US-001 add user login`)
- `fix:` Bug fixes (e.g., `fix: US-003 resolve database connection timeout`)
- `docs:` Documentation changes only.
- `chore:` Maintenance tasks, dependencies, or tool config.

## 🛠 Pull Request Process
- **No direct pushes** to `main` or `develop`.
- **Minimum 1 reviewer** required for every PR.
- **PR Description**: Must include a summary, screenshots (if UI), and test results.
