import React, { useEffect, useRef, useState } from 'react'
import { Canvas } from './Canvas'
import { Game } from './Game'
import { Moves } from './Moves'
import './TicTacToe.css'

const CANVAS_WIDTH = 600
const CANVAS_HEIGHT = 600

let canvasRef: React.RefObject<HTMLCanvasElement>
let canvas: Canvas
let game: Game

let myTurn = true
let aiBusy = false

function getPosFromCoords(xCoord:number, yCoord: number,n:number) {
    const x = Math.floor(xCoord / (CANVAS_WIDTH/n))
    const y = Math.floor(yCoord / (CANVAS_WIDTH/n))
    // console.log("X:",x,"Y:",y)
    return {x,y}
}

export const TicTacToe = () => {
    const [n,setN] = useState(4)
    const [isAI,setIsAI] = useState(true)
    const [isAIBusy,setIsAIBusy] = useState(false)
    canvasRef = useRef<HTMLCanvasElement>(null)

    const init = (n:number) => {
        myTurn = true
        game = new Game(n,canvas)
        game.render()
    }

    const aimove = () => {
        setIsAIBusy(true)
        const {x,y} = game.getBestMove()
        console.log("AI move:",x,y)
        setIsAIBusy(false)
        game.move(1,{x:y,y:x})
    }
    
    useEffect(() => {
        if(canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d')!
            canvas = new Canvas(ctx , CANVAS_WIDTH, CANVAS_HEIGHT,n,n)
    
            canvasRef.current.addEventListener('click', e => {
                const {x,y} = getPosFromCoords(e.offsetX,e.offsetY,n)
                if(myTurn) {
                    game.move(1,{x,y})
                    if(isAI) {
                        setIsAIBusy(true)
                        const {x,y} = game.getBestMove()
                        console.log("AI move:",x,y)
                        setIsAIBusy(false)
                        game.move(-1,{x,y})
                    } else {
                        myTurn = !myTurn
                    }
                } 
                else {
                    game.move(-1,{x,y})
                    myTurn = !myTurn
                }
            })

            init(n)
        }
    },[n])

    const handleChanged = (e:React.ChangeEvent<HTMLSelectElement>) => {
        setN(parseInt(e.target.value))
    }

    const getOptions = () => {
        return (
            <select id="nbybId" onChange={handleChanged} value={n}>
                {Array.from(Array(8).keys()).map( key => {
                    return <option key={key} value={key + 3}>{key+3}</option>
                })}
            </select>
        )
    }
    return (
        <div className="container">
            <Moves/>
            <h1>TTT Viewer: {n} | isAI: {isAI + ""}</h1>
            <span>NxN :</span>
            {getOptions()}
            <div className="spacer"></div>
            <div>
                <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} style={{display:'block'}}></canvas>
            </div>
            <div className="spacer"></div>
            <div>
                <input type="checkbox" checked={isAI} onChange={e => setIsAI(e.target.checked)}/>
                <button onClick={e => init(n)} disabled={isAIBusy}>Reset</button>
                <button onClick={e => aimove()} disabled={isAIBusy}>AI Move</button>
            </div>
        </div>
    )
}
