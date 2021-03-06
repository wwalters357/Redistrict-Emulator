function findElem(sectionId, elementUrl) {
	var currElem = angular.element("#appShell").scope().content[sectionId];
	for(var i = 0; i < elementUrl.length; i++) {
		currElem = currElem[elementUrl[i]];
	}
	return currElem;
}

angular.module('GuiUtil')
	.factory('GeneralUtilService', ['$http', '$cookies', '$rootScope',
		function($http, $cookies, $rootScope) {
			var service = {
				changeTabState: function(buttonId) {
					var tabSectionId = '#' + buttonId.replace('Btn', '');
					var accordionToolbarScope = angular.element(tabSectionId).scope();
					var accordionTab = accordionToolbarScope.$parent.$ctrl.accordion;

					// Invert open value and update button icon
					accordionTab.open = !accordionTab.open;
					var mainCtrlScope = angular.element("#appShell").scope();
					if (accordionTab.open) {
						accordionTab.expandButton.icon = mainCtrlScope.componentProp["accordBtnOpen"]["icon"];
					} else {
						accordionTab.expandButton.icon = mainCtrlScope.componentProp["accordBtnClosed"]["icon"];
					}
				},

				isSelected: function(selectId, element) {
					var select = angular.element("#" + selectId).scope().$ctrl.select;
					var selected = select.selected;
					var selectType = typeof selected;
					switch(element) {
						case "africanAmericanRange":
							element = $rootScope.demographics.AFRICAN_AMERICAN;
							break;
						case "asianRange":
							element = $rootScope.demographics.ASIAN;
							break;
						case "latinAmericanRange":
							element = $rootScope.demographics.HISPANIC;
							break;
					}

					if (selectType === "string") {
						return (selected === element);
					} else {
						return selected.includes(element);
					}
				},

				selectState: function(stateId) {
					if ($rootScope.globalData.programState == $rootScope.programStates.FREE) {
						var map = angular.element("#appShell").scope().usMap;
						var stateLayer = map.geojsonLayer.getLayer(map.getState(stateId));
						map.zoomToState({ target: stateLayer });
					}
				}
			};

			return service;
		}]);

function parseGui(guiStructure, componentProp, url) {
	if (guiStructure && "type" in guiStructure) {
		switch(guiStructure["type"]) {
			case "guiObj":
				url.push(guiStructure["url"]);
				return new GuiObj(url, guiStructure["classes"], guiStructure["ifClause"], 
								  guiStructure["flex"], guiStructure["layout"]);
			break;
			case "textBtn":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();
				return new TextButton(properties, 
									  guiStructure["id"], guiStructure["label"], 
									  guiStructure["text"], guiStructure["clickEvent"], 
					                  guiStructure["tooltip"],
									  guiStructure["tooltipDir"]);
			break;
			case "iconBtn":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();
				return new IconButton(properties, 
									  guiStructure["id"], guiStructure["label"], 
									  guiStructure["icon"], guiStructure["clickEvent"], 
									  guiStructure["tooltip"],
									  guiStructure["tooltipDir"]);
			break;
			case "numInput":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();
				return new NumberInput(properties, 
									   guiStructure["id"], guiStructure["label"], 
									   guiStructure["tooltip"], guiStructure["tooltipDir"], 
									   guiStructure["min"], guiStructure["max"], 
									   guiStructure["step"], guiStructure["value"], 
									   guiStructure["required"]);
			break;
			case "menu":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();

				var triggerUrl = url.slice();
				triggerUrl.push("triggerButton");
				var triggerProp = guiStructure["triggerButton"];
				var triggerButton = parseGui(triggerProp, componentProp, triggerUrl);

				var actions = [];
				url.push("actions");
				for(var i = 0; i < guiStructure.actions.length; i++) {
					var actionUrl = url.slice();
					actionUrl.push(i);
					actions.push(parseGui(guiStructure.actions[i], componentProp, actionUrl));
				}
				
				return new Menu(properties, 
								guiStructure["open"], triggerButton, 
								actions, guiStructure["direction"]);
			break;
			case "slideMeasure":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();
				return new SliderMeasure(properties, 
									   guiStructure["id"], guiStructure["label"], 
									   guiStructure["tooltip"], guiStructure["tooltipDir"], 
									   guiStructure["min"], guiStructure["max"], 
									   guiStructure["step"], guiStructure["value"]);
			break;
			case "rangeMeasure":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();
				return new RangeMeasure(properties, 
									   guiStructure["id"], guiStructure["label"], 
									   guiStructure["tooltip"], guiStructure["tooltipDir"], 
									   guiStructure["min"], guiStructure["max"], 
									   guiStructure["step"], guiStructure["value"],
									   componentProp[guiStructure["childProperties"]]);
			break;
			case "guiGroup":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();

				var sections = {};
				url.push("sections");
				for (var sectionID in guiStructure["sections"]) {
					var section = guiStructure["sections"][sectionID];
					var sectionUrl = url.slice();
					sectionUrl.push(sectionID);
					sections[sectionID] = parseGui(section, componentProp, sectionUrl);
				}
				
				return new GuiGroup(properties, guiStructure["id"], sections);
			break;
			case "select":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();
				return new SelectDisplay(properties, 
									  guiStructure["id"], guiStructure["label"], 
									  guiStructure["options"], guiStructure["selected"],
									  guiStructure["multiSelect"], guiStructure["onChange"]);
			break;
			case "accordTab":
				var properties = componentProp[guiStructure["properties"]];
				properties["url"] = url.slice();

				var expandUrl = url.slice();
				expandUrl.push("expandButton");
				var expandProp = componentProp[guiStructure["expandButton"]];
				expandProp["id"] = guiStructure["id"] + "Btn";
				var expandButton = parseGui(expandProp, componentProp, expandUrl);

				var contentUrl = url.slice();
				expandUrl.push("content");
				var content =  parseGui(guiStructure["content"], componentProp, contentUrl);
				return new AccordionTab(properties, 
									  guiStructure["id"], guiStructure["title"], 
									  content, guiStructure["flexOrder"],
									  guiStructure["open"], expandButton);
			break;
			default:
				return null;
		}
	} else {
		return null;
	}
}