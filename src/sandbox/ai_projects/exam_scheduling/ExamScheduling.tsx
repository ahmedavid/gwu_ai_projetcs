import React from 'react'
import { Graph, GraphNode } from "react-d3-graph";
import { CSP, IConstraint } from './CSP'

const colors = {
    "Mon" : "red",
    "Tue" : "green",
    "Wed" : "blue",
}

const constraints: IConstraint[] = [
    ["A","B"],
    ["A","C"],
    ["B","C"],
    ["B","D"],
    ["B","E"],
    ["C","E"],
    ["C","F"],
    ["D","E"],
    ["E","F"],
    ["E","G"],
    ["F","G"],
]

// const constraints: IConstraint[] = [
//     ["A","B"],
//     ["A","C"],
//     ["B","C"],
    
// ]

const csp = CSP.fromEdgeList(constraints)

// console.log(csp)
const result = csp.solve()
// 
console.log(result)
// console.log(csp)


const vertices = csp.getVertices()
const nodes = vertices.map(v => {
    return {id: v}
})

const links = constraints.map(c => {
    const source = c[0]
    const target = c[1]
    return {source,target}
})

const data = {
    nodes,
    links
  };

// the graph configuration, just override the ones you need
// const myConfig = {
//     nodeHighlightBehavior: true,
//     node: {
//       color: "lightgreen",
//       size: 3* 120,
//       highlightStrokeColor: "blue",
//       labelProperty: (node: GraphNode) => node.id + "(" + result[node.id] + ")"
//     },
//     link: {
//       highlightColor: "lightblue",
//     },
//   };
  
  export const ExamScheduling = () => {
      return (
          <div>
            <h1>Exam Scheduling</h1>
            {/* <Graph
              id="graph-id" // id is mandatory
              data={data}
              config={myConfig} 
            /> */}
        </div>
    )
}
