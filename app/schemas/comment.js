var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId,
  CommentSchema = new mongoose.Schema({
    movie: {
      type: ObjectId,
      ref: 'Movie'
    },
    from: {
      type: ObjectId,
      ref: 'User'
    },
    reply: [{
      from: {
        type: ObjectId,
        ref: 'User'
      },
      to: {
        type: ObjectId,
        ref: 'User'
      },
      content: String
    }],
    content: String,
    meta: {
      createAt: {
        type: Date,
        defaule: Date.now()
      },
      updateAt: {
        type: Date,
        default: Date.now()
      }
    }
  })

CommentSchema.pre('save', function (next) {
  var user = this
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now();
  }
  next()
})


CommentSchema.statics = {
  fetch: function (cb) {
    return this
      .find({})
      .sort({
        'meta.updateAt': -1
      })
      .exec(cb)
  },
  findById: function (id, cb) {
    return this
      .findOne({
        _id: id
      })
      .exec(cb)
  }
}

module.exports = CommentSchema