import { Link, useParams, Outlet } from "react-router-dom";
import { useAuth } from "./auth";
import { getFriends, getUserProfile, modifyProfile, sendFriendRequest, getUserPosts } from "../remote";
import { MouseEvent, useEffect, useState } from "react";
import { Friend, isError, JWTTokenResponse, UserMeta, Post } from "../schema";
import UserInfoDisplay from "./UserInfoDisplay";
import FriendsList from "./FriendsList";
import { Posts } from "./Posts";
import React from "react";

// ProfilePage component
const ProfilePage = () => {
    const [userinfo, setUserInfo] = useState<UserMeta | null>(null);
    const [friends, setFriends] = useState<Friend[] | null>(null);
    const [editable, toggleEditable] = useState<boolean>(false);
    const [posts, setPosts] = useState<Post[] | null>(null); // State to hold the posts
    const params = useParams();
    const auth = useAuth();
    const [buttonText, setButtonText] = useState("Send friend request");

    // Fetch friends on auth change
    useEffect(() => {
        const getsfs = async () => {
            if (auth) {
                const friends = await getFriends(auth.token);
                if (isError(friends)) {
                    console.error('server error: ', friends);
                } else {
                    setFriends(friends);
                }
            }
        };
        getsfs();
    }, [auth]);

    // Fetch user profile data
    useEffect(() => {
        const get = async () => {
            if (params?.username) {
                const req = await getUserProfile(params.username);
                if (!isError(req)) {
                    setUserInfo(req);
                } else {
                    console.error(req);
                }
            }
        };

        get();
    }, [params?.username]);

    // Fetch user posts
    useEffect(() => {
        const fetchPosts = async () => {
            if (params?.username) {
                console.log("Fetching posts for:", params.username); // Debugging log
                const userPosts = await getUserPosts(params.username);
                console.log("Fetched posts:", userPosts); // Debugging log
                if (!isError(userPosts)) {
                    setPosts(userPosts); // Set the posts data
                } else {
                    console.error('Error loading user posts: ', userPosts);
                }
            }
        };

        fetchPosts();
    }, [params?.username]);

    const handleClick = async (e: MouseEvent) => {
        e.preventDefault();
        const a = auth as JWTTokenResponse;
        if (params.username) {
            const req = await sendFriendRequest(a.token, params.username);
            if (isError(req)) {
                console.log(req);
            }
            setButtonText("Sent!");
        }
    };

    const handleModify = async (ui: UserMeta) => {
        if (auth?.token) {
            const res = await modifyProfile(auth.token, ui);

            if (!isError(res)) {
                setUserInfo(res);
                toggleEditable(false);
            } else {
                console.error(res);
            }
        }
    };

    const editButton = auth && auth.username === params?.username ? (
        <button className="bg-[#e78fcb]" onClick={() => toggleEditable(!editable)}>Edit</button>
    ) : (
        <></>
    );

    // If postid is provided, render the Outlet for post details
    if (params?.postid) {
        return <Outlet />;
    }

    return (
        <React.Fragment>
            <div className="flex h-screen w-full">
                {/* Left Side: User Information */}
                <div className="basis-9/12 bg-[#342c33] text-white">
                    <h1 className="p-6 text-3xl font-semibold">{params?.username}</h1>

                    {auth && auth.username !== params?.username && (
                        <button onClick={handleClick} className="">
                            {buttonText}
                        </button>
                    )}

                    <div className="flex px-4 items-center justify-between">
                        <h2 className="text-xl font-semibold">User Information</h2>
                        {editButton}
                    </div>

                    <div className="px-4 pb-2 border-b border-[#514350]">
                        <UserInfoDisplay
                            userinfo={userinfo}
                            editable={editable}
                            uiHandler={handleModify}
                        />
                    </div>

                    {/* Posts Section */}
                    <div className="mt-4">
                        <h2 className="text-xl px-4 font-semibold pb-2 mb-4">Posts</h2>
                        <div className="flex justify-end px-3">
                            <Link
                                to="posts/create"
                                className="h-10 w-40 p-4 bg-[#e78fcb] rounded-[30px] justify-center items-center gap-2.5 inline-flex focus:outline-none hover:bg-[#d07db0] hover:text-white text-white"
                            >
                                Create Post
                            </Link>
                        </div>

                        {/* Render Posts */}
                        {posts ? (
                            <div className="h-screen bg-[#342c33]">
                                <Posts posts={posts} privileged={false} />
                            </div>
                        ) : (
                            <div>Loading posts...</div>
                        )}
                    </div>
                </div>

                {/* Right Side: Friends List */}
                <div className="w-full basis-3/12 p-6 px-8 bg-[#342c33] overflow-y-auto border-l border-[#514350]">
                    <h2 className="text-2xl font-semibold text-[#e78fcb] p-2 font-bold font-sans rounded-lg">Friends</h2>
                    <FriendsList friends={friends} />
                </div>
            </div>

            {/* This will render the child route, such as CreatePost */}
            <Outlet />
        </React.Fragment>
    );
};

export default ProfilePage;
