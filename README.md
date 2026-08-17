# Timez People - Team Timezone Tracker

A simple, frontend-only web application to track your team members' timezones and visualize time differences in a single view.

## Features

- **No Backend Required**: All data stored in browser's LocalStorage
- **Base Timezone**: Set a reference timezone with custom name
- **Add Team Members**: Select timezone and add person's name
- **24-Hour Table View**: See all 24 hours and corresponding times across timezones
- **Current Time Indicator**: Auto-updating highlight of current hour
- **Reference Time Selection**: Click any hour column to highlight that time across all timezones
- **Day Change Indicators**: Grey highlighting for times in different days
- **Edit & Delete**: Manage team members easily
- **Dark Mode**: Clean, minimal dark interface
- **Mobile Friendly**: Responsive design for all screen sizes
- **12-Hour Format**: All times displayed in AM/PM format

## Usage

### Running Locally

Simply open `index.html` in your web browser. No server required!

```bash
# Using Python's built-in server (optional)
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server
```

Then open `http://localhost:8000` in your browser.

### Using Docker

Build and run the application using Docker:

```bash
# Build the Docker image
docker build -t timez-people .

# Run the container
docker run -d -p 8080:80 timez-people

# Access the app at http://localhost:8080
```

## How It Works

1. **Set Base Timezone**: Choose your reference timezone (e.g., your office location) and optionally give it a name
2. **Add People**: Select a timezone from the dropdown to add a team member
3. **View Times**: The table shows what time it is for each person across all 24 hours of your base timezone
4. **Click Hours**: Click any hour column to highlight and compare times across all timezones
5. **Auto-Update**: The current time column automatically updates every 30 seconds

## Technology Stack

- HTML5
- CSS3 (Dark mode, Flexbox, Grid)
- Vanilla JavaScript (ES6+)
- Docker (nginx:alpine)

## Browser Support

Works on all modern browsers that support:
- LocalStorage API
- Intl.DateTimeFormat API
- ES6+ JavaScript

## Data Storage

All data is stored locally in your browser using LocalStorage:
- Team members and their timezones
- Base timezone configuration
- Base timezone custom name

No data is sent to any server or third party.

## License

MIT License - Feel free to use and modify as needed.
