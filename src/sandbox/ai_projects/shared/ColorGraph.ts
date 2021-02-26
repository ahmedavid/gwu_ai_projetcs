export interface IEdge {
    from: number
    to: number
}

export class Edge  {
    constructor(private _from: number, private _to: number) {}

    get from() {
        return this._from
    }

    get to() {
        return this._to
    }
}



export class ColorGraph {
    static fromEdgeList(edges: IEdge[]) {
        const graph = new ColorGraph()

        debugger

        // Initialize Vertices
        for(let edge of edges) {
            const {from,to} = edge
            if(!graph.adjList[from]) {
                graph.adjList[from] = []
            }
            if(!graph.adjList[to]) {
                graph.adjList[to] = []
            }
        }

        // Initialize edges
        for(let edge of edges) {
            graph.addEdge(edge)
        }

        return graph
    }

    adjList: {[key: number]:  number[]} = {}

    addEdge(edge: IEdge) {
        const {from,to} = edge
        if(this.adjList[from].includes(to))
            return

        this.adjList[from].push(to)
        this.adjList[to].push(from)
    }
}