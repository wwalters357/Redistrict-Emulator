package com.giant.demo.returnreceivemodels;

import com.bedatadriven.jackson.datatype.jts.serialization.GeometryDeserializer;
import com.bedatadriven.jackson.datatype.jts.serialization.GeometrySerializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.giant.demo.entities.Demographics;
import com.giant.demo.enums.PartyPreference;
//import com.vividsolutions.jts.geom.Geometry;
import org.locationtech.jts.geom.Geometry;

public class ClusterModel {
    private int ClusterID;
    @JsonSerialize(using = GeometrySerializer.class)
    @JsonDeserialize(contentUsing = GeometryDeserializer.class)
    private Geometry boundaries;
    private int population;
    private Demographics demographics;
    private PartyPreference partyPreference;
    private boolean isMajorityMinority;
    private int numDemo;
    private int numRep;
    private int votes;

    public ClusterModel() {
    }

    public ClusterModel(int clusterID, Geometry boundaries, int population, Demographics demographics, PartyPreference partyPreference, boolean isMajorityMinority, int numDemo, int numRep, int votes) {
        ClusterID = clusterID;
        this.boundaries = boundaries;
        this.population = population;
        this.demographics = demographics;
        this.partyPreference = partyPreference;
        this.isMajorityMinority = isMajorityMinority;
        this.numDemo = numDemo;
        this.numRep = numRep;
        this.votes = votes;
    }

    public int getClusterID() {
        return ClusterID;
    }

    public void setClusterID(int clusterID) {
        ClusterID = clusterID;
    }

    public Geometry getBoundaries() {
        return boundaries;
    }

    public void setBoundaries(Geometry boundaries) {
        this.boundaries = boundaries;
    }

    public int getPopulation() {
        return population;
    }

    public void setPopulation(int population) {
        this.population = population;
    }

    public Demographics getDemographics() {
        return demographics;
    }

    public void setDemographics(Demographics demographics) {
        this.demographics = demographics;
    }

    public PartyPreference getPartyPreference() {
        return partyPreference;
    }

    public void setPartyPreference(PartyPreference partyPreference) {
        this.partyPreference = partyPreference;
    }

    public boolean isMajorityMinority() {
        return isMajorityMinority;
    }

    public void setMajorityMinority(boolean majorityMinority) {
        isMajorityMinority = majorityMinority;
    }

    public int getNumDemo() {
        return numDemo;
    }

    public void setNumDemo(int numDemo) {
        this.numDemo = numDemo;
    }

    public int getNumRep() {
        return numRep;
    }

    public void setNumRep(int numRep) {
        this.numRep = numRep;
    }

    public int getVotes() {
        return votes;
    }

    public void setVotes(int votes) {
        this.votes = votes;
    }


}
