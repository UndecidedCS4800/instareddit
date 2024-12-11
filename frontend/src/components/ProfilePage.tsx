// consider: do we use react-routers loaders or simple fetch hooks?

import { useParams } from "react-router-dom";
import { useAuth } from "./auth";
import { getFriends, getUserProfile, modifyProfile, sendFriendRequest, getUserPosts } from "../remote";
import { MouseEvent, useEffect, useState } from "react";
import { Friend, isError, JWTTokenResponse, Post, UserMeta } from "../schema";
import UserInfoDisplay from "./UserInfoDisplay";
import FriendsList from "./FriendsList";


const ProfilePage = () => {
    // this will be different once we have an actual profile page
    const [userinfo, setUserInfo] = useState<UserMeta | null>(null)
    const [friends, setFriends] = useState<Friend[] | null>(null)
    const [editable, toggleEditable] = useState<boolean>(false)
    const [posts, setPosts] = useState<Post[]>()
    const params = useParams();
    const auth = useAuth();
    const [buttonText, setButtonText] = useState("Send friend request")

    useEffect(() => {
        const getsfs = async () => {
          if (auth) {
            const friends = await getFriends(auth.token);
            console.log(friends)
            if (isError(friends)) {
              console.error('server error: ', friends);
            } else {
              setFriends(friends)
          }
        };
        console.log('firing')
    }
    
        getsfs();
    }, [auth]);
    
    useEffect(() => {
        const get = async () => {
            if (params?.username) {
                const req = await getUserProfile(params.username)
                if (!isError(req)) {
                    setUserInfo(req)
                } else {
                    console.error(req)
                }
            }
        }

        get()
    }, [])

    const handleClick = async (e: MouseEvent) => {
        e.preventDefault();
        const a = auth as JWTTokenResponse;
        if (params.username) {
            const req = await sendFriendRequest(a.token, params.username)
            if (isError(req)) {
                console.log(req);
            }
            setButtonText("Sent!")
        }
    }

    const handleModify = async (ui: UserMeta) => {
        if (auth?.token) {
            const res = await modifyProfile(auth.token, ui);

            if (!isError(res)) {
                setUserInfo(res)
                toggleEditable(false)
            } else {
                console.error(res)
            }
        }
    }
    // Fetch user posts
    useEffect(() => {
        const fetchPosts = async () => {
            console.log('TEST')
            if (auth?.username) {
                console.log("Fetching posts for:", auth.username); // Debugging log
                const userPosts = await getUserPosts(auth.username);
                console.log("Fetched posts:", userPosts); // Debugging log
                if (!isError(userPosts)) {
                    setPosts(userPosts); // Set the posts data
                } else {
                    console.error('Error loading user posts: ', userPosts);
                }
            }
        };

        fetchPosts();
    }, [auth?.username]);

    console.log(posts)

    const editButton = auth && auth.username === params?.username ? <button className="bg-[#e78fcb]" onClick={() => toggleEditable(!editable)}>Edit</button> : <></>
    return (
        <div className="flex h-screen w-full">
            {/* Left Side: User Information */}
            <div className="basis-9/12 bg-[#342c33] text-white">
                <h1 className="p-6 text-3xl font-semibold">{params?.username}</h1>
                
                {auth && auth.username !== params?.username && (
                    <button
                        onClick={handleClick}
                        className="flex bg-[#e78fcb] ml-auto mr-4 focus:outline-none hover:bg-[#d07db0]"
                    >
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
                    <h2 className="text-xl px-4 font-semibold pb-2 mb-4"></h2>
                    
                </div>

            </div>
    
            {/* Right Side: Friends List */}
            <div className="w-full basis-3/12 p-6 px-8 bg-[#342c33] overflow-y-auto border-l border-[#514350]">
                <h2 className="text-2xl font-semibold text-[#e78fcb] p-2 font-bold font-sans rounded-lg">Friends</h2>
                
                <FriendsList friends={friends} />
            </div>
        </div>
    );
    
}

export default ProfilePage;