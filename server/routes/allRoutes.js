import express from "express";
import isAuthenticated from "../middleware/authMiddleware.js";
import projectController from "../controllers/projectController.js";
import postController from "../controllers/postController.js";
import profileController from "../controllers/profileController.js";
import networkController from "../controllers/networkController.js";

const router = express.Router();

router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.post('/projects', isAuthenticated, projectController.createProject);
router.patch('/projects/:id', isAuthenticated, projectController.updateProject);
router.delete('/projects/:id', isAuthenticated, projectController.deleteProject);

router.get('/posts', postController.getAllPosts);
router.post('/posts', isAuthenticated, postController.createPost);
router.delete('/posts/:id', isAuthenticated, postController.deletePost);
router.post('/posts/:id/comments', isAuthenticated, postController.addComment);
router.get('/posts/:id/comments', postController.getPostComments);
router.get('/hashtags/search', postController.searchHashtags);

router.get('/profiles/:id', profileController.getProfile);
router.post('/profiles', isAuthenticated, profileController.createProfile);

router.post('/network/requests', isAuthenticated, networkController.sendRequest);
router.patch('/network/requests/:networkId/accept', isAuthenticated, networkController.acceptRequest);
router.delete('/network/requests/:networkId/reject', isAuthenticated, networkController.rejectRequest);
router.delete('/network/connections/:networkId', isAuthenticated, networkController.disconnectConnection);
router.get('/network/requests', isAuthenticated, networkController.getPendingRequests);
router.get('/network/connections', isAuthenticated, networkController.getAllConnections);


export default router;