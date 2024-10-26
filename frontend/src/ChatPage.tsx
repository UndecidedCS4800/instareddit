import { useEffect, useState } from 'react';
import { ChatHistory, ChatMessage, Friend, isError, JWTTokenResponse } from './schema';
import { getFriends } from './remote';
import socket from './socket';
import { useAuth } from './components/auth';
import FriendsList from './components/FriendsList';
import ChatWindowView from './components/ChatWindow';
import MessageBubble from '../public/Messages.png';

const ChatPage: React.FC = () => {
  const [data, setData] = useState<{ friends: Friend[] } | null>(null);
  const [chatConnected, setChatConnected] = useState(socket.connected);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [selectedChatWindow, setChatWindow] = useState<Friend | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  const auth = useAuth();

  useEffect(() => {
    const connect = () => {
      if (auth) {
        socket.auth = { token: auth.token };
        socket.connect();
      }
    };
    connect();
  }, [auth]);

  useEffect(() => {
    const friends = async () => {
      if (auth) {
        const friends = await getFriends(auth.token);
        if (isError(friends)) {
          console.error('server error: ', friends);
        } else {
          setData({ friends });
        }
      }
    };

    friends();
  }, [auth]);

  const pushMessage = (withId: number, msg: ChatMessage) => {
    if (chatHistory == null) {
      setChatHistory({ [withId]: [msg] });
    } else if (!chatHistory[withId]) {
      setChatHistory({ ...chatHistory, [withId]: [msg] });
    } else {
      setChatHistory({ ...chatHistory, [withId]: chatHistory[withId].concat([msg]) });
    }
  };

  useEffect(() => {
    const onConnect = () => {
      setChatConnected(true);
    };

    const onDisconnect = () => {
      setChatConnected(false);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  useEffect(() => {
    const restoredMessages = (messages: { withUser: number; messages: ChatMessage[] }[]) => {
      setChatHistory(
        messages.reduce<ChatHistory>((accum, current) => ({ [current.withUser]: current.messages, ...accum }), {})
      );
    };

    const chatMessage = (msg: Omit<ChatMessage, 'to'>) => {
      const to = (auth as JWTTokenResponse).id;
      if (chatHistory == null) {
        setChatHistory({ [msg.from]: [{ to, ...msg }] });
      } else if (!chatHistory[msg.from]) {
        setChatHistory({ ...chatHistory, [msg.from]: [{ to, ...msg }] });
      } else {
        setChatHistory({ ...chatHistory, [msg.from]: chatHistory[msg.from].concat([{ to, ...msg }]) });
      }
    };

    socket.on('restoredMessages', restoredMessages);
    socket.on('message', chatMessage);

    return () => {
      socket.off('restoredMessages', restoredMessages);
      socket.off('message', chatMessage);
    };
  }, [chatHistory, auth]);
  // const revalidator = useRevalidator()

  return (
    <>
    
      <div className='h-screen basis-3/12 bg-[#342c33] p-8 border-r border-[#514350]'>
        {chatConnected ? <div><img src={MessageBubble} alt="Message Bubble" className="px-7 w-35 h-7" /></div> : <></>}
        {auth && data && <FriendsList friends={data.friends} setWindowHandler={setChatWindow} />}
      </div>
    
      <div className='h-screen flex-1 bg-[#342c33]'>
        {selectedChatWindow && auth && <ChatWindowView user={selectedChatWindow} pushHistory={pushMessage} history={chatHistory[selectedChatWindow.id]} />}
      </div>
    </>
  );
};

export default ChatPage;
