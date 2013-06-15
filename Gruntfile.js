/*global module:false*/
module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', 'src/Spiffy.js']
        },
        nodeunit: {
            all: ['test/*.js']
        },
        uglify: {
            my_target: {
                files: {
                    'dist/Spiffy.min.js': ['src/Spiffy.js']
                }
            }
        },
        copy: {
            main: {
                files: [
                    {src: ['src/Spiffy.js'], dest: 'dist/', expand: true, flatten: true}
                ]
            }
        }
    });

    grunt.registerTask('default', ['jshint', 'nodeunit', 'uglify', 'copy']);
};
