import { Friend } from "../schema"

interface FriendsListItemProps {
    friend: Friend;
    handler: () => void;
}

const FriendsListItem = ({friend, handler}: FriendsListItemProps) => {
    return (
        <div onClick={() => handler()}
        className="flex items-center justify-between p-2 text-white text-xl font-bold font-sans rounded-lg cursor-pointer">{friend}</div>
    )
}

export default FriendsListItem;