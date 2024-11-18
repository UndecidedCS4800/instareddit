import { Link } from "react-router-dom"
import { LikeNotifications, PostNotifications } from "../schema"

type Notification = {type: "like" | "comment" } & (PostNotifications | LikeNotifications)

interface NotificationCardProps {
    notification: Notification
}
const NotificationCard = ({notification}: NotificationCardProps) => {
    let text = notification.type === "like" ? "liked your post." : "commented on your post.";

    return (
        <Link to={`/community/${notification.community_id}/posts/${notification.post_id}`}>
            {notification.username} {text}
        </Link>
    )
}

export default NotificationCard;