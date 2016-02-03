var ph = require('./lib/paths_helpers');
var pf = require('./lib/paths_factory');
var pfuncs = require('./lib/paths_functions');

function Paths(options) {

    this.getOptions = function getOptions() {
        return options;
    };

    this.getFactory = function getFactory(opt) {
        return pf(opt || this.getOptions());
    };

    ph.extend(true, this, pfuncs(this.getFactory()));

}

module.exports = {
    populateOptions: function populateOptions(options) {
        var envDirs = options.envDirs;
        var _envDirs = {
            dev: options.dirNames.dev,
            prod: options.dirNames.prod
        };
        Object.keys(envDirs).forEach(function(key){
            if (envDirs[key] && !_envDirs[key]) {
                _envDirs[key] = options.dirNames[key];
            }
        });
        options.envDirs = _envDirs;

        Object.keys(options.envDirs).forEach(function(key){
            if (!options.dirMaps[key]) {
                options.dirMaps[key] = 'dist';
            }
        });


        if (!options.dirNames.bower) {
            var bowerc = {};
            try {
                bowerc = JSON.parse(fs.readFileSync(ph.join(options.projectDir,'.bowerrc')));
            } catch(e) {}
            options.dirNames.bower = bowerc.directory || 'bower_components';
        }

        return options;
    },
    getOptionsDefault: function getOptionsDefault() {
        var options = {
            strict: true,
            projectDir: process.cwd(),
            env: 'dev',
            envDirs: {},
            dirNames: {
                project: '',
                dist: 'dist',
                tmp: '.tmp',
                dev: 'dev',
                prod: 'prod'
            },
            dirMaps: {},
            distIgnore: {
                app: true
            }
        };
        return options;
    },
    create: function(opt) {
        var options = {};
        ph.extend(true, options, this.getOptionsDefault());
        ph.extend(true, options, opt);
        return new Paths(this.populateOptions(options));
    }
};