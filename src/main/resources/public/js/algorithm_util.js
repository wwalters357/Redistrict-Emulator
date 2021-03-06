'use strict';
angular.module('AlgoUtil')
    .factory('AlgorithmService', function($rootScope, $mdToast, $http, $interval) {
        var service = this;
        service.formatData = function(data) {
            var result = {};
            result["stateE"] = $rootScope.globalData.selectedState;
            result["numDistricts"] = data.mainControls.numDistrictInput;
            result["compactnessWeight"] = {
                "polsPopSlider": data.measureTabs.compactnessTab.polsPopSlider,
                "schwartzSlider": data.measureTabs.compactnessTab.schwartzSlider,
                "convexHullSlider": data.measureTabs.compactnessTab.convexHullSlider,
                "reockSlider": data.measureTabs.compactnessTab.reockSlider
            };
            result["partyFairSlider"] = data.measureTabs.partFairTab.partFairSlider;
            result["efficiencyGapSlider"] = data.measureTabs.partFairTab.efficiencyGapSlider;
            result["populationEquality"] = data.measureTabs.popEqTab.popEqSlider;
            result["numMajorityMinorityDistricts"] = data.measureTabs.majMinTab.numMajMin;
            var demoList = ["africanAmericanRange", "asianRange", "latinAmericanRange"];
            angular.forEach(demoList, function(demo) {
                var rangeGroup = data.measureTabs.majMinTab.minSettingsGroup;
                if (rangeGroup[demo]) {
                    result[demo.replace("Range", "")] =	{
                        "low": rangeGroup[demo].low,
                        "high": rangeGroup[demo].high
                    };
                } else {
                    result[demo.replace("Range", "")] = null;
                }
            }, result);

            return result;
        };

        service.startSingleRun = function() {
            if ($rootScope.globalData.selectedState !== "") {
                $rootScope.globalData.programState = $rootScope.programStates.RUNNING;
            } else {
                $mdToast.showSimple("State not selected.");
                return null;
            }
        };

        service.makeSingleRunRequest = function() {
            var url = "single-run";
            var data = angular.element("#appShell").scope().content["singleRun"].packData();
            data = service.formatData(data);
            return $http.post(url, data);
        };

        service.getSummary = function() {
            $rootScope.globalData.programState = $rootScope.programStates.PENDING;
            $rootScope.globalData.mode = "summary";
            var url = "getSummary";
            $http.get(url).then(function(summaryInfo) {
                console.log(summaryInfo);
                angular.element("#appShell").scope().summaryObj = summaryInfo.data;
            }, function(errResponse) {
                $mdToast.showSimple("Error loading summary page.");
                service.finishSingleRun();
            });
        };

        service.getMove = function() {
            var url = "getmoves";
            $http.get(url).then(function(moveInfo) {
                if (moveInfo.data !== "") {
                    console.log(moveInfo);
                    if (moveInfo.data.finished) {
                        $interval.cancel($rootScope.simAnnealPromise);
                        service.getSummary();
                    } else {
                        var mainCtrl = angular.element("#appShell").scope();
                        var precinctID = moveInfo.data.precinctID;
                        var oldClusterID = moveInfo.data.fromID;
                        var newClusterID = moveInfo.data.toId;
                        mainCtrl.usMap.moveCluster(precinctID, oldClusterID, newClusterID);
                    }
                }
            }, function(errResponse) {
                console.log("No move currently available.")
            });
        };

        service.startSimAnneal = function() {
            $rootScope.globalData.programState = $rootScope.programStates.RUNNING;
            var url = "start-simulatedAnnealing";
            $http.post(url, {}).then(function(success) {
                // Make interval that requests 'getmoves' until flag is received
                console.log("Phase II finished.");
            }, function(error) {
                $mdToast.showSimple("Phase II could not be initiated.");
            });

            $rootScope.simAnnealPromise = $interval(function() { service.getMove(); }, 300);
        };

        service.saveMap = function() {
            var url = "saveMap";
            var user = $rootScope.globalData.user;
            $http.post(url, user).then(function(saveResponse) {
                $mdToast.showSimple("Map saved successfully.")
            }, function(errResponse) {
                $mdToast.showSimple("Problem saving map.");
            });
        };

        service.finishSingleRun = function() {
            $rootScope.globalData.selectedState = "";
            $rootScope.globalData.programState = $rootScope.programStates.FREE;
            $rootScope.globalData.mode = "singleRun";
            angular.element("#appShell").scope().usMap.reset();
        };

        return service;
    });