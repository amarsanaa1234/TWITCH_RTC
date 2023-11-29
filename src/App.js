import {Routes, Route} from 'react-router-dom';
import './App.css';
import LobbyScreen from './screens/lobby/Lobby';
import RoomScreen from './screens/room/Room';
import Main from './screens/main/Main';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Main/>}/>
        <Route path='/createRoom' element={<LobbyScreen/>}/>
        <Route path='/room/:roomId' element={<RoomScreen/>}/>
      </Routes>
    </div>
  );
}

export default App;
