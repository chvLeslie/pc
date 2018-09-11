var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// 静态服务器
// gulp.task('browser-sync', function() {
//     browserSync.init({
//         server: {
//             baseDir: "./"
//         }
//     });
// });

// 静态服务器 + 监听 scss/html 文件
gulp.task('serve', function () {

    browserSync.init({
        server: "./"
    });
    gulp.watch("./*.css").on('change', reload);
    gulp.watch("./*.html").on('change', reload);
    gulp.watch("./*.js").on('change', reload);
});

// 代理

// gulp.task('browser-sync', function() {
//     browserSync.init({
//         proxy: "你的域名或IP"
//     });
// });

//定义默认任务
gulp.task('default', ['serve']);