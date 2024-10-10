import { Friend } from "../schema"

interface FriendsListItemProps {
    friend: Friend;
}

const FriendsListItem = ({friend}: FriendsListItemProps) => {
    return (
        <div>{friend}</div>
    )
}

export default FriendsListItem;