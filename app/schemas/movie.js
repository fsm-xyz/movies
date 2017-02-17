var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId,
	MovieSchema = new mongoose.Schema({
		title: String,
		director: String,
		language: String,
		country: String,
		year: Number,
		summary: String,
		flash: String,
		poster: String,
		pv: {
			type: Number,
			default: 0
		},
		category: {
			type: ObjectId,
			ref: 'Category'
		},
		meta: {
			createAt: {
				type: Date,
				default: Date.now()
			},
			updateAt: {
				type: Date,
				default: Date.now()
			}
		}
	})

MovieSchema.pre('save', function (next) {
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now();
	}
	next()
})
MovieSchema.statics = {
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

module.exports = MovieSchema
