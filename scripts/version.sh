#!/bin/bash
# Version Management Script for Astor AI

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERSION_FILE="$PROJECT_ROOT/VERSION"
CHANGELOG_FILE="$PROJECT_ROOT/CHANGELOG.md"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
show_current_version() {
    if [ -f "$VERSION_FILE" ]; then
        VERSION=$(cat "$VERSION_FILE")
        echo -e "${GREEN}Current Version: $VERSION${NC}"
    else
        echo -e "${RED}VERSION file not found${NC}"
        exit 1
    fi
}

bump_version() {
    local BUMP_TYPE=$1
    local CURRENT_VERSION=$(cat "$VERSION_FILE")
    
    IFS='.' read -r -a VERSION_PARTS <<< "$CURRENT_VERSION"
    MAJOR="${VERSION_PARTS[0]}"
    MINOR="${VERSION_PARTS[1]}"
    PATCH="${VERSION_PARTS[2]}"
    
    case $BUMP_TYPE in
        major)
            MAJOR=$((MAJOR + 1))
            MINOR=0
            PATCH=0
            ;;
        minor)
            MINOR=$((MINOR + 1))
            PATCH=0
            ;;
        patch)
            PATCH=$((PATCH + 1))
            ;;
        *)
            echo -e "${RED}Invalid bump type: $BUMP_TYPE${NC}"
            echo "Usage: $0 bump [major|minor|patch]"
            exit 1
            ;;
    esac
    
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"
    echo -e "${YELLOW}Bumping version: $CURRENT_VERSION → $NEW_VERSION${NC}"
    
    # Update VERSION file
    echo "$NEW_VERSION" > "$VERSION_FILE"
    
    # Update backend __version__.py
    sed -i "s/__version__ = \".*\"/__version__ = \"$NEW_VERSION\"/" "$PROJECT_ROOT/backend/app/__version__.py"
    sed -i "s/__version_info__ = (.*)/__version_info__ = ($MAJOR, $MINOR, $PATCH)/" "$PROJECT_ROOT/backend/app/__version__.py"
    
    # Update frontend package.json
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$PROJECT_ROOT/frontend/package.json"
    
    # Update .version.json
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$PROJECT_ROOT/.version.json"
    sed -i "s/\"major\": [0-9]*/\"major\": $MAJOR/" "$PROJECT_ROOT/.version.json"
    sed -i "s/\"minor\": [0-9]*/\"minor\": $MINOR/" "$PROJECT_ROOT/.version.json"
    sed -i "s/\"patch\": [0-9]*/\"patch\": $PATCH/" "$PROJECT_ROOT/.version.json"
    
    echo -e "${GREEN}✓ Version updated to $NEW_VERSION${NC}"
    echo -e "${YELLOW}Don't forget to:${NC}"
    echo "  1. Update CHANGELOG.md"
    echo "  2. Commit changes: git add . && git commit -m 'chore: bump version to $NEW_VERSION'"
    echo "  3. Create tag: git tag v$NEW_VERSION"
    echo "  4. Push: git push && git push --tags"
}

set_version() {
    local NEW_VERSION=$1
    
    if [[ ! $NEW_VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        echo -e "${RED}Invalid version format: $NEW_VERSION${NC}"
        echo "Version must be in format: MAJOR.MINOR.PATCH (e.g., 2.0.0)"
        exit 1
    fi
    
    IFS='.' read -r -a VERSION_PARTS <<< "$NEW_VERSION"
    MAJOR="${VERSION_PARTS[0]}"
    MINOR="${VERSION_PARTS[1]}"
    PATCH="${VERSION_PARTS[2]}"
    
    echo -e "${YELLOW}Setting version to: $NEW_VERSION${NC}"
    
    # Update all version files
    echo "$NEW_VERSION" > "$VERSION_FILE"
    
    sed -i "s/__version__ = \".*\"/__version__ = \"$NEW_VERSION\"/" "$PROJECT_ROOT/backend/app/__version__.py"
    sed -i "s/__version_info__ = (.*)/__version_info__ = ($MAJOR, $MINOR, $PATCH)/" "$PROJECT_ROOT/backend/app/__version__.py"
    
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$PROJECT_ROOT/frontend/package.json"
    
    sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" "$PROJECT_ROOT/.version.json"
    sed -i "s/\"major\": [0-9]*/\"major\": $MAJOR/" "$PROJECT_ROOT/.version.json"
    sed -i "s/\"minor\": [0-9]*/\"minor\": $MINOR/" "$PROJECT_ROOT/.version.json"
    sed -i "s/\"patch\": [0-9]*/\"patch\": $PATCH/" "$PROJECT_ROOT/.version.json"
    
    echo -e "${GREEN}✓ Version set to $NEW_VERSION${NC}"
}

create_release() {
    local VERSION=$(cat "$VERSION_FILE")
    local RELEASE_NAME=$1
    
    if [ -z "$RELEASE_NAME" ]; then
        RELEASE_NAME="Release $VERSION"
    fi
    
    echo -e "${YELLOW}Creating release: $RELEASE_NAME${NC}"
    
    # Create git tag
    git tag -a "v$VERSION" -m "$RELEASE_NAME"
    
    echo -e "${GREEN}✓ Created tag v$VERSION${NC}"
    echo -e "${YELLOW}Push with: git push origin v$VERSION${NC}"
}

show_help() {
    cat << EOF
${GREEN}Astor AI Version Management${NC}

Usage: $0 [command] [options]

Commands:
    show                    Show current version
    bump [type]            Bump version (major|minor|patch)
    set [version]          Set specific version (e.g., 2.0.0)
    release [name]         Create a git release tag
    help                   Show this help message

Examples:
    $0 show                # Show current version
    $0 bump minor          # 2.0.0 → 2.1.0
    $0 bump patch          # 2.0.0 → 2.0.1
    $0 set 3.0.0           # Set version to 3.0.0
    $0 release "Enterprise Launch"

Version Format: MAJOR.MINOR.PATCH
    - MAJOR: Incompatible API changes
    - MINOR: New features (backwards-compatible)
    - PATCH: Bug fixes (backwards-compatible)

EOF
}

# Main
case "${1:-show}" in
    show)
        show_current_version
        ;;
    bump)
        bump_version "${2:-patch}"
        ;;
    set)
        if [ -z "$2" ]; then
            echo -e "${RED}Error: Version required${NC}"
            echo "Usage: $0 set [version]"
            exit 1
        fi
        set_version "$2"
        ;;
    release)
        create_release "$2"
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_help
        exit 1
        ;;
esac
