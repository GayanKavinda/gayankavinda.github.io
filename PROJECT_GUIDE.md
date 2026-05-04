# Project Portfolio Guide

## Updated Structure for Enterprise & Open Source Projects

Your portfolio now supports different types of project evidence:

### 🎯 **Evidence Types**

1. **`code`** - Full source code available (Open Source projects)
2. **`docs`** - Documentation only (Enterprise projects without code access)
3. **`diagrams`** - Architecture diagrams only (Design/Architecture work)
4. **`mixed`** - Combination of code, docs, and diagrams

### 📝 **How to Update Your Projects**

#### **For Enterprise Projects (No Code Access):**

```typescript
{
  slug: 'enterprise-project',
  name: 'Enterprise Project Name',
  desc: 'Brief description...',
  tags: ['Go', 'Kafka', 'AWS'],
  cat: 'Web',
  featured: true,
  evidenceType: 'docs', // Documentation only
  hasCaseStudy: true,
  docUrl: '/docs/enterprise-project.pdf', // Your documentation
  diagramUrl: '/diagrams/enterprise-architecture.drawio', // Your diagrams
  github: null, // No GitHub link
  liveUrl: null, // No live demo
}
```

#### **For Open Source Projects:**

```typescript
{
  slug: 'open-source-project',
  name: 'Open Source Project',
  desc: 'Brief description...',
  tags: ['TypeScript', 'React'],
  cat: 'Open Source',
  evidenceType: 'code', // Full code available
  hasCaseStudy: true,
  githubUrl: 'https://github.com/yourusername/project',
  docUrl: 'https://yourproject.dev/docs',
  liveUrl: 'https://yourproject.dev',
}
```

#### **For Projects with Mixed Evidence:**

```typescript
{
  slug: 'mixed-project',
  name: 'Mixed Evidence Project',
  desc: 'Brief description...',
  tags: ['Python', 'Docker'],
  cat: 'Web',
  evidenceType: 'mixed', // Code + docs + diagrams
  hasCaseStudy: true,
  githubUrl: 'https://github.com/yourusername/project',
  docUrl: '/docs/project-details.pdf',
  diagramUrl: '/diagrams/system-design.drawio',
}
```

### 📂 **File Organization**

Create these folders in your `public/` directory:

```
public/
├── docs/
│   ├── distributed-task-engine.pdf
│   ├── real-time-analytics.pdf
│   ├── datapipe-architecture.pdf
│   └── ...
├── diagrams/
│   ├── distributed-task-engine.drawio
│   ├── real-time-analytics.drawio
│   └── ...
└── resume.pdf
```

### 🔗 **Draw.io Integration**

For your Draw.io diagrams:

1. **Export your diagrams** from Draw.io
2. **Save as `.drawio` files** in `public/diagrams/`
3. **Also export as PNG/SVG** for preview images
4. **Update the diagramUrl** in your project data:

```typescript
diagramUrl: '/diagrams/your-project.drawio'
```

### 📄 **Documentation Files**

For enterprise project documentation:

1. **Create comprehensive PDFs** covering:
   - Problem statement
   - Solution architecture
   - Technical decisions
   - Performance metrics
   - Lessons learned

2. **Save in `public/docs/`**

3. **Update docUrl** in project data:

```typescript
docUrl: '/docs/your-project.pdf'
```

### 🎨 **Case Study Content**

Each project with `hasCaseStudy: true` will show:

- **The Challenge** - What problem you solved
- **The Solution** - How you approached it
- **Available Evidence** - What materials are available

### 📊 **Project Cards Now Show**

Project cards display evidence type indicators:

- 💻 **Code** - Full source code available
- 📄 **Docs** - Documentation available
- 📊 **Diagrams** - Architecture diagrams available
- 🔀 **Mixed** - Multiple evidence types

### ✅ **Next Steps**

1. **Organize your documentation**:
   - Gather all PDF docs from your enterprise projects
   - Export Draw.io diagrams
   - Organize in the folder structure above

2. **Update project data**:
   - Set correct `evidenceType` for each project
   - Add `docUrl` and `diagramUrl` where available
   - Set `github` to `null` for enterprise projects

3. **Add real URLs**:
   - GitHub URLs for open source projects
   - Documentation URLs
   - Diagram file paths

4. **Test the display**:
   - Check that project cards show correct evidence types
   - Verify case study sections display properly
   - Test documentation and diagram links

### 🎯 **Benefits of This Approach**

- **Honest representation** of your work
- **Shows enterprise experience** without exposing proprietary code
- **Highlights documentation skills** 
- **Demonstrates system design abilities**
- **Professional presentation** of all project types

### 💡 **Tips for Enterprise Projects**

1. **Focus on architecture and design** - This is your strongest evidence
2. **Include performance metrics** - Show impact even without code
3. **Document technical decisions** - Explain your reasoning
4. **Create detailed diagrams** - Visual architecture is powerful
5. **Write comprehensive case studies** - Tell the complete story

This structure allows you to showcase all your professional work, regardless of code availability!