# Folder Restructuring Plan

## Current Issues Identified

1. **Mixed concerns in root**: Config files, docs, skills, agents, tasks all mixed together
2. **Inconsistent feature structure**: Some features have components/, data/, hooks/, services/, styles/ but not consistently
3. **Scattered assets**: Images and videos are in src/shared/assets but organized by feature
4. **Duplicate page concepts**: Both src/pages/ and src/features/ seem to have page-level components
5. **Unclear separation**: src/app/ has App.tsx and main.tsx, but also styles/
6. **Multiple tool directories**: .agents, .claude, .superpowers, skills - seems redundant
7. **Documentation scattered**: docs/, tasks/, CLAUDE.md, README.md, SKILL.md
8. **Styles scattered**: CSS files in both src/app/styles/ and individual feature styles/

## Proposed Structure

```
gara_yaka_portfolio/
├── config/                    # All configuration files
│   ├── eslint.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── playwright.config.ts
│   ├── vitest.config.ts
│   └── postcss.config.js
├── docs/                      # All documentation
│   ├── CLAUDE.md
│   ├── README.md
│   ├── SKILL.md
│   └── superpowers/
├── public/                    # Static assets (keep as is)
│   ├── fonts/
│   └── ...
├── scripts/                   # Build and utility scripts
├── src/                       # Source code
│   ├── app/                   # Application entry point
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── providers/
│   │       └── theme-provider.tsx
│   ├── assets/                # All static assets
│   │   ├── images/
│   │   │   ├── about/
│   │   │   ├── chatbot/
│   │   │   ├── contact/
│   │   │   ├── experience/
│   │   │   ├── hero/
│   │   │   ├── philosophy/
│   │   │   ├── projects/
│   │   │   └── skills/
│   │   └── videos/
│   │       └── hero/
│   ├── components/            # Shared UI components
│   │   ├── animations/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│  ├── features/              # Feature modules
│  │   ├── about/
│  │  │   ├── components/
│  │  │  │   ├── About.tsx
│  │  │  │   └── EngineeringPhilosophy/
│  │  │  │       ├── index.tsx
│  │  │  │       └── mockups/
│  │  │  ├── hooks/
│  │  │  ├── services/
│  │  │  ├── types/
│  │  │  └── index.ts
│  │  ├── agent/
│  │  │   ├── components/
│  │  │   │   └── ChatBot.tsx
│  │  │   ├── hooks/
│  │  │   │   └── useChat.ts
│  │  │   ├── services/
│  │  │   │   └── ai-service.ts
│  │  │   ├── data/
│  │  │   │   └── knowledge-base.ts
│  │  │   └── index.ts
│  │  ├── contact/
│  │  │   ├── components/
│  │  │   │   └── Contact.tsx
│  │  │   ├── hooks/
│  │  │   ├── services/
│  │  │   ├── types/
│  │  │   └── index.ts
│  │  ├── home/
│  │  │   ├── components/
│  │  │   │   ├── ArchDiagram.tsx
│  │  │   │   ├── Experience.tsx
│  │  │   │   ├── Hero.tsx
│  │  │   │   ├── SystemPillars.tsx
│  │  │   │   ├── HeroRibbon/
│  │  │   │   └── TechStack/
│  │  │   │       ├── SkillChip.tsx
│  │  │   │       ├── SkillMarquee.tsx
│  │  │   │       ├── constants.ts
│  │  │   │       └── index.tsx
│  │  │   ├── hooks/
│  │  │   ├── services/
│  │  │   ├── types/
│  │  │   └── index.ts
│  │  └── projects/
│  │      ├── components/
│  │      │   ├── ProjectCard.tsx
│  │      │   ├── ProjectFilters.tsx
│  │      │   ├── ProjectGrid.tsx
│  │      │   ├── ProjectViz.tsx
│  │      │   └── Projects.tsx
│  │      ├── data/
│  │      │   └── projectData.ts
│  │      ├── hooks/
│  │      ├── services/
│  │      ├── types/
│  │      │   └── types.ts
│  │      └── index.ts
│  ├── hooks/                 # Shared hooks
│  │   ├── index.ts
│  │   ├── use-mobile.tsx
│  │   └── use-toast.ts
│  ├── lib/                   # Utility libraries
│  │   ├── index.ts
│  │   ├── seo.ts
│  │   └── utils.ts
│  ├── pages/                 # Route pages
│  │   ├── AllProjects.tsx
│  │   ├── Home.tsx
│  │   ├── NotFound.tsx
│  │   ├── NowAndUses.tsx
│  │   └── ProjectDetail.tsx
│  ├── styles/                # Global styles
│  │   ├── animations.css
│  │   ├── base.css
│  │   ├── index.css
│  │   └── utilities.css
│  └── vite-env.d.ts
├── tasks/                     # Task management
│   ├── lessons.md
│  └── todo.md
├── .env
├── .gitignore
├── components.json
├── index.html
├── package.json
├── package-lock.json
└── playwright-fixture.ts
```

## Migration Steps

### Phase 1: Create New Directory Structure
1. Create `config/` directory
2. Create `docs/` directory structure
3. Create `scripts/` directory
4. Create `src/assets/` directory structure
5. Create `src/styles/` directory
6. Standardize `src/features/` structure

### Phase 2: Move Configuration Files
1. Move all config files to `config/`
2. Update import paths in code
3. Update build scripts

### Phase 3: Consolidate Documentation
1. Move CLAUDE.md, README.md, SKILL.md to `docs/`
2. Consolidate docs/superpowers/ content
3. Update any references

### Phase 4: Reorganize Source Code
1. Move assets from `src/shared/assets/` to `src/assets/`
2. Move global styles from `src/app/styles/` to `src/styles/`
3. Standardize feature structure (add missing hooks/, services/, types/ directories)
4. Move feature-specific styles into feature directories
5. Consolidate shared components structure

### Phase 5: Update Imports and References
1. Update all import statements
2. Update asset references
3. Update CSS imports
4. Test build process

### Phase 6: Cleanup
1. Remove empty directories
2. Remove unused files (unused_files.txt, unused_files_utf8.txt)
3. Verify all functionality works
4. Update gitignore if needed

## Benefits

1. **Clear separation of concerns**: Config, docs, source code clearly separated
2. **Consistent feature structure**: All features follow the same pattern
3. **Easier navigation**: Logical grouping makes finding files intuitive
4. **Better scalability**: Easy to add new features following established patterns
5. **Professional structure**: Follows industry best practices
6. **Reduced cognitive load**: Developers know where to find things

## Risk Mitigation

1. **Git tracking**: Use git mv to preserve history
2. **Backup**: Create backup before major moves
3. **Incremental testing**: Test after each phase
4. **Rollback plan**: Keep track of changes for easy rollback
5. **Import verification**: Script to verify all imports resolve correctly

## Notes

- Keep `.git/`, `node_modules/`, `dist/` as-is
- Keep `.agents/`, `.claude/`, `.superpowers/`, `skills/` for now (tool-specific)
- Consider consolidating tool directories in future cleanup
- Update any CI/CD pipelines that reference old paths