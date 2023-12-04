import React, { useCallback, useEffect, useState } from 'react'
import {useNavigate} from 'react-router-dom';
import {useSocket} from '../../context/SocketProvider.jsx';
import Header from '../header/Header.js';
import './lobby.css'

function Lobby() {

  const [email, setEmail] = useState('');
  const [room, setRoom] = useState('');
  
  const socket = useSocket();
  const navigate = useNavigate();

  const handleSubmitForm = useCallback(
    (e)=>{
      e.preventDefault();  
      socket.emit('room:join', {email, room});
    },[email, room, socket]
  )

  const handleJoinRoom = useCallback(
    (data) => {
      const { email, room } = data;
      navigate(`/room/${room}`);
    },
    [navigate]
  );

  useEffect(()=>{
    socket.on('room:join', handleJoinRoom);
    return()=>{
      socket.off('room:join', handleJoinRoom);
    }
  },[socket, handleJoinRoom])

  return (
    <div className='Lobby'>
      <Header/>
      <div className='Lobby_form_frame'> 
        <div className='Lobby_form'>
          <h2>👋 Өрөө үүсгэх эсвэл нэгдэх</h2>       
          <form onSubmit={handleSubmitForm}>
            <label htmlFor='email'>Таны нэр</label>
            <input 
              placeholder='Email-ээ оруулна уу?'
              type="email" 
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}/>
            <label htmlFor='text'>Өрөөний нэр</label>
            <input 
              autocomplete="off"
              placeholder='Өрөөний тоо эсвэл нэрийг оруулна уу?'
              type="text"
              id='room'
              value={room}
              onChange={(e) => setRoom(e.target.value)}/>
            <button className='Lobby_button'>Өрөөнд орох</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Lobby
