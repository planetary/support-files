/*
npm install --save gulp-scss-lint \
                   gulp-scss-lint-stylish \
                   gulp-sourcemaps \
                   gulp-sass \
                   gulp-autoprefixer \
*/
var path = require( 'path' );


module.exports = function( gulp, plugins ) {
    var paths = {
        'watch': [
            // scss files to watch and lint
            path.resolve( __dirname, '../site/wp-content/themes/edge/styles/components/*.scss' ),
            path.resolve( __dirname, '../site/wp-content/themes/edge/styles/global/*.scss' ),
            path.resolve( __dirname, '../site/wp-content/themes/edge/styles/layouts/*.scss' ),
            path.resolve( __dirname, '../site/wp-content/themes/edge/styles/style.scss' )
        ],
        'build': [
            // scss files to build (TODO: change this to use the airframe build system)
            path.resolve( __dirname, '../site/wp-content/themes/edge/styles/style.scss' )
        ],
        'output': path.resolve( __dirname, '../site/wp-content/themes/edge' )
    };


    gulp.task( 'build:scss', 'rebuilds all scss files', function() {
        return gulp
            .src( paths.build )
            .pipe( plugins.sourcemaps.init() )
            .pipe( plugins.sass() )
            .on( 'error', function( err ) {
                console.log( err.toString() );
                this.emit( 'end' );
            } )
            .pipe( plugins.autoprefixer() )
            .pipe( plugins.cssmin() )
            .pipe( plugins.sourcemaps.write( '.' ) )
            .pipe( gulp.dest( paths.output ) );
    } );


    gulp.task( 'lint:scss', 'lints all scss files with scsslint', function() {
        return gulp
            .src( paths.watch )
            .pipe( plugins.scssLint( { 'customReport': plugins.scssLintStylish } ) )
            .pipe( plugins.scssLint.failReporter() );
    } );


    gulp.task( 'watch:scss', 'waits for scss files to change, then lints and rebuilds ' +
                             'them', function() {
        return gulp.watch( paths.watch, [ 'lint:scss', 'build:scss' ] );
    } );
};
