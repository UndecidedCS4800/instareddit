// consider: do we use react-routers loaders or simple fetch hooks?

import { useParams } from "react-router-dom";
import { useAuth } from "./auth";
import { getFriends, getUserProfile, modifyProfile, sendFriendRequest } from "../remote";
import { MouseEvent, useEffect, useState } from "react";
import { Friend, isError, JWTTokenResponse, UserMeta } from "../schema";
import UserInfoDisplay from "./UserInfoDisplay";
import FriendsList from "./FriendsList";


const ProfilePage = () => {
    // this will be different once we have an actual profile page
    const [userinfo, setUserInfo] = useState<UserMeta | null>(null)
    const [friends, setFriends] = useState<Friend[] | null>(null)
    const [editable, toggleEditable] = useState<boolean>(false)
    const params = useParams();
    const auth = useAuth();
    const [buttonText, setButtonText] = useState("Send friend request")

    useEffect(() => {
        const friends = async () => {
          if (auth) {
            const friends = await getFriends(auth.token);
            if (isError(friends)) {
              console.error('server error: ', friends);
            } else {
              setFriends(friends)
          }
        };
    
        friends();
    }}, [auth]);
    
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


    const editButton = auth && auth.username === params?.username ? <button onClick={() => toggleEditable(!editable)}>Edit</button> : <></>
    return (
        <div>
            <h1>{params?.username}</h1>
            {auth && auth.username !== params?.username && <button onClick={handleClick}>{buttonText}</button>}

            <h2>User Information {editButton} </h2>
            <UserInfoDisplay userinfo={userinfo} editable={editable} uiHandler={handleModify} />
            <h2>Friends</h2>
            <FriendsList friends={friends}/>
        </div>
    )
}

export default ProfilePage;