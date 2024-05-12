import React from 'react'
import logo from '../assets/img/logo.png';

const Header = () => {
  return (
    <div className="nav">
        <img src={logo} alt="Logo" className='logo'/>
    </div>
  )
}

export default Header