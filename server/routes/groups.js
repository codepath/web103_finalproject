import express from 'express'
import groupsController from '../controllers/groups.js'
const router = express.Router()

router.get('/', groupsController.getGroups)
router.get('/:id', groupsController.getGroup)
router.post('/', groupsController.createGroup)
router.delete('/:id', groupsController.deleteGroup)
router.patch('/:id', groupsController.updateGroup)

export default router