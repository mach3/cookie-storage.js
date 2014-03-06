
module.exports = function(grunt){

	var banner = grunt.template.process(
		grunt.file.read("src/banner.js"),
		{ data: grunt.file.readJSON("package.json") }
	);

	grunt.initConfig({

		concat: {
			dist: {
				options: {
					banner: banner
				},
				files: {
					"dist/cookie-storage.js": "src/cookie-storage.js"
				}
			}
		},

		uglify: {
			dist: {
				options: {
					banner: banner
				},
				files: {
					"dist/cookie-storage.min.js": "src/cookie-storage.js"
				}
			}
		},

		connect: {
			dev: {
				options: {
					port: 8080,
					hostname: "example.com",
					base: ".",
					keepalive: true
				}
			}
		}

	});

	grunt.registerTask("default", []);
	grunt.registerTask("dev", ["connect:dev"]);
	grunt.registerTask("build", ["concat:dist", "uglify:dist"]);

	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	
};
