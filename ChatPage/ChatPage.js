document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const hintButtons = document.querySelectorAll(".question-hint");
    const API_URL = `${window.API_CONFIG.API_URL}/api/chat/message`;
    userInput.addEventListener('input', function () {
        if (/\S/.test(this.value)) {
            sendButton.classList.add('active');
        } else {
            sendButton.classList.remove('active');
        }
    });

    function getCookie(name) {
        const matches = document.cookie.match(
            new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[]\\\/+^])/g, '\\$1') + "=([^;]*)")
        );
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function setCookie(name, value, days = 365) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

        document.cookie = `${name}=${value}; path=/; expires=${date.toUTCString()}`;
    }

    function trackUserIfNeeded() {
        const existingUser = getCookie("unihelper_user");

        if (!existingUser) {
            fetch("http://unihelper-backend-2xlp1d-c53fb4-81-26-177-175.traefik.me/api/analytics/track-user", {
                method: "POST"
            })
            .catch(err => console.warn("Ошибка трекинга:", err));

            setCookie("unihelper_user", "1");
        }
    }

    function getSessionId() {
        let sessionId = localStorage.getItem("session_id");

        if (!sessionId) {
            sessionId = crypto.randomUUID(); // создаем уникальный id
            localStorage.setItem("session_id", sessionId);
        }

        return sessionId;
    }

    trackUserIfNeeded();

    const questionToKey = {
        "Какие документы нужны?": "documents",
        "Сроки подачи заявлений": "terms",
        "Минимальные баллы ЕГЭ": "scores",
        "Как выбрать вуз?": "choose",
        "Льготы при поступлении": "benefits"
    };

    const preparedAnswers = {
        documents: {
            answer:
                "Для поступления обычно нужны: паспорт, СНИЛС, аттестат/диплом, результаты ЕГЭ, заявление (заполняется в вузе) и 2-4 фотографии 3x4. Точный список лучше уточнить на сайте конкретного вуза."
        },
        terms: {
            answer: `
        <p>Приемная кампания обычно стартует 20 июня. Основные этапы:</p>
        <ul>
            <li>20 июня — начало приема документов</li>
            <li>25 июля — завершение приема от поступающих по ЕГЭ</li>
            <li>3-9 августа — издание приказов о зачислении</li>
        </ul>`,
        },

        scores: {
            answer: `
        <p>Минимальные баллы ЕГЭ для поступления в вузы в 2026 году:</p>
        <ul>
            <li>русский язык — 40</li>
            <li>математика профиль — 40</li>
            <li>физика — 41</li>
            <li>информатика — 46</li>
            <li>история, литература, география, биология, химия, иностранные языки — 40</li>
            <li>обществознание — 45</li>
        </ul>
        <p>Для бюджета в топ-вузах баллы намного выше.</p>`,
        },

        choose: {
            answer: `
        <p>При выборе вуза советую обратить внимание на:</p>
        <ol>
            <li>аккредитацию вуза</li>
            <li>проходные баллы прошлых лет</li>
            <li>отзывы студентов</li>
            <li>наличие бюджетных мест</li>
            <li>расположение и инфраструктуру</li>
        </ol>`,
        },

        benefits: {
            answer: `
        <p>Льготы при поступлении есть у:</p>
        <ul>
            <li>олимпиадников (БВИ)</li>
            <li>инвалидов I и II групп</li>
            <li>детей-сирот</li>
            <li>ветеранов боевых действий</li>
        </ul>
        <p>Также есть квота для детей участников СВО.</p>`,
        }
    };

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function addUserMessage(text) {
        const wrapper = document.createElement("div");
        wrapper.className = "message-wrapper user";
        const bubble = document.createElement("div");
        bubble.className = "message-bubble user-bubble";
        bubble.innerText = text;

        wrapper.appendChild(bubble);
        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    function addAiMessage(text, modelResponse) {
        const wrapper = document.createElement("div");
        wrapper.className = "message-wrapper ai";
        wrapper.dataset.response = modelResponse;

        const avatar = document.createElement("div");
        avatar.className = "ai-avatar-message";
        avatar.innerHTML = `<img src="ai-avatar.png" alt="AI">`;

        // контейнер плашки для оценки
        const content = document.createElement("div");
        content.className = "content";

        const bubble = document.createElement("div");
        bubble.className = "message-bubble ai-bubble";
        bubble.innerHTML = text;

        // кнопки оценки для метрики
        const rating = document.createElement("div");
        rating.className = "rating";
        rating.innerHTML = `
            <button class="rate-btn like" title="Хороший ответ">
                <svg viewBox="0 0 24 24">
                    <path d="M1 21h4V9H1v12zm6 0h12c1 0 2-.8 2-2l-1-7c0-1-.8-2-2-2h-6l1-5c0-1-1-2-2-2l-5 7v11z"/>
                </svg>
            </button>

            <button class="rate-btn dislike" title="Плохой ответ">
                <svg viewBox="0 0 24 24">
                    <path d="M23 3h-4v12h4V3zM17 3H5c-1 0-2 .8-2 2l1 7c0 1 .8 2 2 2h6l-1 5c0 1 1 2 2 2l5-7V5c0-1-1-2-2-2z"/>
                </svg>
            </button>
        `; 

        rating.dataset.rated = "false";
        rating.addEventListener("click", (e) => {
            if (rating.dataset.rated === "true") return;
            const btn = e.target.closest(".rate-btn");
            if (!btn) return;
            const isLike = btn.classList.contains("like");
            rating.dataset.rated = "true";
            const messageWrapper = btn.closest(".message-wrapper");
            const response = messageWrapper?.dataset?.response || "";

            rating.querySelectorAll(".rate-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const url = isLike 
                ? 'http://unihelper-backend-2xlp1d-c53fb4-81-26-177-175.traefik.me/api/analytics/like'
                : 'http://unihelper-backend-2xlp1d-c53fb4-81-26-177-175.traefik.me/api/analytics/dislike';
    
            fetch(url, { method: 'POST' })
            .then(response => {
                if (!response.ok) {
                    console.warn(`Ошибка отправки ${isLike ? 'лайка' : 'дизлайка'}:`, response.status);
                } else {
                    console.log(`${isLike ? 'Лайк' : 'Дизлайк'} отправлен`);
                }
            })
            .catch(err => console.warn('Сетевая ошибка при отправке оценки:', err));

            setTimeout(() => {
                rating.querySelectorAll(".rate-btn").forEach(b => {
                b.remove(); // убираем кнопки
                });

                const feedbackBtn = document.createElement("button");
                feedbackBtn.className = "feedback-trigger";
                feedbackBtn.textContent = "Форма обратной связи";

                feedbackBtn.addEventListener("click", () => {
                    createFeedbackModal(isLike ? "like" : "dislike", response);
                });

            rating.appendChild(feedbackBtn);
            }, 800);


            // по умолчанию снимаем активность у обеих кнопок
            rating.querySelectorAll(".rate-btn").forEach(b => {
            b.classList.remove("active");
            });

            // добавляем активную только ту, которую выбрали
            btn.classList.add("active");

            console.log(isLike ? "Лайк" : "Дизлайк");


            //диалоговое окно фитбека
        
            // показываем кнопку с формой обратной связи
            /* let existingFeedbackBtn = rating.querySelector(".feedback-trigger");

            if (!existingFeedbackBtn) {
                const feedbackBtn = document.createElement("button");
                feedbackBtn.className = "feedback-trigger";
                feedbackBtn.textContent = "Форма обратной связи";

                feedbackBtn.addEventListener("click", () => {
                    createFeedbackModal(isLike ? "like" : "dislike");
                });

                rating.appendChild(feedbackBtn);
            }*/
        });
        

        content.appendChild(bubble);
        content.appendChild(rating);

        wrapper.appendChild(avatar);
        wrapper.appendChild(content);
        chatMessages.appendChild(wrapper);

        scrollToBottom();
    }

    function addTypingIndicator() {
        const wrapper = document.createElement("div");
        wrapper.className = "message-wrapper ai";
        wrapper.id = "typingWrapper";

        const avatar = document.createElement("div");
        avatar.className = "ai-avatar-message";
        avatar.innerHTML = `<img src="ai-avatar.png" alt="AI">`;

        const indicator = document.createElement("div");
        indicator.className = "typing-indicator";
        indicator.innerHTML = "<span></span><span></span><span></span>";

        wrapper.appendChild(avatar);
        wrapper.appendChild(indicator);

        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById("typingWrapper");
        if (typing) {
            typing.remove();
        }
    }

    function getPreparedAnswer(message) {
        const trimmed = message.trim();

        if (questionToKey[trimmed]) {
            const key = questionToKey[trimmed];
            return preparedAnswers[key] || null;
        }

        return null;
    }

    function shouldUseModel(message) {
        const normalized = message.toLowerCase();
        const specificMarkers = [
            "09.",
            "бакалавр",
            "бакалавриат",
            "магистрат",
            "магистратура",
            "очно",
            "заочно",
            "очно-заочно",
            "прикладная информатика",
            "информатика и вычислительная техника",
            "программная инженерия",
            "урфу",
            "бюджет",
            "мест",
            "какие экзамены",
            "какие вступительные"
        ];

        return specificMarkers.some(marker => normalized.includes(marker));
    }

    async function sendMessage(customMessage = null) {
        const message = customMessage || userInput.value.trim();
        if (!message) {
            return;
        }

        addUserMessage(message);
        if (!customMessage) {
            userInput.value = "";
        }

        sendButton.disabled = true;
        const prepared = getPreparedAnswer(message);

        if (prepared && !shouldUseModel(message)) {
            addTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addAiMessage(prepared.answer);
                sendButton.disabled = false;
                userInput.focus();
            }, 500);


            return;
        }

        addTypingIndicator();
        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    message: message,
                    sessionId: getSessionId() 
                })
            });

            const data = await response.json();
            console.log(data);
            removeTypingIndicator();

            if (!response.ok) {
                addAiMessage("Ошибка сервера. Попробуйте позже.");
                console.error("Chat API error:", data);

                return;
            }

            addAiMessage(data.answer || "Нет ответа", data.answer);
        } catch (error) {
            removeTypingIndicator();
            addAiMessage("Не удалось подключиться к серверу.");
            console.error("Fetch error:", error);
        } finally {
            sendButton.disabled = false;
            userInput.focus();
        }
    }

    sendButton.addEventListener("click", () => {
        sendMessage();
    });

    userInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    hintButtons.forEach(button => {
        button.addEventListener("click", () => {
            const question = button.textContent.trim();
            sendMessage(question);
        });
    });


    function createFeedbackModal(type, modelResponse) {
        const isLike = type === "like";

        const modal = document.createElement("div");
        modal.className = "feedback-modal";

        const card = document.createElement("div");
        card.className = `feedback-card ${isLike ? "like" : "dislike"}`;

        // avatar
        const avatar = document.createElement("img");
        avatar.src = "ai-avatar.png";
        avatar.className = "feedback-avatar";

        const title = document.createElement("div");
        title.className = "feedback-title";
        title.textContent = "Спасибо за оценку!";

        const textarea = document.createElement("textarea");
        textarea.className = "feedback-input";
        textarea.placeholder = "При желании здесь можно оставить комментарий";

        const footer = document.createElement("div");
        footer.className = "feedback-footer";

        const footerText = document.createElement("span");
        footerText.textContent = "UniHelper AI - твой помощник";

        const button = document.createElement("button");
        button.className = `feedback-btn ${isLike ? "like-btn" : "dislike-btn"}`;
        button.textContent = "Отправить";

        // сборка
        footer.appendChild(footerText);
        footer.appendChild(button);

        card.appendChild(avatar);
        card.appendChild(title);
        card.appendChild(textarea);
        card.appendChild(footer);

        modal.appendChild(card);

        document.body.appendChild(modal);

        // закрытие по клику вне формы
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // отправка
        button.addEventListener("click", async () => {
            const text = textarea.value;
            modal.remove();

            const modelResponseToSend = modelResponse;
            console.log("Отправляем:", {
                type: type,
                text: text,
                modelResponse: modelResponseToSend
            });

            try {
                await fetch("https://script.google.com/macros/s/AKfycbxNCftSIVjDEdCZirkQb6zUMoOn5HoWICh9kAkKSiHchLi3u1e4i1VjP2OSUvxXupqJ/exec", {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        type: type,
                        text: text,
                        modelResponse: modelResponseToSend
                    })
                });

                console.log("Фидбек отправлен");

            } catch (err) {
                console.error("Ошибка отправки:", err);
            }

            modal.remove();
        });
    }
});
