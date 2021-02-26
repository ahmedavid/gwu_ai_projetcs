package java_src.ai_prj2;

import java.io.File;
import java.io.FileNotFoundException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Scanner;

class Main {
    
    public static void main(String[] args) throws FileNotFoundException{
        String filename = "input.txt";
        if(args.length > 0) {
            filename = args[0];
        } else {
            System.out.println("Input file not provided, trying to open input.txt");
        }
        URL path = Main.class.getResource(filename);
        File f = new File(path.getFile());
        try(Scanner sc = new Scanner(f)){
            ArrayList<String[]> edgeList = new ArrayList<>();
            Integer colors = 0;

            while(sc.hasNextLine()) {
                var line = sc.nextLine();
                if(line.contains("color")) {
                    line = line.replaceAll("\\D+", "");
                    colors = Integer.parseInt(line);
                } else if(line.matches("\\d+,\\d+")) {
                    String[] values = line.split(",");
                    edgeList.add(values);
                }
            }

            ArrayList<String> colorsList = new ArrayList<>();
            for(int i = 0;i< colors;i++) {
                colorsList.add(i + 1 + "");
            }

            CSP csp = CSP.fromEdgeList(edgeList,colorsList);
            HashMap<String, String> result = csp.solve();


            System.out.println(result);
        }
    }
}