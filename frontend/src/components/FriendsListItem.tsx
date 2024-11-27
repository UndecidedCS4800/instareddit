import { Friend } from "../schema";

interface FriendsListItemProps {
    friend: Friend;
    cardHandler: () => void;
    removeHandler: () => void;
}

const FriendsListItem = ({ friend, cardHandler, removeHandler }: FriendsListItemProps) => {
    return (
        <div
            onClick={() => cardHandler()}
            className="flex items-center justify-between p-2 text-white text-xl font-bold font-sans rounded-lg cursor-pointer"
        >
            <span>{friend.username}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeHandler();
                }}
                className="ml-4 p-1 text-white rounded-full hover:bg-[#e78fcb] hover:text-white"
            >
                X
            </button>
        </div>
    );
};

export default FriendsListItem;
