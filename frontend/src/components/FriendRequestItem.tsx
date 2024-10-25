import { useState } from "react";
import { acceptFriendRequest } from "../remote";
import { isError } from "../schema";
import { useAuth } from "./auth";

interface FriendRequestItemProps {
    from: {username: string, id: number}
}

const FriendRequestItem = ({from}: FriendRequestItemProps) => {
    const [buttonText, setButtonText] = useState("Accept")
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const auth = useAuth();
    const handleAccept = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (auth) {
            const maybe_error = await acceptFriendRequest(auth.token, from.id)
            setButtonText("Accepted")
            setButtonDisabled(true)
            if (isError(maybe_error)) {
                console.error("Failed to accept friend request: ", maybe_error)
            }

        }
    }

    return (
        <div className="flex rounded-[30px] bg-[#514350] p-2 text-xl font-sans">
            <span className="px-4 py-3">{from.username}</span>
            <button 
                disabled={buttonDisabled} 
                onClick={handleAccept} 
                className="ml-auto px-2 py-2 text-xl font-sans"
            >
                {buttonText}
            </button>
        </div>
    );
}

export default FriendRequestItem;