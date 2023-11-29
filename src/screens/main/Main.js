import React from 'react'
import './main.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import mainImg from '../../img/mainImg.png'

function Main() {
  return (
    <>
        <Header/>
        <div className='main'>
            <div className='main_title'>
                <h1>Интерактив чат, дамжуулалт</h1>
            </div>
            <div className='main_img'>
                <img src={mainImg} alt="image" width={400} height={500}/>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default Main