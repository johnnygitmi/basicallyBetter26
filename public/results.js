const API_BASE = '/api';

async function loadRankings() {
    showLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_BASE}/get-results?limit=50`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load rankings');
        }

        displayRankings(data.rankings);
        showLoading(false);

    } catch (error) {
        console.error('Error loading rankings:', error);
        showError('Failed to load rankings. Please refresh the page.');
        showLoading(false);
    }
}

function displayRankings(rankings) {
    const container = document.getElementById('rankings');
    container.innerHTML = '';

    if (rankings.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">No votes yet. Be the first to vote!</p>';
        container.classList.remove('hidden');
        return;
    }

    rankings.forEach((item, index) => {
        const rank = index + 1;
        const card = document.createElement('div');
        card.className = 'ranking-card';

        let badgeClass = '';
        if (rank === 1) badgeClass = 'gold';
        else if (rank === 2) badgeClass = 'silver';
        else if (rank === 3) badgeClass = 'bronze';

        card.innerHTML = `
            <div class="rank-badge ${badgeClass}">${rank}</div>
            <img src="${item.url}" alt="${item.name}" class="ranking-image">
            <div class="ranking-name">${item.name}</div>
            <div class="ranking-stats">
                <div class="stat-row">
                    <span>Wins:</span>
                    <strong>${item.wins || 0}</strong>
                </div>
                <div class="stat-row">
                    <span>Total Votes:</span>
                    <strong>${item.total_votes || 0}</strong>
                </div>
                <div class="stat-row">
                    <span>Win Rate:</span>
                    <strong>${item.win_rate || 0}%</strong>
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    container.classList.remove('hidden');
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

// Load rankings on page load
loadRankings();
