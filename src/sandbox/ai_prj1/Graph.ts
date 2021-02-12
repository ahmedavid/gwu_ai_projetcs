import PriorityQueue from 'ts-priority-queue'
import { Observable, voidFn } from './Observable'
import {delay, IEdge, IUIMessage, IVertex, TRACE_COLOR, VISITED_COLOR, CURRENT_COLOR } from './shared'

const COLS = 10
const ROWS = 10
const DELAY = 50

const getSquarePos = (v: IVertex) => {
    const x = Math.floor(v.squareID / ROWS)
    const y = v.squareID % ROWS

    return {x,y}
}


// Heuristic function used in A*
const heur = (a: IVertex, b: IVertex) => {
    const aPos = getSquarePos(a)
    const bPos = getSquarePos(b)

    const side1 = Math.abs(aPos.x - bPos.x)
    const side2 = Math.abs(aPos.y - bPos.y)

    return Math.sqrt(side1*side1 + side2*side2)
}

type Algorithm = 'dijkstra' | 'astar'

export class Graph {
    adjList: {[key:number]: IEdge[]} = {}

    vertexMap: {[key:number] : number} = {}

    constructor(private observer: Observable<IUIMessage>) {}

    subscribe(fn: voidFn<IUIMessage>) {
        this.observer.subscribe(fn)
    }

    notifyUI(vertexID: number, color: string) {
        this.observer.notify({
            squareID: this.vertexMap[vertexID],
            color
        })
    }

    addEdge(from: number, to: number, distance: number) {
        if(!this.adjList[from]) {
            this.adjList[from] = []
        }
        if(!this.adjList[to]) {
            this.adjList[to] = []
        }

        this.adjList[from].push({from,to,distance})
        this.adjList[to].push({from,to,distance})
    }

    addEdges(edges: IEdge[]) {
        for(let {from,to,distance} of edges) {
            this.addEdge(from,to,distance)
        }
    }

    addVertex(v: IVertex) {
        this.vertexMap[v.vertexID] = v.squareID
    }

    addVertices(vertices: IVertex[]) {
        for(let vertex of vertices) {
            this.addVertex(vertex)
        }
    }

    printPath(end: number, parent: number[]) {
        const stack = []
        while(end !== -1) {
            stack.push(end)
            end = parent[end]
        }
        const path:number[] = []
        for(let i = stack.length - 1; i >= 0; i--) {
            path.push(stack[i])
            this.notifyUI(stack[i],TRACE_COLOR)
        }
        return path
    }

    countVisited = (visited: boolean[]) => {
        let count = 0
        for(let v of visited) {
            count++
        }
        return count
    }


    shortestPath(start:number, goal: number, searchType: Algorithm) {
        switch(searchType) {
            case 'dijkstra':
                this.dijkstra(start,goal)
                break
            case 'astar':
                this.astar(start,goal)
                break
            default:
                console.log("Error, please specify a valid search type")
        }
    }

    async dijkstra(start:number, goal: number) {
        let count = 0
        const dist = new Array(Object.keys(this.adjList).length).fill(Infinity)
        const parent = new Array(Object.keys(this.adjList).length).fill(-1)
        dist[start] = 0

        const agenda = new PriorityQueue<IEdge>({comparator: (a,b) => a.distance - b.distance})
        const selfEdge = {from:start, to:start, distance: 0}
        agenda.queue(selfEdge)

        while(agenda.length > 0) {
            const currEdge = agenda.dequeue()

            // Update UI
            this.notifyUI(currEdge.from,CURRENT_COLOR)

            await delay(DELAY)

            const currNode = currEdge.to
            if(currEdge.distance > dist[currNode]) {
                this.notifyUI(currEdge.from,VISITED_COLOR)
                continue
            }

            for(let edge of this.adjList[currNode]) {
                count++
                const {from,to, distance} = edge
                if(dist[currNode] + distance < dist[to]) {
                    dist[to] = dist[currNode] + distance
                    agenda.queue({from,to,distance: dist[to]})
                    parent[to] = currNode
                }
            }

            this.notifyUI(currEdge.from,VISITED_COLOR)
        }

        if(isFinite(dist[goal])) {
            // console.log("DIST: ", dist)
            console.log("PATH FOUND WITH COST: ", dist[goal])
            console.log("PATH: " + this.printPath(goal,parent))
            console.log("Dijkstra Visited nodes count: ", count)
        } else {
            console.log("DIJKSTRA NO SOLUTION")
        }
    }

    async astar(start:number, goal: number) {
        const agenda = new PriorityQueue<IEdge>({comparator: (a,b) => a.distance - b.distance})
        let visited: boolean[] = []
        let parent: number[] = []
        let gScore: number[] = []
        let fScore: number[] = []
        for(let i = 0; i < Object.keys(this.adjList).length; i++) {
            visited[i] = false
            parent[i] = -1
            gScore[i] = Infinity
            fScore[i] = Infinity
        }

        const selfEdge = {from:start,to: start, distance: 0}
        agenda.queue(selfEdge)
        visited[start] = true
        gScore[start] = 0
        const startVertex = {vertexID: start, squareID: this.vertexMap[start]}
        const goalVertex = {vertexID: goal, squareID: this.vertexMap[goal]}
        fScore[start] = heur(startVertex,goalVertex)

        while(agenda.length > 0) {
            const curr = agenda.dequeue()
            this.notifyUI(
                curr.from,
                CURRENT_COLOR
            )
                
            await delay(DELAY)

            // Goal Found
            if(curr.to === goal) {
                console.log("A* SUCCESS, visited node count: ",this.countVisited(visited))
                console.log(this.printPath(goal,parent))
                return
            }

            const neighbors = this.adjList[curr.to]
            for(let neighbor of neighbors) {
                const {from,to,distance} = neighbor
                const tempG = gScore[from] + distance
                if(tempG < gScore[to]) {
                    parent[to] = from
                    gScore[to] = tempG
                    const fromVertex = {vertexID: from, squareID: this.vertexMap[from]}
                    const toVertex = {vertexID: to, squareID: this.vertexMap[to]}
                    fScore[to] = tempG + heur(fromVertex,toVertex)
                    if(!visited[to]) {
                        agenda.queue(neighbor)
                    }
                }
            }

            this.notifyUI(curr.from,VISITED_COLOR)
        }

        console.log("A* No Solution")
    }
}