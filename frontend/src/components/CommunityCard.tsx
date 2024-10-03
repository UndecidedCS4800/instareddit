import { Community } from "../schema";
import { Card } from "./Card";

interface CommunityCardProps {
    community: Community;
}

export const CommunityCard = ({ community }: CommunityCardProps) => {
    const { name, description, picture } = community;

    return (
        <Card 
            to={`/community/${community.id}`}>
            <div className="h-[65px] px-[12px] py-4 justify-start items-center gap-5 flex">
                <img className="w-[54px] h-14 rounded-full" src="/public/Rectangle1.png" alt="/public/Rectangle1.png" />
                <div className="text-white text-xl font-bold font-sans">{name}</div>
            </div>
            {picture && <img className="h-[350px] w-full object-cover" src={picture} alt={name} />}
            <div className="h-[55px] px-[12px] flex items-center gap-4">
                <img className="w-[29px] h-[29px]" src="/public/thumb_up(1).png" alt="Thumb Up" />
                <img className="w-[29px] h-[29px]" src="/public/thumb_down(1).png" alt="Thumb Down" />
                <img className="w-[29px] h-[29px]" src="/public/tooltip(1).png" alt="Tooltip" />
                <img className="w-[29px] h-[29px] ml-auto" src="/public/Reply(1).png" alt="Reply" />
            </div>

            <p className="px-4 py-2 text-white flex">{description}</p>
        </Card>
    );
};
