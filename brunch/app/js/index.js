var app = angular.module("monsterBuilder", []); 
app.controller("monsterController", function($scope) {
    $scope.SIZES = ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"];
    $scope.TYPES = ["aberration", "beast", "celestial", "construct", "dragon",
                    "elemental", "fey", "fiend", "giant", "humanoid", 
                    "monstrosity", "ooze", "plant", "undead"];
    $scope.TAGS = ["aarakocra", "bullywug", "demon", "devil", "elf", "gith", 
                   "goblinoid", "gnoll", "gnome", "grimlock", "kenku", "kobold",
                   "kuo-toa", "lizardfolk", "merfolk", "orc", "quaggoth",
                   "sahuagin", "shapechanger", "thri-kreen", "titan", "troglodyte",
                   "yuan-ti", "yugoloth", "zombie"];
	$scope.ALIGNMENTS = ["unaligned", 
	                     "lawful good", "neutral good", "chaotic good",
	                     "lawful neutral", "neutral", "chaotic neutral", 
	                     "lawful evil",	"neutral evil",	"chaotic evil", 
	                     "any alignment",
	                     "any good alignment", "any non-good alignment", 
	                     "any evil alignment", "any non-evil alignment", 
	                     "any lawful alignment", "any non-lawful alignment",
	                     "any chaotic alignment", "any non-chaotic alignment",
	                     "any neutral alignment", "any non-neutral alignment"];
	/*$scope.ABILITIES = ["Str", "Dex", "Con", "Int", "Wis", "Cha"];*/
	//$scope.ABILITIES = {"Str": 10, "Dex": 10, "Con": 10, "Int": 10, "Wis": 10, "Cha": 10};
	$scope.ABILITIES = [{ name: "Str", score: 10, mod: 0 }, 
	                    { name: "Dex", score: 10, mod: 0 }, 
	                    { name: "Con", score: 10, mod: 0 }, 
	                    { name: "Int", score: 10, mod: 0 }, 
	                    { name: "Wis", score: 10, mod: 0 }, 
	                    { name: "Cha", score: 10, mod: 0 }];
	$scope.getAbilityMod = function(ability) {
		return Math.floor((ability - 10) / 2);
	}
});


