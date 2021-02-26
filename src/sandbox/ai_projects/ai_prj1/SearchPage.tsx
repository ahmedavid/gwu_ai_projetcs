import React, { useEffect, useRef } from 'react'
import './SearchPage.css'
import graph_input from './input/input'
import { Canvas } from './Canvas'
import { Graph } from './Graph'
import { Observable } from './Observable'
import { CURRENT_COLOR, IUIMessage, PATH_COLOR, TRACE_COLOR, VISITED_COLOR, WALL_COLOR } from './shared'

const CANVAS_WIDTH = 500
const CANVAS_HEIGHT = 500
const COLS = 10
const ROWS = 10

// const edges = [
//     {
//         from: 1,
//         to: 2,
//         distance: 1
//     },
//     {
//         from: 2,
//         to: 3,
//         distance: 2
//     },
//     {
//         from: 3,
//         to: 4,
//         distance: 5
//     },
//     {
//         from: 4,
//         to: 1,
//         distance: 4
//     }
// ]

const {vertices, edges} = graph_input

let canvasRef: React.RefObject<HTMLCanvasElement>

let lastCell = -1

let runDijkstra: () => void
let runAstar: () => void

let start:number,goal:number, graph : Graph, observer: Observable<IUIMessage>, canvas: Canvas

const updateUI = (cellInfo: IUIMessage) => {
    canvas.drawCellBySquareID(cellInfo.squareID,cellInfo.color)
    if(lastCell !== -1) {
        //canvas.drawLine(lastCell,cellInfo.squareID)
    }
    lastCell = cellInfo.squareID
}

const init = () => {
    const ctx = canvasRef.current!.getContext('2d')
    if(ctx) {
        canvas = new Canvas(ctx , CANVAS_WIDTH, CANVAS_HEIGHT,ROWS,COLS)
        canvas.drawBackground(WALL_COLOR)
        canvas.drawGrid(vertices,false)

        observer = new Observable<IUIMessage>()
        graph = new Graph(observer)
    
        graph.subscribe(updateUI)
    
        graph.addEdges(edges)
        graph.addVertices(vertices)
    
        start = 0
        goal = 99
    }
}

export const SearchPage = () => {
    canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        init()
        
        runDijkstra = () => {
            graph.shortestPath(start,goal,'dijkstra')

        }
        runAstar = () => {
            graph.shortestPath(start,goal,'astar')
        }

        return () => {
            observer.unsubscribe(updateUI)
        }
    },[])
    
    return(
        <div style={{marginLeft:'100px'}}>
            <h3 >Uninformed vs Informed Search</h3>
            <p>Please open developer console to see algorithm output</p>
            <button className='btn' style={{margin:"20px"}} onClick={() => {
                init()
                runDijkstra()
            }}>Dijkstra</button>

            <button className='btn' style={{margin:"20px"}} onClick={() => {
                init()
                runAstar()
            }}>A*</button>
            <canvas width={CANVAS_WIDTH} height={CANVAS_HEIGHT} ref={canvasRef} style={{display:'block'}}></canvas>

            <h3>Legend</h3>
            <div className="legend">
                <div className="legend-box" style={{backgroundColor: TRACE_COLOR}}>
                    Shortest Path
                </div>
                <div className="legend-box" style={{backgroundColor: PATH_COLOR}}>
                    Occupied Squares
                </div>
                <div className="legend-box" style={{backgroundColor: WALL_COLOR}}>
                    Empty Squares
                </div>
                <div className="legend-box" style={{backgroundColor: VISITED_COLOR}}>
                    Visited Squares
                </div>
                <div className="legend-box" style={{backgroundColor: CURRENT_COLOR}}>
                    Currently Visited Square
                </div>
            </div>
        </div>
    )
}