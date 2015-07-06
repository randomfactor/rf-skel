express = require('express')
path = require('path')
favicon = require('serve-favicon')
logger = require('morgan')
cookieParser = require('cookie-parser')
bodyParser = require('body-parser')
session = require('express-session')
sessStore = require('connect-redis')(session)
passport = require('passport')

db = require './lib/dbdata' # storage documents
routes = require './routes/index' # express routes

app = express()

session_config = {}
couchdb_url = ''
primary_url = ''

env = process.env.NODE_ENV || 'development'
console.log 'Environment: ' + env
if ('development' == env)
  primary_url = 'http://lvh.me:3000'
  session_config =
    secret: "cercl-stack"
    resave: false
    saveUninitialized: false
    store: new sessStore { db: 2 }
  couchdb_url = 'http://localhost:5984/cercle'
else if ('production' == env)
  primary_url = 'http://to-be-determined.jit.su'
  session_config =
    secret: "cercl-stack"
    resave: false
    saveUninitialized: false
    store: new sessStore { db: 2 }
    url: 'TBD'
  couchdb_url = 'TBD'

# view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('couchurl', couchdb_url)    # save the persistent storage URL for later initialization
app.set('primary_url', primary_url) # communicate primary_url to router

# uncomment after placing your favicon in /public
#app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session(session_config))
app.use passport.initialize()
app.use passport.session()

routes.map_routes app


app.use(require('stylus').middleware(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'public')))

# catch 404 and forward to error handler
app.use (req, res, next) =>
  err = new Error('Not Found')
  err.status = 404
  next(err)

# error handlers

# development error handler
# will print stacktrace
if (app.get('env') == 'development')
  app.use (err, req, res, next) =>
    res.status(err.status || 500)
    res.render 'error',
      message: err.message
      error: err


# production error handler
# no stacktraces leaked to user
app.use (err, req, res, next) =>
  res.status(err.status || 500)
  res.render 'error',
    message: err.message
    error: {}

# configure passport to use browserid
routes.initialize app

# initialize the URL for persistent json document storage
db.setup { db_url: app.get 'couchurl' }

module.exports = app
