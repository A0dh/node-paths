var ph = require('./paths_helpers');

var PathsFunctions = function PathsFunctions(pathsFactory) {

    var pathsFactoryOptions = pathsFactory.getOptions() || {};
    var strictMode = !!pathsFactoryOptions.strict;
    var env = pathsFactoryOptions.env || 'dev';
    var dirNames = pathsFactoryOptions.dirNames || {};
    var dirMaps = pathsFactoryOptions.dirMaps || {};
    var envIgnore = pathsFactoryOptions.envIgnore || {};

    function translate(keys) {
        keys = keys || [];
        if (keys.constructor !== Array) {
            keys = [keys];
        }
        return keys.map(function(key){
            return dirNames[key]!==undefined?dirNames[key]:key;
        });
    }

    function makeDnf() {
        var dnf = {};
        Object.keys(dirNames).forEach(function(key){
            var args = [];
            var tempKey = key;
            while (true) {
                if (!tempKey) break;
                if (strictMode && dirNames[tempKey] === undefined) {
                    throw 'Directory name for <' + tempKey + '> is not defined. If you wish to proceed, set strict to false.';
                }
                args.unshift(tempKey);
                tempKey = dirMaps[tempKey];
            }
            dnf[key] = args;
        });
        return dnf;
    }

    function makeFunctionSet(dnf) {
        var funcSet = { __r: {}, __dist: {}};
        funcSet.env = function() {
            return funcSet.project.apply(this, dnf[env].concat(ph.objToArray(arguments)));
        };
        funcSet.__r.env = function() {
            return funcSet.__r.project.apply(this, dnf[env].concat(ph.objToArray(arguments)));
        };
        Object.keys(dnf).forEach(function(key){
            var val = translate(dnf[key]);
            funcSet[key] = function() {
                return pathsFactory.create(val).apply(this, arguments);
            };
            funcSet.env[key] = function() {
                var finalArgs = [];
                dnf[key].forEach(function(curKey){
                    var ignore = envIgnore[curKey];
                    if (!ignore) {
                        finalArgs.push(curKey);
                    }
                });

                finalArgs = translate(finalArgs).concat(ph.objToArray(arguments));
                return funcSet.env.apply(this, finalArgs);
            };
            funcSet.__r[key] = function() {
                return pathsFactory.create(val, true).apply(this, arguments);
            };
            funcSet.__r.env[key] = function() {
                var finalArgs = [];
                dnf[key].forEach(function(curKey){
                    var ignore = envIgnore[curKey];
                    if (!ignore) {
                        finalArgs.push(curKey);
                    }
                });

                finalArgs = translate(finalArgs).concat(ph.objToArray(arguments));
                return funcSet.__r.env.apply(this, finalArgs);
            };

        });
        return funcSet;
    }


    return makeFunctionSet(makeDnf());

};


module.exports = PathsFunctions;
