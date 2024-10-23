import {Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';
import FriendsList from './components/FriendsList';
import { ChatHistory, ChatMessage, Friend, FriendRequest, isError, JWTTokenResponse } from './schema';
import { getFriendRequests, getFriends } from './remote';
import  socket  from './socket';
import { useEffect, useState } from 'react';
import { useAuth } from './components/auth';
import ChatWindowView from './components/ChatWindow';
import FriendRequestList from './components/FriendRequestList';

const App: React.FC = () => {



  return (
    <>
        <Pane className='h-screen basis-4/12'>
          <NavBar />
          {auth && data && <FriendRequestList friend_requests={data.friend_requests} />}
        </Pane>
        <CenterViewContainer>
          <Outlet />
        </CenterViewContainer>
        <Pane>
        </Pane>
    </>
  );
}

export default App;
