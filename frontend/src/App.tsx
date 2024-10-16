import {Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';

// eslint-disable-next-line @typescript-eslint/no-unused-vars

const App: React.FC = () => {



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
