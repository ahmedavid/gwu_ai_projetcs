export type IConstraint = [c1: string, c2: string]
export type IAssignment = {[key: string]: string}
export type IDomains = {[key: string]: Set<string>}

const DOMAINS = ["Mon", "Tue", "Wed"]

const objLen = (obj: Object) => Object.keys(obj).length

let count = 0

export class CSP {
    adjList: {[key:string]: Set<string>} = {}
    variables: Set<string> = new Set()
    constraints: {[key:string]: IConstraint} = {}
    domains: IDomains = {}

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

    getVertices() {
        return Array.from(this.variables)
    }

    solve() {
        //return this.backtrack(assignment, domains)
    }

    selectUnassignedVariable(assignment: IAssignment) {
        for(let v of this.variables) {
            if(!assignment[v])
                return v
        }
    }

    backtrack(assignment: IAssignment, domains: IDomains): IAssignment {
        count++
        console.log("COUNT:", count)
        // Check if assignment is complete (All variables are assigned a value from domain)
        if(this.variables.size === objLen(assignment))
            return assignment

        const variable = this.selectUnassignedVariable(assignment)
        if(!variable) return assignment

        for(const val of this.domains[variable]) {
            // copy assigment
            const newAssignment = {...assignment}
            // try new value for variable
            newAssignment[variable] = val

            // Does new assigment violate any constraints?
            if(this.consistent(newAssignment)) {
                //const n = this.getNeighborConstraints(variable)
                const n: IConstraint = this.getConstraint(variable,Array.from(this.adjList[variable])[0])
                
                if(this.ac3(n,domains)) {

                    const result = this.backtrack(newAssignment, domains)
                    // success
                    if(objLen(result) > 0) {
                        console.log("Backtrack count: ", count, result)
                        return result
                    }
                }
            }
        }

        // failure
        return {}
    }

    getNeighborConstraints(X: string): IConstraint[] {
        const constraints: IConstraint[] = []
        this.adjList[X].forEach(n => {
            constraints.push(this.getConstraint(X,n))
        })
        return constraints
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

    revise(X: string, Y: string, domains: IDomains) {
        let revised = false
        for(const x of domains[X]) {
            let yHasValueToSatisfyX = false
            for(const y of domains[Y]) {
                if(x !== y) yHasValueToSatisfyX = true
            }
            // if no y in Y.domain satisfies constraint for(X,Y)
            if(!yHasValueToSatisfyX) {
                domains[X].delete(x)
                revised = true
            }
        }

        return revised
    }

    ac3(constraint: IConstraint, domains: IDomains) {
        const queue: IConstraint[] = [constraint]

        while(queue.length > 0) {
            const constraint = queue.shift()!
            const [Y,X] = constraint
            if(this.revise(X,Y,domains)) {
                console.log("DOMAINS REVISED:", {...domains})
                if(domains[X].size === 0)
                    return false
                
                // for each Z in X.neighbors - {Y}
                for(const Z of this.adjList[X]) {
                    if(Z !== Y) {
                        const c = this.getConstraint(X,Z)
                        queue.push(c)
                    }
                }
            }
        }
        return true
    }
    
    getConstraint(X:string, Y: string) {
        const key1 = `(${X},${Y})`
        const key2 = `(${Y},${X})`
        return this.constraints[key1] ? this.constraints[key1] : this.constraints[key2]
    }

}