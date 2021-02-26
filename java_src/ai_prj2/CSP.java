package java_src.ai_prj2;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

public class CSP {
    private int count = 0;
    private HashMap<String,HashSet<String>> adjList = new HashMap<>();
    private HashMap<String,HashSet<String>> domains = new HashMap<>();
    private Set<String> variables = new HashSet<>();
    private HashMap<String,String[]> constraints = new HashMap<>();

    public static CSP fromEdgeList(ArrayList<String[]> edgeList, ArrayList<String> colors) {
        CSP csp = new CSP();
        
        // Initialize Adjacency List
        for(String[] edge : edgeList) {
            csp.adjList.put(edge[0], new HashSet<>());
            csp.adjList.put(edge[1], new HashSet<>());
            // Initialize variables, if overwrite no problem, we use set
            csp.variables.add(edge[0]);
            csp.variables.add(edge[1]);
        }

        // Initialize Domains
        for(var v : csp.variables) {
            csp.domains.put(v, new HashSet<String>());
            var d = csp.domains.get(v);
            d.addAll(colors);
        }


        // Initialize Constraints
        // Duplicate edges are overriten because of set
        for(String[] edge : edgeList) {
            String v1 = edge[0];
            String v2 = edge[1];

            String key = "("+ v1 + "," + v2 + ")";

            csp.constraints.put(key, new String[2]);
            csp.constraints.get(key)[0] = v1;
            csp.constraints.get(key)[1] = v2;

            csp.adjList.get(v1).add(v2);
            csp.adjList.get(v2).add(v1);
        }

        return csp;
    }

    public HashMap<String,String> solve() {
        var result = backtrack(new HashMap<>(), this.domains);
        System.out.println("DFS Depth: " + count);
        return result;
    }

    // Check X arc consistency in respect to Y
    private boolean revise(String X, String Y, HashMap<String, HashSet<String>> domains) {
        boolean revised = false;
        ArrayList<String> toDelete = new ArrayList<>();

        for(var x : domains.get(X)) {
            boolean yHasValueToSatisfyX = false;
            for(var y : domains.get(Y)) {
                if(x != y) yHasValueToSatisfyX = true;
            }
            // if y has no value to satisfy constraint of x,
            // mark for deletion
            if(!yHasValueToSatisfyX) {
                toDelete.add(x);
                revised = true;
            }
        }
        // delete marked values from x domain
        for(var v : toDelete) {
            domains.get(X).remove(v);
        }
        return revised;
    }

    // Check arc consistentcy of givens list of arcs
    private boolean ac3(ArrayList<String[]> arcs,HashMap<String, HashSet<String>> domains) {
        if(arcs == null || arcs.size() == 0) {
            arcs = new ArrayList<String[]>();
            for(var v : variables) {
                for(var n: adjList.get(v)) {
                    arcs.add(new String[]{v,n});
                }
            }
        }

        Queue<String[]> queue = new LinkedList<>();
        for(var arc : arcs)
            queue.add(arc);

        while(!queue.isEmpty()) {
            String[] arc = queue.poll();
            String X = arc[0];
            String Y = arc[1];
            if(revise(X,Y,domains)) {
                //If domain for variable is empty, failure
                if(domains.get(X).size() == 0)
                    return false;
                
                for(var Z : adjList.get(X)) {
                    if(!Z.equals(Y)) {
                        queue.add(new String[]{Z,X});
                    }
                }
            }
        }
        return true;
    }

    // Use MRV heuristic in conjunction with Degree heuristic for tie break
    private String selectUnassignedVariable(HashMap<String,String> assignment, HashMap<String, HashSet<String>> domains) {
        ArrayList<String> unassigned = new ArrayList<>();
        for(var v : variables) {
            if(!assignment.containsKey(v)) {
                unassigned.add(v);
            }
        }

        unassigned.sort((String a, String b) -> adjList.get(a).size() - adjList.get(b).size());
        Collections.reverse(unassigned);
        unassigned.sort((String a, String b) -> domains.get(a).size() - domains.get(b).size());

        return unassigned.get(0);
    }

    // Backtrack dfs
    private HashMap<String,String> backtrack(HashMap<String,String> assignment,HashMap<String, HashSet<String>> domains) {
        count++;
        // Check if assignment is complete (All variables are assigned a value from domain)
        if(variables.size() == assignment.size())
            return assignment;

        var variable = selectUnassignedVariable(assignment, domains);
        // Try assign value to variable from domain
        for(var val : domains.get(variable)) {
            // copy assigment
            HashMap<String,String> newAssignment = new HashMap<>();
            for(var key : assignment.keySet()) {
                newAssignment.put(key, assignment.get(key));
            }
            newAssignment.put(variable,val);

            // copy domains
            HashMap<String, HashSet<String>> newDomains = new HashMap<>();
            for(var d : domains.keySet()) {
                HashSet<String> copyDomains = new HashSet<>();
                for(var c : domains.get(d))
                    copyDomains.add(c);
                newDomains.put(d, copyDomains);
            }

            if(consistent(newAssignment)) {
                // Interweave Arc consistency checking(Infrence) to increase performance
                // Merge inferences to assignments
                var inferences = inference(variable, newAssignment, newDomains);

                for(var key: inferences.keySet()){
                    newAssignment.put(key, inferences.get(key));
                } 

                var result = backtrack(newAssignment, newDomains);
                // Backtrack Success
                if(result.size() > 0) {
                    return result;
                }
            }
        }
        // Backtrack Failed, return empty
        return new HashMap<>();
    }

    private boolean consistent(HashMap<String,String> assignment) {
        // Only consider arcs where both are assigned
        for(var key : constraints.keySet()) {
            var entry = constraints.get(key);
            String x = entry[0];
            String y = entry[1];

            if(!assignment.containsKey(x) || !assignment.containsKey(y))
                continue;
            if(assignment.get(x).equals(assignment.get(y)))
                return false;
        }
        // If nothing inconsistent, then assignment is consistent
        return true;
    }

    private HashMap<String,String> inference(String variable, HashMap<String,String> assignment, HashMap<String, HashSet<String>> domains) {
        for(var v : assignment.keySet()) {
            HashSet<String> d= new HashSet<String>();
            d.add(assignment.get(v));
            domains.put(v, d);
        }

        ArrayList<String[]> arcs = new ArrayList<>();
        for(var neighbor: adjList.get(variable)) {
            arcs.add(new String[]{neighbor,variable});
        }

        // Check for Failure
        if(!ac3(arcs, domains))
            return new HashMap<String,String>();

        var inferences = new HashMap<String,String>();
        for(var d : domains.keySet()) {
            if(domains.get(d).size() == 1) {
                var x = domains.get(d);
                inferences.put(d, (String) x.toArray()[0]);
            }
        }
        return inferences;
    }
}
