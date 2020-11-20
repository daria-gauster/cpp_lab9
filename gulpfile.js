const pack = "build";
 gulp = require("gulp"),
 less = require("gulp-less"),
 cleanCSS = require('gulp-clean-css'),
 cleanJS = require('gulp-uglify'),
 del = require("del"),
 concat = require('gulp-concat'),
 babel = require('gulp-babel'),
 clean = () => del([pack]),
 pug = require('gulp-pug'),
 uglify = require('gulp-uglify');

const bin = () => {
    return gulp.src("bin/*.js")
        .pipe(babel()).pipe(cleanJS())
        .pipe(gulp.dest(`${pack}/bin`));
}
const data = () => {
    return gulp.src('public/lib/*.json')
        .pipe(gulp.dest(`${pack}/public/lib`));
}
const pics = () => {
    return gulp.src("public/images/*.*")
        .pipe(gulp.dest(`${pack}/public/images`))
}
const script = () =>{
    return gulp.src("public/javascripts/*.*")
        .pipe(babel())
        .pipe(cleanJS())
        .pipe(gulp.dest(`${pack}/public/javascripts`))
}
const views = () => {
    return gulp.src("views/*.pug")
        .pipe(gulp.dest(`${pack}/views`))
}

gulp.task("copy", gulp.parallel(bin, data, pics,
    script, views));

gulp.task("default", gulp.series(clean, "copy"));
gulp.task("clean", clean);
