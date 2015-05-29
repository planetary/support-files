/*
npm install --save include-all \
                   gulp \
                   gulp-help \
                   gulp-load-plugins
*/


// Load plugins
var plugins = require( 'gulp-load-plugins' )( {
    // The glob to search for
    'pattern': [ 'gulp-*' ],

    // Remove from the name of the module when adding it to the context...
    'replaceString': /\bgulp[\-.]|run[\-.]|merge[\-.]|main[\-.]/,

    // ...and convert it to camel case,
    'camelizePluginName': true,

    // Only load plugins on demand
    'lazy': true
} );


// Setup env as a gulp plugin wannabe
plugins.env = {
    'current': process.env.NODE_ENV || 'development',
    'is': {}
};
[ 'development', 'testing', 'staging', 'production' ].forEach( function( env ) {
    plugins.env[ env.toUpperCase() ] = env;
    plugins.env.is[ env ] = env.current === env;
} );

// Load and register gulp tasks
var gulp = require( 'gulp-help' )( require( 'gulp' ) );
var tasks = require( 'include-all' )( {
    'dirname': __dirname,
    'filter': /(.+)\.(js|es6})$/,
    'dontLoad': true
} );

for( var task in tasks )
    if( tasks.hasOwnProperty( task ) && task !== 'index' )
        require( './' + task )( gulp, plugins );
