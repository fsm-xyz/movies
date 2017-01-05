var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('underscore');
var mongoose = require('mongoose');
var Movie = require('./models/movie.js');
var port = process.env.PORT || 3000;
var app = express();


mongoose.connect('mongodb://localhost/imooc');
mongoose.connection.on('connected', function () {
  console.log('Connection success!');
});
//mongoose.Promise = global.Promise;
app.set('views', './views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(bodyParser.json());
app.locals.moment = require('moment');
app.listen(port, function () {
  console.log('server start on port:' + port);
});

//routes
//index
app.get('/', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err)
    }
    res.render('index', {
      title: '首页',
      movies: movies
    });
  });
});

//detail
app.get('/movie/:id', function (req, res) {
  var id = req.params.id;
  Movie.findById(id, function (err, movie) {
    if (err) {
      console.log(err)
    }
    res.render('detail', {
      title: '详情页' + movie.title,
      movie: movie
    });
  });

});
//admin
app.get('/admin/movie', function (req, res) {
  res.render('admin', {
    title: '后台录入',
    movie: {
      title: '',
      doctor: '',
      country: '',
      language: '',
      summary: '',
      year: '',
      flash: '',
      poster: ''
    }
  });
});
app.get('/admin/update/:id', function (req, res) {
  var id = req.params.id;
  if (id) {
    Movie.findById(id, function (err, movie) {
      res.render('admin', {
        title: '后台更新',
        movie: movie
      });
    });
  }
});
app.post('/admin/movie/new', function (req, res) {
  var id = req.body.movie._id;
  var movieObj = req.body.movie;
  var _movie;
  if (id !== 'undefined') {
    Movie.findById(id, function (err, movie) {
      if (err) {
        console.log(err);
      }
      _movie = _.extend(movie, movieObj);
      _movie.save(function (err, movie) {
        if (err) {
          console.log(err)
        }
        res.redirect('/movie/' + movie._id)
      })
    })
  } else {
    _movie = new Movie({
      doctor: movieObj.doctor,
      title: movieObj.title,
      language: movieObj.language,
      country: movieObj.country,
      year: movieObj.year,
      poster: movieObj.poster,
      flash: movieObj.flash,
      summary: movieObj.summary,

    })
    _movie.save(function (err, movie) {
      if (err) {
        console.log(err);
      }
      res.redirect('/movie/' + movie._id)
    })
  }
})

//list
app.get('/admin/list', function (req, res) {
  Movie.fetch(function (err, movies) {
    if (err) {
      console.log(err);
    }
    res.render('list', {
      title: '列表',
      movies: movies
    });
  })
});

//delete
app.delete('/admin/list', function (req, res) {
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
})
