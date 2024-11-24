import { ClientNotification } from "../schema"

interface NotificationCardProps {
    notification: ClientNotification
}

const NotificationCard = ({notification}: NotificationCardProps) => {
    return notification.render()
}

export default NotificationCard;