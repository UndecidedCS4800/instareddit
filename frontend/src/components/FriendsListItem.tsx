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
            className="group flex items-center hover:shadow-xl hover:text-[#e78fcb] justify-between p-2 text-white text-xl font-bold font-sans rounded-lg cursor-pointer"
        >
            <span>{friend.username}</span>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    removeHandler();
                }}
                className="ml-4 p-1 text-white opacity-0 bg-transparent focus:outline-none group-hover:opacity-100 transition-opacity duration-200 hover:text-[#e78fcb]"
            >
                X
            </button>
        </div>
    );
};

export default FriendsListItem;
