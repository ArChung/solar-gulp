import gulp from "gulp"
import del from "del"
import autoprefixer from "autoprefixer"
import browserSync from "browser-sync"
import minimist from "minimist"
import sassImage from "gulp-sass-image"
import order from "gulp-order"
import useref from "gulp-useref"
import terser from 'gulp-terser'
import cache from "gulp-cache"
import imagemin from "gulp-imagemin"
import imageminPngquant from "imagemin-pngquant"
import imageminZopfli from "imagemin-zopfli"
import imageminMozjpeg from "imagemin-mozjpeg" //need to run 'brew install libpng'
import imageminGiflossy from "imagemin-giflossy"

const $ = require("gulp-load-plugins")()

/*****************************************************
 * 變數 block
 *****************************************************/
var envOptions = {
  string: "env",
  default: {
    env: "develop"
  }
}
var options = minimist(process.argv.slice(2), envOptions) // process.argv = [node, gulp.js, arg1, arg2, ...]
var envIsPro = options.env === "production" || options.env == "pro"

export function envNow(cb) {
  console.log(`env now is: ${options.env}, so envIsPro is ${envIsPro}`)
  console.log(options)
  cb()
}

/*****************************************************
 * 複製檔案 block
 *****************************************************/
export function copyHTML() {
  return gulp.src("./src/**/*.html").pipe(gulp.dest("./public"))
}

export function cpBsVar() {
  return gulp
    .src("./node_module/bootstrap/scss/_variables.scss")
    .pipe(gulp.dest(".src/sass/hellper/"))
}

export function copy() {
  return gulp
    .src([
      "./src/**/**",
      "!src/js/**/**",
      "!src/sass/**/**",
      "!src/views/**/**",
      "!src/**/*.ejs",
      "!src/**/*.html"
    ])
    .pipe(gulp.dest("./public"))
}

/*****************************************************
 * 清除暫存 block
 *****************************************************/
export function clean() {
  return del(["./public", "./.tmp"])
}

/*****************************************************
 * HTML 處理 block
 *****************************************************/
export function ejs() {
  return gulp
    .src(["./src/**/*.html"])
    .pipe($.plumber())
    .pipe($.frontMatter())
    .pipe(
      $.layout(file => {
        return file.frontMatter
      })
    )
    .pipe(useref())
    .pipe($.if('*.js', terser()))
    .pipe($.if('*.css', $.cleanCss()))
    .pipe(gulp.dest("./public"))
    .pipe($.if(!envIsPro, browserSync.stream()))
}

/*****************************************************
 * CSS 處理 block
 *****************************************************/
export function sass() {

  const plugins = [
    autoprefixer({
      overrideBrowserslist: ["last 5 version"]
    }),
  ];


  return gulp
    .src(["./src/sass/**/*.sass", "./src/sass/**/*.scss"])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(
      $.sass({
        outputStyle: "nested",
        includePaths: ['node_modules']
      }).on("error", $.sass.logError)
    )
    .pipe($.postcss(plugins))
    .pipe($.if(envIsPro, $.cleanCss()))
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest("./public/css"))
    .pipe($.if(!envIsPro, browserSync.stream()))
}


export function goSassImage() {
  return gulp.src('./src/images/**/*.+(jpeg|jpg|png|gif|svg)')
    .pipe(sassImage({
      targetFile: '_images_data.scss', // 處理完的 SCSS 檔名
      css_path: './src/css', // CSS 檔案位置
      images_path: './src/images', // image 檔案位置
      includeData: false, // 是否將 image 加入到 SCSS 中
    }))
    .pipe(gulp.dest('src/sass')); // 處理後的 SCSS 檔放位置
}

/*****************************************************
 *  JS 處理 block
 *****************************************************/


export function babel() {
  return gulp
    .src(["./src/js/**/*.js", "!./src/js/lib/*"])
    .pipe(order([
      "tool/*.js",
      "**/*.js",
    ]))
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.concat("all.js"))
    .pipe(
      $.babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(
      $.if(
        envIsPro,
        terser({
          compress: {
            drop_console: true
          }
        })
      )
    )
    .pipe($.sourcemaps.write("."))
    .pipe(gulp.dest("./public/js"))
    .pipe($.if(!envIsPro, browserSync.stream()))
}

/*****************************************************
 *  圖片處理 block
 *****************************************************/
export function imageMin() {
  return gulp
    .src("./src/images/*.{gif,png,jpg,jpeg}")
    .pipe($.if(envIsPro, cache(imagemin([
      //png
      imageminPngquant({
        speed: 1,
        quality: [0.8, 0.9] //lossy settings
      }),
      imageminZopfli({
        more: true
      }),
      //gif
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3, //keep-empty: Preserve empty transparent frames
        lossy: 2
      }),
      //svg
      imagemin.svgo({
        plugins: [{
          removeViewBox: false
        }]
      }),
      //jpg lossless
      imagemin.mozjpeg({
        progressive: true
      }),
      //jpg very light lossy, use vs jpegtran
      imageminMozjpeg({
        quality: 90
      })
    ]))))
    .pipe(gulp.dest("./public/images"))
    .pipe($.if(envIsPro, browserSync.stream()))

}


/*****************************************************
 *  實時預覽 block
 *****************************************************/
export function browser() {
  browserSync.init({
    server: {
      baseDir: "./public",
      reloadDebounce: 2000,
      logLevel: "silent"
    }
  })
}

export function watch() {
  gulp.watch(["./src/**/*.html", "./src/**/*.ejs"], ejs)
  // gulp.watch(['./src/**/*.jade', './src/**/*.pug'], ['jade'])
  gulp.watch(
    ["./src/sass/**/*.sass", "./src/sass/**/*.scss"],
    sass
  )
  gulp.watch("./src/js/**/*.js", babel)
  gulp.watch("./src/images/**/*.+(jpeg|jpg|png|gif|svg)", gulp.series(goSassImage, imageMin));
  console.log("watching file ~")
}

/*****************************************************
 *  指令 block
 *****************************************************/

exports.default = gulp.series(
  goSassImage,
  gulp.parallel(imageMin,
    babel,
    sass,
    ejs,
    browser,
    watch
  )
)


exports.build = gulp.series(
  gulp.series(goSassImage, clean, copy),
  gulp.parallel(babel, sass, ejs, imageMin)
)

// = gulp build --env production
exports.buildPro = gulp.series(
  cb => {
    envIsPro = true
    cb()
  },
  gulp.series(goSassImage, clean, copy),
  gulp.parallel(babel, sass, ejs, imageMin)
)

function deploy() {
  return gulp.src("./public/**/*").pipe($.ghPages())
}
exports.deploy = deploy