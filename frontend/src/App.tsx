import {Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';
import { useEffect } from 'react';
import socket from './socket';
import { useAuth } from './components/auth';

const App: React.FC = () => {
  const auth = useAuth()
  useEffect(() => {
    const connect = () => {
      if (auth) {
        socket.auth = { token: auth.token };
        socket.connect();
      }
    };
    connect();
  }, [auth]);


  return (
    <>
        <Pane className='h-screen basis-4/12'>
          <NavBar />
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