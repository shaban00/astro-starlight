---
title: SvelteKit Component Packaging
description: Building Reusable Legal UI Components
---


## Prompt

```
Create a 30-minute software development challenge for Svelte/SvelteKit and Tailwind that teaches packaging a component independently for resuse across applications. 

Context: This is for an innovation lab engineering team preparing that will use SvelteKit for web applications and in Tauri. Team members have an understanding of how to work with SvelteKit and Tailwind, but may have little to no experience with this form of modular development.

Requirements:
- Single focused learning objective
- Step-by-step tutorial with working code
- 2-3 research questions that require documentation exploration
- Practical example relevant to library and legal innovation
- Setup instructions for creating a new package, shipping, and using it in an application
- Clear success criteria

Structure:
1. Challenge Overview & Objectives
2. Prerequisites & Setup Checklist  
3. Context (why this matters for our project)
4. Tutorial Walkthrough (6-8 main steps)
5. Research Challenges
6. Success Criteria & Next Steps
7. Common Troubleshooting

Constraints:
- Must be completable in 30 minutes
- Should connect to real project needs
- Include verification steps
- Avoid excessively complex components that distract from the purpose of learning how to package and share

Output a complete, ready-to-use challenge document.
```


## 1. Challenge Overview & Objectives

**Learning Objective:** Learn to package a SvelteKit component as an independent npm package for reuse across multiple legal innovation applications.

**What You'll Build:** A reusable `CaseStatusBadge` component that displays legal case statuses with consistent styling and behavior, packaged for distribution across your SvelteKit web apps and Tauri desktop applications.

**Time Estimate:** 30 minutes

## 2. Prerequisites & Setup Checklist

**Required Knowledge:**
- [ ] Basic SvelteKit component creation
- [ ] Tailwind CSS utility classes
- [ ] Terminal/command line usage
- [ ] npm basics

**Required Tools:**
- [ ] Node.js (v16+) and npm installed
- [ ] Code editor (VS Code recommended)
- [ ] npm account (for publishing - optional for local testing)

**Initial Setup:**
```bash
mkdir svelte-component-challenge
cd svelte-component-challenge
```

## 3. Context: Why Component Packaging Matters

In our innovation lab, you'll be building multiple applications:
- **Web dashboards** for case management
- **Desktop tools** via Tauri for document processing
- **Client portals** for case tracking

Rather than copying components between projects, packaging allows us to:
- Maintain consistent UI/UX across applications
- Share bug fixes and improvements instantly
- Enable specialized teams to contribute components
- Reduce development time on new projects

## 4. Tutorial Walkthrough

### Step 1: Create the Package Structure

```bash
# Create your component package
mkdir legal-ui-components
cd legal-ui-components
npm init -y
```

Update `package.json`:
```json
{
  "name": "legal-ui-components",
  "version": "1.0.0",
  "type": "module",
  "svelte": "./dist/index.js",
  "main": "./dist/index.js",
  "exports": {
    ".": {
      "svelte": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "devDependencies": {},
  "peerDependencies": {
    "svelte": "^4.0.0"
  }
}
```

### Step 2: Install Development Dependencies

```bash
npm install -D svelte @sveltejs/package vite tailwindcss autoprefixer postcss
```

Create `vite.config.js`:
```javascript
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig({
  plugins: [sveltekit()]
});
```

### Step 3: Setup Project Structure

```bash
mkdir -p src/lib
touch src/lib/index.js
touch src/lib/CaseStatusBadge.svelte
```

Create `src/lib/CaseStatusBadge.svelte`:
```svelte
<script>
  export let status = 'unknown';
  export let size = 'md';
  
  const statusConfig = {
    'active': { 
      class: 'bg-blue-100 text-blue-800 border-blue-200', 
      label: 'Active' 
    },
    'pending': { 
      class: 'bg-yellow-100 text-yellow-800 border-yellow-200', 
      label: 'Pending Review' 
    },
    'closed': { 
      class: 'bg-gray-100 text-gray-800 border-gray-200', 
      label: 'Closed' 
    },
    'urgent': { 
      class: 'bg-red-100 text-red-800 border-red-200', 
      label: 'Urgent' 
    },
    'unknown': { 
      class: 'bg-gray-50 text-gray-500 border-gray-200', 
      label: 'Unknown' 
    }
  };
  
  const sizeClasses = {
    'sm': 'px-2 py-1 text-xs',
    'md': 'px-3 py-1 text-sm',
    'lg': 'px-4 py-2 text-base'
  };
  
  $: config = statusConfig[status] || statusConfig.unknown;
  $: sizeClass = sizeClasses[size] || sizeClasses.md;
</script>

<span 
  class="inline-flex items-center rounded-full border font-medium {config.class} {sizeClass}"
  role="status"
  aria-label="Case status: {config.label}"
>
  {config.label}
</span>
```

### Step 4: Create Package Entry Point

Update `src/lib/index.js`:
```javascript
export { default as CaseStatusBadge } from './CaseStatusBadge.svelte';
```

### Step 5: Setup Build Configuration

Create `package.json` scripts:
```json
{
  "scripts": {
    "build": "svelte-package",
    "prepublishOnly": "npm run build"
  }
}
```

Create `svelte.config.js`:
```javascript
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter()
  },
  package: {
    dir: 'dist',
    exports: (filepath) => {
      return filepath === 'index.js';
    }
  }
};

export default config;
```

**Verification Step:** Run `npm run build` - you should see a `dist` folder created.

### Step 6: Test the Package Locally

Create a test SvelteKit app:
```bash
cd ..
npm create svelte@latest test-app
cd test-app
npm install
```

Install your local package:
```bash
npm install ../legal-ui-components
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/legal-ui-components/**/*.svelte'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `src/app.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 7: Use Your Component

Update `src/routes/+layout.svelte`:
```svelte
<script>
  import '../app.css';
</script>

<slot />
```

Update `src/routes/+page.svelte`:
```svelte
<script>
  import { CaseStatusBadge } from 'legal-ui-components';
</script>

<main class="p-8">
  <h1 class="text-2xl font-bold mb-6">Legal Case Dashboard</h1>
  
  <div class="space-y-4">
    <div class="flex items-center gap-2">
      <span>Case #2024-001:</span>
      <CaseStatusBadge status="active" />
    </div>
    
    <div class="flex items-center gap-2">
      <span>Case #2024-002:</span>
      <CaseStatusBadge status="urgent" size="lg" />
    </div>
    
    <div class="flex items-center gap-2">
      <span>Case #2024-003:</span>
      <CaseStatusBadge status="closed" size="sm" />
    </div>
  </div>
</main>
```

**Verification Step:** Run `npm run dev` - you should see styled case status badges.

### Step 8: Package for Distribution

Back in your component package directory:
```bash
cd ../legal-ui-components
npm run build
```

For local distribution, you can use `npm pack`:
```bash
npm pack
# This creates legal-ui-components-1.0.0.tgz
```

To install the packed version in another project:
```bash
npm install ./legal-ui-components-1.0.0.tgz
```

## 5. Research Challenges

**Challenge 1: TypeScript Integration**
Research how to add TypeScript support to your component package. What files need to be created, and how does the build process change?
- Hint: Look into `.d.ts` files and the `svelte-package` documentation
- Question: How would you type the `status` prop to only accept valid status strings?

**Challenge 2: CSS Strategy**
Currently, we're relying on the consuming application to have Tailwind CSS. Research alternative approaches for styling packaged components.
- Hint: Investigate CSS-in-JS solutions or bundled CSS approaches
- Question: What are the trade-offs between bundling styles vs. requiring peer dependencies?

**Challenge 3: Versioning and Publishing**
Research npm versioning strategies and automated publishing workflows.
- Hint: Look into semantic versioning and GitHub Actions
- Question: How would you automate package publishing when you push to the main branch?

## 6. Success Criteria & Next Steps

**You've succeeded when you can:**
- [ ] Build your component package without errors
- [ ] Import and use your component in a separate SvelteKit app
- [ ] See properly styled case status badges in the browser
- [ ] Modify the component source and rebuild to see changes reflected

**Next Steps for Real Projects:**
1. **Add more components** to your package (forms, buttons, modals)
2. **Setup automated testing** with Vitest or Playwright
3. **Create documentation** using Storybook or custom docs
4. **Implement CI/CD** for automated publishing
5. **Add accessibility testing** to ensure components meet standards

## 7. Common Troubleshooting

**Problem:** "Cannot resolve legal-ui-components"
```bash
# Solution: Ensure you're in the correct directory and package is installed
npm list legal-ui-components
# If not found, reinstall from local path
npm install ../legal-ui-components
```

**Problem:** Tailwind styles not applying
```bash
# Solution: Verify tailwind.config.js includes your package
# Add this to content array:
'./node_modules/legal-ui-components/**/*.svelte'
```

**Problem:** Build fails with svelte-package
```bash
# Solution: Ensure all required dependencies are installed
npm install -D @sveltejs/package
# Check svelte.config.js exists and is properly configured
```

**Problem:** Component not updating after changes
```bash
# Solution: Rebuild the package and reinstall
cd ../legal-ui-components
npm run build
cd ../test-app
npm uninstall legal-ui-components
npm install ../legal-ui-components
```

**Quick Reset:** If you get stuck, you can start over by deleting both directories and beginning from Step 1.

---

**Completion Time Check:** You should be able to complete this challenge in 30 minutes. If you're taking longer, focus on getting the basic packaging working first, then explore the research challenges separately.
