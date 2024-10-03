import { FeedViews } from "./CenterPane";

interface FeedNavProps {
    viewSetter: (s: FeedViews) => void;
    activeView: FeedViews; 
}

export const FeedNav = ({ viewSetter, activeView }: FeedNavProps) => {
    return (
        <nav className="flex justify-center bg-stone-800 py-4 px-8">
            <ol className="flex space-x-14">
                <li
                onClick={() => viewSetter("recent")}
                className={`cursor-pointer px-2 py-1 ${
                    activeView === "recent"
                        ? "border-b-2 border-pink-400 text-pink-400"
                        : "text-white"
                }`}
                >
                Recent Activity
                </li>
                <li
                    onClick={() => viewSetter("community")}
                    className={`cursor-pointer px-2 py-1 ${
                        activeView === "community"
                            ? "border-b-2 border-pink-400 text-pink-400"
                            : "text-white"
                }`}
                >
                Communities
                </li>
            </ol>
        </nav>
    );
};
