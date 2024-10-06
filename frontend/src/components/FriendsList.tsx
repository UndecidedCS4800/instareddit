import { User } from "../schema";
import FriendsListItem from "./FriendsListItem";


// TODO: when we want user profile pages this should be updated
interface FriendsListProps {
    friends: User[];
}

const FriendsList = ({friends}: FriendsListProps) => {
    if (friends.length === 0) {
        return <></>
    }
    
    return (
        <div>
            {friends.map(friend => <FriendsListItem key={friend.id} friend={friend} />)}
        </div>
    )

}

export default FriendsList;