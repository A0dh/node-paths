# nodejs-paths
Path name manager for nodejs

# Installation

`npm install nodejs-paths`

# Description

This is a paths management to maintain path names in one place. Is particularly useful with task managers, such as gulp
or grunt.

For example, consider following folder structure that is being generated by generator-angular-fullstack yeoman generator:

Source: https://github.com/angular-fullstack/generator-angular-fullstack
```
├── client
│   ├── app                 - All of our app specific components go in here
│   ├── assets              - Custom assets: fonts, images, etc…
│   ├── components          - Our reusable components, non-specific to to our app
│
├── e2e                     - Our protractor end to end tests
│
└── server
    ├── api                 - Our apps server api
    ├── auth                - For handling authentication with different auth strategies
    ├── components          - Our reusable or app-wide components
    ├── config              - Where we do the bulk of our apps configuration
    │   └── local.env.js    - Keep our environment variables out of source control
    │   └── environment     - Configuration specific to the node environment
    └── views               - Server rendered views

To create path manager to work with this structure:
```

Configuration:

```
var paths = require('nodejs-paths');
var p = paths.create({
    strict: true,
    env: 'dev',
    dirNames: {
        client: 'client',
        client_app: 'app',
        client_assets: 'assets',
        client_components: 'components',
        e2e: 'e2e',
        server: 'server',
        server_api: 'api',
        server_auth: 'auth',
        server_components: 'components',
        server_config: 'config',
        server_views: 'views'
    },
    dirMaps: {
        client_app: 'client',
        client_assets: 'client',
        client_components: 'client',
        server_api: 'server',
        server_auth: 'server',
        server_components: 'server',
        server_config: 'server',
        server_views: 'server'
    }
});
```

Therefore, p will have absolute directories available via dirNames methods, i.e.
```
p.server_views() => /path/to/project/server/views
p.env.server_views() => /path/to/project/dist/dev/server/views
p.client_components() => /path/to/project/client/client/components
p.env.client_components() => /path/to/project/dist/dev/client/components
```
However, `dist` and `dev` folders are set by default and can be overridden by configuration, i.e.:
```
dirNames: {
    dev: 'another_dev_folder',
    dist: 'dist_gulp'
}
```

If for some reason it is needed to move all the server files into root of dist/dev instead (sort of ignoring server folder),
it can be done by applying envIgnore config, i.e.:
 
```
    envIgnore: {
        server: true
    }
```
It will produce following paths:
```
p.server_views() => /path/to/project/server/views
p.env.server_views() => /path/to/project/dist/dev/views
p.client_components() => /path/to/project/client/client/components
p.env
```

# Relative paths

Relative paths can be accessed by `p.__r.{dirName}`, i.e.

```
p.__r.client_components() => client/components
p.__r.env() => dist/dev
p.__r.env.server_views() => dist/dev/client/components
```

# Path construction

For example, we need to generate the path to the file that is located in client/assets/img/logo.png and client/assets/img2/another.png
To start with, we need to add to config following values:
```
dirNames: {
    client_img: 'img',
    client_img2: 'img2'
},
dirMaps: {
    client_img: 'client_assets',
    client_img2: 'client_assets'
}
```

Then the file path can be generated via

`p.client_img('logo.png') => /path/to/project/client/assets/img/logo.png`

Moreover if more files are needed, for example in the case of gulp task, when multiple files are need to add to src:
```
p.client_img(['logo.png', 'another_image.png']) =>
        [ '/path/to/project/client/assets/img/logo.png',
          '/path/to/project/client/assets/img/another_image.png' ]
```
Or if we want to add another folder in between with all files in them:
```
var dirNames = p.getOptions().dirNames;
p.client_img([dirNames.client_img, dirNames.client_img2], ['*.png']) =>
        [ '/path/to/project/client/assets/img/img/*.png',
          '/path/to/project/client/assets/img/img2/*.png' ]
```
