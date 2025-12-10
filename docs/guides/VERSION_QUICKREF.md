# Version Management - Quick Reference

## Current Version: 2.0.0

## Quick Commands

```bash
# Show version info
./scripts/info.sh

# Show current version
./scripts/version.sh show

# Bump version
./scripts/version.sh bump patch   # 2.0.0 → 2.0.1
./scripts/version.sh bump minor   # 2.0.0 → 2.1.0
./scripts/version.sh bump major   # 2.0.0 → 3.0.0

# Set specific version
./scripts/version.sh set 2.1.5

# Create release
./scripts/version.sh release "Release Name"
```

## API Endpoints

```bash
# Root endpoint (version info)
curl http://localhost:8000/

# Detailed version info
curl http://localhost:8000/api/v1/version
```

## In Code

### Backend (Python)
```python
from app.__version__ import __version__, FEATURES, get_version_info

version = __version__                    # "2.0.0"
info = get_version_info()                # Full details
features = FEATURES["feature_name"]      # Check feature
```

### Frontend (TypeScript)
```typescript
import { getVersion, getVersionInfo } from '@/lib/version';
import VersionBadge from '@/components/VersionBadge';

const version = getVersion();            // "2.0.0"
const info = getVersionInfo();           // Full details

// Use component
<VersionBadge />
<VersionBadge showDetails={true} />
```

## Release Process

1. Update code & test
2. Update CHANGELOG.md
3. Bump version: `./scripts/version.sh bump minor`
4. Commit: `git commit -m "chore: bump version to 2.1.0"`
5. Create tag: `./scripts/version.sh release "Feature Release"`
6. Push: `git push && git push --tags`
7. Create GitHub release

## Version Files

- `VERSION` - Source of truth
- `backend/app/__version__.py` - Python module
- `frontend/package.json` - NPM package
- `frontend/lib/version.ts` - TypeScript module
- `.version.json` - Machine-readable metadata
- `CHANGELOG.md` - Change history

## Documentation

- `docs/VERSION_MANAGEMENT.md` - Full guide
- `VERSION_SYSTEM_COMPLETE.md` - Implementation report
- `CHANGELOG.md` - Change history

## Semantic Versioning

**MAJOR.MINOR.PATCH**
- **MAJOR**: Breaking changes
- **MINOR**: New features (compatible)
- **PATCH**: Bug fixes (compatible)
