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
  const [data, setData] = useState<{ friends: Friend[], friend_requests: FriendRequest[] } | null>(null)
  const [chatConnected, setChatConnected] = useState(socket.connected)
  const [chatHistory, setChatHistory] = useState<ChatHistory>({})
  const [selectedChatWindow, setChatWindow] = useState<Friend | null>(null)

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
    const getData = async () => {
      if (auth) {
        const friends = await getFriends(auth.token);
        const friend_requests = await getFriendRequests(auth.token, auth.username);
        if (isError(friends)) {
          console.error("server error: ", friends)
        } else if (isError(friend_requests)) {
          console.error("server error", friend_requests)
        } else {
          setData({
            friends,
            friend_requests,
          })
        }
      }
    }

    getData()

  }, [auth])

  const pushMessage = (withId: number, msg: ChatMessage) => {
    console.log(msg);
    if (chatHistory == null) {
      setChatHistory({ [withId]: [msg]})
    } else if (!chatHistory[withId]) {
      setChatHistory({...chatHistory, [withId]: [msg] })
    } else {
      console.log(chatHistory[withId])
      setChatHistory({...chatHistory, [withId]: chatHistory[withId].concat([msg])})
    }
  }

  useEffect(() => {
    const onConnect = () => {
      setChatConnected(true)
    }

    const onDisconnect = () => {
      setChatConnected(false)
    }

    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    
    return () => {
      socket.off("connect", onConnect)
      socket.off("disconnect", onDisconnect)
    }

  }, [])

  useEffect(() => {
    const restoredMessages = (messages: { withUser: number, messages: ChatMessage[]}[]) => {
      console.log(messages)
     setChatHistory(
        messages.reduce<ChatHistory>((accum, current) => ({ [current.withUser]: current.messages, ...accum}), {})
      )
    }

    const chatMessage = (msg: Omit<ChatMessage, "to">) => {
      const to = (auth as JWTTokenResponse).id
      console.log("chatMessage", msg)
      if (chatHistory == null) {
        setChatHistory({ [msg.from]: [{to, ...msg}]})
      } else if (!chatHistory[msg.from]) {
        setChatHistory({...chatHistory, [msg.from]: [{to, ...msg}] })
      } else {
        setChatHistory(
          { ...chatHistory, [msg.from]: chatHistory[msg.from].concat([{ to, ...msg }]) }
        )
      }
    }
    socket.on("restoredMessages", restoredMessages)
    socket.on("message", chatMessage)

    return () => {
      socket.off("restoredMessages", restoredMessages)
      socket.off("message", chatMessage)
    }
  }, [chatHistory, auth] )

  return (
    <>
        <Pane>
          <NavBar />
          {chatConnected ? <div>Connected to chat</div> : <></>}
          {auth && data && <FriendsList friends={data.friends} setWindowHandler={setChatWindow} />}
          {auth && data && <FriendRequestList friend_requests={data.friend_requests} />}
        </Pane>
        <CenterViewContainer>
          <Outlet />
        </CenterViewContainer>
        <Pane>
          {selectedChatWindow && auth && <ChatWindowView user={selectedChatWindow} pushHistory={pushMessage} history={chatHistory[selectedChatWindow.id]} />}
        </Pane>
    </>
  );
}

export default App;
