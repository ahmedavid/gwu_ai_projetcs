export type IDomains = {[key:string]: Set<string>}
export type IConstraint = [c1: string, c2: string]
export type IAssignment = {[key: string]: string}


let count = 0

const objLen = (obj: Object) => Object.keys(obj).length

const DOMAINS = ["Mon", "Tue", "Wed"]

export class CSP {
    variables: Set<string> = new Set()
    domains: IDomains = {}
    adjList: {[key:string]: Set<string>} = {}
    constraints: {[key:string]: IConstraint} = {}

    static fromEdgeList(constraints: IConstraint[]) {
        const csp = new CSP()
        // Init Variables
        for(let constraint of constraints) {
            const [v1,v2] = constraint
            csp.variables.add(v1)
            csp.variables.add(v2)

            csp.adjList[v1] = new Set() 
            csp.adjList[v2] = new Set() 
        }
        for(let constraint of constraints) {
            const [v1,v2] = constraint

            const key = `(${v1},${v2})`
            csp.constraints[key] = constraint
            csp.domains[v1] = new Set([...DOMAINS])
            csp.domains[v2] = new Set([...DOMAINS])

            csp.adjList[v1].add(v2)
            csp.adjList[v2].add(v1)
        }
        console.log(csp)
        return csp
    }

    solve() {
        return this.backtrack({}, this.domains)
    }

    revise(X: string, Y: string,domains: IDomains) {
        let revised = false

        const toDelete = []
        for(let x of domains[X]) {
            let yHasValueToSatisfyX = false 
            for(let y of domains[Y]) {
                if(x !== y) yHasValueToSatisfyX = true
            }
            // if y has no value to satisfy constraint of x,
            // mark for deletion
            if(!yHasValueToSatisfyX) {
                toDelete.push(x)
                revised = true
            }
        }
        // delete marked values from x domain
        toDelete.forEach(d => domains[X].delete(d))

        return revised
    }

    ac3(arcs: IConstraint[], domains: IDomains) {
        // Add all arc in the problem if arcs list is empty
        if(arcs.length === 0) {
            for(let variable in this.adjList) {
                for(let neighbor in this.adjList[variable]) {
                    arcs.push([variable, neighbor])
                }
            }
        }
        const queue = arcs

        while(queue.length > 0) {
            const constraint = queue.shift()!
            const [X,Y] = constraint
            if(this.revise(X,Y, domains)) {
                //If domain for variable is empty, failure
                if(domains[X].size === 0)
                    return false
                for(const Z of this.adjList[X]) {
                    if(Z !== Y) {
                        queue.push([Z,X])
                    }
                }
            }
        }
        return true
    }

    // Use MRV heuristics, if a tie, choose the variable with highest degree
    selectUnassignedVariable(assignment: IAssignment,domains: IDomains) {
        const unassigned = []
        for(let v of this.variables) {
            if(!assignment[v])
                unassigned.push(v)
        }
        // Sort by degree ascending
        unassigned.sort((a,b) => this.adjList[a].size - this.adjList[b].size)
        unassigned.reverse()
        // Sort by mrv
        unassigned.sort((a,b) => domains[a].size - domains[b].size)

        return unassigned[0]
    }

    backtrack(assignment: IAssignment, domains: IDomains): IAssignment {
        count++
        // Check if assignment is complete (All variables are assigned a value from domain)
        if(this.variables.size === objLen(assignment))
            return assignment

        const variable = this.selectUnassignedVariable(assignment,domains)
        if(!variable) return assignment
        
        // Try assign value to variable from domain
        for(const val of domains[variable]) {
            // copy assigment
            let newAssignment = {...assignment}
            // try new value for variable
            newAssignment[variable] = val

            let newDomains: IDomains = {}
            // Deep copy domains
            for(const key in domains) {
                newDomains[key] = new Set(Array.from(domains[key]))
            }

            // Does new assigment violate any constraints?
            if(this.consistent(newAssignment)) {
                // Merge inferences to assignments
                // const inferences = this.inference(variable,newAssignment, newDomains)
                // newAssignment = {...newAssignment, ...inferences}

                const result = this.backtrack(newAssignment, newDomains)!
                // Backtrack Success
                if(objLen(result) > 0) {
                    console.log("Count:", count)
                    return result
                }
            }
        }

        // Backtrack Failed
        return {}
    }

    consistent(assignment: IAssignment) {
        // Only consider arcs where both are assigned
        for(const key in this.constraints) {
            const [x,y] = this.constraints[key]
            if(!assignment[x] || !assignment[y])
                continue

            // If both have same value, then not consistent
            if(assignment[x] === assignment[y])
                return false
        }
        // If nothing inconsistent, then assignment is consistent
        return true
    }

    inference(variable: string, assignment: IAssignment, domains: IDomains) {
        for(const v in assignment) {
            domains[v] = new Set([assignment[v]])
        }
        const arcs: IConstraint[] = []
        for(const neighbor of this.adjList[variable]) {
            arcs.push([neighbor,variable])
        }

        // Failure?
        if(!this.ac3(arcs, domains)) {
            return {}
        }

        const inferences: IAssignment = {}

        for(let v in domains) {
            if(domains[v].size === 1)
                inferences[v] = Array.from(domains[v])[0]
        }

        return inferences
    }

}