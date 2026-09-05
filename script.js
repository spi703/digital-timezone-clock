// List of common timezones with flags and info
const TIMEZONES = [
    { name: 'UTC', offset: 'UTC±0', flag: '🌍' },
    { name: 'Europe/London', offset: 'UTC±0', flag: '🇬🇧' },
    { name: 'Europe/Paris', offset: 'UTC+1', flag: '🇫🇷' },
    { name: 'Europe/Berlin', offset: 'UTC+1', flag: '🇩🇪' },
    { name: 'Europe/Moscow', offset: 'UTC+3', flag: '🇷🇺' },
    { name: 'Asia/Dubai', offset: 'UTC+4', flag: '🇦🇪' },
    { name: 'Asia/Kolkata', offset: 'UTC+5:30', flag: '🇮🇳' },
    { name: 'Asia/Bangkok', offset: 'UTC+7', flag: '🇹🇭' },
    { name: 'Asia/Hong_Kong', offset: 'UTC+8', flag: '🇭🇰' },
    { name: 'Asia/Shanghai', offset: 'UTC+8', flag: '🇨🇳' },
    { name: 'Asia/Tokyo', offset: 'UTC+9', flag: '🇯🇵' },
    { name: 'Asia/Seoul', offset: 'UTC+9', flag: '🇰🇷' },
    { name: 'Australia/Sydney', offset: 'UTC+10', flag: '🇦🇺' },
    { name: 'Pacific/Auckland', offset: 'UTC+12', flag: '🇳🇿' },
    { name: 'America/New_York', offset: 'UTC-5', flag: '🗽' },
    { name: 'America/Chicago', offset: 'UTC-6', flag: '🇺🇸' },
    { name: 'America/Denver', offset: 'UTC-7', flag: '🏔️' },
    { name: 'America/Los_Angeles', offset: 'UTC-8', flag: '☀️' },
    { name: 'America/Anchorage', offset: 'UTC-9', flag: '🐻' },
    { name: 'Pacific/Honolulu', offset: 'UTC-10', flag: '🏝️' },
    { name: 'America/Toronto', offset: 'UTC-5', flag: '🇨🇦' },
    { name: 'America/Mexico_City', offset: 'UTC-6', flag: '🇲🇽' },
    { name: 'America/Sao_Paulo', offset: 'UTC-3', flag: '🇧🇷' },
    { name: 'America/Buenos_Aires', offset: 'UTC-3', flag: '🇦🇷' },
    { name: 'Africa/Cairo', offset: 'UTC+2', flag: '🇪🇬' },
    { name: 'Africa/Johannesburg', offset: 'UTC+2', flag: '🇿🇦' },
    { name: 'Asia/Jakarta', offset: 'UTC+7', flag: '🇮🇩' },
    { name: 'Asia/Singapore', offset: 'UTC+8', flag: '🇸🇬' },
    { name: 'Asia/Manila', offset: 'UTC+8', flag: '🇵🇭' },
    { name: 'Australia/Melbourne', offset: 'UTC+10', flag: '🦘' },
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
        option.textContent = `${tz.flag} ${tz.name} (${tz.offset})`;
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
    const clockId = `clock-${Date.now()}-${Math.random()}`;
    activeClocks.push({
        id: clockId,
        timezone: timezoneName
    });

    renderClocks();
    showAlert(`${timezoneName.replace(/_/g, ' ')} added successfully! ✓`, 'success');
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
    const clockCount = document.getElementById('clockCount');

    grid.innerHTML = '';
    clockCount.textContent = activeClocks.length;

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
    const flag = timezone ? timezone.flag : '🌍';

    card.innerHTML = `
        <div class="clock-header">
            <div class="timezone-info">
                <div class="timezone-name">
                    <i class="fas fa-map-marker-alt"></i>
                    ${flag} ${clock.timezone.replace(/_/g, ' ')}
                </div>
                <div class="timezone-offset">${offset}</div>
            </div>
        </div>
        <div class="digital-clock" id="display-${clock.id}">00<span class="colon">:</span>00<span class="colon">:</span>00</div>
        <div class="date-info">
            <div class="day" id="day-${clock.id}">Monday</div>
            <div class="full-date" id="date-${clock.id}">00 January 2026</div>
        </div>
        <div style="text-align: right; margin-top: 15px;">
            <button class="btn-remove" onclick="removeTimezone('${clock.id}')">
                <i class="fas fa-trash-alt"></i> Remove
            </button>
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

        // Update display with HTML to preserve colon animation
        const displayElement = document.getElementById(`display-${clock.id}`);
        if (displayElement) {
            displayElement.innerHTML = `${hour}<span class="colon">:</span>${minute}<span class="colon">:</span>${second}`;
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

// Show alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    alertDiv.innerHTML = `<i class="${icon}"></i><span>${message}</span>`;

    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alertDiv, mainContent.firstChild);

    // Remove alert after 3 seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0';
        alertDiv.style.transition = 'opacity 0.3s ease';
        setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
}