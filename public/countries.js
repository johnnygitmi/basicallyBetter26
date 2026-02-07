const API_BASE = '/api';

// Country code to name mapping (simplified - you can expand this)
const COUNTRY_NAMES = {
    'US': 'United States',
    'GB': 'United Kingdom',
    'CA': 'Canada',
    'AU': 'Australia',
    'DE': 'Germany',
    'FR': 'France',
    'ES': 'Spain',
    'IT': 'Italy',
    'JP': 'Japan',
    'CN': 'China',
    'IN': 'India',
    'BR': 'Brazil',
    'MX': 'Mexico',
    'NL': 'Netherlands',
    'SE': 'Sweden',
    'NO': 'Norway',
    'DK': 'Denmark',
    'FI': 'Finland',
    'PL': 'Poland',
    'BE': 'Belgium',
    'AT': 'Austria',
    'CH': 'Switzerland',
    'IE': 'Ireland',
    'NZ': 'New Zealand',
    'SG': 'Singapore',
    'HK': 'Hong Kong',
    'KR': 'South Korea',
    'XX': 'Unknown'
};

async function loadCountryStats() {
    showLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_BASE}/get-country-stats`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load country stats');
        }

        displayCountryStats(data.countries);
        showLoading(false);

    } catch (error) {
        console.error('Error loading country stats:', error);
        showError('Failed to load country data. Please refresh the page.');
        showLoading(false);
    }
}

function displayCountryStats(countries) {
    const container = document.getElementById('country-stats');
    container.innerHTML = '';

    if (countries.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No votes yet.</p>';
        container.classList.remove('hidden');
        return;
    }

    const maxVotes = Math.max(...countries.map(c => c.votes));

    countries.forEach(country => {
        const countryName = COUNTRY_NAMES[country.country] || country.country;
        const percentage = (country.votes / maxVotes) * 100;

        const bar = document.createElement('div');
        bar.className = 'country-bar';

        bar.innerHTML = `
            <div class="country-flag">${getCountryFlag(country.country)}</div>
            <div class="country-info">
                <div class="country-name">${countryName}</div>
                <div class="country-progress">
                    <div class="country-progress-bar" style="width: ${percentage}%">
                        ${country.votes} votes
                    </div>
                </div>
            </div>
        `;

        container.appendChild(bar);
    });

    container.classList.remove('hidden');
}

function getCountryFlag(countryCode) {
    if (countryCode === 'XX') return '🌐';
    
    // Convert country code to flag emoji
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    return String.fromCodePoint(...codePoints);
}

function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

// Load stats on page load
loadCountryStats();
