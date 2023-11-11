import express from 'express'

import route_functions from '../controllers/route_functions.js'

const router = express.Router()
//everything user
router.get('/users', route_functions.getUsers)
router.get('/users/:constraint/:value', route_functions.getUsersByConstraint)
router.get('/user/:constraint/:value', route_functions.getUserByConstraint)

router.post('/user', route_functions.createUser)
router.patch('/user/:id', route_functions.updateUser)
router.delete('/car', route_functions.deleteUser)
//everything company
router.get('/companys', route_functions.getCompanys)
router.get('/companys/:constraint/:value', route_functions.getCompanysByConstraint)
router.get('/company/:constraint/:value', route_functions.getCompanyByConstraint)
router.post('/company', route_functions.createCompany)
router.patch('/company/:id', route_functions.updateCompany)
router.delete('/company', route_functions.deleteCompany)
//everything posts
router.get('/posts', route_functions.getPosts)
router.get('/posts/:constraint/:value', route_functions.getPostsByConstraint)
router.get('/post/:constraint/:value', route_functions.getPostByConstraint)
router.post('/post', route_functions.createPost)
router.patch('/post/:id', route_functions.updatePost)
router.delete('/post', route_functions.deletePost)

export default router