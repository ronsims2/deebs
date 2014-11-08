module.exports = function(grunt){

	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    uglify: {
	    	options: {
	        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	    	},
	    	build: {
	    		src: '<%= pkg.main %>',
	    		dest: 'build/<%= pkg.name %>' + '<%= pkg.version %>' + '.min.js'
	    	}
	    },
	    bump: {
	    	files: ['package.json'],
	        updateConfigs: ['pkg'],
	        commit: false,
	        push: false
	    }
	  });

	  grunt.loadNpmTasks('grunt-contrib-uglify');
	  grunt.loadNpmTasks('grunt-bump');
	  grunt.registerTask('default', ['bump:patch', 'uglify', ]);
};