import { User } from "../schema"

interface FriendsListItemProps {
    friend: User;
}

const FriendsListItem = ({friend}: FriendsListItemProps) => {
    return (
        <div>{friend.id} {friend.username}</div>
    )
}

export default FriendsListItem;