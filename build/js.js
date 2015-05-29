// Requires: gulp-jshint
// Requires: gulp-jscs
// Requires: gulp-jscs-stylish
// Requires: gulp-sourcemaps
// Requires: gulp-uglify
// Requires: gulp-rename
var path = require( 'path' );


module.exports = function( gulp, plugins ) {
    var paths = {
        'watch': [
            // JS files to watch and lint
            path.resolve( __dirname, '../gulp/*.js' ),
            path.resolve( __dirname, '../site/wp-content/themes/edge/js/nav.js' ),
            path.resolve( __dirname, '../site/wp-content/themes/edge/js/nudie.js' )
        ],
        'build': [
            // JS files to build (TODO: maybe change this to use browserify)
            path.resolve( __dirname, '../site/wp-content/themes/edge/js/nav.js' ),
            path.resolve( __dirname, '../site/wp-content/themes/edge/js/nudie.js' )
        ],
        'output': path.resolve( __dirname, '../site/wp-content/themes/edge/js' )
    };


    gulp.task( 'build:js', 'rebuilds all js files', function() {
        return gulp
            .src( paths.build )
            .pipe( plugins.sourcemaps.init() )
            .pipe( plugins.uglify() )
            .pipe( plugins.rename( { 'extname': '.min.js' } ) )
            .pipe( plugins.sourcemaps.write( '.' ) )
            .pipe( gulp.dest( paths.output ) );
    } );


    gulp.task( 'lint:js:jscs', 'lints all javascript files with jscs', function() {
        return gulp
            .src( paths.watch )
            .pipe( plugins.jscs() )
            .pipe( plugins.jscsStylish() );
    } );


    gulp.task( 'lint:js:jshint', 'lints all javascript files with jshint', function() {
        return gulp
            .src( paths.watch )
            .pipe( plugins.jshint() )
            .pipe( plugins.jshint.reporter( 'jshint-stylish' ) )
            .pipe( plugins.jshint.reporter( 'fail' ) );
    } );


    gulp.task( 'lint:js', 'lints all javascript files with both jscs and jshint', [
        'lint:js:jshint',
        'lint:js:jscs'
    ] );


    gulp.task( 'watch:js', 'waits for javascript files to change, then lints and rebuilds ' +
                           'them ', function() {
        return gulp.watch( paths.watch, [ 'lint:js', 'build:js' ] );
    } );
};
