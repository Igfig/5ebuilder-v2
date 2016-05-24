/* TODO: find a better way to refer to Con mod than "monster.abilities[2].mod"
 * Ideally, should be able to refer to it by name
 */


var app = angular.module("monsterBuilder", []);
app.controller("monsterController", function($scope, $http, $filter) {
	
	/* load variables from JSON */
	$http.get("js/lists.json").then(function(lists){
		for (list in lists.data){
			$scope[list] = lists.data[list];
		}
		
		/* initialize dependent variables */
		$scope.monster.size = getFromArray($scope.SIZES, 'Medium');
			//$filter('filter')($scope.SIZES, {name:'Medium'})[0];
		//$scope.monster.speed.ground = $scope.monster.size.speed;
		
		// bind ability scores to mods (and save bonuses?)
		for (var ability in $scope.monster.abilities) {
			bindModToAbility($scope.monster.abilities[ability]);
		}
		
		// calculate monster hp
		$scope.$watchGroup(["monster.size.hd", "monster.hd", getAbility('Con').mod],
				function() {
			$scope.monster.hp = diceAverage($scope.monster.hd, 
					$scope.monster.size.hd, getAbility('Con').mod);
			
			if ($scope.builder.hdMode == "fixed") {
				//set target hp to current hp
				$scope.builder.hpTarget = $scope.monster.hp;
			}
		});
		
		// bind target hp to HD
		$scope.$watch("builder.hpTarget", function() {
			if ($scope.builder.hdMode == "dynamic") {
				$scope.monster.hd = getNumDiceFromAverage($scope.builder.hpTarget, 
						$scope.monster.size.hd, getAbility('Con').mod);
			}
		});
		
		
		// functions dependent on loaded variables
		
		$scope.newAttack = function() {
			var attack = $scope.builder.defaultAttack;
			$scope.monster.attacks.push(attack);
			bindTotalDamageToAttack(attack);
		}
	});
	
	$scope.tab = "stats";
	
	$scope.goToTab = function(tab) {
		$scope.tab = tab;
	}
	
	
	
	
	/* PRIVATE FUNCTIONS */
	
	
	function expressionFromObject(objectName) { //TODO: change name
		return $scope[objectName]; //no, gotta split this on dots
	}
	
	
	/* binds an ability's mod to its base score */
	function bindModToAbility(ability) {
		$scope.$watch(function(){
			return ability.score;
		}, function(){
			ability.mod = Math.floor((ability.score - 10) / 2);
		});
	}
	
	//old, messy version of ability binding
	/*function bindModToAbility(ability) {
		$scope.$watch("abilities['" + ability + "'].score", function(score) {
			$scope.abilities[ability].mod = Math.floor((score - 10) / 2);
		});
	}*/
	
	function bindTotalDamageToAttack(attack) {
		$scope.$watchGroup(function(){
			console.log([attack.damage.dice.num, attack.damage.dice.size, "monster.abilities[0].mod"]);
			return [attack.damage.dice.num, attack.damage.dice.size, "monster.abilities[0].mod"];
			
		}, function(){
			attack.damage.total = diceAverage(attack.damage.dice.num, attack.damage.dice.size);
		});
	}
	
	function diceAverage(num, size, bonus) {
		bonus = bonus || 0;
		return Math.floor(num * ((size + 1) / 2 + bonus));
	}
	
	function getNumDiceFromAverage(average, size, bonus) {
		bonus = bonus || 0;
		return Math.round(average / ((size + 1) / 2 + bonus));
	}
	
	function getFromArray(array, value) {
		try {
			return $filter('filter')(array, {id: value})[0];
		} catch (err) {
			return null;
		}
	}
	
	function getAbility(ability) {
		console.log(getFromArray($scope.monster.abilities, ability));
		return getFromArray($scope.monster.abilities, ability);
	}
});
