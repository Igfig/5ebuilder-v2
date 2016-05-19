var app = angular.module("monsterBuilder", []);
app.controller("monsterController", function($scope, $http) {
	
	/* load static variables from JSON */
	$http.get("js/lists.json").then(function(lists){
		for (list in lists.data){
			$scope[list] = lists.data[list];
		}
		
		/* init variables depending on static variables */
		$scope.monster = {};
		//$scope.monster.size = $scope.SIZES[0];
		$scope.monster.size = $scope.SIZES['Medium'];
		$scope.monster.type = 'humanoid';
		$scope.monster.alignment = 'any alignment';
		$scope.monster.hd = 2;
	});
	
	$scope.abilities = [ { name : "Str", score : 10, mod : 0 },
	                     { name : "Dex", score : 10, mod : 0 }, 
	                     { name : "Con", score : 10, mod : 0 },
	                     { name : "Int", score : 10, mod : 0 }, 
	                     { name : "Wis", score : 10, mod : 0 },
	                     { name : "Cha", score : 10, mod : 0 } ];
	/*$scope.abilities = {"Str": { score : 10, mod : 0 },
						"Dex": { score : 10, mod : 0 }, 
						"Con": { score : 15, mod : 0 },
						"Int": { score : 10, mod : 0 }, 
						"Wis": { score : 10, mod : 0 },
						"Cha": { score : 10, mod : 0 }};*/
	
	
	
	for (var ability in $scope.abilities) {
		bindModToAbility(ability);
	}
	
	
	// bind ability scores and mods
	
	//functions, but a little messy maybe?
	function bindModToAbility(ability) {
		$scope.$watch("abilities['" + ability + "'].score", function(score) {
			$scope.abilities[ability].mod = Math.floor((score - 10) / 2);
		});
	}
	
	//try to do it using the local scope created by ng-repeat
	/*function bindModToAbility(ability) {
		$scope.$watch("", function(){
			
		});
	}*/
	
	/*for (ability in $scope.abilities) {
	$scope.$watch(function(){return ability.score}, function(score, old, scope) {
		ability.mod = Math.floor((score - 10) / 2);
	});
	}*/
	/*$scope.watchCollection('abilities', function(){
		
	});*/
	/*
	 * $scope.getAbilityMod = function(ability) { return Math.floor((ability -
	 * 10) / 2); }
	 */
});
