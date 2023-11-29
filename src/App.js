import {Routes, Route} from 'react-router-dom';
import './App.css';
import LobbyScreen from './screens/Lobby';
import RoomScreen from './screens/Room';
import Header from './screens/Header';
import Main from './screens/Main';
import Footer from './screens/Footer';

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
