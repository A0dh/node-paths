var ph = require('./paths_helpers');

var PathsFunctions = function PathsFunctions(pathsFactory) {

    var pathsFactoryOptions = pathsFactory.getOptions() || {};
    var env = pathsFactoryOptions.env || 'dev';
    var dirNames = pathsFactoryOptions.dirNames || {};
    var dirMaps = pathsFactoryOptions.dirMaps || {};
    var distIgnore = pathsFactoryOptions.distIgnore || {};

    function makeDnf() {
        var dnf = {};
        Object.keys(dirNames).forEach(function(key){
            var args = [];
            var tempKey = key;
            var dirName;
            // create relative path, i.e. app/module
            while (true) {
                dirName = dirNames[tempKey];
                if (!dirName) break;
                args.unshift(dirName);
                tempKey = dirMaps[dirName];
            }
            dnf[key] = ph.join.apply(this, args);
        });
        return dnf;
    }

    function makeFunctionSet(dnf) {
        var funcSet = { __r: {}, __dist: {} };
        Object.keys(dnf).forEach(function(key){
            var val = dnf[key];
            funcSet[key] = function() {
                return pathsFactory.create(val).apply(this, arguments);
            };
            funcSet.__r[key] = function() {
                return pathsFactory.create(val, true).apply(this, arguments);
            };
            funcSet.__dist[key] = function() {
                var args = [dnf[env]];
                var ignore = distIgnore[key];
                if (!ignore) {
                    args.push(funcSet.__r[key]());
                } else if (ignore == 'single') {
                    var r = new RegExp(key, 'g');
                    args.push(funcSet.__r[key]().replace(r, ''));
                }
                args = args.concat(ph.objToArray(arguments));
                return funcSet.project.apply(this, args);
            };
        });
        return funcSet;
    }


    return makeFunctionSet(makeDnf());

};


module.exports = PathsFunctions;
