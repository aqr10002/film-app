 

const gulp = require('gulp');
const concat = require('gulp-concat');



 
 
// JS
gulp.task('watch-js', () => {
    gulp.src([
                'app/js/src/main.js',
                'app/js/src/navigation.js',
                'app/js/src/localStorage.js',
                'app/js/src/content.js',
                'app/js/src/api.js',
                'app/js/src/sampleData.js',
                'app/js/src/init.js'
    ])
    .pipe(concat('script.js'))
    .pipe(gulp.dest('app/js/dist'));
});



 

gulp.task('watch', () => {
    gulp.watch('app/styles/sass/*.scss ', ['watch-sass']);
    gulp.watch('app/js/src/*.js ', ['watch-js']);
});