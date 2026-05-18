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
        e.preventDefault();

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

        // Navigate after analytics
        window.location.href = button.href;
    });
});
