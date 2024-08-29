// gulpfile.js  
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cssnano = require('gulp-cssnano');
const babel = require('gulp-babel');
const sass = require('gulp-sass')(require('sass'));
const gulpIf = require('gulp-if');
const clean = require('gulp-clean');

function js() {
    return gulp.src('src/**/*.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
}

const paths = {
    scripts: {
        src: 'src/*.js',
        indexcjs: 'src/indexcjs.js',
        virtualKeyboard: 'src/virtualKeyboard.js',
        virtualKeyboardJs: 'src/virtualKeyboardJs.js',
        indexesm: 'src/indexesm.js',
        cjs: 'dist/cjs/',
        esm: 'dist/esm/'
    }
};

// CommonJS 打包  
function buildCJS2() {
    return gulp.src(["src/*.js"])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(rename({ dirname: '' })) // 去掉目录结构  
        .pipe(gulp.dest('dist'));
}

// CommonJS 打包  
function buildCJS() {
    return gulp.src([paths.scripts.virtualKeyboard])
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(uglify())
        .pipe(rename({ dirname: '' })) // 去掉目录结构  
        .pipe(gulp.dest(paths.scripts.cjs));
}

// ES Module 打包  
function buildESM() {
    return gulp.src([paths.scripts.virtualKeyboardJs])
        .pipe(babel({
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-modules-commonjs'] // 转换为 CommonJS
        }))
        .pipe(uglify())
        .pipe(rename({ dirname: '' })) // 去掉目录结构  
        .pipe(gulp.dest(paths.scripts.esm));
}


function isScss(file) {
    return file.extname === '.scss';
}

function css() {
    return gulp.src(['src/*.scss', 'src/*.css']) // 同时处理 .scss 和 .css 文件  
        .pipe(gulpIf(isScss, sass().on('error', sass.logError))) // 仅当是 SCSS 文件时编译  
        .pipe(cssnano()) // 压缩 CSS  
        .pipe(rename({ suffix: '.min' })) // 添加 .min 后缀  
        .pipe(gulp.dest('dist')); // 输出到 dist 文件夹  
}

function cleanDist() {
    return gulp.src('dist', { allowEmpty: true, read: false }) // 删除 dist 文件夹
        .pipe(clean());
}

exports.default = gulp.series(cleanDist, gulp.parallel(js)); // 先清理，再并行执行 js 和 css 任务