import {Outlet} from 'react-router-dom';
import './App.css';
import NavBar from './NavBar';
import { AuthProvider } from "./components/auth"
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
