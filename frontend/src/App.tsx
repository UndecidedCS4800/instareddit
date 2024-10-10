import {LoaderFunction, Outlet, useLoaderData} from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';
import FriendsList from './components/FriendsList';
import { ChatHistory, ChatMessage, Friend, isError, JWTTokenResponse } from './schema';
import { getFriends } from './remote';
import  socket  from './socket';
import { useEffect, useState } from 'react';
import { useAuth } from './components/auth';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loader: LoaderFunction<{friends: Friend[]}> = async (_args) => {
    const token = localStorage.getItem("token")

  if (token) {
    const friends = await getFriends(token);
    console.log("friends", friends)
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
  const [chatHistory, setChatHistory] = useState<ChatHistory | null>(null)
  const [selectedChatWindow, setChatWindow] = useState<number | null>(null)

  const auth = useAuth()
  console.log(auth)

  useEffect(() => {
    const connect = () => {
      if (auth) {
        socket.auth = { token: auth.token }
        socket.connect()
        console.log("connected!")
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

    const chatMessage = (msg: Omit<ChatMessage, "to">) => {
      const to = (auth as JWTTokenResponse).id
      if (chatHistory == null) {
        setChatHistory({ [msg.from]: [{to, ...msg}]})
      } else {
        setChatHistory(
          { [msg.from]: chatHistory[msg.from].concat({ to, ...msg }), ...chatHistory }
        )
      }
    }

    const restoredMessages = (messages: { withId: number, messages: ChatMessage[]}[]) => {
      setChatHistory(
        messages.reduce<ChatHistory>((accum, current) => ({ [current.withId]: current.messages, ...accum}), {})
      )
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("message", chatMessage)
    socket.on("restoredMessages", restoredMessages)

    
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
      socket.off("message", chatMessage)
      socket.off("restoredMessages", chatMessage)
    }

  }, [])

  return (
    <>
        <Pane>
          <NavBar />
          {chatConnected && <FriendsList friends={loaderData.friends} setWindowHandler={setChatWindow} />}
        </Pane>
        <CenterViewContainer>
          <Outlet />
        </CenterViewContainer>
        <Pane>
          {/* {selectedChatWindow && <ChatWindow user={selectedChatWindow} history={chatHistory[selectedChatWindow]} />} */}
        </Pane>
    </>
  );
}

export default App;
