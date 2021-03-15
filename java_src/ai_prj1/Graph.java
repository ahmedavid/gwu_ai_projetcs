package java_src.ai_prj1;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Stack;

public class Graph {
    public static int COLS = 10;
    public static int ROWS = 10;

    private HashMap<Integer, HashSet<Edge>> adjList = new HashMap<>();
    private HashMap<Integer, Integer> vertexMap = new HashMap<>();

    private double[] getSqurePos(int vertexID, int squareID) {
        double[] result = new double[2];

        result[0] = Math.floor(vertexMap.get(vertexID) / ROWS);
        result[1] = squareID / ROWS;

        return result;
    }

    // Eucledean Distance
    private double heur(int a, int b) {
        double[] aPos = getSqurePos(a, vertexMap.get(a));
        double[] bPos = getSqurePos(b, vertexMap.get(b));

        double side1 = Math.abs(aPos[0] - bPos[0]);
        double side2 = Math.abs(aPos[1] - bPos[1]);

        return Math.sqrt(side1*side1 + side2*side2);
    }

    public void addEdge(int from, int to, int distance) {
        Edge edge1 = new Edge(from, to, distance);
        Edge edge2 = new Edge(to, from, distance);

        if(!adjList.containsKey(from))
            adjList.put(from, new HashSet<>());
        if(!adjList.containsKey(to))
            adjList.put(to, new HashSet<>());

        var s1 = adjList.get(from);
        var s2 = adjList.get(to);
        s1.add(edge1);
        s2.add(edge2);
    }

    public void addEdges(List<String[]> edges) {
        for (var edge : edges)
            addEdge(
                Integer.parseInt(edge[0]),
                Integer.parseInt(edge[1]),
                Integer.parseInt(edge[2])
            );
    }

    public void addVertex(int vertexID, int squareID) {
        vertexMap.put(vertexID, squareID);
    }

    public void addVertices(List<String[]> vertices) {
        for (var v : vertices)
            addVertex(Integer.parseInt(v[0]), Integer.parseInt(v[1]));
    }

    private void printPath(int end, int[] parent) {
        Stack<Integer> stack = new Stack<>();

        while(end != -1) {
            stack.push(end);
            end = parent[end];
        }

        ArrayList<Integer> path = new ArrayList<>();
        for(int i = stack.size() - 1; i >= 0; i--)
            path.add(stack.pop());
        
        System.out.println(path);
    }

    public void shortestPath(int start, int goal, String searchType) {
        switch (searchType) {
            case "dijkstra":
                dijkstra(start, goal);
                break;
            case "astar":
                astar(start, goal);
                break;
            default:
                System.out.println("Error, please specify a valid search type");
                break;
        }
    }

    private void dijkstra(int start, int goal) {
        int[] dist = new int[adjList.size()];
        int[] parent = new int[adjList.size()];
        Arrays.fill(dist, Integer.MAX_VALUE);
        Arrays.fill(parent, -1);

        dist[start] = 0;

        PriorityQueue<Edge> agenda = new PriorityQueue<>();
        var selfEdge = new Edge(start, start, 0);
        agenda.add(selfEdge);

        while (!agenda.isEmpty()) {
            Edge currEdge = agenda.poll();
            int currNode = currEdge.getTo();
            if(currEdge.getDistance() > dist[currNode])
                continue;
            
            for(var edge : adjList.get(currNode)) {
                int from = edge.getFrom();
                int to = edge.getTo();
                int distance = edge.getDistance();
                if(dist[currNode] + distance < dist[to]) {
                    dist[to] = dist[currNode] + distance;
                    agenda.add(new Edge(from,to,dist[to]));
                    parent[to] = currNode;
                }
            }
        }

        if(dist[goal] < Integer.MAX_VALUE) {
            System.out.println("Dijkstra Path found with cost: " + dist[goal]);
            printPath(goal, parent);
        }
        else {
            System.out.println("Dijkstra No Solution");
            System.exit(1);
        }
    }

    private void astar(int start, int goal) {
        int len = adjList.size();
        PriorityQueue<Edge> agenda = new PriorityQueue<>();
        boolean[] visited = new boolean[len];
        int[] parent = new int[len];
        double[] gScore = new double[len];
        double[] fScore = new double[len];

        for(int i=0;i<len;i++) {
            visited[i] = false;
            parent[i] = -1;
            gScore[i] = Double.MAX_VALUE;
            fScore[i] = Double.MAX_VALUE;
        }

        var selfEdge = new Edge(start, start, 0);
        agenda.add(selfEdge);
        visited[start] = true;
        gScore[start] = 0;
        fScore[start] = heur(start, goal);

        while(!agenda.isEmpty()) {
            Edge currEdge = agenda.poll();

            // Goal Found
            if(currEdge.getTo() == goal) {
                System.out.println("A* Found Path with cost: "+ gScore[goal]);
                printPath(goal, parent);
                System.exit(1);
            }

            var neighbors = adjList.get(currEdge.getTo());
            for(var neighbor : neighbors) {
                int to = neighbor.getTo();
                int from = neighbor.getFrom();
                int distance = neighbor.getDistance();
                double tempG = gScore[from] + distance;
                if(tempG < gScore[to]) {
                    parent[to] = from;
                    gScore[to] = tempG;
                    fScore[to] = tempG + heur(from, to);
                    if(!visited[to])
                        agenda.add(neighbor);
                }
            }
        }

        // If no solution found fail
        System.out.println("A* didn't find solution");
    }
    
    private class Edge implements Comparable<Edge>{
        private int from;
        private int to;
        private int distance;
    
        public Edge(int from, int to, int distance) {
            this.setFrom(from);
            this.setTo(to);
            this.setDistance(distance);
        }
    
        public int getFrom() {
            return from;
        }
    
        public void setFrom(int from) {
            this.from = from;
        }
    
        public int getDistance() {
            return distance;
        }
    
        public void setDistance(int distance) {
            this.distance = distance;
        }
    
        public int getTo() {
            return to;
        }
    
        public void setTo(int to) {
            this.to = to;
        }

        @Override
        public int compareTo(Edge o) {
            return distance - o.getDistance();
        }
    }
}

