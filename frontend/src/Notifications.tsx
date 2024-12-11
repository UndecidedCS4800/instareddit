import React, { useEffect, useState } from 'react';
import { FriendRequest, isError, LikeNotifications, PostNotifications } from './schema';
import { getFriendRequests, getLikeNotifications, getPostCommentNotifications } from './remote';
import FriendRequestList from './components/FriendRequestList';
import { useAuth } from './components/auth';
import NotificationCardList from './components/NotificationCardList';

const Notifications: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [commentNotifications, setCommentNotifications] = useState<PostNotifications[]>([])
  const [likeNotifications, setLikeNotifications] = useState<LikeNotifications[]>([])

  const auth = useAuth();

  useEffect(() => {
    const fetch = async () => {
      if (auth) {
        const friendsreq = getFriendRequests(auth.token, auth.username);
        const postsreq = getPostCommentNotifications(auth.token);
        const likesreq = getLikeNotifications(auth.token);

        const [friends, posts, likes] = await Promise.all([friendsreq, postsreq, likesreq])

        if (!isError(friends)) 
          setFriendRequests(friends);
        else {
           console.error("server error", friends)
        }

        if (!isError(posts)) {
          setCommentNotifications(posts)
        } else {
          console.error("server error", posts)
        }

        if (!isError(likes)) {
          setLikeNotifications(likes)
        } else {
          console.error("server error", likes)
        }
      }
    };
    fetch();
  }, [auth]);


  return (
    <div className='h-screen bg-[#342c33] flex-1 p-5 overflow-y-auto'>
      <h2 className="w-[242px] h-12 text-white text-[32px] font-bold font-sans mb-5">Notifications</h2>
      <FriendRequestList friend_requests={friendRequests} />
      <NotificationCardList comments={commentNotifications} likes={likeNotifications} />
    </div>
  );
};

export default Notifications;
