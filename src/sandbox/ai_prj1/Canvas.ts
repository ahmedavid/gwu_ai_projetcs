import { getSquarePos, ICell, IVertex, PATH_COLOR, WALL_COLOR } from "./shared"

export class Canvas {
    cellWidth: number
    cellHeight: number
    grid: ICell[][] = []

    lastSquareID = -1
    
    constructor(
        private ctx: CanvasRenderingContext2D, 
        private width:number, 
        private height: number,
        private rows:number,
        private cols: number
        ) 
        {
            this.cellWidth = this.width / this.cols
            this.cellHeight = this.height / this.rows
        }

    drawBackground(colorString: string) {
        this.ctx.fillStyle = colorString
        this.ctx.fillRect(0,0,this.width,this.height)
    }

    drawCellBySquareID(squareID: number, color: string) {
        const cell = getSquarePos(squareID,this.cols)
        this.drawCell(cell,color)

        if(this.lastSquareID !== -1) {

        }
    }

    drawLine(sq1: number, sq2: number) {
        const c1 = getSquarePos(sq1,this.cols)
        const c2 = getSquarePos(sq2,this.cols)
        this.ctx.strokeStyle = "green"
        this.ctx.lineWidth = 5
        this.ctx.beginPath()
        this.ctx.moveTo((c1.x*this.cellWidth + this.cellWidth / 2),(c1.y*this.cellHeight + this.cellHeight/2) )
        this.ctx.lineTo((c2.x*this.cellWidth + this.cellWidth/2),(c2.y *this.cellHeight +this.cellHeight/2))
        this.ctx.stroke()
    }


    drawCell(cell: ICell, color: string) {
        const {x,y} = cell
        this.ctx.fillStyle = WALL_COLOR
        this.ctx.strokeStyle = WALL_COLOR
        this.ctx.strokeRect(x*this.cellWidth,y*this.cellHeight,this.cellWidth,this.cellHeight)
        this.ctx.fillStyle = color
        this.ctx.fillRect(x*this.cellWidth,y*this.cellHeight,this.cellWidth,this.cellHeight)
    }

    drawGrid(vertices: IVertex[], debug: boolean) {
        for(let i = 0; i < vertices.length; i++) {
            const cell = getSquarePos(vertices[i].squareID,this.cols)
            this.drawCell(cell,PATH_COLOR)
        }
    }
}

