# Astor AI Wiki

This directory contains comprehensive documentation for the Astor AI platform in GitHub Wiki format.

## 📚 Available Pages

1. **[Home](Home.md)** - Wiki homepage and navigation
2. **[Installation Guide](Installation-Guide.md)** - Complete setup instructions
3. **[Quick Start](Quick-Start.md)** - Get running in 5 minutes
4. **[Configuration](Configuration.md)** - Environment and settings
5. **[System Architecture](System-Architecture.md)** - Technical architecture overview
6. **[API Design](API-Design.md)** - RESTful API documentation
7. **[Deployment Guide](Deployment-Guide.md)** - Production deployment
8. **[Troubleshooting](Troubleshooting.md)** - Common issues and solutions

## 🚀 Publishing to GitHub Wiki

### Manual Upload

1. Go to your repository's Wiki tab
2. Create a new page
3. Copy content from each `.md` file
4. Save the page

### Using Git (Recommended)

```bash
# Clone the wiki repository
git clone https://github.com/Raghavendra198902/astro.wiki.git

# Copy wiki files
cp wiki/*.md astro.wiki/

# Commit and push
cd astro.wiki
git add .
git commit -m "Add comprehensive wiki documentation"
git push origin master
```

### Using Wiki Publishing Script

```bash
#!/bin/bash
# publish-wiki.sh

REPO_WIKI="https://github.com/Raghavendra198902/astro.wiki.git"

# Clone wiki repo
git clone $REPO_WIKI wiki-repo
cd wiki-repo

# Copy all wiki files
cp ../wiki/*.md .

# Commit and push
git add *.md
git commit -m "Update wiki documentation - $(date +%Y-%m-%d)"
git push origin master

# Cleanup
cd ..
rm -rf wiki-repo

echo "✅ Wiki published successfully!"
```

## 📝 Wiki File Naming Convention

GitHub Wiki uses specific naming:
- `Home.md` → Main wiki page
- `Installation-Guide.md` → "Installation Guide" page
- `Quick-Start.md` → "Quick Start" page

Links between pages use the page name without `.md`:
```markdown
See the [Installation Guide](Installation-Guide) for setup.
```

## 🔄 Keeping Wiki Updated

When updating wiki content:

1. Edit files in `wiki/` directory
2. Test locally
3. Commit to main repository
4. Republish to GitHub Wiki

## 📊 Wiki Statistics

- **Total Pages**: 8
- **Total Size**: ~68 KB
- **Topics Covered**: Installation, Configuration, Architecture, API, Deployment, Troubleshooting
- **Last Updated**: December 10, 2025

## 🎯 Future Wiki Pages

Planned additions:
- Chart Generation Guide
- Compatibility Analysis Guide
- AI/ML Infrastructure Guide
- Consultation System Guide
- Payment Integration Guide
- Security Best Practices
- Performance Optimization
- Contributing Guide
- Testing Guide
- FAQ

---

**Note**: The wiki files in this directory are maintained in the main repository for version control and can be synced to GitHub Wiki.
