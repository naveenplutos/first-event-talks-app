document.addEventListener('DOMContentLoaded', () => {
    const scheduleContainer = document.getElementById('scheduleContainer');
    const categorySearch = document.getElementById('categorySearch');
    let allTalks = [];

    // Fetch talks from the API
    fetch('/api/talks')
        .then(response => response.json())
        .then(data => {
            allTalks = data;
            renderSchedule(allTalks);
        })
        .catch(error => {
            console.error('Error loading schedule:', error);
            scheduleContainer.innerHTML = '<div class="alert alert-danger">Failed to load the event schedule. Please try again later.</div>';
        });

    // Real-time search/filter
    categorySearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTalks = allTalks.filter(talk => {
            if (talk.id === 'lunch') return true; // Always show lunch break
            return talk.categories.some(cat => cat.toLowerCase().includes(searchTerm));
        });
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talks) {
        if (talks.length === 0) {
            scheduleContainer.innerHTML = '<div class="text-center py-5"><p class="text-muted">No talks found matching that category.</p></div>';
            return;
        }

        scheduleContainer.innerHTML = '';
        
        talks.forEach((talk, index) => {
            const card = document.createElement('div');
            card.className = `talk-card ${talk.id === 'lunch' ? 'lunch-break' : ''}`;
            
            const categoriesHtml = talk.categories
                .map(cat => `<span class="category-badge">${cat}</span>`)
                .join('');

            const speakersHtml = talk.speakers.length > 0 
                ? `<div class="speaker-name">By ${talk.speakers.join(' & ')}</div>` 
                : '';

            card.innerHTML = `
                <div class="time-badge">${talk.startTime} - ${talk.endTime}</div>
                <h3 class="h5 mb-1">${talk.title}</h3>
                ${speakersHtml}
                <p class="mb-3 text-secondary small">${talk.description}</p>
                <div class="categories mt-auto">
                    ${categoriesHtml}
                </div>
            `;

            scheduleContainer.appendChild(card);

            // Add transition marker between talks (except after the last one)
            if (index < talks.length - 1 && talk.id !== 'lunch' && talks[index+1].id !== 'lunch') {
                const transition = document.createElement('div');
                transition.className = 'transition-marker';
                transition.textContent = '10 min transition';
                scheduleContainer.appendChild(transition);
            }
        });
    }
});
