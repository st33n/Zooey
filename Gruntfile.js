module.exports = function(grunt) {
  grunt.initConfig({
   browserify: {
     dist: {
       options: {
         transform: [
           ["babelify", {
             loose: "all"
           }]
         ]
       },
       files: {
         "./public/js/zooey.js": ["./src/index.js"]
       }
     }
   },
   watch: {
     scripts: {
       files: ["./src/*.js"],
       tasks: ["browserify"]
     }
   }
  });

  grunt.loadNpmTasks("grunt-browserify");
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask("default", ["browserify", "watch"]);

};
