## PHP Webpack Plugin

_This module will work only with Webpack 4 and above._

This [Webpack](https://webpack.js.org/) plugin will create a PHP file in your `output.path` directory containing an associative arrays of entry points and their corresponding chunk groups.

The resulting file can be used by your PHP application to determine which files should be included when rendering your
frontend of your website.

The resulting PHP file will have the following format:

    <?php
    return [
        'entry1' => [
            'chunk1.js' => '{publicPath}/asset1.js',
            'chunk2.js => '{publicPath}/asset2.js',
            // ... more chunks for 'entry1'
        ],
        'entry2' => [
            'chunk1.js' => '{publicPath}/asset1.js',
            'chunk2.js => '{publicPath}/asset2.js',
            // ... more chunks for entry2
        ]
    ];

In a ZendFramework or Laminas MVC application, this file can be used to load the scripts associated with a given 
rendered page by associating templates or matched routes to a given entry point.  

(_An example application will come later_) 

Companion [Zend](https://docs.zendframework.com) and [Laminas](https://getlaminas.org) framework modules are in the works to automate the rendering of script tags using the output of
this plugin.

### Install

Using NPM

    $ npm install php-webpack-plugin
    
Using Yarn
    
    $ yarn add php-webpack-plugin


### Usage

    // in your webpack config file
    
    const PhpWebpackPlugin = require('php-webpack-plugin');
    
    module.exports = {
        // ...
        plugins: [
            new PhpWebpackPlugin(options)
        ]
    }

## Available Options

`filename` (default: "scriptlists.php")

The filename that will contain the associative array.  The file will be created in the directory set by `output.path` 
and will be appended with `.php` if no extension is set.

`entryPoint` (default: null)

The name of the entry point in the webpack configuration for which to create a script.  If not set, then all the entry
points are processed.

For example, considering the following webpack config:

    const PhpWebpackPlugin = require('php-webpack-plugin');
    
    module.exports = {
        entry: {
            main: 'index.js',
            print: 'print.js,
        },
        plugins: [
            new PhpWebpackPlugin({
            }),
            new PhpWebpackPlugin({
                entryPoint: 'print'
                filename: 'print'
            }),
        ]
    } 
    
then 2 PHP files will be created:

`scriptlist.php` from the first instance of the plugin:

    <?php
    return [
        'main' => [
            'index.js' => '{publicPath}/index.js',
            'chunk2.js => '{publicPath}/chunk2.js',
            // ... more chunks
        ],
        'print' => [
            'print.js' => '{publicPath}/index.js'
            'chunk2.js => '{publicPath}/chunk2.js',
            // ... more chunks
        ]
    ];
    
`print.php` from the second instance of the plugin:

    <?php
    return [
        'print' => [
            'print.js' => '{publicPath}/index.js'
            'chunk2.js => '{publicPath}/chunk2.js',
            // ... more chunks
        ]
    ];
