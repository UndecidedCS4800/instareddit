import {Outlet} from 'react-router-dom';
import './App.css';
import NavBar from './NavBar';
const App: React.FC = () => {

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default App;
