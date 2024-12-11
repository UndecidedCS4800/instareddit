import { FormEvent, useEffect, useRef, useState } from "react";
import { ChatMessage, Friend } from "../schema";
import socket from "../socket";
import { useAuth } from "./auth";
import { v4 } from 'uuid'

interface ChatWindowViewProps {
    user: Friend;
    history: ChatMessage[];
    pushHistory: (withId: number, msg: ChatMessage) => void;
}

const ChatWindowView = ({ user, history, pushHistory }: ChatWindowViewProps) => {
    const [messageText, setMessageText] = useState<string>("");
    const auth = useAuth();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    if (!auth) {
        return <div>Not authenticated</div>;
    }

    // Scroll to the bottom of the messages when history changes or component mounts
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const message = { from: auth.id, to: user.id, message: messageText };
        socket.emit("message", { to: user, message: messageText });
        pushHistory(user.id, message);
        setMessageText("");
    };

    return (
        <div className="flex flex-col h-full w-full">
            <h2 className="w-full p-4 px-5 text-white text-xl font-bold font-sans border-b border-[#514350]">
                {user.username}
            </h2>
            <div className="flex flex-col h-full space-y-3 p-4 rounded-lg overflow-y-auto">
                {history &&
                    history.map((msg) => (
                        <div
                            key={v4()}
                            className={`flex ${msg.from === auth.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`p-3 rounded-lg max-w-xs ${
                                    msg.from === auth.id
                                        ? 'bg-[#e78fcb] text-[#514350] rounded-tl-[30px] rounded-tr-[30px] rounded-bl-[30px] rounded-br'
                                        : 'bg-[#514350] rounded-tl-[30px] rounded-tr-[30px] rounded-bl rounded-br-[30px]'
                                }`}
                            >
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    ))}
                {/* Invisible div to ensure scrolling */}
                <div ref={messagesEndRef}></div>
            </div>
            <form
                className="py-4 px-4 border-t border-[#514350] justify-center items-center gap-[15px] flex"
                onSubmit={handleSubmit}
            >
                <input
                    className="w-full h-10 px-5 py-4 bg-[#514350] rounded-[10px] text-white focus:outline-none"
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Enter a message"
                />
                <button
                    className="h-10 py-2.5 bg-[#e78fcb] rounded-[30px] justify-center items-center gap-2.5 inline-flex focus:outline-none hover:bg-[#d07db0]"
                    type="submit"
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default ChatWindowView;
