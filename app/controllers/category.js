var Category = require('../models/category.js')
exports.new = function (req, res) {
  res.render('category', {
    title: '目录录入页',
    category: {}
  })
}
exports.save = function (req, res) {
  var _category = req.body.category,
    category,
    id = _category.id;
  if (id) {
    category = new Category(_category)
    category.save(function (err, category) {
      if (err) {
        console.log(err)
      }
    })
  } else {
    var category = new Category(_category)
      //todo
  }
  res.redirect('/admin/category/list')
}


exports.list = function (req, res) {
  Category.fetch(function (err, categories) {
    if (err) {
      console.log(err)
    }
    res.render('categorylist.jade', {
      title: '目录列表页',
      categories: categories
    })
  })
}
