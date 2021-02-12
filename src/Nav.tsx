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
                <Link to='/mazetest'>Maze Test</Link>
            </li>
            <li>
                <Link to='/mazeproject1'>AI Project1</Link>
            </li>
            <li>
                <Link to='/mazegenerator'>Maze Generator</Link>
            </li>
        </ul>
    </nav>
    )
}



export default Nav