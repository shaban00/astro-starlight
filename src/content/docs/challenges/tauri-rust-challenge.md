---
title: Tauri-SvelteKit Bridge 
description: Citation Parser
---


## Prompt

```
Create a 30-minute software development challenge for Tauri and SvelteKit that teaches how to write Rust functions and invoke them from JavaScript. 

Context: This is for a development team preparing for a project that uses Tauri to build a desktop application. Team members have little experience with Rust but extensive experience with web development.

Requirements:
- Single focused learning objective
- Step-by-step tutorial with working code
- 2-3 research questions that require documentation exploration
- Practical example relevant to law school libraries
- Setup instructions for SvelteKit and plain JavaScript in Tauri
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
- Avoid complex or verbose frontend code

Output a complete, ready-to-use challenge document.
```

# Tauri-SvelteKit Bridge Challenge: Citation Parser

**Duration:** 30 minutes  
**Difficulty:** Beginner  
**Focus:** Rust-JavaScript Interoperability in Tauri

## 1. Challenge Overview & Objectives

### Learning Objective
Learn how to write Rust functions in Tauri and invoke them from SvelteKit JavaScript, focusing on the command system that bridges backend logic with frontend interfaces.

### What You'll Build
A citation parser that takes legal citations (like "Smith v. Jones, 123 U.S. 456 (1999)") and extracts structured data using Rust's string processing capabilities, then displays the results in a SvelteKit interface.

### Key Skills
- Writing Tauri commands in Rust
- Invoking Rust functions from JavaScript
- Handling async operations across the bridge
- Error handling between Rust and JavaScript

## 2. Prerequisites & Setup Checklist

### Required Software
- [ ] Node.js (v16+)
- [ ] Rust (latest stable)
- [ ] VS Code or similar editor

### Verify Installation
```bash
# Check versions
node --version
cargo --version
rustc --version
```

### Project Setup
```bash
# Create new Tauri + SvelteKit project
npm create tauri-app@latest citation-parser
# Choose: SvelteKit, TypeScript (No), CSS (No)

cd citation-parser
npm install
```

### Verification Step
```bash
npm run tauri dev
```
You should see a basic window open with "Welcome to Tauri!"

## 3. Context: Why This Matters

In our law school library project, we'll frequently need to:
- Process and validate legal citations
- Perform text parsing that's more efficient in Rust
- Maintain data integrity through Rust's type system
- Leverage existing Rust libraries for specialized tasks

This pattern of "heavy processing in Rust, UI in JavaScript" will be fundamental to our architecture.

## 4. Tutorial Walkthrough

### Step 1: Create the Citation Data Structure (5 minutes)

**File:** `src-tauri/src/lib.rs`

Replace the entire contents with:

```rust
// Prevents additional console window on Windows in release
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Citation {
    pub case_name: String,
    pub volume: String,
    pub reporter: String,
    pub page: String,
    pub year: String,
    pub full_citation: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ParseResult {
    pub success: bool,
    pub citation: Option<Citation>,
    pub error_message: Option<String>,
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![parse_citation])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**Verification:** Run `cargo check` in the `src-tauri` directory - it should compile without errors.

### Step 2: Implement the Citation Parser Function (8 minutes)

**File:** `src-tauri/src/lib.rs`

Add this function before the `main()` function:

```rust
#[tauri::command]
fn parse_citation(citation_text: String) -> ParseResult {
    // Simple regex-like parsing for: "Case Name, Vol Reporter Page (Year)"
    // Example: "Smith v. Jones, 123 U.S. 456 (1999)"
    
    let citation_text = citation_text.trim();
    
    if citation_text.is_empty() {
        return ParseResult {
            success: false,
            citation: None,
            error_message: Some("Citation cannot be empty".to_string()),
        };
    }
    
    // Find the year (text in parentheses at the end)
    let year = if let Some(year_start) = citation_text.rfind('(') {
        if let Some(year_end) = citation_text.rfind(')') {
            if year_end > year_start {
                citation_text[(year_start + 1)..year_end].to_string()
            } else {
                return create_parse_error("Invalid year format");
            }
        } else {
            return create_parse_error("Missing closing parenthesis for year");
        }
    } else {
        return create_parse_error("Year not found");
    };
    
    // Get text before the year
    let before_year = if let Some(paren_pos) = citation_text.rfind('(') {
        citation_text[..paren_pos].trim()
    } else {
        return create_parse_error("Cannot parse citation structure");
    };
    
    // Split by comma to separate case name from citation details
    let parts: Vec<&str> = before_year.splitn(2, ',').collect();
    if parts.len() != 2 {
        return create_parse_error("Missing comma separator");
    }
    
    let case_name = parts[0].trim().to_string();
    let citation_part = parts[1].trim();
    
    // Parse "123 U.S. 456" format
    let citation_components: Vec<&str> = citation_part.split_whitespace().collect();
    if citation_components.len() < 3 {
        return create_parse_error("Incomplete citation format");
    }
    
    let volume = citation_components[0].to_string();
    let reporter = citation_components[1].to_string();
    let page = citation_components[2].to_string();
    
    ParseResult {
        success: true,
        citation: Some(Citation {
            case_name,
            volume,
            reporter,
            page,
            year,
            full_citation: citation_text.to_string(),
        }),
        error_message: None,
    }
}

fn create_parse_error(message: &str) -> ParseResult {
    ParseResult {
        success: false,
        citation: None,
        error_message: Some(message.to_string()),
    }
}
```

**Verification:** Run `cargo check` again - should compile successfully.

### Step 3: Create the SvelteKit Interface (8 minutes)

**File:** `src/routes/+page.svelte`

Replace contents with:

```svelte
<script>
  import { invoke } from '@tauri-apps/api/tauri';
  
  let inputCitation = '';
  let parseResult = null;
  let isLoading = false;

  async function parseCitation() {
    if (!inputCitation.trim()) return;
    
    isLoading = true;
    try {
      parseResult = await invoke('parse_citation', { 
        citationText: inputCitation 
      });
    } catch (error) {
      parseResult = {
        success: false,
        error_message: `Failed to parse: ${error}`
      };
    }
    isLoading = false;
  }

  function clearResult() {
    parseResult = null;
    inputCitation = '';
  }
</script>

<div class="container">
  <h1>Legal Citation Parser</h1>
  
  <div class="input-section">
    <label for="citation">Enter a legal citation:</label>
    <input 
      id="citation"
      bind:value={inputCitation} 
      placeholder="e.g., Smith v. Jones, 123 U.S. 456 (1999)"
      on:keydown={(e) => e.key === 'Enter' && parseCitation()}
    />
    <div class="buttons">
      <button on:click={parseCitation} disabled={isLoading}>
        {isLoading ? 'Parsing...' : 'Parse Citation'}
      </button>
      <button on:click={clearResult}>Clear</button>
    </div>
  </div>

  {#if parseResult}
    <div class="result">
      {#if parseResult.success}
        <h2>✅ Parsed Successfully</h2>
        <div class="citation-details">
          <p><strong>Case Name:</strong> {parseResult.citation.case_name}</p>
          <p><strong>Volume:</strong> {parseResult.citation.volume}</p>
          <p><strong>Reporter:</strong> {parseResult.citation.reporter}</p>
          <p><strong>Page:</strong> {parseResult.citation.page}</p>
          <p><strong>Year:</strong> {parseResult.citation.year}</p>
        </div>
      {:else}
        <h2>❌ Parse Error</h2>
        <p class="error">{parseResult.error_message}</p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container { max-width: 600px; margin: 2rem auto; padding: 1rem; }
  .input-section { margin-bottom: 2rem; }
  label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
  input { width: 100%; padding: 0.5rem; margin-bottom: 1rem; }
  .buttons { display: flex; gap: 1rem; }
  button { padding: 0.5rem 1rem; cursor: pointer; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
  .result { border: 2px solid #ccc; padding: 1rem; border-radius: 4px; }
  .citation-details p { margin: 0.5rem 0; }
  .error { color: #d32f2f; }
</style>
```

### Step 4: Test the Basic Functionality (3 minutes)

Run the application:
```bash
npm run tauri dev
```

Test with these citations:
- `Smith v. Jones, 123 U.S. 456 (1999)` ✅ Should parse successfully
- `Invalid citation` ❌ Should show error
- `` (empty) ❌ Should show error

**Verification:** All three test cases should work as expected.

### Step 5: Add Input Validation (3 minutes)

**File:** `src-tauri/src/lib.rs`

Add this validation function before `parse_citation`:

```rust
fn validate_citation_format(citation: &str) -> Result<(), String> {
    if citation.len() < 10 {
        return Err("Citation too short".to_string());
    }
    
    if !citation.contains(',') {
        return Err("Citations must contain a comma separator".to_string());
    }
    
    if !citation.contains('(') || !citation.contains(')') {
        return Err("Citations must contain year in parentheses".to_string());
    }
    
    Ok(())
}
```

Update the beginning of `parse_citation` function:

```rust
#[tauri::command]
fn parse_citation(citation_text: String) -> ParseResult {
    let citation_text = citation_text.trim();
    
    if citation_text.is_empty() {
        return create_parse_error("Citation cannot be empty");
    }
    
    // Add validation
    if let Err(validation_error) = validate_citation_format(citation_text) {
        return create_parse_error(&validation_error);
    }
    
    // ... rest of function remains the same
```

**Verification:** Test with `"Short"` - should show validation error.

### Step 6: Add Success Counter (3 minutes)

**File:** `src/routes/+page.svelte`

Add to the `<script>` section:

```javascript
let successCount = 0;

// Update the parseCitation function
async function parseCitation() {
  if (!inputCitation.trim()) return;
  
  isLoading = true;
  try {
    parseResult = await invoke('parse_citation', { 
      citationText: inputCitation 
    });
    
    // Increment counter on success
    if (parseResult.success) {
      successCount++;
    }
  } catch (error) {
    parseResult = {
      success: false,
      error_message: `Failed to parse: ${error}`
    };
  }
  isLoading = false;
}
```

Add this to the HTML after the `<h1>` tag:

```svelte
<p>Successfully parsed citations: {successCount}</p>
```

## 5. Research Challenges

### Challenge A: Error Handling Patterns
**Question:** How would you modify the Rust function to return different types of errors (validation errors vs. parsing errors) that the frontend could handle differently?

**Research:** Look up Tauri's error handling documentation and Rust's `Result<T, E>` type.

**Implementation:** Create an enum for error types and update the parse function.

### Challenge B: Performance Optimization
**Question:** If this parser needed to handle 1000+ citations at once, how would you modify the architecture?

**Research:** Investigate Tauri's async command patterns and Rust's threading capabilities.

**Hint:** Look into `#[tauri::command]` with async and batch processing.

### Challenge C: Extended Functionality
**Question:** How would you add a "format citation" command that takes the parsed data and outputs it in different citation styles (APA, MLA, etc.)?

**Research:** Explore how to call multiple Tauri commands from the same frontend and pass complex objects between them.

## 6. Success Criteria & Next Steps

### ✅ Success Checklist
- [ ] Application runs without errors
- [ ] Can parse valid citations correctly
- [ ] Shows appropriate error messages for invalid input
- [ ] Counter updates on successful parses
- [ ] UI is responsive and intuitive

### Understanding Check
You should be able to explain:
1. How the `#[tauri::command]` macro works
2. Why we use `serde::Serialize` and `serde::Deserialize`
3. How async/await works between Rust and JavaScript
4. The role of the `invoke_handler` in main()

### Next Steps
1. **Add more citation formats** (law review articles, statutes)
2. **Implement citation validation** against known reporters
3. **Add batch processing** for multiple citations
4. **Create citation export** functionality

### Production Considerations
- Add comprehensive error logging
- Implement input sanitization
- Add unit tests for Rust functions
- Consider citation database integration

## 7. Common Troubleshooting

### Issue: "Command not found" error
**Symptoms:** JavaScript shows invoke error
**Solution:** 
1. Ensure function has `#[tauri::command]` attribute
2. Check that function is listed in `generate_handler![]`
3. Restart dev server after Rust changes

### Issue: Compilation errors in Rust
**Symptoms:** `cargo check` fails
**Solution:**
1. Check all imports are included
2. Ensure struct fields match between definition and usage
3. Verify all functions return correct types

### Issue: Serde serialization errors
**Symptoms:** Data doesn't transfer properly
**Solution:**
1. Ensure all structs have `#[derive(Serialize, Deserialize)]`
2. Check that field names match between Rust and JavaScript
3. Verify `Option<T>` handling for nullable fields

### Issue: Frontend doesn't update
**Symptoms:** UI shows old data
**Solution:**
1. Check that variables are reactive (`let`, not `const`)
2. Ensure async functions are properly awaited
3. Verify component state updates trigger re-renders

### Dev Tools
- Use browser developer console for JavaScript errors
- Check Tauri dev console for Rust panics
- Add `console.log()` and `println!()` for debugging

---

**Estimated Completion Time: 30 minutes**  
**Next Challenge:** Advanced Tauri Commands with File System Operations

