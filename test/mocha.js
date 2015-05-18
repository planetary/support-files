// requies: gulp-mocha
path = require( 'path' );

module.exports = function( gulp, plugins ) {
    gulp.task(
        'test:unit',
        'runs unit tests using mocha',
        function() {
            return gulp.src(
                path.resolve( __dirname, '../test/unit/**/*.js' ),
                { 'read': false }
            ).pipe( plugins.mocha() );
        }
    );

    gulp.task(
        'test:integration',
        'runs integration tests using mocha',
        function() {
            return gulp.src(
                path.resolve( __dirname, '../test/integration/**/*.js' ),
                { 'read': false }
            ).pipe( plugins.mocha() );
        }
    );
}
