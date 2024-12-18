import { useEffect, useState } from "react";
import { FeedNav } from "./FeedNav";
import { CommunityFeed } from "./CommunityFeed";
import { isError, JWTTokenResponse, PaginationResponse, Post } from "../schema";
import { getRecentPosts } from "../remote";
import { useAuth } from "./auth";
import { Posts } from "./Posts";

export type FeedViews = "recent" | "community";

const getView = (s: FeedViews, auth: JWTTokenResponse | null, posts: Post[]): React.ReactNode => {
    switch (s) {
        case "recent":
            if (!auth) {
                return <div>Login to see recent posts from your communities and friends.</div>;
            }
            return <Posts privileged={false} posts={posts ? posts : []} />;
        case "community":
            return <CommunityFeed />;
    }
};

export const CenterPane = () => {
    const [view, setView] = useState<FeedViews>("recent");
    const [posts, setPosts] = useState<PaginationResponse<Post> | null>(null);
    const auth = useAuth();

    useEffect(() => {
        let ignore = false;
        setPosts(null);
        const get = async () => {
            if (!ignore && auth) {
                const json = await getRecentPosts(auth.token);
                if (!isError(json)) {
                    setPosts(json);
                }
            }
        };
        get();
        return () => {
            ignore = true;
        };
    }, [auth]);

    const setViewHandler = (s: FeedViews) => {
        switch (s) {
            case "recent":
                setView("recent");
                break;
            case "community":
                setView("community");
                break;
        }
    };

    const v = getView(view, auth, posts ? posts.results : []);

    return (
        <div id="centerpane" className="w-full">
            <FeedNav viewSetter={setViewHandler} activeView={view} />
            <div className="flex-1 h-[calc(100vh-75px)] bg-[#342c33] overflow-y-auto">{v}</div>
        </div>
    );
};
