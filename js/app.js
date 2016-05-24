(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = ({}).hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = null;
    hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
document.addEventListener('DOMContentLoaded', function() {
  // do your setup here
});

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

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map