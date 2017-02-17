var Movie = require('../models/movie.js'),
	Comment = require('../models/comment.js'),
	Category = require('../models/category.js'),
	_ = require('underscore'),
	fs = require('fs'),
	path = require('path');
exports.detail = function (req, res) {
	var id = req.params.id;
	Movie.update({
		_id: id
	}, {
		$inc: {
			pv: 1
		}
	}, function (err) {
		if (err) {
			console.log(err)
		}
	})
	Movie.findById(id, function (err, movie) {

		Comment.find({
			movie: id
		}).populate('from', 'name').populate('reply.from reply.to', 'name').exec(function (err, comments) {
			res.render('detail', {
				title: movie.title,
				movie: movie,
				comments: comments
			})
		})
	})
};
//admin
exports.new = function (req, res) {
	Category.find({}, function (err, categories) {
		res.render('admin', {
			title: '后台录入',
			categories: categories,
			movie: {}
		});
	})
};
exports.update = function (req, res) {
	var id = req.params.id;
	if (id) {
		Movie.findById(id, function (err, movie) {
			Category.find({}, function (err, categories) {
				res.render('admin', {
					title: '后台更新',
					movie: movie,
					categories: categories
				})
			})
		})
	}
};
exports.savePoster = function (req, res, next) {
	var posterData = req.files.movie.uploadPoster,
		filePath = posterData.path,
		originalFilename = posterData.originalFilename

	if (originalFilename) {
		fs.readFile(filePath, function (err, data) {
			var timestamp = Date.now(),
				type = posterData.type.split('/')[1],
				poster = timestamp + '.' + type,
				newPath = path.join(__dirname, '../../', 'public/upload/' + poster);
			fs.writeFile(newPath, data, function (err) {
				req.poster = poster;
				next()
			})
		})
	} else {
		next()
	}
};
//todo以后可以把下面的步骤做成一个方法，共用，categoryName， category， flag
exports.save = function (req, res) {
	var id = req.body.movie._id,
		movieObj = req.body.movie,
		_movie,
		categoryName = movieObj.categoryName,
		categoryId = movieObj.category;
	if (req.poster) {
		movieObj.poster = req.poster
	}

	if (id) {
		Movie.findById(id, function (err, movie) {
			if (err) {
				console.log(err);
			}
			_movie = _.extend(movie, movieObj)
			_movie.save(function (err, movie) {
				if (err) {
					console.log(err);
				}
				res.redirect('/movie/' + movie._id)
			})
		})
	} else {
		_movie = new Movie(movieObj)
		_movie.save(function (err, movie) {
			if (err) {
				console.log(err);
			}
			if (categoryId) {
				Category.findById(categoryId, function (err, category) {
					category.movies.push(movie._id)
					category.save(function (err, category) {
						if (err) {
							console.log(err)
						}
						res.redirect('/movie/' + movie._id)
					})
				})
			} else if (categoryName) {
				var category = new Category({
					name: categoryName,
					movies: [movie._id]
				})
				category.save(function (err, category) {
					if (err) {
						console.log(err)
					}
					_movie.category = category._id
					_movie.save(function (err, movie) {
						res.redirect('/movie/' + movie._id)
					})
				})
			}
		})
	}
};
//list
exports.list = function (req, res) {
	Movie.fetch(function (err, movies) {
		if (err) {
			console.log(err);
		}
		res.render('list', {
			title: '列表',
			movies: movies
		});
	})
};
//delete
exports.del = function (req, res) {
	var id = req.query.id
	if (id) {
		Movie.remove({
			_id: id
		}, function (err, movie) {
			if (err) {
				console.log(err);
			} else {
				res.json({
					success: 1
				})
			}
		})
	}
}
