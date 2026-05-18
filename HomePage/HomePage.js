window.addEventListener("load", () => {
    // Analytics: track user once
    if (!localStorage.getItem('user_tracked')) {
        fetch(`${window.API_CONFIG.API_URL}/api/analytics/track-user`, {
            method: "POST"
        }).then(res => {
            if (res.ok) {
                localStorage.setItem('user_tracked', 'true');
            }
        });
    }

    // Analytics: track impression
    fetch(`${window.API_CONFIG.API_URL}/api/analytics/impression`, {
        method: "POST"
    }).catch(err => console.error("Impression error:", err));
});

// Ripple effect and Analytics for all buttons
const buttons = document.querySelectorAll(".chat-button");

buttons.forEach(button => {
    button.addEventListener("click", async (e) => {
        const isExternal = button.href.startsWith('http');
        if (!isExternal) {
            e.preventDefault();
        }

        // Ripple effect logic
        let circle = document.createElement("span");
        let diameter = Math.max(button.clientWidth, button.clientHeight);
        let radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
        circle.classList.add("ripple");

        const existingRipple = button.querySelector(".ripple");
        if (existingRipple) {
            existingRipple.remove();
        }

        button.appendChild(circle);

        // Analytics: track click
        try {
            await fetch(`${window.API_CONFIG.API_URL}/api/analytics/click`, {
                method: "POST"
            });
        } catch (error) {
            console.error("Click error:", error);
        }

        // Navigate after analytics for internal links
        if (!isExternal) {
            window.location.href = button.href;
        }
    });
});

/* модальный окошки для вузов */
const previewCards = document.querySelectorAll('.university-preview-card');
const universityOverlay = document.getElementById('universityOverlay');
const universityModals = document.querySelectorAll('.university-modal');
const closeButtons = document.querySelectorAll('.modal-close-btn');

if (previewCards.length > 0) {
    previewCards.forEach(card => {
        card.addEventListener('click', () => {
            const modalId = card.dataset.modal;
            const currentModal = document.getElementById(modalId);

            if (universityOverlay && currentModal) {
                universityOverlay.classList.add('active');
                currentModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
}

if (closeButtons.length > 0) {
    closeButtons.forEach(button => {
        button.addEventListener('click', closeUniversityModal);
    });
}

if (universityOverlay) {
    universityOverlay.addEventListener('click', (e) => {
        if (e.target === universityOverlay) {
            closeUniversityModal();
        }
    });
}

function closeUniversityModal() {
    if (universityOverlay) {
        universityOverlay.classList.remove('active');
        universityModals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = '';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeUniversityModal();
    }
});

/* настройки темной темы - смена картинок*/
const themeImages = document.querySelectorAll('.theme-image');
function updateThemeImages() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    themeImages.forEach(img => {
        img.src = isDark
            ? img.dataset.dark
            : img.dataset.light;
    });
}

if (themeImages.length > 0) {
    updateThemeImages();
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', updateThemeImages);
}
