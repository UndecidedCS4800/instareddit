import { useState } from "react";
import { acceptFriendRequest } from "../remote";
import { isError } from "../schema";
import { useAuth } from "./auth";

interface FriendRequestItemProps {
    from: { username: string; id: number };
}

const FriendRequestItem = ({ from }: FriendRequestItemProps) => {
    const [buttonText, setButtonText] = useState("Accept");
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const auth = useAuth();

    const handleAccept = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (auth) {
            const maybe_error = await acceptFriendRequest(auth.token, from.id);
            setButtonText("Accepted");
            setButtonDisabled(true);
            if (isError(maybe_error)) {
                console.error("Failed to accept friend request: ", maybe_error);
            }
        }
    };

    return (
        <div className="p-4 bg-[#50444e] rounded-md shadow hover:shadow-xl transition mx-10">
            <div className="flex justify-between items-center">
                <span className="text-white text-l">
                    {from.username} sent you a friend request!
                </span>
                <button
                    disabled={buttonDisabled}
                    onClick={handleAccept}
                    className="px-4 py-2 bg-[#e78fcb] text-white rounded-md hover:bg-[#d07db0] disabled:bg-gray-400 transition"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export default FriendRequestItem;
