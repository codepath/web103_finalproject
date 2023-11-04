import express from 'express'

import route_functions from '../controllers/route_functions.js'

const router = express.Router()
//everything user
router.get('/user', route_functions.getUserByConstraint)
router.post('/user', route_functions.createUser)
router.patch('/user/:id', route_functions.updateUser)
router.delete('/car', route_functions.deleteUser)
//everything company
router.get('/company', route_functions.getCompany)
router.get('/company/constraint', route_functions.getCompanyByConstraint)
router.post('/company', route_functions.createCompany)
router.patch('/company/:id', route_functions.updateCompany)
router.delete('/company', route_functions.deleteCompany)
//everything posts
router.get('/post', route_functions.getPost)
router.get('/post/constraint', route_functions.getPostByConstraint)
router.post('/post', route_functions.createPost)
router.patch('/post/:id', route_functions.updatePost)
router.delete('/post', route_functions.deletePost)

export default router