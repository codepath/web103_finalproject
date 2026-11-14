import express from 'express'
import GroupsController from '../controllers/groups.js'
import { requireHost, requireOrganizer, requireUser } from '../utils/access.js'

// Create a new router instance
const router = express.Router()

// only the organizer of the group in the address may change or delete it
const requireGroupOrganizer = requireOrganizer(GroupsController.getGroupOrganizerId)

// Define a route to get all groups
router.get('/', GroupsController.getGroups)

// Define a route for a host to create a group
router.post('/', requireHost, GroupsController.createGroup)

// Define a route to get a specific group by its ID
router.get('/:groupId', GroupsController.getGroupById)

// Define routes for the organizer to edit or delete their group
router.patch('/:groupId', requireGroupOrganizer, GroupsController.updateGroup)
router.delete('/:groupId', requireGroupOrganizer, GroupsController.deleteGroup)

// Define a route to list the people in a group
router.get('/:groupId/members', GroupsController.getGroupMembers)

// Define routes for a logged-in person to join and leave a group
router.post('/:groupId/members', requireUser, GroupsController.joinGroup)
router.delete('/:groupId/members/me', requireUser, GroupsController.leaveGroup)

// Define routes for a logged-in person to save and unsave a group
router.post('/:groupId/saves', requireUser, GroupsController.saveGroup)
router.delete('/:groupId/saves/me', requireUser, GroupsController.unsaveGroup)

export default router
