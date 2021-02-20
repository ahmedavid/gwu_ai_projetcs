import React from 'react'
import { Link } from 'react-router-dom'
import './Nav.css'
const Nav = () => {
    return (
    <nav>
        <ul className='nav-list'>
            <li>
                <Link to='/'>Home</Link>
            </li>
            <li>
                <Link to='/netsim'>NetSim</Link>
            </li>
        </ul>
    </nav>
    )
}



export default Nav