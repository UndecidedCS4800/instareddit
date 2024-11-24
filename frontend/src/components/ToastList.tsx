import { useState } from "react"
import { isError }  from "../schema"
import useInterval from "../useInterval"
import { getLikeNotifications, getPostCommentNotifications } from "../remote"
import { useAuth } from "./auth"
import NotificationCard from "./NotificationCard"
import { useNotificationDispatch, useNotifications } from "./notification"
import { Link } from "react-router-dom"

const ToastList = () => {
    const notifications = useNotifications()
    const notifDispatch = useNotificationDispatch()
    const [since, setSince] = useState<number>(Date.now())

    const auth = useAuth()
    const ts = Math.floor(since / 1000)
    useInterval(async () => {
        if (auth) {
            const postreq = getPostCommentNotifications(auth.token, ts);
            const likereq = getLikeNotifications(auth.token, ts);

            const [posts, likes] = await Promise.all([postreq, likereq])
            const p = isError(posts) ? [] : posts
            const l = isError(likes) ? [] : likes

            p.forEach(n => notifDispatch({type: "push", payload: { content: "comment", render: () => <Link to={`/community/${n.community_id}/posts/${n.post_id}`}>{n.username} commented on your post.</Link> }}))
            l.forEach(n => notifDispatch({type: "push", payload: { content: "like", render: () => <Link to={`/community/${n.community_id}/posts/${n.post_id}`}>{n.username} liked your post.</Link>}}))

            setSince(Date.now())
        }
    }, 5000)

    useInterval(async () => {
        notifDispatch({type: "popFront"})
    }, 3000)

    return  (
        <div>
            {notifications.map(notif => <NotificationCard notification={notif} />)}
        </div>
    )

}

export default ToastList