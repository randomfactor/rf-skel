
###
 * GET home page.
###

# TODO: add this back
user_router = require './user'
passport = require 'passport'
BrowserIDStrategy = require('passport-browserid').Strategy # login will use browserid
User = require('../lib/user').User

index = (req, res) ->
  res.render 'index', { title: 'Randomfactor Stack' }

test = (req, res) ->
  res.render 'test/test'

# setup for passport to use browserid
exports.initialize = (app) ->
  passport.serializeUser (user, done) ->
    done null, user._id

  passport.deserializeUser (email, done) ->
    User.find_by_id(email).then(
      (user) ->
        done null, user
      (err) ->
        done err
    )

  passport.use new BrowserIDStrategy {
      audience: app.get 'primary_url'
    },
    (email, done) ->
      User.find_or_create_by_email(email).then(
        (user) ->
          done null, user
        (err) ->
          console.log 'lookup by email failed'
          done err
      )

exports.map_routes = (app) ->
  app.get '/', index
  app.get '/test', test

  # define routes for login with browserid and logout
  app.get '/logout', (req, res) ->
    req.logout()
    res.json { user: req.user }
  app.post '/auth/browserid',
    passport.authenticate 'browserid', { failureRedirect: '/logout' }
    (req, res) ->
      res.json { user: req.user }

  # routing for /api/users...
  user_router.map_routes app
