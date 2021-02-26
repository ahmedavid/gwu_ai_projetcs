import React from 'react'
import { CSP, IConstraint } from './CSP'

const edges = [
    {
        from: 1,
        to: 3
    },
    {
        from: 2,
        to: 18
    },
    {
        from: 3,
        to: 19
    },
    {
        from: 2,
        to: 19
    },
    {
        from: 2,
        to: 19
    }
]


// const constraints: IConstraint[] = [
//     ["A","B"],
//     ["A","C"],
//     ["B","C"],
//     ["B","D"],
//     ["B","E"],
//     ["C","E"],
//     ["C","F"],
//     ["D","E"],
//     ["E","F"],
//     ["E","G"],
//     ["F","G"],
// ]
// A B C D E F G
// 1 2 3 4 5 6 7
const constraints: IConstraint[] = [
    ["1","2"],
    ["1","3"],
    ["2","3"],
    ["2","4"],
    ["2","5"],
    ["3","5"],
    ["3","6"],
    ["4","5"],
    ["5","6"],
    ["5","7"],
    ["6","7"],
]

const csp = CSP.fromEdgeList(constraints)
const result = csp.solve()

console.log(result)



export const MapColoring = () => {
    return (
        <h1>Map Coloring</h1>
    )
}
