---
title: Storybook Development
description: Building Interactive Svelte Components
---


## Prompt

```
Create a 30-minute software development challenge for Storybook that teaches development of Svelte 5 or SvelteKit and Tailwind 4 based components, including mocking dependencies and async network requests according to best practices. 

Context: This is for a development team preparing for a project that will use SvelteKit for web applications and in Tauri. Team members have general web development experience and some understanding of SvelteKit and Tailwind, but may have little to no exposure to developing components using a tool like Storybook.

Requirements:
- Single focused learning objective
- Step-by-step tutorial with working code
- 2-3 research questions that require documentation exploration
- Practical example relevant to building a SvelteKit and Tailwind-based application from reusable components
- Setup instructions for a new reusable component package
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
- Avoid elaborate application features irrelevant to understanding how to set up and work with Storybook

Output a complete, ready-to-use challenge document.
```


## 1. Challenge Overview & Objectives

**Duration:** 30 minutes  
**Learning Objective:** Build and document a reusable SvelteKit component with async data fetching using Storybook, implementing proper mocking strategies for network requests.

**What You'll Build:** A `UserProfileCard` component that fetches user data from an API, displays loading and error states, and is fully documented in Storybook with mocked network requests.

**Key Skills:**
- Setting up Storybook for SvelteKit projects
- Creating stories with different component states
- Mocking async network requests in Storybook
- Using Tailwind 4 for component styling
- Implementing proper loading and error handling patterns

## 2. Prerequisites & Setup Checklist

**Required Knowledge:**
- [ ] Basic Svelte/SvelteKit syntax
- [ ] Understanding of async/await in JavaScript
- [ ] Familiarity with Tailwind CSS classes
- [ ] Basic command line usage

**System Requirements:**
- [ ] Node.js 18+ installed
- [ ] Package manager (npm/pnpm/yarn)
- [ ] Code editor with Svelte support

**Initial Setup:**
```bash
# Create new SvelteKit project
npm create svelte@latest storybook-challenge
cd storybook-challenge
npm install

# Add required dependencies
npm install -D @storybook/svelte-vite @storybook/addon-essentials
npm install -D @storybook/addon-mock msw
npx storybook@latest init
```

## 3. Context: Why This Matters for Our Project

In our upcoming SvelteKit/Tauri project, we'll need:
- **Reusable components** that work consistently across web and desktop
- **Reliable testing** of components in isolation, especially those with network dependencies
- **Design system documentation** that non-developers can review
- **Consistent handling** of async states (loading, error, success)

Storybook provides a development environment where we can build, test, and document components independently of the main application, which is crucial for:
- Parallel development across team members
- Visual regression testing
- Component API design validation
- Stakeholder review and approval

## 4. Tutorial Walkthrough

### Step 1: Configure Storybook for SvelteKit and Tailwind (5 minutes)

**Create `.storybook/main.js`:**
```javascript
/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-mock'
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {}
  }
};
export default config;
```

**Create `.storybook/preview.js`:**
```javascript
import '../src/app.css'; // Import your Tailwind styles

/** @type { import('@storybook/svelte').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

**Verify setup:**
```bash
npm run storybook
```
Storybook should open at `http://localhost:6006`

### Step 2: Create the UserProfileCard Component (8 minutes)

**Create `src/lib/components/UserProfileCard.svelte`:**
```svelte
<script>
  import { onMount } from 'svelte';
  
  /** @type {number} */
  export let userId;
  
  /** @type {function} */
  export let fetchUser = defaultFetchUser;
  
  let user = null;
  let loading = true;
  let error = null;

  async function defaultFetchUser(id) {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  }

  async function loadUser() {
    try {
      loading = true;
      error = null;
      user = await fetchUser(userId);
    } catch (err) {
      error = err.message;
      user = null;
    } finally {
      loading = false;
    }
  }

  onMount(loadUser);
  
  $: if (userId) loadUser();
</script>

<div class="max-w-sm mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
  {#if loading}
    <div class="p-6">
      <div class="animate-pulse">
        <div class="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <div class="h-4 bg-gray-300 rounded mb-2"></div>
        <div class="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
      </div>
    </div>
  {:else if error}
    <div class="p-6 text-center">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">Error Loading Profile</h3>
      <p class="text-sm text-gray-600">{error}</p>
    </div>
  {:else if user}
    <div class="p-6">
      <div class="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <span class="text-white font-bold text-xl">{user.name.charAt(0)}</span>
      </div>
      <div class="text-center">
        <h3 class="text-xl font-semibold text-gray-900">{user.name}</h3>
        <p class="text-gray-600">@{user.username}</p>
        <p class="text-sm text-gray-500 mt-2">{user.email}</p>
        <div class="mt-4 pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-400">{user.company.name}</p>
        </div>
      </div>
    </div>
  {/if}
</div>
```

### Step 3: Create Mock Data and Network Handlers (5 minutes)

**Create `src/lib/mocks/userData.js`:**
```javascript
export const mockUsers = {
  1: {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    company: { name: "Tech Corp" }
  },
  2: {
    id: 2,
    name: "Jane Smith", 
    username: "janesmith",
    email: "jane@example.com",
    company: { name: "Design Studio" }
  },
  999: null // For testing error states
};

export const createMockFetcher = (delay = 1000, shouldError = false) => {
  return async (userId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    if (shouldError) {
      throw new Error('Network error occurred');
    }
    
    const user = mockUsers[userId];
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  };
};
```

### Step 4: Create Storybook Stories with Different States (8 minutes)

**Create `src/lib/components/UserProfileCard.stories.js`:**
```javascript
import UserProfileCard from './UserProfileCard.svelte';
import { mockUsers, createMockFetcher } from '../mocks/userData.js';

export default {
  title: 'Components/UserProfileCard',
  component: UserProfileCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    userId: {
      control: { type: 'number', min: 1, max: 10 },
      description: 'The ID of the user to fetch and display'
    }
  }
};

// Default success state
export const Default = {
  args: {
    userId: 1,
    fetchUser: createMockFetcher(500)
  }
};

// Loading state (longer delay to see loading)
export const Loading = {
  args: {
    userId: 1,
    fetchUser: createMockFetcher(5000) // 5 second delay
  }
};

// Error state
export const Error = {
  args: {
    userId: 1,
    fetchUser: createMockFetcher(500, true) // Force error
  }
};

// User not found
export const UserNotFound = {
  args: {
    userId: 999,
    fetchUser: createMockFetcher(500)
  }
};

// Different user data
export const AlternateUser = {
  args: {
    userId: 2,
    fetchUser: createMockFetcher(500)
  }
};

// Interactive example with controls
export const Interactive = {
  args: {
    userId: 1,
    fetchUser: createMockFetcher(1000)
  }
};
```

### Step 5: Test and Verify Stories (2 minutes)

**Run Storybook:**
```bash
npm run storybook
```

**Verification checklist:**
- [ ] All 6 stories render without errors
- [ ] Loading story shows skeleton animation
- [ ] Error stories display error messages
- [ ] Default and AlternateUser show user data
- [ ] Interactive story responds to userId changes

### Step 6: Add Story Documentation (2 minutes)

**Update the stories file with documentation:**
```javascript
export default {
  title: 'Components/UserProfileCard',
  component: UserProfileCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
A reusable user profile card component that fetches and displays user information.

**Features:**
- Automatic loading states with skeleton animation
- Error handling with user-friendly messages  
- Responsive design with Tailwind CSS
- Dependency injection for testing (fetchUser prop)

**Usage in SvelteKit:**
\`\`\`svelte
<UserProfileCard userId={1} />
\`\`\`
        `
      }
    }
  },
  // ... rest of config
};

// Add documentation to individual stories
export const Default = {
  args: {
    userId: 1,
    fetchUser: createMockFetcher(500)
  },
  parameters: {
    docs: {
      description: {
        story: 'Default success state showing a loaded user profile.'
      }
    }
  }
};
```

## 5. Research Challenges

### Challenge A: Advanced Storybook Configuration
**Question:** How would you configure Storybook to automatically generate stories from TypeScript interfaces or JSDoc comments in Svelte components?

**Research Focus:** Look into `@storybook/addon-docs` and automatic story generation. Document your findings on:
- Story auto-generation from prop types
- Integration with TypeScript definitions
- Custom documentation blocks

### Challenge B: MSW Integration
**Question:** How can you use Mock Service Worker (MSW) instead of function mocks to intercept actual HTTP requests in Storybook?

**Research Focus:** Investigate `@storybook/addon-mock` and MSW setup. Find out:
- How to set up MSW in Storybook
- Differences between function mocks vs HTTP mocks
- Benefits for testing actual fetch calls

### Challenge C: Visual Testing Strategy
**Question:** What tools and approaches would you use to implement visual regression testing for your Storybook components in a CI/CD pipeline?

**Research Focus:** Look into Chromatic, Percy, or other visual testing tools. Consider:
- Integration with version control
- Cost and setup complexity
- Team workflow implications

## 6. Success Criteria & Next Steps

### Success Criteria ✅
- [ ] Storybook runs without errors and displays all stories
- [ ] UserProfileCard component handles all three states (loading, error, success)
- [ ] Stories demonstrate different component states using mocked functions
- [ ] Component styling works correctly with Tailwind classes
- [ ] Documentation is clear and helpful for team members

### Verification Commands:
```bash
# Build storybook (should complete without errors)
npm run build-storybook

# Check component in isolation
npm run storybook
```

### Next Steps for Project Integration:
1. **Expand Component Library:** Create additional components following this pattern
2. **Add Visual Testing:** Set up Chromatic or similar for regression testing
3. **TypeScript Integration:** Convert components to TypeScript for better type safety
4. **Design System:** Establish consistent spacing, colors, and typography tokens
5. **Testing Strategy:** Add unit tests that work alongside Storybook stories

## 7. Common Troubleshooting

### Issue: "Failed to resolve import"
**Solution:** Ensure all dependencies are installed and paths in import statements are correct.
```bash
npm install -D @storybook/svelte-vite @storybook/addon-essentials
```

### Issue: Tailwind styles not appearing
**Solution:** Verify that `app.css` is imported in `.storybook/preview.js` and contains Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Issue: Stories not updating when component changes
**Solution:** Restart Storybook development server:
```bash
# Stop with Ctrl+C, then restart
npm run storybook
```

### Issue: Async stories not working properly
**Solution:** Check that your mock functions return Promises and handle errors correctly. Verify the component's `onMount` and reactive statements.

### Issue: Build fails
**Solution:** Check for syntax errors in stories files and ensure all imports resolve correctly. Run:
```bash
npm run check  # SvelteKit syntax check
npm run build  # Build the app
```

---

**Estimated Completion Time:** 30 minutes  
**Difficulty Level:** Intermediate  
**Team Skill Development:** Component architecture, testing patterns, documentation practices
