// Requires: gulp-mocha
// Requires: env-test
path = require( 'path' );


module.exports = function( gulp, plugins ) {
    var paths = {
        'unit': [
            path.resolve( __dirname, '../tests/index.js' ),
            path.resolve( __dirname, '../tests/unit/**/*.js' )
        ],
        'integration': [
            path.resolve( __dirname, '../tests/index.js'),
            path.resolve( __dirname, '../tests/integration/**/*.js' )
        ]
    };
    var config = {
        'timeout': 2000,
        'require': ['env-test']
    };


    gulp.task( 'test:unit', 'runs unit tests using mocha', function() {
        gulp
            .src( paths.unit, { 'read': false } )
            .pipe( plugins.mocha ( config ) );
    } );


    gulp.task( 'test:integration', 'runs integration tests using mocha', function() {
        return gulp
            .src( paths.integration, { 'read': false } )
            .pipe( plugins.mocha( config ) );
    } );


    gulp.task( 'test', 'runs both unit and integration tests using mocha', function() {
        return gulp
            .src( paths.unit.concat( paths.integration ), { 'read': false } )
            .pipe( plugins.mocha( config ) );
    } );
};
