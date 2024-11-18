import { v4 } from "uuid";
import { LikeNotifications, PostNotifications } from "../schema";
import NotificationCard from "./NotificationCard";

interface NotificationCardListProps {
    likes: LikeNotifications[],
    comments: PostNotifications[],
}

type Notification = {type: "like" | "comment" } & (PostNotifications | LikeNotifications)

const NotificationCardList = ({likes, comments}: NotificationCardListProps) => {
    const labeled_likes: Notification[] = likes.map(like => ({type: "like", ...like}));
    const labeled_comments: Notification[] = comments.map(comment => ({type: "comment", ...comment}))

    const notifications = [labeled_likes, labeled_comments].flat().sort((a, b) => b.when - a.when)

    return notifications.map(notif => <NotificationCard key={v4()} notification={notif} />)
}

export default NotificationCardList