package com.giant.demo.preprocessing;

import com.giant.demo.entities.Demographics;
import com.giant.demo.entities.Precinct;
import com.giant.demo.enums.StateE;
import com.giant.demo.repositories.PrecinctRepository;
import com.giant.demo.services.PreprocessService;
import org.json.simple.parser.ParseException;
import org.locationtech.jts.geom.*;
import org.locationtech.jts.simplify.TopologyPreservingSimplifier;
import org.locationtech.jts.geom.impl.CoordinateArraySequence;
import org.springframework.beans.factory.annotation.Autowired;


import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.stereotype.Service;

import javax.management.ObjectInstance;
import java.io.FileReader;
import java.io.IOException;
import java.util.*;

@Service
public class PreProcess {
    @Autowired
    private PreprocessService preprocessService;
    private static int counter = 0;

    public PreProcess(){

    }

    public void loadPrecincts() {
        JSONParser parser = new JSONParser();
        Set<Precinct> precincts = new HashSet();

        Object obj = null;
        try {
            obj = parser.parse(new FileReader("src/main/resources/public/vaprecincts.json"));
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        JSONObject jo = (JSONObject) obj;
        Map<Integer, Precinct> precinctMap = new HashMap<>();
        Set<Precinct> allPrecincts = new HashSet<>();

        int loadCounter= 0;
        for (Iterator iterator = jo.keySet().iterator(); iterator.hasNext(); ) {
            String key = (String) iterator.next();
            Map p = (Map) jo.get(key);
            Integer precinctID = Long.valueOf((long) p.get("precinctID")).intValue();
            String countyID = (String) p.get("county");
            String name = (String) p.get("name");
            Integer pop = Long.valueOf((long) p.get("pop")).intValue();
            Integer votes = (int) (long) p.get("votes");
            Double demo = (double)p.get("demo");
            Double rep = (double) p.get("rep");
            if (pop==0){
                pop = (int)Math.ceil(demo + rep);
            }
            if (votes == 0){
                votes = (int)Math.ceil(demo + rep);
            }

            if (pop == 0){
                pop = 100;
            }

            if (votes == 0){
                votes = 100;
            }

            double africanAmerican = (long)p.get("africanAmerican") / (double)pop;
            double asian = (long) p.get("asian") / (double)pop;
            double latinAmerican = (long) p.get("latinAmerican") / (double)pop;
            double white = (long) p.get("white") / (double)pop;
            double other = (long) p.get("other") / (double)pop;

            africanAmerican = Double.valueOf(africanAmerican);
            asian = Double.valueOf(asian);
            latinAmerican = Double.valueOf(latinAmerican);
            white = Double.valueOf(white);
            other = Double.valueOf(other);
            pop = Integer.valueOf(pop);

            Demographics demographics = new Demographics(africanAmerican, asian, latinAmerican, white, other, pop);

            JSONArray array = (JSONArray) p.get("neighbor");

            int[] numbers = new int[array.size()];
            int index = 0;
            for (Object o : array) {
                numbers[index++] = (int) (long) o;
            }

            //System.out.println(Arrays.toString(numbers));*/


            Map shape = (Map) p.get("shape");

            //how to read in shape file

            GeometryFactory geometryFactory = new GeometryFactory();
            //Polygon polygon = geometryFactory.createPolygon(shape.get("coordinates"));
            JSONArray coords = (JSONArray) shape.get("coordinates");
            coords = (JSONArray) coords.get(0);





            index = 0;
            if(coords.size() == 1){
                coords = (JSONArray) coords.get(0);
            }
            Coordinate[] coordinates = new Coordinate[coords.size()];
            for(Object object : coords){
                JSONArray coord = (JSONArray) object;
                double x = (double) coord.get(0);
                double y = (double) coord.get(1);
                coordinates[index++] = new Coordinate(x, y);

            }
            CoordinateSequence coordinateSequence = new CoordinateArraySequence(coordinates);
            Geometry polygon = geometryFactory.createPolygon(coordinateSequence);

            StateE stateE = StateE.VA;

//            if (stateE == StateE.VA){
//                polygon = new TopologyPreservingSimplifier(polygon).getResultGeometry();
//            }

            //add county tp precint construvto
            Precinct precinct = new Precinct(precinctID, name, pop, votes, demo, rep, polygon, demographics, stateE, numbers, countyID);
            precinctMap.put(precinctID, precinct);
            allPrecincts.add(precinct);
            preprocessService.savePrecinct(precinct);
            System.out.println("Saving: "+ loadCounter++);


        }
        for(Precinct precinct : allPrecincts) {
            Set<Precinct> neighbors = new HashSet<>();

            int[] tempNs = precinct.getTempNs();
            for (int i=0; i<tempNs.length; i++) {
                neighbors.add(precinctMap.get(tempNs[i]));
            }
            precinct.setNeighbours(neighbors);
            preprocessService.savePrecinct(precinct);
            System.out.println(counter++ + " out of " + allPrecincts.size());
            }
        System.out.println("Preprocessing has finished...");
        }
}
