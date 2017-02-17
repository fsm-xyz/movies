var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	mongoose = require('mongoose'),
	mongoStore = require('connect-mongo')(session),
	port = process.env.PORT || 3000,
	app = express(),
	morgan = require('morgan'),
	multiparty = require('connect-multiparty'),
	//logger = morgan('combined'),
	dbUrl = 'mongodb://localhost/imooc',
	fs = require('fs'),
	models_path,
	walk

mongoose.connect(dbUrl);
mongoose.connection.on('connected', function () {
	console.log('Connection success!');
});

//models loading
models_path = __dirname + '/app/models'
walk = function (path) {
	fs
		.readdirSync(path)
		.forEach(function (file) {
			var newPath = path + '/' + file,
				stat = fs.statSync(newPath);

			if (stat.isFile()) {
				if (/(.*)\.(js|coffee)/.test(file)) {
					require(newPath)
				}
			} else if (stat.isDirectory()) {
				walk(newPath)
			}
		})
}
walk(models_path)

//mongoose.Promise = global.Promise;
app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	extended: true
}))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({
	secret: 'imooc',
	resave: true,
	saveUninitialized: true,
	store: new mongoStore({
		url: dbUrl,
		options: 'sessions'
	})
}));
app.use(multiparty())
var env = process.env.NODE_ENV || 'dev'
if ('development' === env) {
	app.set('showStackError', true);
	app.use(morgan(':method :url :status'));
	app.locals.pretty = true;
	mongoose.set('debug', true);
}
require('./config/routes.js')(app)
	//app.use(bodyParser.json());
app.locals.moment = require('moment');
app.listen(port, function () {
	console.log('server start on port:' + port);
});
