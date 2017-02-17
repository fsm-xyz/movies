var Movie = require('../models/movie.js');
var Category = require('../models/category.js');

//index
exports.index = function (req, res) {
  Category
    .find({})
    .populate({
      path: 'movies',
      select: 'title poster',
      options: {
        limit: 5
      }
    })
    .exec(function (err, categories) {
      if (err) {
        console.log(err)
      }
      res.render('index', {
        title: '首页',
        categories: categories
      })
    });
}

exports.search = function (req, res) {
  var catId = req.query.cat,
    q = req.query.q,
    page = parseInt(req.query.p, 10) || 0,
    count = 2,
    index = page * count,
    category
  if (catId) {
    Category
      .find({
        _id: catId
      })
      .populate({
        path: 'movies',
        select: 'title poster',
        options: {
          //limit: 2,
          //skip: index
        }
      })
      .exec(function (err, categories) {
        if (err) {
          console.log(err)
        }
        category = categories[0] || {}
        movies = category.movies || []
        results = movies.slice(index, index + 2)
        res.render('results', {
          title: '搜索结果列表页',
          keyword: category.name,
          currentPage: page + 1,
          query: 'cat=' + catId,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  } else {
    Movie
      .find({
        title: new RegExp((q + '.*'), 'i')
      })
      .exec(function (err, movies) {
        if (err) {
          console.log(err)
        }
        var results = movies.slice(index, index + count)
        res.render('results', {
          title: '搜索结果列表页',
          keyword: q,
          currentPage: page + 1,
          query: 'q=' + q,
          totalPage: Math.ceil(movies.length / count),
          movies: results
        })
      })
  }
}
