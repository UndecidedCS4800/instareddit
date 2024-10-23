// consider: do we use react-routers loaders or simple fetch hooks?

import { useParams } from "react-router-dom";
import { useAuth } from "./auth";
import { sendFriendRequest } from "../remote";
import { MouseEvent, useState } from "react";
import { isError, JWTTokenResponse } from "../schema";

// type LoaderParams = {
//     userid: string,
// }

// const loader: LoaderFunction<LoaderParams> = async (args) => {
//     const { userid } = args.params;

//     const uid = Number(userid as string);
//     if (isNaN(uid)) {
//         throw  { error: "Invalid user id!" };
//     }

//     const user = getUser(uid)

//     return user;
// }

const ProfilePage = () => {
    // this will be different once we have an actual profile page
    const params = useParams();
    const auth = useAuth();
    const [buttonText, setButtonText] = useState("Send friend request")
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

    return (
        <div>
            {params.username}

            {auth && <button onClick={handleClick}>{buttonText}</button>}
        </div>
    )
}

export default ProfilePage;