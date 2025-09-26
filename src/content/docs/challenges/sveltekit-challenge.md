---
title: SvelteKit Challenge 
description: Building Your First Multi-Page Application
---



## Prompt

```
Create a 30-minute software development challenge for SvelteKit that teaches generating a new project adding pages, routing, and creation of components. 

Context: This is for a development team preparing for a project that will use SvelteKit for web applications and in Tauri. Team members have web development experience with Django, Python, REST APIs, and SQL databases.

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
- Avoid complete coverage of advanced Svelte and Sveltekit features 

Output a complete, ready-to-use challenge document.
```

```
Update this challenge to include Tailwind configuration. The example uses tailwind but there are no configuration or dependencies in the examples.
```

```
Ensure the example uses Svelte version 5 and Tailwind 4.
```

```
simplify the Tailwind setup for this challenge by using a CDN and ensure the audience is able to run the server immediately after generating the project
```


# SvelteKit Challenge: Building Your First Multi-Page Application

## Challenge Overview & Objectives

**Time Limit:** 30 minutes  
**Learning Objective:** Master the fundamentals of SvelteKit project creation, file-based routing, and component architecture by building a simple task management application using Svelte 5 and Tailwind CSS.

**What You'll Build:** A multi-page task management app with navigation, reusable components, and modern reactive state using Svelte 5's runes system.

**Why This Matters:** This challenge covers the core SvelteKit concepts you'll use daily: project structure, routing, components, and Svelte 5's new reactivity system - essential skills for our upcoming web and Tauri desktop applications.

## Prerequisites & Setup Checklist

### Required Knowledge
- JavaScript/TypeScript fundamentals
- Basic HTML/CSS
- Understanding of component-based architecture (similar to Django templates but more dynamic)

### Environment Setup
- [ ] Node.js 18+ installed
- [ ] Code editor (VS Code recommended)
- [ ] Terminal/command line access
- [ ] Git (optional but recommended)

### VS Code Extensions (Recommended)
- [ ] Svelte for VS Code (latest version for Svelte 5 support)
- [ ] Tailwind CSS IntelliSense

## Context: Why This Matters for Our Project

SvelteKit serves as our foundation for both web applications and Tauri desktop apps. Unlike Django's server-side rendering, SvelteKit provides:

- **File-based routing** (similar to Django URLs but automatic)
- **Component reusability** (like Django template includes but more powerful)
- **Modern reactivity** (Svelte 5's runes system for fine-grained reactivity)
- **Full-stack capabilities** (API routes + frontend in one framework)

This challenge uses the latest Svelte 5 features with Tailwind CSS via CDN for quick setup.

## Tutorial Walkthrough

### Step 1: Create and Initialize Your SvelteKit Project (3 minutes)

```bash
# Create new SvelteKit project
npm create svelte@latest task-manager
cd task-manager

# Select these options when prompted:
# - Which Svelte app template? → Skeleton project
# - Add type checking? → Yes, using TypeScript
# - Add ESLint? → Yes
# - Add Prettier? → Yes
# - Add Playwright for browser testing? → No
# - Add Vitest for unit testing? → No

# Install dependencies and start immediately
npm install
npm run dev
```

**Verification:** Visit `http://localhost:5173` and see the SvelteKit welcome page running successfully.

### Step 2: Add Tailwind CSS via CDN (2 minutes)

Update `src/app.html` to include Tailwind CSS:

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		<script src="https://cdn.tailwindcss.com"></script>
		<script>
			tailwind.config = {
				theme: {
					extend: {
						colors: {
							primary: '#3b82f6',
							secondary: '#6b7280'
						}
					}
				}
			}
		</script>
		<style>
			body {
				background-color: #f9fafb;
				color: #111827;
			}
		</style>
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

**Verification:** Refresh your browser - the page should now have a light gray background from Tailwind.

### Step 3: Understand the Project Structure (2 minutes)

Explore your project structure:

```
task-manager/
├── src/
│   ├── lib/           # Reusable components and utilities
│   ├── routes/        # Pages and API routes
│   │   └── +page.svelte  # Homepage
│   └── app.html       # Main HTML template (now with Tailwind CDN)
├── static/            # Static assets
└── package.json
```

**Key Concept:** The `src/routes/` directory uses file-based routing:
- `routes/+page.svelte` = `/` (homepage)
- `routes/about/+page.svelte` = `/about`
- `routes/tasks/[id]/+page.svelte` = `/tasks/123` (dynamic route)

### Step 4: Create Your First Page Component with Svelte 5 (5 minutes)

Replace the content in `src/routes/+page.svelte`:

```svelte
<script>
  // Using Svelte 5's $state rune for reactivity
  let tasks = $state([
    { id: 1, title: 'Learn SvelteKit', completed: false },
    { id: 2, title: 'Build task manager', completed: false },
    { id: 3, title: 'Deploy to production', completed: false }
  ]);

  function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
  }
</script>

<svelte:head>
  <title>Task Manager</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Task Manager</h1>
  
  <div class="space-y-4">
    {#each tasks as task (task.id)}
      <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <span class="text-lg {task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">
            {task.title}
          </span>
          <button 
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 font-medium"
            onclick={() => toggleTask(task.id)}
          >
            {task.completed ? 'Undo' : 'Complete'}
          </button>
        </div>
      </div>
    {/each}
  </div>
</div>
```

**Verification:** Your homepage should display a styled list of tasks with working toggle functionality.

### Step 5: Create a Reusable Task Component with Svelte 5 (4 minutes)

Create the components directory:

```bash
mkdir -p src/lib/components
```

Create `src/lib/components/TaskItem.svelte`:

```svelte
<script>
  // Using Svelte 5 props syntax
  let { task, onToggle } = $props();
</script>

<div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
  <div class="flex items-center justify-between">
    <span class="text-lg {task.completed ? 'line-through text-gray-500' : 'text-gray-800'}">
      {task.title}
    </span>
    <div class="flex gap-2">
      <button 
        class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
        onclick={() => onToggle(task.id)}
      >
        {task.completed ? 'Undo' : 'Complete'}
      </button>
      <a 
        href="/tasks/{task.id}" 
        class="px-3 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200 text-sm font-medium no-underline inline-block"
      >
        View
      </a>
    </div>
  </div>
</div>
```

Update `src/routes/+page.svelte` to use the component:

```svelte
<script>
  import TaskItem from '$lib/components/TaskItem.svelte';
  
  // Using Svelte 5's $state rune for reactivity
  let tasks = $state([
    { id: 1, title: 'Learn SvelteKit', completed: false },
    { id: 2, title: 'Build task manager', completed: false },
    { id: 3, title: 'Deploy to production', completed: false }
  ]);

  function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }
  }
</script>

<svelte:head>
  <title>Task Manager</title>
</svelte:head>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Task Manager</h1>
  
  <div class="space-y-4">
    {#each tasks as task (task.id)}
      <TaskItem {task} onToggle={toggleTask} />
    {/each}
  </div>
</div>
```

**Verification:** Tasks should work with toggle functionality and now have styled "View" buttons.

### Step 6: Add Navigation and Layout (4 minutes)

Create `src/routes/+layout.svelte`:

```svelte
<nav class="bg-gray-800 text-white shadow-lg">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center py-4">
      <h1 class="text-xl font-bold">Task Manager</h1>
      <div class="flex space-x-6">
        <a href="/" class="hover:text-gray-300 transition-colors duration-200 font-medium">Home</a>
        <a href="/about" class="hover:text-gray-300 transition-colors duration-200 font-medium">About</a>
        <a href="/tasks/new" class="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition-colors duration-200 font-medium">New Task</a>
      </div>
    </div>
  </div>
</nav>

<main class="min-h-screen">
  {@render children()}
</main>
```

Create the about directory and page:

```bash
mkdir -p src/routes/about
```

Create `src/routes/about/+page.svelte`:

```svelte
<div class="container mx-auto px-4 py-8 max-w-4xl">
  <h1 class="text-3xl font-bold text-gray-800 mb-6">About Task Manager</h1>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <p class="text-gray-700 text-lg leading-relaxed mb-4">
      This is a simple task management application built with SvelteKit 5 and styled with Tailwind CSS.
      It demonstrates modern routing, components, and Svelte 5's new reactivity system.
    </p>
    <p class="text-gray-600 mb-4">
      Features include task creation, completion tracking, and detailed task views using the latest web technologies.
    </p>
    <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
      <p class="text-blue-800 font-medium">
        Built with Svelte 5 runes for modern reactivity and Tailwind CSS for styling.
      </p>
    </div>
  </div>
</div>
```

**Verification:** Navigation should appear on all pages with proper styling and work correctly.

### Step 7: Create Dynamic Routes with Svelte 5 (4 minutes)

Create the tasks directory structure:

```bash
mkdir -p src/routes/tasks/[id]
```

Create `src/routes/tasks/[id]/+page.svelte`:

```svelte
<script>
  import { page } from '$app/stores';
  
  // Mock data - in a real app, this would come from a database
  const tasksData = {
    1: { id: 1, title: 'Learn SvelteKit', completed: false, description: 'Master the basics of SvelteKit framework including routing, components, and Svelte 5\'s new reactivity system with runes.' },
    2: { id: 2, title: 'Build task manager', completed: false, description: 'Create a functional task management app with CRUD operations using modern Svelte 5 patterns.' },
    3: { id: 3, title: 'Deploy to production', completed: false, description: 'Deploy the application to a production server with proper CI/CD using modern deployment strategies.' }
  };
  
  // Using Svelte 5's $derived rune for computed values
  const taskId = $derived($page.params.id);
  const task = $derived(tasksData[taskId]);
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  {#if task}
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-4">{task.title}</h1>
      <p class="text-gray-700 text-lg leading-relaxed mb-6">{task.description}</p>
      <div class="flex items-center gap-4">
        <span class="px-4 py-2 rounded-full text-sm font-medium {task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}">
          {task.completed ? 'Completed' : 'In Progress'}
        </span>
        <a 
          href="/" 
          class="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
        >
          ← Back to Tasks
        </a>
      </div>
      <div class="mt-6 p-4 bg-gray-50 rounded-lg">
        <p class="text-sm text-gray-600">
          <strong>Note:</strong> This page demonstrates Svelte 5's $derived rune for reactive computed values.
        </p>
      </div>
    </div>
  {:else}
    <div class="text-center py-12">
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Task Not Found</h1>
        <p class="text-gray-600 mb-6">The task you're looking for doesn't exist.</p>
        <a 
          href="/" 
          class="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200"
        >
          ← Back to Tasks
        </a>
      </div>
    </div>
  {/if}
</div>
```

**Verification:** Click "View" buttons on tasks to see individual task pages. Test with invalid IDs.

### Step 8: Add a New Task Form with Svelte 5 (4 minutes)

Create the new task directory:

```bash
mkdir -p src/routes/tasks/new
```

Create `src/routes/tasks/new/+page.svelte`:

```svelte
<script>
  import { goto } from '$app/navigation';
  
  // Using Svelte 5's $state rune for form data
  let formData = $state({
    title: '',
    description: ''
  });
  
  // Using $derived for validation
  const isValid = $derived(formData.title.trim().length > 0);
  
  function handleSubmit(event) {
    event.preventDefault();
    if (isValid) {
      // In a real app, this would save to a database
      console.log('New task:', formData);
      goto('/');
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-2xl">
  <h1 class="text-3xl font-bold text-gray-800 mb-8">Create New Task</h1>
  
  <form onsubmit={handleSubmit} class="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
    <div class="mb-6">
      <label for="title" class="block text-sm font-semibold text-gray-700 mb-2">
        Task Title *
      </label>
      <input 
        type="text" 
        id="title"
        bind:value={formData.title}
        required
        placeholder="Enter task title..."
        class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      />
    </div>
    
    <div class="mb-8">
      <label for="description" class="block text-sm font-semibold text-gray-700 mb-2">
        Description
      </label>
      <textarea 
        id="description"
        bind:value={formData.description}
        rows="4"
        placeholder="Enter task description..."
        class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
      ></textarea>
    </div>
    
    <div class="flex gap-4">
      <button 
        type="submit"
        disabled={!isValid}
        class="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors duration-200"
      >
        Create Task
      </button>
      <a 
        href="/"
        class="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium transition-colors duration-200 no-underline inline-block text-center"
      >
        Cancel
      </a>
    </div>
    
    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
      <p class="text-sm text-blue-800">
        <strong>Svelte 5 Feature:</strong> This form uses $state for reactive form data and $derived for validation.
      </p>
    </div>
  </form>
</div>
```

**Verification:** Form should accept input with proper styling, validation, and redirect to homepage when submitted.

## Research Challenges

### Challenge 1: Svelte 5 Runes and Reactivity
**Question:** How do Svelte 5's runes ($state, $derived, $effect) compare to Svelte 4's reactivity system, and when should you use each one?

**Research Goal:** Explore the Svelte 5 documentation on runes. Create a small example showing the difference between $state and $derived, and experiment with $effect for side effects.

### Challenge 2: Data Loading with Svelte 5
**Question:** How would you load task data from an external API when the page loads, and how does this work with Svelte 5's new reactivity system?

**Research Goal:** Explore SvelteKit's `+page.js` or `+page.server.js` files and the `load` function. How would you combine this with Svelte 5's $state rune for client-side state management?

### Challenge 3: Form Actions and Modern Patterns
**Question:** How can you handle form submissions server-side in SvelteKit while leveraging Svelte 5's new features?

**Research Goal:** Look into SvelteKit's form actions and progressive enhancement. How would you modify the new task form to work with and without JavaScript using Svelte 5 patterns?

## Success Criteria & Next Steps

### ✅ Success Criteria
- [ ] SvelteKit project runs without errors immediately after creation
- [ ] Tailwind CSS is working via CDN (no build setup required)
- [ ] Homepage uses Svelte 5's $state rune for task management
- [ ] Components use the new $props() syntax
- [ ] Navigation works with {@render children()} in layout
- [ ] Task detail pages use $derived for computed values
- [ ] Form uses $state and $derived for reactive validation
- [ ] All pages have consistent styling and responsive layout
- [ ] Server starts immediately with `npm run dev` after project creation

### 🚀 Next Steps
1. **Immediate:** Complete the research challenges above
2. **This Week:** Explore Svelte 5's $effect rune and lifecycle management
3. **Next:** Learn about SvelteKit's store system and how it works with Svelte 5
4. **Future:** Investigate Tauri integration with Svelte 5 applications

### 📚 Additional Learning Resources
- [Svelte 5 Documentation](https://svelte.dev/docs/svelte/overview)
- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Svelte 5 Migration Guide](https://svelte.dev/docs/svelte/v5-migration-guide)

## Common Troubleshooting

### Issue: Project won't start after creation
**Solution:** 
1. Ensure Node.js 18+ is installed: `node --version`
2. Run `npm install` in the project directory
3. Try `npm run dev -- --open` to automatically
