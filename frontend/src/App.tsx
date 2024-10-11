import {Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';
import FriendsList from './components/FriendsList';
import { ChatHistory, ChatMessage, Friend, isError, JWTTokenResponse } from './schema';
import { getFriends } from './remote';
import  socket  from './socket';
import { useEffect, useState } from 'react';
import { useAuth } from './components/auth';
import ChatWindowView from './components/ChatWindow';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const App: React.FC = () => {
  const [data, setData] = useState<{ friends: Friend[] } | null>(null)
  const [chatConnected, setChatConnected] = useState(socket.connected)
  const [chatHistory, setChatHistory] = useState<ChatHistory>({})
  const [selectedChatWindow, setChatWindow] = useState<number | null>(null)

  const auth = useAuth()
  console.log("history", chatHistory[34])

  useEffect(() => {
    console.log("effect auth running")
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
    const friends = async () => {
      if (auth) {
        const friends = await getFriends(auth.token);
        if (isError(friends)) {
          console.error("server error: ", friends)
        } else {
          setData( {friends})
        }
      }
    }

    friends()

  }, [auth])

  const pushMessage = (withId: number, msg: ChatMessage) => {
    if (chatHistory == null) {
      console.log('new history')
      setChatHistory({ [withId]: [msg]})
    } else if (!chatHistory[withId]) {
      console.log('new chat')
      setChatHistory({...chatHistory, [withId]: [msg] })
    } else {
      console.log('concat')
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

    const chatMessage = (msg: Omit<ChatMessage, "to">) => {
      const to = (auth as JWTTokenResponse).id
      console.log("to:", to)
      console.log("got msg", msg)
      console.log(chatHistory[msg.from])
      if (chatHistory == null) {
        setChatHistory({ [msg.from]: [{to, ...msg}]})
      } else {
        setChatHistory(
          { ...chatHistory, [msg.from]: chatHistory[msg.from].concat([{ to, ...msg }]) }
        )
    }}

    const restoredMessages = (messages: { withUser: number, messages: ChatMessage[]}[]) => {
      console.log("restoring")
      console.log(messages)
      setChatHistory(
        messages.reduce<ChatHistory>((accum, current) => ({ [current.withUser]: current.messages, ...accum}), {})
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

  // const revalidator = useRevalidator()

  return (
    <>
        <Pane>
          <NavBar />
          {chatConnected ? <div>Connected to chat</div> : <></>}
          {auth && data && <FriendsList friends={data.friends} setWindowHandler={setChatWindow} />}
        </Pane>
        <CenterViewContainer>
          <Outlet />
        </CenterViewContainer>
        <Pane>
          {selectedChatWindow && auth && <ChatWindowView user={selectedChatWindow} pushHistory={pushMessage} history={chatHistory[selectedChatWindow]} />}
        </Pane>
    </>
  );
}

export default App;
