import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Teammate } from './schema'
import { getData } from './remote'

function App() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [data, setData] = useState<Teammate[] | null>(null);
  const handleDBClick = async () => {
    setLoading(false);
    try {
      const res = await getData();
      setData(res);
    } catch (e){
      console.log(e)
      setError(true);
    }
    setLoading(false);
  }

  const dbResult = () => {
    if (error) {
      return <p>Failed to connect to db:</p>
    }
    if (loading) {
      return <p>Loading</p>
    }
    let i = 0;
    return <div>
      {data?.map(tm => <p key={i++}>{tm.name} {tm.fruit}</p>)}
    </div>
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h2>{import.meta.env.VITE_BACKEND_URL}</h2>
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
  )
}

export default App
