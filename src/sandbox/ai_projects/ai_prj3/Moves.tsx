import React, { useEffect } from 'react'
import axios from 'axios'

import './Moves.css'

// const BASE_URL = 'https://www.notexponential.com/aip2pgaming/api/index.php?type=team&teamId=1243'
const BASE_URL = 'http://localhost:8080'

const parseBoardString = (boardString: string) => {
    const board: number[][] = []
    boardString.trim()
    let rows = boardString.split('\n')
    for(let i=0;i<rows.length-1;i++) {
        board.push([])
        const symbols = rows[i].split('')
        for(let j=0;j<symbols.length;j++) {
            if(symbols[j] === 'X')
                board[i].push(1)
            else if(symbols[j] === 'O')
                board[i].push(-1)
            else 
                board[i].push(0)
        }
    }

    return board
}

const getTeam = async () => {
    // axios.defaults.headers.common['Authorization'] = 'Basic Og=='
    // axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    // axios.defaults.headers.common['x-api-key'] = API_KEY
    //const data = await axios.get(`${PROXY_URL}${BASE_URL}?type=team&teamId=1243`)
    const data = await axios.get(`${BASE_URL}/board`)
    console.log("DATA: ",data.data)

    const b = parseBoardString(data.data.output)
    console.log(b)
}

export const Moves = () => {
    useEffect(() => {
        getTeam()
    }, [])
    return (
        <div className="moves">
            <h1>Moves</h1>
        </div>
    )
}