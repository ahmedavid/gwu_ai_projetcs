import { IGameState } from "./Game"

export class Canvas {
    constructor(
        private ctx: CanvasRenderingContext2D,
        private width:number,
        private height:number,
        private rows:number,
        private cols:number,
        ) {}

    clearBoard() {
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0,0,this.width,this.height)
    }

    renderBoard(state: IGameState) {
        this.drawBoard()
        const n = this.width / this.rows

        // draw moves
        for(let x=0;x<this.cols;x++) {
            for(let y=0;y<this.rows;y++) {
                if(state[y][x] === 1) {
                    this.drawX(x,y)
                }
                else if(state[y][x] === -1) {
                    this.drawO(x,y)
                }
            }
        }

    }

    drawBoard() {
        const n = this.width / this.rows
        // Board background
        this.ctx.fillStyle = "#000000"
        this.ctx.fillRect(0,0,this.width,this.height)

        this.ctx.fillStyle = "#fff"
        this.ctx.strokeStyle = "#000"
        for(let x=0;x<this.cols;x++) {
            for(let y=0;y<this.rows;y++) {
                this.ctx.fillRect(x*n,y*n,n,n)
                this.ctx.strokeRect(x*n,y*n,n,n)
            }
        }
    }

    drawTicTac(type: "tic" | "tac", xCoord:number, yCoord: number) {
        const n = this.width / this.rows
        const x = Math.floor(xCoord / n)
        const y= Math.floor(yCoord / n)

        // this.drawCircle(x,y)
        if(type === "tic")
            // this.drawCircle(x,y)
            this.drawX(x,y)
        else
            this.drawO(x,y)
    }

    drawCircle(x:number, y:number) {
        const n = this.width / this.rows
        this.ctx.save()
        this.ctx.strokeStyle = "green"
        this.ctx.lineWidth = 8
        this.ctx.beginPath()
        this.ctx.arc(x*n  + n/2,y*n + n/2, 50,0,2 * Math.PI)
        this.ctx.stroke()
        this.ctx.restore()
    }

    drawX(x:number, y:number) {
        const n = this.width / this.rows
        this.ctx.save()
        this.ctx.fillStyle = "blue"
        this.ctx.font = "72px Arial";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText("X",x*n + n/2,y*n+n/2)
        this.ctx.restore()
    }

    drawO(x:number, y:number) {
        const n = this.width / this.rows
        this.ctx.save()
        this.ctx.fillStyle = "red"
        this.ctx.font = "72px Arial";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "center";
        this.ctx.fillText("O",x*n + n/2,y*n + n/2)
        this.ctx.restore()
    }

//     drawCell(cell: ICell, color: string) {
//         const {x,y} = cell
//         this.ctx.fillStyle = WALL_COLOR
//         this.ctx.strokeStyle = WALL_COLOR
//         this.ctx.strokeRect(x*this.cellWidth,y*this.cellHeight,this.cellWidth,this.cellHeight)
//         this.ctx.fillStyle = color
//         this.ctx.fillRect(x*this.cellWidth,y*this.cellHeight,this.cellWidth,this.cellHeight)
//     }

//     drawGrid() {
//         for(let i = 0; i < vertices.length; i++) {
//             const cell = getSquarePos(vertices[i].squareID,this.cols)
//             this.drawCell(cell,PATH_COLOR)
//         }
//     }
}

