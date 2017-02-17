var mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10,
	UserSchema = new mongoose.Schema({
		name: {
			unique: true,
			type: String
		},
		password: String,
		// 0: normal
		// 1: verified
		// 2: professional
		// >10: admin
		// >50: super admin
		role: {
			type: Number,
			default: 0
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

UserSchema.pre('save', function (next) {
	var user = this
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now();
	}
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) {
			return next(err)
		}
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) {
				next(err)
			}
			user.password = hash
			next()
		})
	})
})

UserSchema.methods = {
	comparePassword: function (_password, cb) {
		bcrypt.compare(_password, this.password, function (err, isMatch) {
			if (err) {
				return cb(err)
			}
			cb(null, isMatch)
		})
	}
}
UserSchema.statics = {
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

module.exports = UserSchema
