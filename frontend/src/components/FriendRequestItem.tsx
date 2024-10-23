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
        <div>
            <span>{from.username}</span>
            <button disabled={buttonDisabled} onClick={handleAccept}>{buttonText}</button>
        </div>
    )
}

export default FriendRequestItem;