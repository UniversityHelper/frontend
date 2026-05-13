window.addEventListener("load", () => {
    if (!localStorage.getItem('user_tracked')) {
        fetch(`${window.API_CONFIG.API_URL}/api/analytics/track-user`, {
            method: "POST"
        }).then(res => {
            if (res.ok) {
                localStorage.setItem('user_tracked', 'true');
            }
        });
    }

    fetch(`${window.API_CONFIG.API_URL}/api/analytics/impression`, {
        method: "POST"
    })
        .catch(err => console.error("Impression error:", err));
});

const button = document.getElementById("chatBtn");

button.addEventListener("click", function(e) {
    let circle = document.createElement("span");
    let diameter = Math.max(button.clientWidth, button.clientHeight);
    let radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
  
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
});

const chatButton = document.getElementById("chatBtn");

if (chatButton) {
    chatButton.addEventListener("click", async (e) => {
        e.preventDefault(); // block the transition

        try {
            await fetch(`${window.API_CONFIG.API_URL}/api/analytics/click`, {
                method: "POST"
            });
        } catch (error) {
            console.error("Click error:", error);
        }

        window.location.href = "../ChatPage/ChatPage.html";
    })
}


/* модальный окошки для вузов */
const previewCards = document.querySelectorAll('.university-preview-card');
const universityOverlay = document.getElementById('universityOverlay');
const universityModals = document.querySelectorAll('.university-modal');
const closeButtons = document.querySelectorAll('.modal-close-btn');

previewCards.forEach(card => {

    card.addEventListener('click', () => {

        const modalId = card.dataset.modal;
        const currentModal = document.getElementById(modalId);

        universityOverlay.classList.add('active');
        currentModal.classList.add('active');

        document.body.style.overflow = 'hidden';
    });

});

closeButtons.forEach(button => {

    button.addEventListener('click', closeUniversityModal);

});

universityOverlay.addEventListener('click', (e) => {

    if (e.target === universityOverlay) {
        closeUniversityModal();
    }

});

function closeUniversityModal() {

    universityOverlay.classList.remove('active');

    universityModals.forEach(modal => {
        modal.classList.remove('active');
    });

    document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {

    if (e.key === 'Escape') {
        closeUniversityModal();
    }

});
