import { FeedViews } from "./CenterPane"

interface FeedNavProps {
    viewSetter: (s: FeedViews) => void;
}

export const FeedNav = ({ viewSetter }: FeedNavProps) => {
    return (
        <nav>
            <ol>
                <li onClick={() => viewSetter("recent")}>Recent Activity</li>
                <li onClick={() => viewSetter("community")}>Communities</li>
            </ol>
        </nav>
    )
}