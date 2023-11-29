import React from 'react'
import './header.css';
import { Link } from 'react-router-dom';
function Header() {
  return (
    <div className='header'>
        <div className='header_frame'>
            <div className='header_icon'>icon</div>
            <h1 className='header_title'>Tech Stream</h1>
        </div>
        <div className='header_group_button'>
            <button className='header_button'>
                <Link to="/createRoom" className='aTag'>Create Room</Link>
            </button>
            <button className='header_button'>
                <Link to="/createRoom" className='aTag'>Join Room</Link>
            </button>
        </div>
    </div>
  )
}

export default Header;