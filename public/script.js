const API_BASE = '/api';
let currentPair = null;
let voteCount = 0;

async function loadNextPair() {
    showLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_BASE}/get-next-pair`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to load images');
        }

        currentPair = data;
        displayPair(data.imageA, data.imageB);
        showLoading(false);
        document.getElementById('vote-area').classList.remove('hidden');

    } catch (error) {
        console.error('Error loading pair:', error);
        showError('Failed to load images. Please refresh the page.');
        showLoading(false);
    }
}

function displayPair(imageA, imageB) {
    document.getElementById('image-a').src = imageA.url;
    document.getElementById('image-a').alt = imageA.name;
    document.getElementById('label-a').textContent = imageA.name;

    document.getElementById('image-b').src = imageB.url;
    document.getElementById('image-b').alt = imageB.name;
    document.getElementById('label-b').textContent = imageB.name;
}

async function submitVote(winnerId) {
    if (!currentPair) return;

    const voteData = {
        imageAId: currentPair.imageA.id,
        imageBId: currentPair.imageB.id,
        winnerId: winnerId
    };

    try {
        const response = await fetch(`${API_BASE}/submit-vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(voteData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to submit vote');
        }

        // Show success animation
        showVoteSuccess();

        // Increment vote count
        voteCount++;
        document.getElementById('vote-count').textContent = voteCount;

        // Load next pair after short delay
        setTimeout(() => {
            hideVoteSuccess();
            loadNextPair();
        }, 1000);

    } catch (error) {
        console.error('Error submitting vote:', error);
        showError('Failed to submit vote. Please try again.');
    }
}

function showLoading(show) {
    document.getElementById('loading').classList.toggle('hidden', !show);
}

function showVoteSuccess() {
    document.getElementById('vote-area').classList.add('hidden');
    document.getElementById('vote-success').classList.remove('hidden');
}

function hideVoteSuccess() {
    document.getElementById('vote-success').classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function hideError() {
    document.getElementById('error').classList.add('hidden');
}

// Event listeners
document.getElementById('vote-a').addEventListener('click', () => {
    if (currentPair) {
        submitVote(currentPair.imageA.id);
    }
});

document.getElementById('vote-b').addEventListener('click', () => {
    if (currentPair) {
        submitVote(currentPair.imageB.id);
    }
});

// Load first pair on page load
loadNextPair();
