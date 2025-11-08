// script.js

const SERVER_ADDRESS = 'ws://127.0.0.1:8080';
let ws = null;
const inputField = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Função de utilidade para exibir mensagens na UI
function appendMessage(sender, message, type) {
    const messagesDiv = document.getElementById('messages');
    const p = document.createElement('p');
    p.classList.add('chat-message', type);
    p.innerHTML = `<strong>${sender}:</strong> ${message}`;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Lógica de Envio de Mensagem
function sendMessage() {
    const message = inputField.value.trim();
    if (!message) return;

    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        appendMessage('Eu', message, 'client');
        inputField.value = ''; // Limpa o campo
    } else {
        appendMessage('Sistema', 'Aguardando conexão ou erro.', 'error');
    }
}

// Lógica de Conexão WebSocket
function connectWebSocket() {
    console.log('Tentando conectar ao Servidor C++...');
    ws = new WebSocket(SERVER_ADDRESS);

    ws.onopen = () => {
        appendMessage('Sistema', 'Conexão estabelecida!', 'system');
    };

    ws.onmessage = (event) => {
        const receivedMessage = event.data;
        appendMessage('Servidor', receivedMessage, 'server');
    };

    ws.onerror = (error) => {
        console.error("Erro no WebSocket:", error);
        appendMessage('Sistema', 'Erro de conexão.', 'error');
    };

    ws.onclose = () => {
        appendMessage('Sistema', 'Conexão encerrada.', 'system');
    };
}

// Garante que o script só rode após o HTML carregar
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia a conexão
    connectWebSocket();

    // 2. Conecta a função sendMessage() ao botão
    sendButton.addEventListener('click', sendMessage);

    // 3. Conecta a função sendMessage() à tecla Enter no campo de input
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
            e.preventDefault(); // Impede a quebra de linha padrão
        }
    });
});