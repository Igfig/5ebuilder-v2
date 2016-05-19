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

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=app.js.map