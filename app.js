// Comprehensive list of timezones
const TIMEZONES = [
    'UTC',
    'America/New_York',
    'America/Chicago',
    'America/Denver',
    'America/Los_Angeles',
    'America/Anchorage',
    'Pacific/Honolulu',
    'America/Toronto',
    'America/Vancouver',
    'America/Mexico_City',
    'America/Sao_Paulo',
    'America/Buenos_Aires',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Madrid',
    'Europe/Rome',
    'Europe/Amsterdam',
    'Europe/Brussels',
    'Europe/Vienna',
    'Europe/Stockholm',
    'Europe/Oslo',
    'Europe/Copenhagen',
    'Europe/Helsinki',
    'Europe/Athens',
    'Europe/Moscow',
    'Europe/Istanbul',
    'Asia/Dubai',
    'Asia/Karachi',
    'Asia/Kolkata',
    'Asia/Dhaka',
    'Asia/Bangkok',
    'Asia/Singapore',
    'Asia/Hong_Kong',
    'Asia/Shanghai',
    'Asia/Tokyo',
    'Asia/Seoul',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Australia/Brisbane',
    'Australia/Perth',
    'Pacific/Auckland',
    'Pacific/Fiji',
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'Africa/Nairobi',
];

// State
let people = [];
let baseTimezone = 'UTC';
let baseTimezoneName = '';
let referenceHour = null;
let currentEditingId = null;
let updateInterval = null;

// DOM elements
const baseTimezoneSelect = document.getElementById('baseTimezone');
const baseTimezoneNameInput = document.getElementById('baseTimezoneName');
const timezoneSelect = document.getElementById('timezoneSelect');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const personNameInput = document.getElementById('personName');
const modalTimezoneInfo = document.getElementById('modalTimezone');
const modalSave = document.getElementById('modalSave');
const modalCancel = document.getElementById('modalCancel');
const tableHeader = document.getElementById('tableHeader');
const tableBody = document.getElementById('tableBody');
const emptyState = document.getElementById('emptyState');

// Initialize app
function init() {
    loadFromLocalStorage();
    populateTimezoneSelects();
    setupEventListeners();
    renderTable();
    startAutoUpdate();
}

// Load data from LocalStorage
function loadFromLocalStorage() {
    const savedPeople = localStorage.getItem('timezonePeople');
    const savedBaseTimezone = localStorage.getItem('baseTimezone');
    const savedBaseTimezoneName = localStorage.getItem('baseTimezoneName');

    if (savedPeople) {
        people = JSON.parse(savedPeople);
    }

    if (savedBaseTimezone) {
        baseTimezone = savedBaseTimezone;
    }

    if (savedBaseTimezoneName) {
        baseTimezoneName = savedBaseTimezoneName;
        baseTimezoneNameInput.value = baseTimezoneName;
    }
}

// Save data to LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('timezonePeople', JSON.stringify(people));
    localStorage.setItem('baseTimezone', baseTimezone);
    localStorage.setItem('baseTimezoneName', baseTimezoneName);
}

// Populate timezone selects
function populateTimezoneSelects() {
    // Populate base timezone select
    TIMEZONES.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz.replace(/_/g, ' ');
        if (tz === baseTimezone) {
            option.selected = true;
        }
        baseTimezoneSelect.appendChild(option);
    });

    // Populate add person timezone select
    TIMEZONES.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = tz.replace(/_/g, ' ');
        timezoneSelect.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    baseTimezoneSelect.addEventListener('change', handleBaseTimezoneChange);
    baseTimezoneNameInput.addEventListener('input', handleBaseTimezoneNameChange);
    timezoneSelect.addEventListener('change', handleTimezoneSelectChange);
    modalSave.addEventListener('click', handleModalSave);
    modalCancel.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    personNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleModalSave();
        }
    });
}

// Handle base timezone change
function handleBaseTimezoneChange(e) {
    baseTimezone = e.target.value;
    saveToLocalStorage();
    referenceHour = null;
    renderTable();
}

// Handle base timezone name change
function handleBaseTimezoneNameChange(e) {
    baseTimezoneName = e.target.value;
    saveToLocalStorage();
    renderTable();
}

// Handle timezone select change (open modal to add person)
function handleTimezoneSelectChange(e) {
    const selectedTimezone = e.target.value;
    if (selectedTimezone) {
        openModalForAdd(selectedTimezone);
        e.target.value = '';
    }
}

// Open modal for adding person
function openModalForAdd(timezone) {
    currentEditingId = null;
    modalTitle.textContent = 'Add Person';
    personNameInput.value = '';
    modalTimezoneInfo.textContent = `Timezone: ${timezone.replace(/_/g, ' ')}`;
    modalTimezoneInfo.dataset.timezone = timezone;
    modal.classList.add('show');
    personNameInput.focus();
}

// Open modal for editing person
function openModalForEdit(id) {
    const person = people.find(p => p.id === id);
    if (!person) return;

    currentEditingId = id;
    modalTitle.textContent = 'Edit Person';
    personNameInput.value = person.name;
    modalTimezoneInfo.textContent = `Timezone: ${person.timezone.replace(/_/g, ' ')}`;
    modalTimezoneInfo.dataset.timezone = person.timezone;
    modal.classList.add('show');
    personNameInput.focus();
}

// Close modal
function closeModal() {
    modal.classList.remove('show');
    currentEditingId = null;
    personNameInput.value = '';
    modalTimezoneInfo.textContent = '';
    delete modalTimezoneInfo.dataset.timezone;
}

// Handle modal save
function handleModalSave() {
    const name = personNameInput.value.trim();
    const timezone = modalTimezoneInfo.dataset.timezone;

    if (!name) {
        alert('Please enter a name');
        return;
    }

    if (currentEditingId) {
        // Edit existing person
        const person = people.find(p => p.id === currentEditingId);
        if (person) {
            person.name = name;
        }
    } else {
        // Add new person
        const newPerson = {
            id: Date.now(),
            name: name,
            timezone: timezone
        };
        people.push(newPerson);
    }

    saveToLocalStorage();
    renderTable();
    closeModal();
}

// Delete person
function deletePerson(id) {
    if (confirm('Are you sure you want to remove this person?')) {
        people = people.filter(p => p.id !== id);
        saveToLocalStorage();
        renderTable();
    }
}

// Get time in 12-hour format
function formatTime12Hour(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

// Get hour in 12-hour format
function formatHour12(hour) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    let displayHour = hour % 12;
    displayHour = displayHour ? displayHour : 12;
    return `${displayHour} ${ampm}`;
}

// Check if date is in different day relative to base date
function isDifferentDay(baseDate, targetDate) {
    return baseDate.getDate() !== targetDate.getDate() ||
           baseDate.getMonth() !== targetDate.getMonth() ||
           baseDate.getFullYear() !== targetDate.getFullYear();
}

// Render table
function renderTable() {
    if (people.length === 0) {
        document.querySelector('.table-wrapper').style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    document.querySelector('.table-wrapper').style.display = 'block';
    emptyState.style.display = 'none';

    renderTableHeader();
    renderTableBody();
}

// Render table header
function renderTableHeader() {
    tableHeader.innerHTML = '';

    // Name column
    const nameHeader = document.createElement('th');
    nameHeader.textContent = 'Name';
    tableHeader.appendChild(nameHeader);

    // Timezone column
    const timezoneHeader = document.createElement('th');
    timezoneHeader.textContent = 'Timezone';
    tableHeader.appendChild(timezoneHeader);

    // 24 hour columns
    for (let hour = 0; hour < 24; hour++) {
        const hourHeader = document.createElement('th');
        hourHeader.textContent = formatHour12(hour);
        hourHeader.classList.add('clickable');
        hourHeader.dataset.hour = hour;
        hourHeader.addEventListener('click', () => handleHourClick(hour));

        // Display base timezone name if set
        if (hour === 0 && baseTimezoneName) {
            const label = document.createElement('div');
            label.style.fontSize = '0.75rem';
            label.style.color = 'var(--text-secondary)';
            label.textContent = baseTimezoneName;
            hourHeader.appendChild(document.createElement('br'));
            hourHeader.appendChild(label);
        }

        tableHeader.appendChild(hourHeader);
    }

    // Actions column
    const actionsHeader = document.createElement('th');
    actionsHeader.textContent = 'Actions';
    tableHeader.appendChild(actionsHeader);
}

// Handle hour column click (set reference time)
function handleHourClick(hour) {
    referenceHour = referenceHour === hour ? null : hour;
    renderTableBody();
}

// Helper function to get timezone offset in milliseconds
function getTimezoneOffset(date, timezone) {
    // Get the date in UTC
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    // Get the date in the target timezone
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    // Return the difference
    return tzDate.getTime() - utcDate.getTime();
}

// Helper function to create a date at a specific hour in a timezone
function createDateAtHourInTimezone(referenceDate, hour, timezone) {
    // Get today's date components in the target timezone
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const parts = formatter.formatToParts(referenceDate);
    const month = parts.find(p => p.type === 'month').value;
    const day = parts.find(p => p.type === 'day').value;
    const year = parts.find(p => p.type === 'year').value;

    // Create a date string for this specific hour
    const dateStr = `${year}-${month}-${day}T${hour.toString().padStart(2, '0')}:00:00`;

    // Parse as if it's in the target timezone by finding the equivalent UTC time
    // We'll test multiple UTC offsets to find which one gives us the correct hour in the target timezone
    const baseDate = new Date(referenceDate);
    baseDate.setHours(0, 0, 0, 0);

    // Try different UTC hours to find which gives us the target hour in the timezone
    for (let testHour = -12; testHour < 36; testHour++) {
        const testDate = new Date(baseDate.getTime() + (testHour * 3600000));
        const hourInTz = parseInt(new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: 'numeric',
            hour12: false
        }).format(testDate));

        const dayInTz = parseInt(new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            day: 'numeric'
        }).format(testDate));

        if (hourInTz === hour && dayInTz === parseInt(day)) {
            return testDate;
        }
    }

    return new Date();
}

// Render table body
function renderTableBody() {
    tableBody.innerHTML = '';

    const now = new Date();

    people.forEach(person => {
        const row = document.createElement('tr');

        // Name cell
        const nameCell = document.createElement('td');
        nameCell.textContent = person.name;
        nameCell.classList.add('name-cell');
        row.appendChild(nameCell);

        // Timezone cell
        const timezoneCell = document.createElement('td');
        timezoneCell.textContent = person.timezone.replace(/_/g, ' ');
        timezoneCell.classList.add('timezone-cell');
        row.appendChild(timezoneCell);

        // Get current hour in base timezone
        const currentHourInBase = parseInt(new Intl.DateTimeFormat('en-US', {
            timeZone: baseTimezone,
            hour: 'numeric',
            hour12: false
        }).format(now));

        // Get today's date in base timezone for reference
        const baseDateParts = new Intl.DateTimeFormat('en-US', {
            timeZone: baseTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).formatToParts(now);

        const baseDay = parseInt(baseDateParts.find(p => p.type === 'day').value);

        // For each hour in base timezone, show corresponding time in person's timezone
        for (let hour = 0; hour < 24; hour++) {
            const timeCell = document.createElement('td');
            timeCell.classList.add('time-cell');

            // Create a date representing this hour in the base timezone
            const dateAtHourInBase = createDateAtHourInTimezone(now, hour, baseTimezone);

            // Check if this is the current hour
            const isCurrentHour = hour === currentHourInBase;

            // Convert to person's timezone - use actual time for current hour, hour start for others
            const dateToDisplay = isCurrentHour ? now : dateAtHourInBase;

            const timeInPersonTz = new Intl.DateTimeFormat('en-US', {
                timeZone: person.timezone,
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            }).format(dateToDisplay);

            const dayInPersonTz = parseInt(new Intl.DateTimeFormat('en-US', {
                timeZone: person.timezone,
                day: 'numeric'
            }).format(dateAtHourInBase));

            // Display time
            timeCell.textContent = timeInPersonTz;

            // Highlight current time
            if (isCurrentHour) {
                timeCell.classList.add('current-time');
            }

            // Highlight reference time
            if (referenceHour !== null && hour === referenceHour) {
                timeCell.classList.add('reference-time');
            }

            // Highlight day change (different day than base timezone)
            if (dayInPersonTz !== baseDay) {
                timeCell.classList.add('day-change');
            }

            row.appendChild(timeCell);
        }

        // Actions cell
        const actionsCell = document.createElement('td');
        actionsCell.classList.add('actions-cell');

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('action-btn');
        editBtn.addEventListener('click', () => openModalForEdit(person.id));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('action-btn', 'delete');
        deleteBtn.addEventListener('click', () => deletePerson(person.id));

        actionsCell.appendChild(editBtn);
        actionsCell.appendChild(deleteBtn);
        row.appendChild(actionsCell);

        tableBody.appendChild(row);
    });
}

// Start auto-update timer
function startAutoUpdate() {
    // Update every 30 seconds
    updateInterval = setInterval(() => {
        if (people.length > 0) {
            renderTableBody();
        }
    }, 30000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
