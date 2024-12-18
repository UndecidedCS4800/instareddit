import { Outlet, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';
import { useEffect } from 'react';
import socket from './socket';
import { useAuth } from './components/auth';
import React from 'react';

const App: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();

  useEffect(() => {
    const connect = () => {
      if (auth) {
        socket.auth = { token: auth.token };
        socket.connect();
      }
    };
    connect();
  }, [auth]);

  // Hide NavBar when on the /login route
  const shouldHideNavBar = location.pathname === '/login';

  return (
    <>
      
      {!shouldHideNavBar && (
        <Pane className="h-screen basis-3/12">
          <NavBar />
        </Pane>
      )}

      <CenterViewContainer>
        <Outlet />
      </CenterViewContainer>

      <Pane>
      </Pane>
    </>
  );
};

export default App;
