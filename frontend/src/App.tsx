import {LoaderFunction, Outlet, useLoaderData} from 'react-router-dom';
import NavBar from './NavBar';
import { CenterViewContainer } from './components/CenterViewContainer';
import Pane from './components/Pane';
import FriendsList from './components/FriendsList';
import { Friend, isError } from './schema';
import { getFriends } from './remote';

export const loader: LoaderFunction<{friends: Friend[]}> = async (_args) => {
    const token = localStorage.getItem("token")

  if (token) {
    const friends = await getFriends(token);
    if (isError(friends)) {
      console.error("server error: ", friends)
    } else {
      return { friends }
    }
  }

  return {
    friends: [] as Friend[]
  }
}

const App: React.FC = () => {
  const loaderData = useLoaderData() as { friends: Friend[] };

  return (
    <>
        <Pane>
          <NavBar />
          <FriendsList friends={loaderData.friends} />
        </Pane>
        <CenterViewContainer>
          <Outlet />
        </CenterViewContainer>
    </>
  );
}

export default App;
