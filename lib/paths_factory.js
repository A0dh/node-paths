var ph = require('./paths_helpers');

function PathsFactory(options) {
    return {
        create: function createPathFunction(base, relative) {
            var base_ = ((typeof base === 'function') ? base() : base) || '';

            function getBasePath(path) {
                var basePath = ph.join(base_, (path || ''));
                basePath = relative
                    ?basePath.replace(/^\/+/,'')
                    :ph.join(options.projectDir, basePath);
                return ph.cleanPath(basePath);
            }

            return function dirFunction() {
                var args = ph.objToArray(arguments),
                    pathCollection = [],
                    returnArray = false;
                for (var i=0; i<args.length;i++) {
                    if (typeof args[i] === 'function') args[i] = args[i]();
                    var curArg = args[i];
                    if (curArg && curArg.constructor === Array) {
                        returnArray = true;
                    }
                    pathCollection = ph.combinePaths(pathCollection, curArg);
                }
                if (pathCollection.length === 0) {
                    pathCollection = [''];
                }
                pathCollection = pathCollection.map(function(path){
                    return getBasePath(path);
                });
                return returnArray?pathCollection:pathCollection[0];
            }
        },
        getOptions: function() {
            return options;
        }
    };

}

module.exports = PathsFactory;