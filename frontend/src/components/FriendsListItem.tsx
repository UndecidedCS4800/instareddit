import { Friend } from "../schema"

interface FriendsListItemProps {
    friend: Friend;
    cardHandler: () => void;
    removeHandler: () => void;
}

const FriendsListItem = ({friend, cardHandler, removeHandler}: FriendsListItemProps) => {
    return (
        <div onClick={() => cardHandler()}
        className="flex items-center justify-between p-2 text-white text-xl font-bold font-sans rounded-lg cursor-pointer">{friend.username}
        <button onClick={() => removeHandler()}>X</button></div>
    )
}

export default FriendsListItem;