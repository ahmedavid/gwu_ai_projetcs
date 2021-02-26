export type IConstraint = [c1: string, c2: string]
export type IAssignment = {[key: string]: string}
export type IDomains = {[key: string]: Set<string>}

const DOMAINS = ["Mon", "Tue", "Wed"]

let count = 0

// Utils
const objLen = (obj:IAssignment) => Object.keys(obj).length

export class CSP {
    adjList: {[key:string]: Set<string>} = {}
    variables: Set<string> = new Set()
    constraints: {[key:string]: IConstraint} = {}
    domains: IDomains = {}

    static fromEdgeList(constraints: IConstraint[]) {
        const csp = new CSP()
        // Init Variables
        for(let edge of constraints) {
            const [c1,c2] = edge
            if(!csp.adjList[c1]) csp.adjList[c1] = new Set() 
            if(!csp.adjList[c2]) csp.adjList[c2] = new Set() 
            csp.adjList[c1].add(c2)
            csp.adjList[c2].add(c1)
            csp.variables.add(c1)
            csp.variables.add(c2)
            const key = `(${c1}, ${c2})`
            csp.constraints[key] = edge
            csp.domains[c1] = new Set([...DOMAINS])
            csp.domains[c2] = new Set([...DOMAINS])

        }
        console.log(csp)
        return csp
    }

    getVertices() {
        return Array.from(this.variables)
    }
    
    solve() {
        // init domain
        this.domains["A"] = new Set()
        this.domains["A"].add(DOMAINS[0])
        this.domains["A"].add(DOMAINS[2])

        this.domains["B"] = new Set()
        this.domains["B"].add(DOMAINS[2])

        this.domains["C"] = new Set()
        this.domains["C"].add(DOMAINS[1])
        this.ac3()
        return this.backtrack({})
    }

    selectUnassignedVariable(assignment: IAssignment) {
        for(let v of this.variables) {
            if(!assignment[v])
                return v
        }
    }
    
    backtrack(assignment: IAssignment): IAssignment {
        count++
        // Check if assignment is complete
        if(Object.keys(assignment).length === this.variables.size) {
            return assignment
        }

        // Try a new variable
        const variable = this.selectUnassignedVariable(assignment)!
        for(let d of DOMAINS) {
            // copy assignment
            let newAssignment = { ...assignment }
            newAssignment[variable] = d
            // this.domains[variable].add(d)
            // if(variable === "D") debugger
            if(this.consistent(newAssignment)) {
                // const inferences = this.inference(newAssignment)
                // if(Object.keys(inferences).length > 0) {
                //     newAssignment = {...newAssignment, ...inferences}
                // }
                let result =  this.backtrack(newAssignment)
                if(Object.keys(result).length > 0) {
                    console.log("Backtrack count: ", count)
                    return result
                }
            }
        }

        return {}
    }

    revise(constraint: IConstraint) {
        let revised = false
        const {"0": X, "1": Y} = constraint
        for(let x of this.domains[X]) {
            let yHasValueToSatisfyX = false
            for(let y of this.domains[Y]) {
                if(x !== y) {
                    yHasValueToSatisfyX = true
                }
            }
            if(!yHasValueToSatisfyX) {
                this.domains[X].delete(x)
                revised = true                    
            }
        }
        return revised
    }

    ac3() {
        const queue:IConstraint[] = []
        Object.keys(this.constraints).forEach(k => {
            queue.push(this.constraints[k])
        })
        while(queue.length > 0) {
            const constraint = queue.shift()!
            const {"0": X, "1": Y} = constraint
            if(this.revise(constraint)) {
                if(this.domains[X].size == 0)
                    return false

                for(const Z of this.adjList[X]) {
                    if(Z !== Y) {
                        const key1 = `(${Z},${X})`
                        const key2 = `(${X},${Z})`
                        const cst = this.constraints[key1] ? this.constraints[key1] : this.constraints[key2]
                        if(cst)
                            queue.push(cst)
                    }
                }
                
            }
        }
        return true
    }

    inference(assignment: IAssignment) {
        if(this.ac3()) {
            return {...assignment}

        }
        return {}
    }

    consistent(assignment: IAssignment) {
        // Only consider arcs where both are assigned
        // for(let {"0": x,"1": y} of this.constraints) {
        for(const key in this.constraints) {
            const {"0": x,"1": y} = this.constraints[key]
            if(!assignment[x] || !assignment[y])
                continue

            // If both have same value, then not consistent
            if(assignment[x] === assignment[y])
                return false
        }

        // If nothing inconsistent, then assignment is consistent
        return true
    }
}