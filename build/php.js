// Requires: gulp-phplint
var path = require( 'path' ),
    phplint = require( 'phplint' ).lint;


module.exports = function( gulp ) {
    var paths = [
        path.resolve( __dirname, '../site/**/*.php' )
    ];


    gulp.task( 'lint:php', 'lints all php files with php -l', function( next ) {
        phplint( paths, { 'limit': 8 }, function( err ) {
            next( err );
        } );
    } );
};
