import users_sequelize from '../models/users_sequelize.js'
import post_sequelize from '../models/post_sequelize.js'
import company_sequelize from '../models/company_sequelize.js'

// get all video games from the database
const getUsers = async (req, res) => {
  try {
    const {constraint, value} = req.body;
    const results = await users_sequelize.findAll( constraint, value)
    res.status(200).json(results.rows)
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// get video games by ID from the database
const getUserByConstraint = async (req, res) => {
  try {
    const {constraint, value} = req.body;
    const results = await users_sequelize.findOne(constraint, value)
    res.status(200).json(results.rows[0])
  }
  catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// create new blog post
const createUser = async (req, res) => {
    try {
      
      const {  githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin } = req.body
      const results = await users_sequelize.create( githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin)
      res.status(201).json(results.rows)
    } catch (error) {
      
      res.status(400).json( { error: error.message } )
    }
  }
  
  // update existing blog post
  const updateUser = async (req, res) => {
    try {
      const { githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin } = req.body
      const results = await users_sequelize.update(req.params.id, githubId, username, avatarUrl, accessToken, savedJobs, Role, is_admin)
      res.status(201).json(results.rows)
    } catch (error) {
      res.status(400).json( { error: error.message } )
    }
  }
  
  // delete existing blog post
  const deleteUser = async (req, res) => {
    try {
      const {constraint, value} = req.body
      const results = await users_sequelize.deleteUser(constraint, value)
      res.status(200).json(results.rows)
    } catch (error) {
      res.status(400).json( { error: error.message } )
    }
  }
  //now for company

  const getCompany = async (req, res) => {
    try {
      const {constraint, value} = req.body;
      const results = await company_sequelize.findAll( constraint, value)
      res.status(200).json(results.rows)
    }
    catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
  
  // get video games by ID from the database
  const getCompanyByConstraint = async (req, res) => {
    try {
      const {constraint, value} = req.body;
      const results = await company_sequelize.findOne(constraint, value)
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
  
  // create new blog post
  const createCompany = async (req, res) => {
      try {
        
        const {  githubId, name, description, picture_url } = req.body
        const results = await company_sequelize.create( githubId, name, description, picture_url)
        res.status(201).json(results.rows)
      } catch (error) {
        
        res.status(400).json( { error: error.message } )
      }
    }
    
    // update existing blog post
    const updateCompany = async (req, res) => {
      try {
        const { githubId, name, description, picture_url } = req.body
        const results = await company_sequelize.update(req.params.id, githubId, name, description, picture_url)
        res.status(201).json(results.rows)
      } catch (error) {
        res.status(400).json( { error: error.message } )
      }
    }
    
    // delete existing blog post
    const deleteCompany = async (req, res) => {
      try {
        const {constraint, value} = req.body
        const results = await company_sequelize.deleteCompany(constraint, value)
        res.status(200).json(results.rows)
      } catch (error) {
        res.status(400).json( { error: error.message } )
      }
    }
// now for posts
const getPost = async (req, res) => {
    try {
      const {constraint, value} = req.body;
      const results = await post_sequelize.findAll( constraint, value)
      res.status(200).json(results.rows)
    }
    catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
  
  // get video games by ID from the database
  const getPostByConstraint = async (req, res) => {
    try {
      const {constraint, value} = req.body;
      const results = await post_sequelize.findOne(constraint, value)
      res.status(200).json(results.rows[0])
    }
    catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
  
  // create new blog post
  const createPost = async (req, res) => {
      try {
        
        const {  githubId, title, body, likes, pending } = req.body
        const results = await post_sequelize.create( githubId, title, body, likes, pending)
        res.status(201).json(results.rows)
      } catch (error) {
        
        res.status(400).json( { error: error.message } )
      }
    }
    
    // update existing blog post
    const updatePost = async (req, res) => {
      try {
        const { githubId, title, body, likes, pending } = req.body
        const results = await post_sequelize.update(req.params.id, githubId, title, body, likes, pending)
        res.status(201).json(results.rows)
      } catch (error) {
        res.status(400).json( { error: error.message } )
      }
    }
    
    // delete existing blog post
    const deletePost = async (req, res) => {
      try {
        const {constraint, value} = req.body
        const results = await post_sequelize.deletePost(constraint, value)
        res.status(200).json(results.rows)
      } catch (error) {
        res.status(400).json( { error: error.message } )
      }
    }



export default {
  getUsers,
  getUserByConstraint,
  createUser,
  updateUser,
  deleteUser,
  getCompany,
  getCompanyByConstraint,
  createCompany,
  updateCompany,
  deleteCompany,
  getPost,
  getPostByConstraint,
  createPost,
  updatePost,
  deletePost


}