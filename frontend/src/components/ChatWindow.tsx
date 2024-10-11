import { FormEvent, useState } from "react";
import { ChatMessage } from "../schema";
import socket from "../socket";
import { useAuth } from "./auth";
import { v4 } from 'uuid'

interface ChatWindowViewProps {
    user: number
    history: ChatMessage[];
    pushHistory: (withId: number, msg: ChatMessage) => void;
}

const ChatWindowView = ({user, history, pushHistory}: ChatWindowViewProps) => {
    const [messageText, setMessageText] = useState<string>("")
    const auth = useAuth();

    if (!auth) {
        return <div>Not authenticated</div>
    }
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const message = {from: auth.id, to: user, message: messageText}
        socket.emit("message", {to: user, message: messageText})
        pushHistory(user, message)

    }
    console.log("hist", history)

    return (
        <div>
            <h2>{user}</h2>
            <div>
                {history && history.map(msg => <div key={v4()}>{msg.from}{'->'}{msg.to}<p>{msg.message}</p></div>)}
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" value={messageText} onChange={e => setMessageText(e.target.value)}placeholder="Enter a message" />
                <button type="submit">Send</button>
            </form>
        </div>
    )

}

export default ChatWindowView
