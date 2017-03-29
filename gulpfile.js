 var bower = require('bower'),
  sh = require('shelljs'),
  gulp = require('gulp'),
  del = require('del'),
  merge = require('merge-stream'),
  spritesmith = require('gulp.spritesmith'),
  buffer = require('vinyl-buffer'),
  $ = require('gulp-load-plugins')();


 //log with colors
 (function colorful() {
   Object.keys($.util.colors.styles).forEach( function(clr) {
     String.prototype[clr] = function () {
       return $.util.colors[clr](this)
     }
   })
 })();

 var log = {
   warn : function() { $.util.log.apply(null, ['WARN:'.red()].concat(Array.prototype.slice.call(arguments))) },
   info : function() { $.util.log.apply(null, ['INFO:'.grey()].concat(Array.prototype.slice.call(arguments))) }
 }

 // setup environment configuration
 var path = function(prefix){
   var conPath = {
     cssPath  : '/css' ,
     jsPath   : '/js' ,
     imgPath  : '/img',
     libPath: '/lib'
   };
   var _file = function(filename){return filename ? ('/' + filename):'';};
   return {
     dir: function(){ return prefix;},
     file: function(filename){return prefix + "/" + _file(filename);},
     css : function(filename) {return prefix + conPath.cssPath+"/"+ _file(filename);},
     js: function(filename) {return prefix + conPath.jsPath+"/"+ _file(filename);},
     img : function(filename) {return prefix + conPath.imgPath +"/"+  _file(filename);},
     lib: function(filename) {return prefix + conPath.libPath +"/"+  _file(filename);},
   }
 };


 var env = {

   npmRepo :path('./node_modules'),
   src :  path('./www/src'),
   dst :  path('./www') ,

 };

 // clean directory and file for build
 gulp.task('clean_css',del.bind(null,env.dst.css()));
 gulp.task('clean_assets',del.bind(null,[env.dst.img()]));
 gulp.task('clean_deps', del.bind(null,env.dst.file('lib')));

 gulp.task('sass',['clean_css','sprite'],function() {
   var prefixConf = {browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']};
   var sassConf = {outputStyle: 'expanded', precision: 10, includePaths: ['.']};

   return gulp.src('./www/scss/**/*.scss')
     .pipe($.plumber())
     .pipe($.sourcemaps.init())
     .pipe($.sass.sync(sassConf).on('error', $.sass.logError))
     .pipe($.autoprefixer(prefixConf))
     .pipe($.sourcemaps.write())
     .pipe(gulp.dest( env.dst.css() ));
 });



 // copy assets to dst files
 gulp.task('assets',['clean_assets','sprite'], function() {
// IDs of SVGs often used as hooks for embedding and styling
   var imgConf = {progressive: true, svgoPlugins: [{cleanupIDs: false}]};

   $.util.log(env.dst.css());
     gulp.src([env.src.img('**/*'), '!' + env.src.img('sprite/**.*')])

       .pipe(gulp.dest(env.dst.img()));

 });



 // Generate  spritesheet
 gulp.task('sprite',['clean_css'],function() {

   var spriteData = gulp.src(env.src.img( "sprite/**/*.*")).pipe(spritesmith({
     imgName: 'sprite.png',
     cssName: 'sprite.scss',
     padding: 20,
     algorithm: 'binary-tree'
   }));

// Pipe image stream through image optimizer and onto disk
   var imgStream = spriteData.img
   // dst: We must buffer our stream into a Buffer for `imagemin`
     .pipe(buffer())
     .pipe($.imagemin())
     .pipe(gulp.dest(env.dst.img('icons')));

// Pipe CSS stream through CSS optimizer and onto disk
   var cssStream = spriteData.css
     .pipe(gulp.dest(env.dst.css("/sprite")));
// Return a merged stream to handle both `end` events
   return merge(imgStream, cssStream);

 });


 gulp.task('vendors',['clean_deps'],function(){
   console.log(env.src.lib())
   gulp.src(env.src.lib('**/*'))
     .pipe(gulp.dest(env.dst.lib()));
 });
 // minify all the resource in temp then copy to dist
 gulp.task('minify', function() {

   return merge(
     gulp.src( [env.src.file('**/*'), '!' +env.src.img('**/*'), '!' +env.src.file('/lib/**/*')])
       .pipe($.if('*.js', $.uglify({mangle: false}).on('error',$.util.log)))
       .pipe($.if('*.css', $.cleanCss()))
       .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
       .pipe(gulp.dest( env.dst.dir() )),
     gulp.src(env.dst.img('**/*'))
       .pipe($.imagemin())
       .pipe(gulp.dest(env.dst.img()))
   )
 });


gulp.task('watch',function(){

  gulp.watch( '/scss/**/*.scss', ['sass'] );
  gulp.watch( [env.src.file('**/*.*'),'!'+env.src.img('**/*')], ['minify'] );
  gulp.watch( [env.src.img('**/*')], ['assets'] );
});
gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + $.util.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', $.util.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + $.util.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
gulp.task('build',['vendors','sass','minify']);
gulp.task('default',['build','watch']);
