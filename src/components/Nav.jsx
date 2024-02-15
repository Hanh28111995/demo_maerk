import React from 'react'
import Logo from '../assets/images/logo.svg'

export default function Nav() {
    return (
        <nav className="nav--bar">
            <img className="logo" src={Logo} alt=''/>
            <button className="button--navbar">BUY NOW</button>
        </nav>
    )
}
