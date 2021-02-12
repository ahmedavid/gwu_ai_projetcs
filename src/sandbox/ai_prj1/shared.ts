export const START_COLOR = "#0d5abf"
export const GOAL_COLOR = "#3cc213"
export const WALL_COLOR = "#4d0b12"
export const PATH_COLOR = "#1da8cf"
export const VISITED_COLOR = "#cedb16"
export const TRACE_COLOR = "#890ce8"
export const DEFAULT_COLOR = "#ff4000"
export const CURRENT_COLOR = "#ff0000"



export interface IUIMessage {
    squareID: number
    color: string
}

export interface ICell {
    x: number
    y: number
}

export interface IEdge {
    from: number
    to: number
    distance: number
}

export interface IVertex {
    squareID: number
    vertexID: number
}

export const getSquarePos = (squareId: number,cols: number) => {
    const x = squareId % cols
    const y = squareId < cols ? squareId : Math.floor(squareId / cols)
    return {x,y}
}

export const delay = async (ms: number) => {
    return new Promise((res,rej) => {
        setTimeout(()=> res(ms),ms)
    })
}
