module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: grunt.file.readJSON('config.json'),

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
          'src/js/vendor/modernizr-2.6.2.min.js',
          'src/js/vendor/jquery-2.0.3.min.js',
          'src/js/vendor/jquery.scrollTo.min.js',
          'src/js/vendor/jquery.localScroll.min.js',
          'src/js/vendor/waypoints.min.js',
          'src/js/vendor/waypoints-sticky.min.js',
          'src/js/vendor/retina-1.3.0.min.js',
          'src/js/scripts/*.js'
        ],
        dest: 'src/js/app.js'
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n' +
                ' <%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
                ' */\n'
      },
      dist: {
        files: {
          'src/js/app.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js', '!src/**/*.min.js', '!src/js/app*.js'],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    
    // Watch for changes and trigger compass, jshint, uglify and livereload
    watch: {
      compass: {
        files: ['src/css/sass/{,**/}*.scss'],
        tasks: ['compass:dev']
      },
      js: {
        files: '<%= jshint.files %>',
        tasks: ['jshint', 'concat', 'uglify']
      },
      livereload: {
        options: {
          livereload: true
        },
        files: [
          'src/*.html',
          'src/css/*.css',
          'src/js/*.js',
          'src/img/{,**/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // Compass and scss
    compass: {
      options: {
        config: 'config.rb'
      },
      clean: {
        options: {
          clean: true
        }
      },
      dev: {
        options: {
          environment: 'development',
          outputStyle: 'expanded',
          sourcemap: true
        }
      },
      dist: {
        options: {
          environment: 'production',
          outputStyle: 'compressed'
        }
      }
    },

    // Minify html files
    htmlmin: {
      options: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        removeCDATASectionsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: false,
        removeAttributeQuotes: false,
        removeRedundantAttributes: false,
        useShortDoctype: false,
        removeEmptyAttributes: false,
        removeOptionalTags: false
      },
      main: {
        files: {
          'dist/index.html': 'src/index.html',
          // 'dist/coming-soon.html': 'src/coming-soon.html',
          // 'dist/404.html': 'src/404.html',
        }
      }
    },

    // Copy files
    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'src',
            src: '*',
            dest: 'dist/'
          },
          {
            src: 'src/css/app.css',
            dest: 'dist/css/app.css'
          },
          {
            src: 'src/js/app.min.js',
            dest: 'dist/js/app.min.js'
          },
          {
            expand: true,
            cwd: 'src/',
            src: ['img/**', '!img/*.png'],
            dest: 'dist/'
          },
          {
            expand: true,
            cwd: 'src/',
            src: 'gallery/**',
            dest: 'dist/'
          },
        ]
      }
    },

    // Deploy to server
    sftp: {
      dist: {
        files: {
          './': 'dist/**/*'
        },
        options: {
          createDirectories: true,
          path: '<%= config.server.path %>',
          srcBasePath: 'dist/',
          host: '<%= config.server.host %>',
          port: '<%= config.server.port %>',
          username: '<%= config.server.username %>',
          password: '<%= config.server.password %>',
          showProgress: true
        }
      }
    },

    // Compress png files
    tinypng: {
      options: {
        apiKey: '<%= config.tinypng.key %>',
        checkSigs: true,
        sigFile: 'tinypng.json',
        summarize: true,
        showProgress: true,
        stopOnImageError: true
      },
      compress: {
        expand: true,
        cwd: 'src/',
        src: 'img/*.png',
        dest: 'dist/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-ssh');
  grunt.loadNpmTasks('grunt-tinypng');

  grunt.registerTask('deploy', [
    'build',
    'sftp'
  ]);

  grunt.registerTask('build', [
    'jshint',
    'concat',
    'uglify',
    'compass:clean',
    'compass:dist',
    'copy',
    'tinypng',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'concat',
    'uglify',
    'compass:dev',
    'watch'
  ]);
};