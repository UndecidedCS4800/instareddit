import {Outlet} from 'react-router-dom';
import { AuthProvider } from "./components/auth"
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';

const App: React.FC = () => {

  return (
    <>
      <AuthProvider>
        <NavBar />
        <CenterViewContainer>
          <Outlet />
        </CenterViewContainer>
      </AuthProvider>
    </>
  );
}

export default App;
