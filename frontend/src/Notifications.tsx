import React, { useEffect, useState } from 'react';
import { FriendRequest, isError } from './schema';
import { getFriendRequests } from './remote';
import FriendRequestList from './components/FriendRequestList';
import { useAuth } from './components/auth';

const Notifications: React.FC = () => {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const auth = useAuth();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (auth) {
        const result = await getFriendRequests(auth.token, auth.username);
        if (isError(result)) {
          console.error("server error", result);
        } else {
          setFriendRequests(result);
        }
      }
    };
    fetchFriendRequests();
  }, [auth]);

  return (
    <div className='bg-[#342c33] flex-1 p-5'>
      <h2 className="w-[242px] h-12 text-white text-[32px] font-bold font-sans">Notifications</h2>
      <FriendRequestList friend_requests={friendRequests} />
    </div>
  );
};

export default Notifications;
