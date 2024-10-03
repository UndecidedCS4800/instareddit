import {Outlet} from 'react-router-dom';
import { AuthProvider } from "./components/auth"
import NavBar from './NavBar';

const App: React.FC = () => {

  return (
    <>
      <AuthProvider>
        <NavBar />
        <Outlet />
      </AuthProvider>
    </>
  );
}

export default App;
