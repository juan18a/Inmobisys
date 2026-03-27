import React, { useState, useRef, useEffect } from 'react';

interface Message {
    id: number;
    text: string;
    isBot: boolean;
}

const INITIAL_MESSAGES: Message[] = [
    {
        id: 1,
        text: 'Welcome to Ethereal Estate. How can I assist with your architectural search today?',
        isBot: true,
    },
];

const ChatWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        setMessages((prev) => [
            ...prev,
            { id: Date.now(), text: trimmed, isBot: false },
        ]);
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSend();
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            {/* Chat Popup */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-80 bg-white rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden">
                    {/* Header */}
                    <div className="bg-secondary p-6">
                        <h4 className="text-on-primary font-headline font-bold text-lg">
                            Ethereal Concierge
                        </h4>
                        <p className="text-on-primary/70 text-xs">AI Assistant powered by ArchNet</p>
                    </div>

                    {/* Messages */}
                    <div
                        className="h-64 p-6 overflow-y-auto bg-surface-container-low space-y-4"
                        style={{ scrollbarWidth: 'none' }}
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`p-3 rounded-lg text-sm shadow-sm ${msg.isBot
                                    ? 'bg-white rounded-tl-none'
                                    : 'bg-secondary text-on-primary rounded-tr-none ml-4'
                                    }`}
                            >
                                {msg.text}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 bg-surface-container border border-outline-variant/20 text-xs rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-secondary"
                        />
                        <button
                            onClick={handleSend}
                            className="material-symbols-outlined text-secondary hover:scale-110 transition-transform"
                        >
                            send
                        </button>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="w-16 h-16 bg-secondary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all active:scale-95"
                aria-label="Toggle chat"
            >
                <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    chat_bubble
                </span>
            </button>
        </div>
    );
};

export default ChatWidget;