'use strict';
angular.module('AlgoUtil')
    .factory('AlgorithmService', function($rootScope, $mdToast) {
        var service = this;
        service.formatData = function(data) {
            var result = {};
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
                var url = "single-run";
                var data = angular.element("#appShell").scope().content["singleRun"].packData();
                data = service.formatData(data);
                $http.post(url, data)
                    .then(function(successResponse) {
                        console.log(successResponse);
                    }, function(errorResponse) {

                    });
            } else {
                $mdToast.showSimple("State not selected.");
            }
        };

        return service;
    });