import { Friend } from "../schema";
import FriendsListItem from "./FriendsListItem";

// TODO: when we want user profile pages this should be updated
interface FriendsListProps {
    friends: Friend[] | null;
    onClick?: (f: Friend) => void;
    removeHandler?: (f: Friend) => void;
}

const FriendsList = ({friends, onClick, removeHandler}: FriendsListProps) => {
    if (!friends || friends?.length === 0) {
        return <></>
    }
    
    const handler = onClick ? (friend: Friend) => onClick(friend) : () => {}
    const remove = removeHandler ? (friend: Friend) => removeHandler(friend) : () => {}
    return (
        <div>
            {friends.map(friend => <FriendsListItem key={friend.id} friend={friend} removeHandler={() => remove(friend)} cardHandler={() => handler(friend)} />)}
        </div>
    );
};

export default FriendsList;
