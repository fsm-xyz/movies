var User = require('../models/user.js');

exports.showSignup = function (req, res) {
  res.render('signup', {
    title: '注册'
  })
}
exports.showSignin = function (req, res) {
  res.render('signin', {
    title: '登录'
  })
}
exports.signup = function (req, res) {
  var _user = req.body.user;
  User.findOne({
    name: _user.name
  }, function (err, user) {
    if (err) {
      console.log(err);
    }
    if (user) {
      return res.redirect('/signin');
    } else {
      var user = new User(_user);
      user.save(function (err, user) {
        if (err) {
          console.log(err)
        }
        res.redirect('/admin/user/list')
      })
    }
  })
};
//signin
exports.signin = function (req, res) {
  var _user = req.body.user,
    name = _user.name,
    password = _user.password;
  User.findOne({
    name: _user.name
  }, function (err, user) {
    if (err) {
      console.log(err)
    }
    if (!user) {
      return res.redirect('/signup');
    }
    user.comparePassword(password, function (err, isMatch) {
      if (err) {
        console.log(err);
      }
      if (isMatch) {
        req.session.user = user;
        return res.redirect('/');
      } else {
        return res.redirect('/signin');
      }
    })
  })
}

exports.logout = function (req, res) {
  delete req.session.user;
  //delete app.locals.uesr;
  res.redirect('/')
};
//userlist
exports.list = function (req, res) {
  User.fetch(function (err, users) {
    if (err) {
      console.log(err);
    }
    res.render('userlist', {
      title: '列表',
      users: users
    });
  })
};
//middleware for user
exports.signinRequired = function (req, res, next) {
  var user = req.session.user
  if (!user) {
    return res.redirect('/signin')
  }
  next()
}

exports.adminRequired = function (req, res, next) {
  var user = req.session.user
  if (user.role <= 10) {
    return res.redirect('/signin')
  }
  next()
}