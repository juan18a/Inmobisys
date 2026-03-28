import React, { useState, useRef, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
    id: number;
    text: string;
    isBot: boolean;
    isError?: boolean;
}

// ─── Config ───────────────────────────────────────────────────────────────────

/**
 * Laravel proxy route — credenciales añadidas server-side.
 * El browser nunca ve la API key ni la URL de N8N.
 */
const CHAT_URL = '/chat';

/** Maximum characters a user message may contain. */
const MAX_INPUT_LENGTH = 500;

/** How many user messages per minute before rate-limiting client-side. */
const RATE_LIMIT_PER_MINUTE = 10;

// ─── Security helpers ─────────────────────────────────────────────────────────

/**
 * Patterns that strongly suggest prompt-injection attempts.
 * The list covers common jailbreak / override techniques documented in
 * OWASP LLM01 and the wider red-teaming literature.
 */
const INJECTION_PATTERNS: RegExp[] = [
    // Role / instruction overrides
    /ignore\s+(all\s+)?(previous|prior|above|system|your)\s+(instructions?|prompts?|rules?|context)/i,
    /forget\s+(everything|all|your|previous|prior)/i,
    /you\s+are\s+now\s+(a\s+)?(different|new|another|an?\s+)?[a-z]+/i,
    /act\s+as\s+(if\s+you\s+(are|were)\s+)?(a\s+)?(?!an?\s+agent)/i, // "act as [X]" but not "act as an agent"
    /pretend\s+(you\s+are|to\s+be)/i,
    /roleplay\s+as/i,
    /simulate\s+(being|a|an)/i,
    /new\s+persona/i,
    /your\s+(true|real|actual)\s+(self|nature|purpose)/i,
    /developer\s+mode/i,
    /jailbreak/i,
    /dan\s+mode/i, // "Do Anything Now"

    // System prompt leakage
    /print\s+(your\s+)?(system\s+prompt|instructions)/i,
    /reveal\s+(your\s+)?(system\s+prompt|hidden\s+instructions|prompt)/i,
    /what\s+(are|were)\s+your\s+(instructions|prompts?|rules?)/i,
    /show\s+me\s+your\s+(prompt|instructions)/i,

    // Exfiltration via encoding / obfuscation
    /base64/i,
    /hex\s+encoded?/i,
    /rot13/i,

    // Classic injection delimiters
    /\[system\]/i,
    /<\|im_start\|>/i,
    /###\s*instruction/i,
    /\bHuman:\s/i,
    /\bAssistant:\s/i,

    // Prompt chaining / delimiter tricks
    /---\s*(new\s+)?prompt/i,
    /======+\s*override/i,
];

/**
 * Returns true if the text appears to contain a prompt-injection attempt.
 */
function looksLikeInjection(text: string): boolean {
    return INJECTION_PATTERNS.some((re) => re.test(text));
}

/**
 * Strips HTML tags and trims whitespace.
 * Prevents stored-XSS if the response is ever rendered as HTML.
 */
function sanitize(text: string): string {
    return text
        .replace(/<[^>]*>/g, '')
        .trim();
}

// ─── Rate-limiter (client-side, complements server-side limits) ───────────────

function useRateLimiter(maxPerMinute: number) {
    const timestamps = useRef<number[]>([]);

    return (): boolean => {
        const now = Date.now();
        timestamps.current = timestamps.current.filter((t) => now - t < 60_000);
        if (timestamps.current.length >= maxPerMinute) return false;
        timestamps.current.push(now);
        return true;
    };
}

// ─── Session ID (ties conversation context on the N8N side) ──────────────────

function getOrCreateSessionId(): string {
    const key = 'ethereal_chat_session';
    let id = sessionStorage.getItem(key);
    if (!id) {
        id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        sessionStorage.setItem(key, id);
    }
    return id;
}

// ─── Initial state ────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        text: 'Welcome to Ethereal Estate. How can I assist with your architectural search today?',
        isBot: true,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const sessionId = useRef(getOrCreateSessionId());
    const checkRate = useRateLimiter(RATE_LIMIT_PER_MINUTE);

    // Auto-scroll
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // ── Send ────────────────────────────────────────────────────────────────

    const handleSend = async () => {
        const trimmed = sanitize(inputValue);
        if (!trimmed || isLoading) return;

        // ① Client-side rate limit
        if (!checkRate()) {
            pushMessage(
                'You are sending messages too quickly. Please wait a moment before trying again.',
                true,
                true
            );
            setInputValue('');
            return;
        }

        // ② Prompt-injection guard
        if (looksLikeInjection(trimmed)) {
            pushMessage(
                'I can only assist with questions about our properties. Please rephrase your message.',
                true,
                true
            );
            setInputValue('');
            return;
        }

        // ③ Length guard
        if (trimmed.length > MAX_INPUT_LENGTH) {
            pushMessage(
                `Please keep your message under ${MAX_INPUT_LENGTH} characters.`,
                true,
                true
            );
            return;
        }

        // ④ Show user message
        pushMessage(trimmed, false);
        setInputValue('');
        setIsLoading(true);

        // ⑤ Call N8N webhook
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content ?? '';

            const response = await fetch(CHAT_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    message: trimmed,
                    session_id: sessionId.current,
                    timestamp: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();

            // N8N should return { reply: "..." }
            const reply = sanitize(
                typeof data?.reply === 'string'
                    ? data.reply
                    : 'I received an unexpected response. Please try again.'
            );

            pushMessage(reply, true);
        } catch {
            pushMessage(
                'I could not reach the assistant right now. Please try again in a moment.',
                true,
                true
            );
        } finally {
            setIsLoading(false);
        }
    };

    // ── Helpers ─────────────────────────────────────────────────────────────

    const pushMessage = (text: string, isBot: boolean, isError = false) => {
        setMessages((prev) => [
            ...prev,
            { id: Date.now() + Math.random(), text, isBot, isError },
        ]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) handleSend();
    };

    const remainingChars = MAX_INPUT_LENGTH - inputValue.length;

    // ─── Render ─────────────────────────────────────────────────────────────

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            {/* ── Chat Popup ───────────────────────────────────────────────── */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden">

                    {/* Header */}
                    <div className="bg-secondary p-6">
                        <h4 className="text-on-primary font-headline font-bold text-lg">
                            Ethereal Concierge
                        </h4>
                        <p className="text-on-primary/70 text-xs">
                            AI Assistant powered by ArchNet
                        </p>
                    </div>

                    {/* Messages */}
                    <div
                        className="h-64 p-6 overflow-y-auto bg-surface-container-low space-y-4"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-3 rounded-lg text-sm shadow-sm ${msg.isError
                                        ? 'bg-red-50 text-red-700 rounded-tl-none border border-red-200'
                                        : msg.isBot
                                            ? 'bg-white rounded-tl-none'
                                            : 'bg-secondary text-on-primary rounded-tr-none ml-4'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm flex gap-1 items-center w-16">
                                {[0, 1, 2].map((i) => (
                                    <span
                                        key={i}
                                        className="w-2 h-2 bg-secondary/60 rounded-full animate-bounce"
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    />
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about our properties…"
                                maxLength={MAX_INPUT_LENGTH}
                                disabled={isLoading}
                                className="flex-1 bg-surface-container border border-outline-variant/20 text-xs rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary disabled:opacity-50"
                            />
                            <button
                                onClick={handleSend}
                                disabled={isLoading || !inputValue.trim()}
                                className="material-symbols-outlined text-secondary hover:scale-110 transition-transform disabled:opacity-40 disabled:scale-100"
                                aria-label="Send message"
                            >
                                send
                            </button>
                        </div>

                        {/* Character counter — only visible when approaching limit */}
                        {remainingChars < 100 && (
                            <p className={`text-right text-[10px] pr-1 ${remainingChars < 20 ? 'text-red-500' : 'text-outline-variant'}`}>
                                {remainingChars} characters remaining
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* ── Toggle Button ────────────────────────────────────────────── */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-16 h-16 bg-secondary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95"
                aria-label="Toggle chat"
            >
                <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    {isOpen ? 'close' : 'chat_bubble'}
                </span>
            </button>
        </div>
    );
};

export default ChatWidget;