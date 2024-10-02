import { FeedViews } from "./CenterPane"

interface FeedNavProps {
    viewSetter: (s: FeedViews) => void;
}

export const FeedNav = ({ viewSetter }: FeedNavProps) => {
    return (
        <nav className="bg-gray-100 p-4 rounded-lg shadow-md">
            <ol className="flex space-x-4">
                <li
                    onClick={() => viewSetter("recent")}
                >
                    Recent Activity
                </li>
                <li
                    onClick={() => viewSetter("community")}
                >
                    Communities
                </li>
            </ol>
        </nav>
    );
};
