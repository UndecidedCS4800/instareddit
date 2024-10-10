import { Friend } from "../schema"

interface FriendsListItemProps {
    friend: Friend;
    handler: () => void;
}

const FriendsListItem = ({friend, handler}: FriendsListItemProps) => {
    return (
        <div onClick={() => handler()}>{friend}</div>
    )
}

export default FriendsListItem;