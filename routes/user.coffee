User = require('../lib/user').User

#app.get '/users', User.index
index = (req, res) ->
  User.find_all(req.query).then(
    (data) ->
      res.json { users: data }    # TODO: don't reveal email
    (err) ->
      res.status(404).send('Not found.')
  )

#app.post '/users', User.create
create = (req, res) ->
  console.log 'create user'
  console.dir req.body
  res.send 'create: not implemented'

#app.get '/users/:id', User.find
find = (req, res) ->
  id = req.params.id
  User.find_by_id(id).then(
    (data) ->
      res.json { user: data }    # TODO: don't reveal email
    (err) ->
      console.error err
      res.status(404).send('Not found.')
  )

#app.put '/users/:id', User.modify
modify = (req, res) ->
  User.find_by_id(req.params.id).then(
    (user) ->
      console.log "modify user: #{user._id}"
      delete req.body._id if req.body?._id? # don't allow changing user's id
      console.dir req.body
      user[key] = val for key, val of req.body.user
      User.save(user).then(
        (data) ->
          console.log "modified user: #{user._id}"
          console.dir data
          res.send 'OK'
      )
    (err) ->
      res.status(404).send('Not found.')
  )

#app.delete '/users/:id', User.delete
delete_by_id = (req, res) ->
  res.send 'delete: not implemented'

# only allow same user or admin to modify a user after it is created
authorize_owner_or_admin = (req, res, next) ->
  if req.user?._id is req.params?.id
    next()
  else if 'admin' in req.user?.roles
    next()
  else
    res.status(401).send('Not authorized.')

exports.map_routes = (app) ->
  app.get '/api/users', index
  app.post '/api/users', create
  app.get '/api/users/:id', find
  app.put '/api/users/:id', authorize_owner_or_admin, modify
  app.delete '/api/users/:id', authorize_owner_or_admin, delete_by_id

exports.authorize_owner_or_admin = authorize_owner_or_admin
