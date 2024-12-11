import { Community } from "../schema";
import { Card } from "./Card";
import Rectangle from "../../public/Rectangle1.png"
interface CommunityCardProps {
    community: Community;
}

export const CommunityCard = ({ community }: CommunityCardProps) => {
    const { name, description, picture } = community;

    return (
        <Card 
            to={`/community/${community.id}`}>
            <div className="h-[65px] px-[12px] py-4 justify-start items-center gap-5 flex">
                <div className="text-white text-xl font-bold font-sans">{name}</div>
            </div>
            {picture && <img className="h-[350px] w-full object-cover" src={picture} alt={name} />}
            <p className="px-4 py-2 text-white flex">{description}</p>
        </Card>
    );
};

