import {LoaderFunction, Outlet, useLoaderData} from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';
import FriendsList from './components/FriendsList';
import { Friend, isError } from './schema';
import { getFriends } from './remote';
import  socket  from './socket';
import { useEffect, useState } from 'react';
import { useAuth } from './components/auth';

export const loader: LoaderFunction<{friends: Friend[]}> = async (_args) => {
    const token = localStorage.getItem("token")

  if (token) {
    const friends = await getFriends(token);
    if (isError(friends)) {
      console.error("server error: ", friends)
    } else {
      return { friends }
    }
  }

  return {
    friends: [] as Friend[]
  }
}

const App: React.FC = () => {
  const loaderData = useLoaderData() as { friends: Friend[] };
  const [chatConnected, setChatConnected] = useState(socket.connected)

  const auth = useAuth()

  useEffect(() => {
    const connect = () => {
      if (auth) {
        socket.auth = { token: auth.token }
        socket.connect()
      }
      
    }
    connect()
  }, [auth])


  useEffect(() => {
    const onConnect = () => {
      setChatConnected(true)
    }

    const onDisconnect = () => {
      setChatConnected(false)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("message", () => {})
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }

  }, [])

  return (
    <>
        <Pane className='h-screen basis-4/12'>
          <NavBar/>
          {chatConnected && <FriendsList friends={loaderData.friends} />}
        </Pane>
        <CenterViewContainer>
          <Outlet />
        </CenterViewContainer>
    </>
  );
 
}

export default App;
