import { Community } from "../schema"
import { Card } from "./Card";

interface CommunityCardProps {
    community: Community
}

export const CommunityCard = ({community}: CommunityCardProps) => {
    const {name, description, picture } = community;

    return (
        <Card to={`/community/${community.id}`}>
            {picture && <img src={picture} />}
            <h1>{name}</h1>
            <p>{description}</p>
        </Card>
    )
}