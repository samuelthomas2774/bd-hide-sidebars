const gulp = require('gulp');
const rename = require('gulp-rename');
const inject = require('gulp-inject-string');

const config = require('./config');

const header_meta = {
    name: config.info.id,
    description: config.info.description,
    author: config.info.authors.map(a => a.name).join(', '),
    version: config.info.version
};
const header = `//META${JSON.stringify(header_meta)}*//\n`;

gulp.task('release', function () {
    return gulp.src('dist/hide-sidebars.min.css')
        .pipe(rename('hide-sidebars.theme.css'))
        .pipe(inject.prepend(header))
        .pipe(gulp.dest('dist/'));
});
