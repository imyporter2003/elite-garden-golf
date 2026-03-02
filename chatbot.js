/**
 * Aria - Elite Garden Golf AI Concierge
 * OpenAI-powered luxury golf concierge.
 *
 * API Key Setup:
 *   Create a file called config.js in the same folder with:
 *     const ARIA_API_KEY = 'sk-proj-your-key-here';
 *   config.js is gitignored and never committed publicly.
 */

const ELARA_CONFIG = {
    apiKey: (typeof ARIA_API_KEY !== 'undefined') ? ARIA_API_KEY : '',
    name: 'Aria',
    avatar: 'assets/aria_icon.png',
    systemPrompt: `You are Aria, the Elite AI concierge for "Elite Garden Golf". 
    You are professional, sophisticated, and highly knowledgeable about luxury garden golf simulator studios.
    
    Key Information for your context:
    - Products: Par Pod (£24,950+), Birdie Bay (£39,950+), Eagle Estate (£59,950+).
    - Tech Partners: TrackMan 4, Foresight (GC3/GCQuad), FlightScope, BenQ 4K Projection.
    - Construction: Bespoke architectural cabins, cedar wood cladding, fully insulated, climate controlled.
    - Goal: Help users choose a tier and encourage them to "Design Your Studio" or "Request a Quote".
    - Tone: Elegant, helpful, concise, and authoritative.
    `
};

class AriaChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createUI();
        this.addEventListeners();
        this.addWelcomeMessage();
    }

    createUI() {
        const widget = document.createElement('div');
        widget.className = 'aria-widget';
        widget.innerHTML = `
            <div class="aria-launcher" id="aria-launcher">
                <div class="aria-pulse"></div>
                <img src="${ELARA_CONFIG.avatar}" alt="${ELARA_CONFIG.name}">
            </div>
            <div class="aria-window" id="aria-window">
                <div class="aria-header">
                    <div class="aria-header-info">
                        <img src="${ELARA_CONFIG.avatar}" class="aria-header-avatar">
                        <div class="aria-header-text">
                            <h3>${ELARA_CONFIG.name}</h3>
                            <span><div class="aria-status-dot"></div> Online</span>
                        </div>
                    </div>
                    <div class="aria-close" id="aria-close">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </div>
                </div>
                <div class="aria-messages" id="aria-messages"></div>
                <div class="aria-input-area">
                    <input type="text" class="aria-input" id="aria-input" placeholder="Ask Aria anything...">
                    <button class="aria-send" id="aria-send">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(widget);
        this.elements = {
            launcher: document.getElementById('aria-launcher'),
            window: document.getElementById('aria-window'),
            close: document.getElementById('aria-close'),
            messages: document.getElementById('aria-messages'),
            input: document.getElementById('aria-input'),
            send: document.getElementById('aria-send')
        };
    }

    addEventListeners() {
        this.elements.launcher.onclick = () => this.toggleChat();
        this.elements.close.onclick = () => this.toggleChat();
        this.elements.send.onclick = () => this.sendMessage();
        this.elements.input.onkeypress = (e) => { if (e.key === 'Enter') this.sendMessage(); };
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.elements.window.classList.toggle('active', this.isOpen);
        if (this.isOpen) {
            this.elements.input.focus();
            this.scrollToBottom();
        }
    }

    addWelcomeMessage() {
        this.addMessage('ai', "Welcome to Elite Garden Golf. I am Aria, your architectural concierge. How may I assist you with your simulator project today?");
    }

    addMessage(role, content) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `aria-msg ${role}`;
        msgDiv.innerText = content;
        this.elements.messages.appendChild(msgDiv);
        this.messages.push({ role: role === 'ai' ? 'assistant' : 'user', content });
        this.scrollToBottom();
    }

    scrollToBottom() {
        this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
    }

    async sendMessage() {
        const text = this.elements.input.value.trim();
        if (!text) return;

        this.addMessage('user', text);
        this.elements.input.value = '';

        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = `aria-msg ai aria-typing-container`;
        typingDiv.innerHTML = `<div class="aria-typing"><div class="aria-dot"></div><div class="aria-dot"></div><div class="aria-dot"></div></div>`;
        this.elements.messages.appendChild(typingDiv);
        this.scrollToBottom();

        try {
            // Call the Vercel serverless proxy — API key stays server-side
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: ELARA_CONFIG.systemPrompt },
                        ...this.messages.slice(-6) // Keep context window manageable
                    ]
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Server error');
            }

            const aiResponse = data.choices[0].message.content;
            this.elements.messages.removeChild(typingDiv);
            this.addMessage('ai', aiResponse);

        } catch (error) {
            console.error('Aria API Error:', error);
            this.elements.messages.removeChild(typingDiv);
            this.addMessage('ai', "I apologize, I'm experiencing a temporary connection issue. Please feel free to use our contact form for urgent inquiries.");
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.aria = new AriaChatbot();
});
