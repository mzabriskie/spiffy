/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'src/Spiffy.js']
        },
        nodeunit: {
            all: ['test/*.js']
        }
    });

    grunt.registerTask('default', ['jshint', 'nodeunit']);
};
