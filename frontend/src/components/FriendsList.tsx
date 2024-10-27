import {Friend } from "../schema";
import FriendsListItem from "./FriendsListItem";


// TODO: when we want user profile pages this should be updated
interface FriendsListProps {
    friends: Friend[] | null;
    onClick?: (f: Friend) => void;
}

const FriendsList = ({friends, onClick: setWindowHandler}: FriendsListProps) => {
    if (!friends || friends?.length === 0) {
        return <></>
    }
    
    const handler = setWindowHandler ? (friend: Friend) => setWindowHandler(friend) : () => {}
    return (
        <div>
            {friends.map(friend => <FriendsListItem key={friend.id} friend={friend} handler={() => handler(friend)} />)}
        </div>
    )

}

export default FriendsList;