const gulp = require('gulp');
const pump = require('pump');
const rename = require('gulp-rename');
const inject = require('gulp-inject-string');
const sass = require('gulp-sass');
const asar = require('gulp-asar');
const json = require('gulp-json-editor');
const merge = require('merge2');

const config = require('./config');

gulp.task('pack', function () {
    return pump([
        merge([
            pump([
                gulp.src('config.json'),
                json(config => {
                    config.info.type = 'css';
                    config.main = 'hide-sidebars.min.css';
                    return config;
                }, {beautify: false}),
            ]),
            pump([
                // As we have no configurable options we can just compile the theme now
                gulp.src('src/hide-sidebars.scss'),
                rename('hide-sidebars.min.css'),
                sass({
                    outputStyle: 'compressed',
                }),
            ]),
        ]),

        asar('hide-sidebars.bd'),
        gulp.dest('dist'),
    ]);
});

gulp.task('build', function () {
    return pump([
        gulp.src('src/hide-sidebars.scss'),
        rename('hide-sidebars.css'),
        sass({
            sourceMapContents: true,
            sourceMapEmbed: true,
        }),
        gulp.dest('dist'),
    ]);
});

gulp.task('watch', gulp.series('build', function () {
    return gulp.watch('src/**/*.scss', gulp.series('build'));
}));

gulp.task('release', function () {
    const header_meta = {
        name: config.info.id,
        description: config.info.description,
        author: config.info.authors.map(a => a.name || a).join(', '),
        version: config.info.version,
    };

    const header = `//META${JSON.stringify(header_meta)}*//\n`;

    return pump([
        gulp.src('src/bdv1-entry.scss'),

        rename('hide-sidebars.min.css'),
        sass({ outputStyle: 'compressed' }),
        gulp.dest('dist'),

        rename('hide-sidebars.theme.css'),
        inject.prepend(header),
        gulp.dest('dist'),
    ]);
});
