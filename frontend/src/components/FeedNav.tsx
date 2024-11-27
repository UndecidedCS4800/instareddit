import { FeedViews } from "./CenterPane";

interface FeedNavProps {
    viewSetter: (s: FeedViews) => void;
    activeView: FeedViews; 
}

export const FeedNav = ({ viewSetter, activeView }: FeedNavProps) => {
    return (
        <div className="flex w-full bg-[#342c33] justify-center border-b border-[#514350]">
            {/* Left Section: Navigation */}
            <nav className="flex basis-9/12 justify-center py-4 px-8">
                <ol className="flex space-x-14">
                    <li
                        onClick={() => viewSetter("recent")}
                        className={`cursor-pointer px-2 py-2 font-normal ${
                            activeView === "recent"
                                ? "border-b-2 border-[#e78fcb] text-[#e78fcb]"
                                : "text-white"
                        }`}
                    >
                        Recent Activity
                    </li>
                    <li
                        onClick={() => viewSetter("community")}
                        className={`cursor-pointer px-2 py-2 font-normal ${
                            activeView === "community"
                                ? "border-b-2 border-[#e78fcb] text-[#e78fcb]"
                                : "text-white"
                        }`}
                    >
                        Communities
                    </li>
                </ol>
            </nav>

            
        </div>
    );
};
