package com.giant.demo.entities;

import com.giant.demo.enums.StateE;

import javax.persistence.*;
import java.util.Set;

@Entity
public class State {
    @Id
    private int stateID;
    private StateE state;
    private int numOfDistricts;
    @OneToMany
    private Set<Cluster> districts;
    @OneToMany
    @JoinColumn(name = "clusterID")
    private Set<Cluster> majorityMinorityDistricts;
    private int population;
    @OneToOne
    private Demographics demographics;
    private int numMinorityDistricts;
    @Transient
    private Job weights;


    public State() {
    }

    public State(StateE state, int numOfDistricts, Set<Cluster> districts) {
        this.state = state;
        this.numOfDistricts = numOfDistricts;
        this.districts = districts;
    }


    public void displayMajorityMinorityDistricts(){

    }


    public StateE getState() {
        return state;
    }

    public void setState(StateE state) {
        this.state = state;
    }

    public int getNumOfDistricts() {
        return numOfDistricts;
    }

    public void setNumOfDistricts(int numOfDistricts) {
        this.numOfDistricts = numOfDistricts;
    }

    public Set<Cluster> getDistricts() {
        return districts;
    }

    public void setDistricts(Set<Cluster> districts) {
        this.districts = districts;
    }

    public Set<Cluster> getMajorityMinorityDistricts() {
        return majorityMinorityDistricts;
    }

    public void setMajorityMinorityDistricts(Set<Cluster> majorityMinorityDistricts) {
        this.majorityMinorityDistricts = majorityMinorityDistricts;
    }

    public int getPopulation() {
        return population;
    }

    public void setPopulation(int population) {
        this.population = population;
    }

    public int getStateID() {
        return stateID;
    }

    public void setStateID(int stateID) {
        this.stateID = stateID;
    }

    public Demographics getDemographics() {
        return demographics;
    }

    public void setDemographics(Demographics demographics) {
        this.demographics = demographics;
    }

    //needs to hold the number of minority majority districts
    public int getNumMinorityDistricts() {
        return this.numMinorityDistricts;
    }

    public Job getWeights() {
        return weights;
    }

    public void setWeights(Job weights) {
        this.weights = weights;
    }

    public Cluster findCluster(Precinct p){
        for(Cluster c : this.getDistricts()){
            if(c.getContainedPrecincts().contains(p))
                return c;
        }
        return null;
    }
}
