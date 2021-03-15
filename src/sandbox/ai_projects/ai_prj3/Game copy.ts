type ICellState = 0 | 1 | -1
type IGameState = ICellState[][]
type IPlayer = "X" | "O"

interface IAction {
    x: number
    y: number
}

export class Game {
    gameState : IGameState = [
        [0,1,-1],
        [-1,1,0],
        [1,0,-1],
    ]    
    // gameState : IGameState = [
    //     [1,0,0],
    //     [0,0,0],
    //     [0,0,0],
    // ]

    constructor(private n:number) {
        this.initStateMatrix()
    }

    private initStateMatrix() {
        // for(let x=0;x<this.n;x++) {
        //     this.gameState.push([])
        //     for(let y=0;y<this.n;y++) {
        //         this.gameState[x].push(0)
        //     }
        // }
    }

    copyState(state: IGameState) {
        const newState = []
        for(let i=0;i<this.n;i++) {
            newState.push([...state[i]])
        }

        return newState
    }

    move() {
        const player = this.player(this.gameState)

        if(player === 1) {
            const res = this.maxValue(this.copyState(this.gameState))
            console.log("UTIL: ",res,this.gameState)
        } else {
            const res = this.minValue(this.gameState)
            console.log("UTIL: ",res)
        }
    }

    player(state: IGameState) {
        let xCount = 0
        let oCount = 0
        for(let i=0;i<this.n;i++) {
            for(let j=0;j<this.n;j++) {
                if(state[i][j] === 1) xCount++
                else if(state[i][j] === -1) oCount++
            }
        }

        return xCount === oCount ? 1 : -1
    }

    actions(state: IGameState) {
        const actions: IAction[] = []
        for(let i=0;i<this.n;i++) {
            for(let j=0;j<this.n;j++) {
                if(state[i][j] === 0)
                    actions.push({x:i,y:j})
            }
        }

        return actions
    }

    result(state: IGameState, action: IAction) {
        const {x,y} = action
        const player = this.player(state)
        state[x][y] = player
        return state
    }

    utility(state: IGameState): number {
        let rowSet = new Set<ICellState>()
        let colSet = new Set<ICellState>()
        let diag1Set = new Set<ICellState>()
        let diag2Set = new Set<ICellState>()

        for(let i=0;i<this.n;i++) {
            rowSet = new Set<ICellState>()
            colSet = new Set<ICellState>()
            for(let j=0;j<this.n;j++) {
                rowSet.add(state[i][j])
                colSet.add(state[j][i])

                if(i == j) {
                    diag1Set.add(state[i][j])
                }
                if(i + j === this.n - 1) {
                    diag2Set.add(state[i][j])
                }
            }

            // check rows
            if(rowSet.size === 1) {
                return Array.from(rowSet)[0]
            }

            //check cols
            if(colSet.size === 1) {
                return Array.from(colSet)[0]
            }
        }
        // check diagonals
        if(diag1Set.size === 1) {
            return Array.from(diag1Set)[0]
        }
        if(diag2Set.size === 1) {
            return Array.from(diag2Set)[0]
        }

        // Drawn
        return 0
    }

    terminal(state: IGameState) {
        if(this.utility(state) !== 0 || this.actions(state).length === 0) {
            return true
        }
        
        return false
    }

    minimax(state: IGameState) {
        const next_player = this.player(state)
        const optimal_action = []

        if(next_player === 1) {
            return this.maxValue(state)
        } else {
            return this.minValue(state)
        }
    }

    maxValue(state: IGameState) {
        let v = -Infinity
        if(this.terminal(state)) {
            const util = this.utility(state)
            return {util,action: undefined}
        }
        const actions =  this.actions(state)
        let bestAction = {util:-1,action:actions[0]}
        for(let action of actions) {
            const newState = this.copyState(state)
            const result = this.result(newState,action)
            v = Math.max(v, this.minValue(result).util)
            if(v > bestAction.util) {
                bestAction.util = v
                bestAction.action = action
            }
        }

        return bestAction
    }

    minValue (state: IGameState) {
        let v = -Infinity
        if(this.terminal(state)) {
            const util = this.utility(state)
            return {util,action: undefined}
        }
        const actions =  this.actions(state)
        let bestAction = {util:1,action:actions[0]}
        for(let action of actions) {
            const newState = this.copyState(state)
            const result = this.result(newState,action)
            v = Math.max(v, this.maxValue(result).util)
            if(v > bestAction.util) {
                bestAction.util = v
                bestAction.action = action
            }
        }

        return bestAction
    }
}