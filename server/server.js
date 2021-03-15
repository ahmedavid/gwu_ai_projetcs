const axios = require('axios')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())



const BASE_URL = 'https://www.notexponential.com/aip2pgaming/api/index.php'
const API_KEY = 'b50e09d24155e0aee7cc'

function setHeaders() {
    axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.common['x-api-key'] = API_KEY
    axios.defaults.headers.common['userId'] = 1046
}

const getTeam = async () => {
    setHeaders()
    const response = await axios.get(`${BASE_URL}?type=team&teamId=1243`)

    return response.data
}

const getGame = async (gameId) => {
    setHeaders()
    const response = await axios.get(`${BASE_URL}?type=moves&gameId=${gameId}&count=20`)

    console.log(response.data)

    return response.data
}

const getBoard = async (gameId) => {
    setHeaders()
    const response = await axios.get(`${BASE_URL}?type=boardString&gameId=${gameId}`)

    console.log(response.data)

    return response.data
}

const PORT = process.env.PORT || 8080

app.get('/game', async (req,res) => {
    const data = await getGame(1310)
    res.json(data)
})

app.get('/board', async (req,res) => {
    const data = await getBoard(1309)
    res.json(data)
})

app.listen(PORT, () => console.log('Server running on port ', PORT))
