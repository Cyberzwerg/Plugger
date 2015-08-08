gulp = require("gulp")
coffee = require('gulp-coffee')


paths = 
	coffee: 
		process: ->
			gulp.src("./src/*.coffee").pipe(coffee()).pipe(gulp.dest("./build"))
		watch: ["./src/*.coffee"]


for task,options of paths 
	console.log task, options
	gulp.task(task,options.process)

	if options.watch?

		gulp.watch(options.watch,[task])


gulp.task("default",Object.keys(paths))

