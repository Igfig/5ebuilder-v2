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
		$scope.$watchGroup(//["monster.size.hd", "monster.hd", "monster.abilities[2].mod"],
				["monster.size.hd", "monster.hd", abMod('Con')],
				function(){
			$scope.monster.hp = diceAverage($scope.monster.hd, 
					$scope.monster.size.hd, abMod('Con'));
		});
		
		
		// functions dependent on loaded variables
		
		$scope.newAttack = function() {
			var attack = {damage:{	dice:{
										num: 1, 
										size: 8},
									total: 4}}
			
			$scope.monster.attacks.push(attack);
			
			bindTotalDamageToAttack(attack);
		}
	});
	
	$scope.tab = "stats";
	
	$scope.goToTab = function(tab) {
		$scope.tab = tab;
	}
	
	
	
	
	/* PRIVATE FUNCTIONS */
	
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
			return [attack.damage.dice.num, attack.damage.dice.size, "monster.abilities[0].mod"];
			
		}, function(){
			attack.damage.total = diceAverage(attack.damage.dice.num, attack.damage.dice.size);
		});
	}
	
	function diceAverage(num, size, bonus) {
		bonus = bonus || 0;
		return Math.floor(num * ((size + 1) / 2 + bonus));
	}
	
	function getFromArray(array, value) {
		try {
			return $filter('filter')(array, {id: value})[0];
		} catch (err) {
			return null;
		}
	}
	
	function abMod(ability) {
		return getFromArray($scope.abilities, ability);
	}
});
