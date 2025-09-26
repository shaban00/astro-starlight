---
title: Tailwind 4 + SvelteKit Desktop App Styling
description: A guide to implementing UX designs with Tailwind
---


## Prompt

```
Create a 30-minute software development challenge for  Tailwind 4 in Svelte 5 that teaches integration of Tailwind into a SvelteKit project, while demonstrating use of Tailwind classes to style a desktop app and global customization of default styles. 

Context: This is for a development team preparing for a project that will use SvelteKit for web applications and in Tauri. Team members have general web development experience but may have limited exposure to advanced uses of Tailwind.

Requirements:
- Single focused learning objective
- Step-by-step tutorial with working code
- 2-3 research questions that require documentation exploration
- Practical example relevant to building a new application
- Setup instructions for a new SvelteKit application
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
- Avoid complete coverage of advanced Svelte, Sveltekit and Tailwind features 

Output a complete, ready-to-use challenge document.
```



## 1. Challenge Overview & Objectives

**Time Limit:** 30 minutes

**Learning Objective:** Learn to integrate Tailwind 4 into a SvelteKit project and create a modern desktop app interface with custom global styles that work seamlessly across web and Tauri environments.

**What You'll Build:** A desktop-style task management app interface with a custom sidebar, main content area, and global theme customizations using Tailwind's utility classes and CSS variables.

## 2. Prerequisites & Setup Checklist

### Prerequisites
- [ ] Node.js 18+ installed
- [ ] Basic understanding of HTML/CSS
- [ ] Familiarity with component-based frameworks
- [ ] VS Code (recommended) with Tailwind CSS IntelliSense extension

### Required Tools
```bash
# Verify your Node version
node --version  # Should be 18+
npm --version   # Should be 8+
```

## 3. Context: Why This Matters

Modern desktop applications built with frameworks like Tauri require consistent styling that works across web and native environments. Tailwind 4's new features provide:

- **CSS-first architecture** that eliminates build-time dependencies
- **Better performance** with native CSS cascade layers
- **Simplified integration** with SvelteKit's SSR/SSG capabilities
- **Consistent theming** across web and desktop platforms

This challenge simulates styling patterns you'll use in our upcoming Tauri-based desktop applications.

## 4. Tutorial Walkthrough

### Step 1: Create and Initialize SvelteKit Project (3 minutes)

```bash
# Create new SvelteKit project
npm create svelte@latest tailwind-desktop-app
cd tailwind-desktop-app

# Select these options when prompted:
# - Skeleton project: Yes
# - TypeScript: Yes (recommended)
# - Add ESLint: Yes
# - Add Prettier: Yes

# Install dependencies
npm install
```

**Verification:** Run `npm run dev` and see the SvelteKit welcome page at `http://localhost:5173`

### Step 2: Install and Configure Tailwind 4 (4 minutes)

```bash
# Install Tailwind 4 (currently in alpha)
npm install tailwindcss@next @tailwindcss/postcss@next
```

Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'app-bg': 'var(--app-bg)',
        'app-sidebar': 'var(--app-sidebar)',
        'app-text': 'var(--app-text)',
        'app-accent': 'var(--app-accent)',
      }
    },
  },
}
```

Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
```

### Step 3: Set Up Global Styles (4 minutes)

Create `src/app.css`:
```css
@import 'tailwindcss';

:root {
  --app-bg: #f8fafc;
  --app-sidebar: #1e293b;
  --app-text: #334155;
  --app-accent: #3b82f6;
}

/* Dark mode variables */
@media (prefers-color-scheme: dark) {
  :root {
    --app-bg: #0f172a;
    --app-sidebar: #020617;
    --app-text: #cbd5e1;
    --app-accent: #60a5fa;
  }
}

/* Desktop app specific styles */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--app-bg);
  color: var(--app-text);
  height: 100vh;
  overflow: hidden; /* Prevent scrolling in desktop app */
}

/* Custom scrollbar for desktop feel */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
```

Update `src/app.html` to include the styles:
```html
<!DOCTYPE html>
<html lang="en" class="%sveltekit.theme%">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover" class="h-screen">
    <div style="display: contents" class="h-full">%sveltekit.body%</div>
  </body>
</html>
```

### Step 4: Create Desktop Layout Component (5 minutes)

Create `src/lib/components/DesktopLayout.svelte`:
```svelte
<script>
  export let title = 'Desktop App';
</script>

<div class="flex h-screen bg-app-bg">
  <!-- Sidebar -->
  <aside class="w-64 bg-app-sidebar text-white flex flex-col">
    <!-- App Header -->
    <div class="p-4 border-b border-slate-700">
      <h1 class="text-xl font-semibold">{title}</h1>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 p-4">
      <ul class="space-y-2">
        <li>
          <a href="#" class="flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <span class="w-5 h-5 mr-3">📋</span>
            Tasks
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <span class="w-5 h-5 mr-3">📁</span>
            Projects
          </a>
        </li>
        <li>
          <a href="#" class="flex items-center p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <span class="w-5 h-5 mr-3">⚙️</span>
            Settings
          </a>
        </li>
      </ul>
    </nav>
    
    <!-- User Section -->
    <div class="p-4 border-t border-slate-700">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-app-accent rounded-full flex items-center justify-center text-sm font-medium">
          U
        </div>
        <span class="ml-3 text-sm">User Name</span>
      </div>
    </div>
  </aside>
  
  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col overflow-hidden">
    <slot />
  </main>
</div>
```

### Step 5: Create Task Management Interface (6 minutes)

Create `src/lib/components/TaskBoard.svelte`:
```svelte
<script>
  let tasks = [
    { id: 1, title: 'Design new feature', status: 'todo', priority: 'high' },
    { id: 2, title: 'Fix login bug', status: 'in-progress', priority: 'urgent' },
    { id: 3, title: 'Update documentation', status: 'done', priority: 'low' },
  ];
  
  let newTaskTitle = '';
  
  function addTask() {
    if (newTaskTitle.trim()) {
      tasks = [...tasks, {
        id: Date.now(),
        title: newTaskTitle.trim(),
        status: 'todo',
        priority: 'medium'
      }];
      newTaskTitle = '';
    }
  }
  
  function getPriorityColor(priority) {
    const colors = {
      urgent: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-blue-100 text-blue-800 border-blue-200',
      low: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[priority] || colors.medium;
  }
</script>

<!-- Header -->
<header class="bg-white border-b border-gray-200 px-6 py-4">
  <div class="flex items-center justify-between">
    <h2 class="text-2xl font-bold text-app-text">Task Management</h2>
    <button class="bg-app-accent text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
      New Project
    </button>
  </div>
</header>

<!-- Content -->
<div class="flex-1 p-6 overflow-auto">
  <!-- Add Task Form -->
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
    <form on:submit|preventDefault={addTask} class="flex gap-3">
      <input
        bind:value={newTaskTitle}
        placeholder="Add a new task..."
        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-accent focus:border-transparent"
      />
      <button
        type="submit"
        class="bg-app-accent text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
        disabled={!newTaskTitle.trim()}
      >
        Add Task
      </button>
    </form>
  </div>
  
  <!-- Task Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {#each tasks as task (task.id)}
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div class="flex items-start justify-between mb-3">
          <h3 class="font-medium text-app-text">{task.title}</h3>
          <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border {getPriorityColor(task.priority)}">
            {task.priority}
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <select
            bind:value={task.status}
            class="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-app-accent"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          
          <button class="text-gray-400 hover:text-red-500 transition-colors">
            🗑️
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
```

### Step 6: Update Main Route (3 minutes)

Replace `src/routes/+layout.svelte`:
```svelte
<script>
  import '../app.css';
</script>

<slot />
```

Replace `src/routes/+page.svelte`:
```svelte
<script>
  import DesktopLayout from '$lib/components/DesktopLayout.svelte';
  import TaskBoard from '$lib/components/TaskBoard.svelte';
</script>

<DesktopLayout title="TaskMaster Pro">
  <TaskBoard />
</DesktopLayout>
```

### Step 7: Test and Verify (3 minutes)

```bash
# Start development server
npm run dev
```

**Verification Checklist:**
- [ ] App loads without console errors
- [ ] Sidebar displays with navigation items
- [ ] Main content area shows task board
- [ ] Custom colors (CSS variables) are applied
- [ ] Add task functionality works
- [ ] Responsive design works on different screen sizes
- [ ] Dark mode respects system preferences

### Step 8: Build for Production (2 minutes)

```bash
# Test production build
npm run build
npm run preview
```

**Verification:** App works identically in production mode

## 5. Research Challenges

### Challenge 1: Tailwind 4 New Features (10 minutes)
**Question:** What are the key differences between Tailwind 3 and 4, and how does the new CSS-first architecture benefit SvelteKit projects?

**Research Focus:**
- Explore Tailwind 4's official migration guide
- Understand the elimination of PostCSS dependency
- Learn about new CSS cascade layers support

**Deliverable:** Write a 2-3 sentence summary of the biggest advantage for our Tauri desktop apps.

### Challenge 2: SvelteKit + Tauri Styling Considerations (10 minutes)
**Question:** How should you structure Tailwind styles in a SvelteKit project that will be compiled for both web and Tauri desktop applications?

**Research Focus:**
- Look into Tauri's CSS handling documentation
- Investigate SvelteKit's static adapter requirements
- Research desktop app styling best practices

**Deliverable:** List 3 specific recommendations for styling consistency.

### Challenge 3: Advanced Tailwind Customization (10 minutes)
**Question:** How can you create a design system using Tailwind's configuration that supports multiple themes for desktop applications?

**Research Focus:**
- Study Tailwind's theming documentation
- Explore CSS custom properties integration
- Look into component-based design tokens

**Deliverable:** Modify the provided config to add a "high contrast" accessibility theme.

## 6. Success Criteria & Next Steps

### Success Criteria
- [ ] SvelteKit project successfully integrates Tailwind 4
- [ ] Desktop app layout renders correctly with sidebar and main content
- [ ] Custom CSS variables work with Tailwind classes
- [ ] Task management interface is fully functional
- [ ] Application responds to system dark mode preference
- [ ] Production build completes without errors
- [ ] All research questions answered with documentation sources

### Next Steps
1. **Tauri Integration:** Add `@tauri-apps/cli` and test the desktop app compilation
2. **Advanced Theming:** Implement theme switcher component
3. **Component Library:** Extract reusable components into a shared library
4. **State Management:** Add stores for application state
5. **Performance:** Optimize bundle size and implement code splitting

### Team Integration
- Share your customized `tailwind.config.js` with the team
- Document any desktop-specific styling patterns discovered
- Create component examples for the team design system

## 7. Common Troubleshooting

### Issue: Tailwind Classes Not Working
**Solution:**
```bash
# Ensure PostCSS config is correct
npm ls @tailwindcss/postcss
# Restart dev server
npm run dev
```

### Issue: CSS Variables Not Updating
**Solution:** Check that CSS variables are defined in `:root` and verify browser dev tools show the computed values.

### Issue: Dark Mode Not Working
**Solution:** Verify `tailwind.config.js` includes `darkMode: 'media'` (default) or `darkMode: 'class'` if implementing manual toggle.

### Issue: Build Errors
**Solution:**
```bash
# Clear SvelteKit cache
rm -rf .svelte-kit
# Reinstall dependencies
npm install
```

### Issue: Styles Not Loading in Production
**Solution:** Verify `app.html` correctly references styles and check network tab for 404s on CSS files.

---

**Total Estimated Time:** 30 minutes
**Difficulty Level:** Intermediate
**Team Recommended:** 2-4 developers working together

*This challenge prepares your team for real-world SvelteKit + Tauri development with modern Tailwind practices.*
