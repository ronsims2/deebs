module.exports = function(grunt){

	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    uglify: {
	    	options: {
	        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	    	},
	    	build: {
	    		src: '<%= pkg.main %>',
	    		dest: '<%= pkg.name %>-build/<%= pkg.name %>' + '.<%= pkg.version %>' + '.min.js'
	    	}
	    },
	    bump: {
	    	options: {
	    		files: ['package.json'],
		        updateConfigs: ['pkg'],
		        commit: false,
		        createTag: false,
		        push: false,
		        pushTo: '',
		        globalReplace: false
	    	}
	    },
	    clean: ['<%= pkg.name %>-build']
	  });

	  grunt.loadNpmTasks('grunt-contrib-uglify');
	  grunt.loadNpmTasks('grunt-bump');
	  grunt.loadNpmTasks('grunt-contrib-clean');
	  grunt.registerTask('default', ['clean', 'bump:patch', 'uglify']);
};