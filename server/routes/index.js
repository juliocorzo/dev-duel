import {Router} from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'

import { generateUserSlow, generateUsersSlow } from "../services/user-service-slow"
import { generateUserFast, generateUsersFast } from "../services/user-service-fast"
import { generateUser, generateUsers } from "../services/user-service";
import { snoopUser } from "../services/user-service-snoop"

axios.defaults.baseURL = 'https://api.github.com/'
axios.defaults.headers.common['Authorization'] = token

export default () => {
  let router = Router()

  /** GET /health-check - Check service health */
  router.get('/health-check', (req, res) => res.send('OK'))

  /** GET /api/rate_limit - Get github rate limit for your token */
  router.get('/rate', (req, res) => {
    axios.get(`rate_limit`).then(({ data }) => res.json(data))
  })

  /** GET /api/user/:username - Get user */
  router.get('/user/:username', validate(validation.user), async (req, res) => {
    try {
      const user = await generateUser(req.params.username)
      res.json(user)
    } catch (error) {
      res.status(404).send(error.message)
    }
  })

  /** GET /api/users? - Get users */
  router.get('/users/', validate(validation.users), async (req, res) => {
    try {
      const users = await generateUsers(req.query)
      res.json(users)
    } catch (error) {
      res.status(404).send(error.message)
    }
  })

  /** GET /api/snoop/:username - Get deeper user data */
  router.get('/snoop/:username', validate(validation.user), (req, res) => {
      snoopUser(req.params.username, res)
  })

  /**
   * GET /slow/user/:username
   *
   * A more accurate endpoint, that goes through all of the user's repositories and gets a better representation of
   * language usage. The downside is that it takes a lot longer, because, for example, if a user has 100 repositories,
   * this endpoint would make 102 requests to GitHub, one for user data, one for repository data, and 100 for
   * repository language data.
   */
  router.get('/slow/user/:username', validate(validation.user), (req, res) => {
    generateUserSlow(req.params.username, res)
  })

  /**
   * GET /slow/users
   *
   * Returns an array of users based on the query, format is exactly the same as the other slow endpoint, but for
   * multiple users.
   */
  router.get('/slow/users/', validate(validation.users), (req, res) => {
    generateUsersSlow(req.query, res)
  })

  return router
}
