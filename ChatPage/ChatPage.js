document.addEventListener("DOMContentLoaded", () => {
    const chatMessages = document.getElementById("chatMessages");
    const userInput = document.getElementById("userInput");
    const sendButton = document.getElementById("sendButton");
    const hintButtons = document.querySelectorAll(".question-hint");
    const API_URL = "http://localhost:5000/api/chat/message";

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
                "📄 Для поступления обычно нужны: паспорт, СНИЛС, аттестат/диплом, результаты ЕГЭ, заявление (заполняется в вузе) и 2-4 фотографии 3x4. Точный список лучше уточнить на сайте конкретного вуза.",
            sources: [
                { title: "Правила приема УрФУ", url: "https://urfu.ru/" }
            ]
        },
        terms: {
            answer: `
        <p>📅 Приемная кампания обычно стартует 20 июня. Основные этапы:</p>
        <ul>
            <li>20 июня — начало приема документов</li>
            <li>25 июля — завершение приема от поступающих по ЕГЭ</li>
            <li>3-9 августа — издание приказов о зачислении</li>
        </ul>`,
            sources: [
                { title: "Информация для абитуриентов", url: "https://urfu.ru/" }
            ]
        },

        scores: {
            answer: `
        <p>📊 Минимальные баллы ЕГЭ для поступления в вузы в 2026 году:</p>
        <ul>
            <li>русский язык — 40</li>
            <li>математика профиль — 40</li>
            <li>физика — 41</li>
            <li>информатика — 46</li>
            <li>история, литература, география, биология, химия, иностранные языки — 40</li>
            <li>обществознание — 45</li>
        </ul>
        <p>💡 Для бюджета в топ-вузах баллы намного выше.</p>`,
            sources: [
                { title: "Правила приема УрФУ", url: "https://urfu.ru/" }
            ]
        },

        choose: {
            answer: `
        <p>🏛 При выборе вуза советую обратить внимание на:</p>
        <ol>
            <li>аккредитацию вуза</li>
            <li>проходные баллы прошлых лет</li>
            <li>отзывы студентов</li>
            <li>наличие бюджетных мест</li>
            <li>расположение и инфраструктуру</li>
        </ol>`,
            sources: [
                { title: "Образовательные программы УрФУ", url: "https://urfu.ru/" }
            ]
        },

        benefits: {
            answer: `
        <p>🎓 Льготы при поступлении есть у:</p>
        <ul>
            <li>олимпиадников (БВИ)</li>
            <li>инвалидов I и II групп</li>
            <li>детей-сирот</li>
            <li>ветеранов боевых действий</li>
        </ul>
        <p>Также есть квота для детей участников СВО.</p>`,
            sources: [
                { title: "Правила приема УрФУ", url: "https://urfu.ru/" }
            ]
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

    function addAiMessage(text, sources = []) {
        const wrapper = document.createElement("div");
        wrapper.className = "message-wrapper ai";

        const avatar = document.createElement("div");
        avatar.className = "ai-avatar-message";
        avatar.innerHTML = `<img src="ai-avatar.png" alt="AI">`;

        const bubble = document.createElement("div");
        bubble.className = "message-bubble ai-bubble";
        bubble.innerHTML = text;

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        chatMessages.appendChild(wrapper);

        if (sources.length > 0) {
            const sourcesWrapper = document.createElement("div");
            sourcesWrapper.className = "message-wrapper ai";

            const spacer = document.createElement("div");
            spacer.className = "ai-avatar-message";
            spacer.style.visibility = "hidden";

            const sourcesBubble = document.createElement("div");
            sourcesBubble.className = "message-bubble ai-bubble";

            const title = document.createElement("div");
            title.style.fontWeight = "600";
            title.style.marginBottom = "8px";
            title.textContent = "Источники:";
            sourcesBubble.appendChild(title);

            sources.forEach(source => {
                const link = document.createElement("a");
                link.href = source.url;
                link.textContent = source.title || source.url;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.style.display = "block";
                link.style.marginBottom = "6px";
                sourcesBubble.appendChild(link);
            });

            sourcesWrapper.appendChild(spacer);
            sourcesWrapper.appendChild(sourcesBubble);
            chatMessages.appendChild(sourcesWrapper);
        }

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
                addAiMessage(prepared.answer, prepared.sources || []);
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
                body: JSON.stringify({ message: message })
            });

            const data = await response.json();
            removeTypingIndicator();

            if (!response.ok) {
                addAiMessage("Ошибка сервера. Попробуйте позже.");
                console.error("Chat API error:", data);

                return;
            }

            addAiMessage(data.answer || "Нет ответа", data.sources || []);
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
});