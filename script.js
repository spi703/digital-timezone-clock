// List of common timezones
const TIMEZONES = [
    { name: 'UTC', offset: 'UTC±0' },
    { name: 'London', offset: 'UTC±0' },
    { name: 'Europe/Paris', offset: 'UTC+1' },
    { name: 'Europe/Berlin', offset: 'UTC+1' },
    { name: 'Europe/Moscow', offset: 'UTC+3' },
    { name: 'Asia/Dubai', offset: 'UTC+4' },
    { name: 'Asia/Kolkata', offset: 'UTC+5:30' },
    { name: 'Asia/Bangkok', offset: 'UTC+7' },
    { name: 'Asia/Hong_Kong', offset: 'UTC+8' },
    { name: 'Asia/Shanghai', offset: 'UTC+8' },
    { name: 'Asia/Tokyo', offset: 'UTC+9' },
    { name: 'Asia/Seoul', offset: 'UTC+9' },
    { name: 'Australia/Sydney', offset: 'UTC+10' },
    { name: 'Pacific/Auckland', offset: 'UTC+12' },
    { name: 'America/New_York', offset: 'UTC-5' },
    { name: 'America/Chicago', offset: 'UTC-6' },
    { name: 'America/Denver', offset: 'UTC-7' },
    { name: 'America/Los_Angeles', offset: 'UTC-8' },
    { name: 'America/Anchorage', offset: 'UTC-9' },
    { name: 'Pacific/Honolulu', offset: 'UTC-10' },
    { name: 'America/Toronto', offset: 'UTC-5' },
    { name: 'America/Mexico_City', offset: 'UTC-6' },
    { name: 'America/Sao_Paulo', offset: 'UTC-3' },
    { name: 'America/Buenos_Aires', offset: 'UTC-3' },
    { name: 'Africa/Cairo', offset: 'UTC+2' },
    { name: 'Africa/Johannesburg', offset: 'UTC+2' },
    { name: 'Asia/Jakarta', offset: 'UTC+7' },
    { name: 'Asia/Singapour', offset: 'UTC+8' },
    { name: 'Asia/Manila', offset: 'UTC+8' },
    { name: 'Australia/Melbourne', offset: 'UTC+10' },
];

// Store for active clocks
let activeClocks = [];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeTimezoneSelect();
    // Add a default timezone (UTC)
    addDefaultTimezone();
    // Update clocks every second
    setInterval(updateAllClocks, 1000);
});

// Initialize timezone select dropdown
function initializeTimezoneSelect() {
    const select = document.getElementById('timezoneSelect');
    TIMEZONES.forEach(tz => {
        const option = document.createElement('option');
        option.value = tz.name;
        option.textContent = `${tz.name} (${tz.offset})`;
        select.appendChild(option);
    });
}

// Add default timezone (UTC)
function addDefaultTimezone() {
    if (activeClocks.length === 0) {
        addTimezoneWithName('UTC');
    }
}

// Add timezone
function addTimezone() {
    const select = document.getElementById('timezoneSelect');
    const timezoneName = select.value;

    if (!timezoneName) {
        showAlert('Please select a timezone', 'error');
        return;
    }

    // Check if timezone already exists
    if (activeClocks.some(clock => clock.timezone === timezoneName)) {
        showAlert(`${timezoneName} is already added`, 'error');
        return;
    }

    addTimezoneWithName(timezoneName);
    select.value = '';
}

// Add timezone with name
function addTimezoneWithName(timezoneName) {
    const clockId = `clock-${Date.now()}`;
    activeClocks.push({
        id: clockId,
        timezone: timezoneName
    });

    renderClocks();
    showAlert(`${timezoneName} added successfully`, 'success');
}

// Remove timezone
function removeTimezone(clockId) {
    activeClocks = activeClocks.filter(clock => clock.id !== clockId);
    renderClocks();
    showAlert('Timezone removed', 'success');
}

// Render all clocks
function renderClocks() {
    const grid = document.getElementById('clocksGrid');
    const emptyState = document.getElementById('emptyState');

    grid.innerHTML = '';

    if (activeClocks.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    activeClocks.forEach(clock => {
        const clockCard = createClockCard(clock);
        grid.appendChild(clockCard);
    });

    updateAllClocks();
}

// Create clock card
function createClockCard(clock) {
    const card = document.createElement('div');
    card.className = 'clock-card';
    card.id = clock.id;

    const timezone = TIMEZONES.find(tz => tz.name === clock.timezone);
    const offset = timezone ? timezone.offset : 'UTC±0';

    card.innerHTML = `
        <div class="clock-header">
            <div class="timezone-name">${clock.timezone.replace(/_/g, ' ')}</div>
            <div class="timezone-offset">${offset}</div>
        </div>
        <div class="digital-clock" id="display-${clock.id}">00:00:00</div>
        <div class="date-info">
            <div class="day" id="day-${clock.id}">Monday</div>
            <div class="full-date" id="date-${clock.id}">00 January 2026</div>
        </div>
        <div style="text-align: center; margin-top: 15px;">
            <button class="btn-remove" onclick="removeTimezone('${clock.id}')">Remove</button>
        </div>
    `;

    return card;
}

// Update all clocks
function updateAllClocks() {
    activeClocks.forEach(clock => {
        updateClock(clock);
    });
}

// Update single clock
function updateClock(clock) {
    try {
        // Get current time in the specified timezone
        const now = new Date();
        const options = {
            timeZone: clock.timezone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };

        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(now);

        let hour = '00', minute = '00', second = '00';
        let day = 'Monday', month = 'January', date = '01';

        parts.forEach(part => {
            switch(part.type) {
                case 'hour': hour = part.value; break;
                case 'minute': minute = part.value; break;
                case 'second': second = part.value; break;
                case 'weekday': day = part.value; break;
                case 'month': month = part.value; break;
                case 'day': date = part.value; break;
            }
        });

        // Update display
        const displayElement = document.getElementById(`display-${clock.id}`);
        if (displayElement) {
            displayElement.textContent = `${hour}${createColon()}${minute}${createColon()}${second}`;
        }

        const dayElement = document.getElementById(`day-${clock.id}`);
        if (dayElement) {
            dayElement.textContent = day;
        }

        const dateElement = document.getElementById(`date-${clock.id}`);
        if (dateElement) {
            dateElement.textContent = `${date} ${month} ${now.getFullYear()}`;
        }
    } catch (error) {
        console.error(`Error updating clock for ${clock.timezone}:`, error);
    }
}

// Create blinking colon
function createColon() {
    return '<span class="colon">:</span>';
}

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;

    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}