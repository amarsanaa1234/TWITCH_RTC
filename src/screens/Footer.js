import React from 'react'
import './footer.css';
function Footer() {
  return (
    <div className='footer'>
        <div className='footer_count'>
            <h2>Шууд дамжуулалт: </h2>
            <h1>0</h1>
        </div>
        <div className='footer_room_status'></div>
    </div>
  )
}

export default Footer