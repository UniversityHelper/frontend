window.addEventListener("load", () => {
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