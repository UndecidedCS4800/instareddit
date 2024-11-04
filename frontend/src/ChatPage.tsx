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
  const [chatConnected, setChatConnected] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory>({});
  const [selectedChatWindow, setChatWindow] = useState<Friend | null>(null);

  const auth = useAuth();

  useEffect(() => {
    if (!auth?.token) return;

    socket.auth = { token: auth.token };

    const connectSocket = () => {
      socket.connect();

      getFriends(auth.token).then(friends => {
        if (!isError(friends)) {
          setData({ friends });
        } else {
          console.error('Error fetching friends:', friends);
        }
      });

      socket.on('connect', () => {
        setChatConnected(true);
        socket.emit('requestRestoredMessages');
      });

      socket.on('disconnect', () => setChatConnected(false));

      socket.on('restoredMessages', (messages: { withUser: number; messages: ChatMessage[] }[]) => {
        const restoredHistory = messages.reduce<ChatHistory>((accum, current) => {
          accum[current.withUser] = current.messages;
          return accum;
        }, {});
        setChatHistory(restoredHistory);
      });

      socket.on('message', (msg: Omit<ChatMessage, 'to'>) => {
        const to = (auth as JWTTokenResponse).id;
        setChatHistory(prevHistory => ({
          ...prevHistory,
          [msg.from]: (prevHistory[msg.from] || []).concat([{ to, ...msg }]),
        }));
      });
    };

    connectSocket();

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('restoredMessages');
      socket.off('message');
      socket.disconnect();
    };
  }, [auth]);

  const pushMessage = (withId: number, msg: ChatMessage) => {
    setChatHistory(prevHistory => ({
      ...prevHistory,
      [withId]: (prevHistory[withId] || []).concat(msg),
    }));
  };

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