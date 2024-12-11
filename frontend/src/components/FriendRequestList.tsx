import { FriendRequest } from "../schema";
import FriendRequestItem from "./FriendRequestItem";

interface FriendRequestListProps {
    friend_requests: FriendRequest[]
}


const FriendRequestList = ({friend_requests}: FriendRequestListProps) => {
    return (
        <div className="flex flex-col gap-5">
            {friend_requests.map(friend =>
                <FriendRequestItem key={friend.id} from={{id: friend.id, username: friend.from_username}} />
            )}
        </div>
    )
}

export default FriendRequestList;