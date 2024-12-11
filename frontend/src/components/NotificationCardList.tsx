import { v4 } from "uuid";
import { LikeNotifications, PostNotifications } from "../schema";
import NotificationCard from "./NotificationCard";
import { Link } from "react-router-dom";

interface NotificationCardListProps {
    likes: LikeNotifications[];
    comments: PostNotifications[];
}

const NotificationCardList = ({ likes, comments }: NotificationCardListProps) => {
    const like_nodes = likes.map((li) => ({
        content: "like",
        render: () => (
            <Link
                to={`/community/${li.community_id}/posts/${li.post_id}`}
                className="text-white hover:text-[#e78fcb] text-l"
            >
                {li.username} liked your post.
            </Link>
        ),
    }));

    const comment_nodes = comments.map((cm) => ({
        content: "comment",
        render: () => (
            <Link
                to={`/community/${cm.community_id}/posts/${cm.post_id}`}
                className="text-white text-l hover:text-[#e78fcb]"
            >
                {cm.username} commented on your post.
            </Link>
        ),
    }));

    const notifications = [like_nodes, comment_nodes].flat();

    return (
        <div className="p-4  ">
            <div className="flex flex-col gap-3">
                {notifications.map((notif) => (
                    <div
                        key={v4()}
                        className="p-3 rounded-md shadow hover:shadow-xl transition"
                    >
                        <NotificationCard notification={notif} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NotificationCardList;
