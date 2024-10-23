import {Friend } from "../schema";
import FriendsListItem from "./FriendsListItem";


// TODO: when we want user profile pages this should be updated
interface FriendsListProps {
    friends: Friend[];
    setWindowHandler: React.Dispatch<React.SetStateAction<Friend | null>>
}

const FriendsList = ({friends, setWindowHandler}: FriendsListProps) => {
    if (friends.length === 0) {
        return <></>
    }
    
    return (
        <div>
            {friends.map(friend => <FriendsListItem key={friend.id} friend={friend} handler={() => setWindowHandler(friend)} />)}
        </div>
    )

}

export default FriendsList;