# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Timez People is a frontend-only team timezone tracker SPA built with vanilla JavaScript (ES6+), HTML5, and CSS3. No build process or external dependencies - just static files served directly.

## Running the Application

**Local development:**
```bash
# Option 1: Python HTTP server
python3 -m http.server 8000

# Option 2: Node.js http-server
npx http-server
```

**Docker:**
```bash
docker build -t timez-people .
docker run -d -p 8080:80 timez-people
```

No automated tests or linting configured.

## Architecture

### Core Files
- `app.js` - Complete application logic (state, rendering, persistence, event handling)
- `index.html` - HTML structure with timezone selectors, table container, and modal
- `styles.css` - Dark mode theme with CSS variables, responsive down to 480px

### State Management (app.js)
Global state variables:
- `people[]` - Array of team members with id, name, timezone
- `baseTimezone` - Reference timezone for the table
- `baseTimezoneName` - Custom display name for base timezone
- `referenceHour` - Currently highlighted hour column

All state persists to localStorage with keys: `timezonePeople`, `baseTimezone`, `baseTimezoneName`.

### Key Logic Sections in app.js
- Lines 1-50: Timezone list (50 timezones)
- Lines 75-81: Initialization flow
- Lines 84-108: LocalStorage persistence
- Lines 176-207: Modal operations
- Lines 210-247: Person CRUD operations
- Lines 337-390: **Time conversion logic** - most complex part, especially `createDateAtHourInTimezone()`
- Lines 275-497: Table rendering

### Data Flow
```
DOMContentLoaded → loadFromLocalStorage() → populateTimezoneSelects()
    → setupEventListeners() → renderTable() → 30-second auto-update timer
```

### CSS Structure
- Lines 7-21: Color variables (dark theme)
- Lines 100-158: Table with sticky columns
- Lines 164-176: Highlighting classes (`.current-time`, `.reference-time`, `.day-change`)
- Breakpoints: 768px (tablet), 480px (mobile)

## Code Conventions

- **Functions:** camelCase with verb prefix (`handleBaseTimezoneChange`, `renderTable`)
- **CSS classes:** kebab-case (`.day-change`, `.current-time`)
- **DOM elements:** Cached at top level (lines 61-72), created with `document.createElement()`
- **Event handlers:** Prefix with `handle`
- **Rendering:** Separate functions per component, re-render entire table on state change

## Browser Requirements

Requires: LocalStorage API, Intl.DateTimeFormat API, ES6+, CSS Grid/Flexbox, CSS variables. Not IE11 compatible.
