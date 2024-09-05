import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import About from './About'; // Import the About component
import './About.css';
import { Teammate } from './schema';
import { getData } from './remote';

const App: React.FC = () => {
  const [count, setCount] = useState<number>(0); // Specify type for state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Teammate[] | null>(null);
  const handleDBClick = async () => {
    setLoading(false);
    try {
      const res = await getData();
      setData(res);
    } catch (e) {
      if (e instanceof Error) {
        console.log(e)
        setError(e);
      }
    }
    setLoading(false);
  }

  const dbResult = () => {
    if (error) {
      return <p>Failed to connect to db: {error.message}</p>
    }
    if (loading) {
      return <p>Loading</p>
    }
    let i = 0;
    return <div>
      {data?.map(tm => <p key={i++}>{tm.name}</p>)}
    </div>
  };
  return (
    <Router>
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
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div>
                  <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                  </a>
                  <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                  </a>
                </div>
                <h1>Vite + React</h1>
                <div className="card">
                  <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                  </button>
                  <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                  </p>
                </div>
                <p className="read-the-docs">
                  Click on the Vite and React logos to learn more
                </p>
                <div>
                  <button onClick={handleDBClick}>
                    Click me to load the table
                  </button>
                  {dbResult()}
                </div>
              </>
            }
          />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
