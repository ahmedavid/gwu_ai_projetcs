package java_src.ai_prj1;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Scanner;

class Main {
    public static void main(String[] args) throws FileNotFoundException{
        String filename = "p1_graph.txt";
        if(args.length > 0) {
            filename = args[0];
        } else {
            System.out.println("Input file not provided, trying to open p1_graph.txt");
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

            graph.shortestPath(0, 99, "astar");


            System.out.println("DONE");
        }
    }
}