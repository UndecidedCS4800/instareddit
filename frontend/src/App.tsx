import {Outlet} from 'react-router-dom';
import './App.css';
//import './About.css';
import NavBar from './NavBar';
// import Login from './Login';
// import Register from './Register';

const App: React.FC = () => {

  return (
      <div> 
        {/* use navbar */}
        <NavBar />
      {/*
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
          </ul>
        </nav>
  */}

      <Outlet />
      </div>
  );
}

export default App;
