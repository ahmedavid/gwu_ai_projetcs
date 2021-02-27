package java_src.ai_prj1;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Scanner;

class Main {
    public static void main(String[] args) throws FileNotFoundException{
        String filename = "p1_graph.txt";
        String algorithm = "astar";
        if(args.length > 1) {
            filename = args[0];
            if(!(args[1].equals("dijkstra") || args[1].equals("astar"))) {
                System.out.println("Specify a search algorithm (astar, dijkstra)");
                System.exit(1);
            }
            algorithm = args[1];

        } else {
            System.out.println("Missing arguments. example : java java_src.ai_prj1.Main p1_graph.txt astar");
            System.exit(1);
        }
        URL path = Main.class.getResource(filename);
        File f = new File(path.getFile());
        try(Scanner sc = new Scanner(f)){
            ArrayList<String[]> vertices = new ArrayList<>();
            ArrayList<String[]> edges = new ArrayList<>();

            while(sc.hasNextLine()) {
                var line = sc.nextLine();
                if(line.matches("\\d+,\\d+")) {
                    String[] values = line.split(",");
                    vertices.add(values);
                }
                else if(line.matches("\\d+,\\d+,\\d+")) {
                    String[] values = line.split(",");
                    edges.add(values);
                }
            }

            Graph graph = new Graph();
            graph.addVertices(vertices);
            graph.addEdges(edges);

            graph.shortestPath(0, 99, algorithm);


            System.out.println("DONE");
        }
    }
}