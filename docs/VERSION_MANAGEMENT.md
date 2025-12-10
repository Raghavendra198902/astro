# Version Management Guide

## Overview

Astor AI uses [Semantic Versioning](https://semver.org/) for version control.

**Current Version**: 2.0.0

## Version Format

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Incompatible API changes
- **MINOR**: New features (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

## Files Tracking Version

1. `VERSION` - Single source of truth (plain text)
2. `backend/app/__version__.py` - Python version module
3. `frontend/package.json` - NPM package version
4. `.version.json` - Machine-readable version metadata
5. `CHANGELOG.md` - Human-readable change history

## Using the Version Script

### Show Current Version

```bash
./scripts/version.sh show
```

### Bump Version

```bash
# Patch release (2.0.0 → 2.0.1)
./scripts/version.sh bump patch

# Minor release (2.0.0 → 2.1.0)
./scripts/version.sh bump minor

# Major release (2.0.0 → 3.0.0)
./scripts/version.sh bump major
```

### Set Specific Version

```bash
./scripts/version.sh set 2.1.5
```

### Create Release Tag

```bash
./scripts/version.sh release "Bug Fix Release"
```

## Release Process

### 1. Update Code & Test

Ensure all features are complete and tested.

### 2. Update CHANGELOG.md

Add changes under appropriate version heading:

```markdown
## [2.1.0] - 2025-12-15

### Added
- New feature X
- New feature Y

### Fixed
- Bug fix A
- Bug fix B

### Changed
- Update Z
```

### 3. Bump Version

```bash
./scripts/version.sh bump minor
```

This automatically updates:
- `VERSION`
- `backend/app/__version__.py`
- `frontend/package.json`
- `.version.json`

### 4. Commit Changes

```bash
git add .
git commit -m "chore: bump version to 2.1.0"
```

### 5. Create Release Tag

```bash
./scripts/version.sh release "Feature Release 2.1.0"
```

### 6. Push to Repository

```bash
git push origin main
git push origin v2.1.0
```

### 7. Create GitHub Release

Go to GitHub → Releases → Create new release:
- Tag: `v2.1.0`
- Title: `v2.1.0 - Feature Release`
- Description: Copy from CHANGELOG.md

## Version in Code

### Backend (Python)

```python
from app.__version__ import __version__, get_version_info

# Get version string
version = __version__  # "2.0.0"

# Get detailed info
info = get_version_info()
# {
#   "version": "2.0.0",
#   "release_date": "2025-12-10",
#   "release_name": "Enterprise Launch",
#   ...
# }
```

### Frontend (TypeScript)

```typescript
import { getVersion, getVersionInfo } from '@/lib/version';

// Get version string
const version = getVersion(); // "2.0.0"

// Get detailed info
const info = getVersionInfo();
```

### API Endpoint

```bash
# Get version info
curl http://localhost:8000/api/v1/version
```

## Release Schedule

- **Major releases**: Quarterly (Q1, Q2, Q3, Q4)
- **Minor releases**: Monthly
- **Patch releases**: As needed for critical fixes

## Version History

| Version | Release Date | Name | Type |
|---------|--------------|------|------|
| 2.0.0 | 2025-12-10 | Enterprise Launch | Major |
| 1.0.0 | 2025-11-01 | Initial Release | Major |

## Hotfix Process

For urgent production fixes:

1. Create hotfix branch from main:
   ```bash
   git checkout -b hotfix/2.0.1 main
   ```

2. Make fixes and test

3. Bump patch version:
   ```bash
   ./scripts/version.sh bump patch
   ```

4. Update CHANGELOG.md with hotfix details

5. Commit and merge to main:
   ```bash
   git add .
   git commit -m "hotfix: critical bug fix"
   git checkout main
   git merge hotfix/2.0.1
   ```

6. Create release tag and push

## Feature Flags

Version-specific features are controlled in `backend/app/__version__.py`:

```python
FEATURES = {
    "life_events_prediction": True,
    "advanced_vedic": True,
    "ai_interpretations": True,
    # ... more features
}
```

Check features in code:

```python
from app.__version__ import FEATURES

if FEATURES["life_events_prediction"]:
    # Enable life events prediction
    pass
```

## Docker Image Tags

Docker images should be tagged with version:

```bash
# Build with version tag
docker build -t astor-ai-backend:2.0.0 backend/
docker build -t astor-ai-frontend:2.0.0 frontend/

# Also tag as latest
docker tag astor-ai-backend:2.0.0 astor-ai-backend:latest
docker tag astor-ai-frontend:2.0.0 astor-ai-frontend:latest
```

## Troubleshooting

### Version Mismatch

If versions are out of sync:

```bash
# Force set version across all files
./scripts/version.sh set 2.0.0
```

### Script Not Executable

```bash
chmod +x ./scripts/version.sh
```

## Best Practices

1. **Always update CHANGELOG.md** before bumping version
2. **Test thoroughly** before creating release
3. **Use semantic versioning** correctly
4. **Tag releases** in git for easy rollback
5. **Keep VERSION file** as single source of truth
6. **Document breaking changes** in CHANGELOG for major versions
7. **Use feature flags** for gradual rollouts
