import { v4 } from "uuid";
import { LikeNotifications, PostNotifications } from "../schema";
import NotificationCard from "./NotificationCard";
import { Link } from "react-router-dom";

interface NotificationCardListProps {
    likes: LikeNotifications[],
    comments: PostNotifications[],
}

const NotificationCardList = ({likes, comments}: NotificationCardListProps) => {

    const like_nodes = likes.map(li => ({content: "like", render: () =>  <Link to={`/community/${li.community_id}/posts/${li.post_id}`}>{li.username} commented on your post.</Link>  }))
    const comment_nodes = comments.map(cm => ({content: "comment", render: () =>  <Link to={`/community/${cm.community_id}/posts/${cm.post_id}`}>{cm.username} commented on your post.</Link>  }))
    const notifications = [like_nodes, comment_nodes].flat()
    return notifications.map(notif => <NotificationCard key={v4()} notification={notif} />)
}

export default NotificationCardList