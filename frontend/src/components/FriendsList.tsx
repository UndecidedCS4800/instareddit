import { Friend } from "../schema";
import FriendsListItem from "./FriendsListItem";

// TODO: when we want user profile pages this should be updated
interface FriendsListProps {
    friends: Friend[] | null; // Allowing for null to handle cases where friends may not be loaded
    setWindowHandler?: React.Dispatch<React.SetStateAction<Friend | null>>; // Optional handler for setting the window
}

const FriendsList = ({ friends, setWindowHandler }: FriendsListProps) => {
    // Return an empty fragment if there are no friends or if the list is null
    if (!friends || friends.length === 0) {
        return <></>;
    }

    // Define the handler based on whether setWindowHandler is provided
    const handler = setWindowHandler
        ? (friend: Friend) => setWindowHandler(friend)
        : () => {};

    return (
        <div>
            {friends.map((friend) => (
                <FriendsListItem
                    key={friend.id}
                    friend={friend}
                    handler={() => handler(friend)} // Use the defined handler for clicks
                />
            ))}
        </div>
    );
};

export default FriendsList;
