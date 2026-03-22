document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded");
    
    (function() {
        const answersDB = {
            documents: "📄 Для поступления обычно нужны: паспорт, СНИЛС, аттестат/диплом, результаты ЕГЭ, заявление (заполняется в вузе) и 2-4 фотографии 3x4. Точный список лучше уточнить на сайте конкретного вуза.",
            
            terms: "📅 Приемная кампания обычно стартует 20 июня. Основные этапы:<br>• 20 июня — начало приема документов<br>• 25 июля — завершение приема от поступающих по ЕГЭ<br>• 3–9 августа — издание приказов о зачислении.",
            
            scores: "📊 Минимальные баллы ЕГЭ для поступления в вузы в 2026 году (утверждены приказом Минобрнауки от 14.11.2025 №881):<br><br>• русский язык — 40<br>• математика профиль — 40<br>• физика — 41<br>• информатика — 46<br>• история, литература, география, биология, химия, иностранные языки — 40<br>• обществознание — 45<br><br>💡 Для бюджета в топ-вузах баллы намного выше!",
            
            choose: "🏛 Рекомендую обратить внимание на:<br>1) аккредитацию вуза<br>2) проходные баллы прошлых лет<br>3) отзывы студентов<br>4) наличие бюджетных мест<br>5) расположение и инфраструктуру.",
            
            benefits: "🎓 Льготы при поступлении есть у:<br>• олимпиадников (БВИ)<br>• инвалидов I и II групп<br>• детей-сирот<br>• ветеранов боевых действий<br><br>Также есть квота для детей участников СВО.",
            
            default: "Спасибо за вопрос! К сожалению, сейчас я не могу дать на него ответ."
        };

        const questionToKey = {
            "Какие документы нужны?": "documents",
            "Сроки подачи заявлений": "terms",
            "Минимальные баллы ЕГЭ": "scores",
            "Как выбрать вуз?": "choose",
            "Льготы при поступлении": "benefits"
        };

        const quickRepliesList = [
            "Какие документы нужны?",
            "Сроки подачи заявлений",
            "Минимальные баллы ЕГЭ",
            "Как выбрать вуз?",
            "Льготы при поступлении"
        ];

        const messagesContainer = document.getElementById('chatMessages');
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');

        function createMessageElement(text, sender) {
            const wrapper = document.createElement('div');
            wrapper.className = `message-wrapper ${sender}`;

            if (sender === 'ai') {
                const avatar = document.createElement('div');
                avatar.className = 'ai-avatar-message';
                avatar.innerHTML = '<img src="ai-avatar.png" alt="AI">';
                wrapper.appendChild(avatar);
            }

            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            
            if (text.includes('<br>') || text.includes('<br/>')) {
                bubble.innerHTML = text; 
            } else {
                bubble.textContent = text; 
            }
            
            wrapper.appendChild(bubble);

            return wrapper;
        }

        function createTypingIndicator() {
            const wrapper = document.createElement('div');
            wrapper.className = 'message-wrapper ai';
            wrapper.id = 'typingIndicator';

            const avatar = document.createElement('div');
            avatar.className = 'ai-avatar-message';
            avatar.innerHTML = '<img src="ai-avatar.png" alt="AI">';
            wrapper.appendChild(avatar);

            const indicator = document.createElement('div');
            indicator.className = 'typing-indicator';
            indicator.innerHTML = '<span></span><span></span><span></span>';
            wrapper.appendChild(indicator);

            return wrapper;
        }

        function appendMessage(text, sender) {
            const msg = createMessageElement(text, sender);
            messagesContainer.appendChild(msg);
            scrollToBottom();
        }

        function scrollToBottom() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function removeTypingIndicator() {
            const typing = document.getElementById('typingIndicator');
            if (typing) typing.remove();
        }

        function replyWithKey(key) {
            const answer = answersDB[key] || answersDB.default;
            appendMessage(answer, 'ai');
        }

        function handleChipClick(questionText) {
            appendMessage(questionText, 'user');
            
            const typing = createTypingIndicator();
            messagesContainer.appendChild(typing);
            scrollToBottom();

            const key = questionToKey[questionText] || 'default';
            setTimeout(() => {
                removeTypingIndicator();
                replyWithKey(key);
            }, 1300);
        }

        function handleUserMessage(message) {
            if (!message.trim()) return;
            
            appendMessage(message, 'user');
            userInput.value = '';

            const typing = createTypingIndicator();
            messagesContainer.appendChild(typing);
            scrollToBottom();

            setTimeout(() => {
                removeTypingIndicator();
                appendMessage(answersDB.default, 'ai');
            }, 1400);
        }

        function buildInitialChat() {
            messagesContainer.innerHTML = '';

            // Приветственное сообщение
            const welcomeWrapper = document.createElement('div');
            welcomeWrapper.className = 'message-wrapper ai';

            const avatar = document.createElement('div');
            avatar.className = 'ai-avatar-message';
            avatar.innerHTML = '<img src="ai-avatar.png" alt="AI">';
            welcomeWrapper.appendChild(avatar);

            const bubble = document.createElement('div');
            bubble.className = 'message-bubble';
            bubble.textContent = 'Привет! Я AI-помощник UniHelper. Работаю с официальными документами вузов и знаю всё о поступлении! Напиши свой вопрос или выбери из предложенных';
            welcomeWrapper.appendChild(bubble);
            messagesContainer.appendChild(welcomeWrapper);

            // Чипсы
            const quickDiv = document.createElement('div');
            quickDiv.className = 'quick-replies';
            quickRepliesList.forEach(q => {
                const chip = document.createElement('span');
                chip.className = 'quick-chip';
                chip.textContent = q;
                chip.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleChipClick(q);
                });
                quickDiv.appendChild(chip);
            });
            messagesContainer.appendChild(quickDiv);

            // Подпись
            const note = document.createElement('div');
            note.className = 'info-note';
            note.innerHTML = '<i class="fa-regular fa-lightbulb"></i> Кликни по вопросу — узнаешь ответ';
            messagesContainer.appendChild(note);

            scrollToBottom();
        }

        sendButton.addEventListener('click', (e) => {
            e.preventDefault();
            handleUserMessage(userInput.value);
        });

        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleUserMessage(userInput.value);
            }
        });

        buildInitialChat();

        const inputField = document.getElementById ('userInput');
        const sendBtn = document.querySelector ('.send-btn')

        inputField.addEventListener('input', function() {
            if (/\S/.test(this.value)) {
                sendBtn.classList.add('active');
            } else {
                sendBtn.classList.remove('active');
            }
        })
    })();
    
});
