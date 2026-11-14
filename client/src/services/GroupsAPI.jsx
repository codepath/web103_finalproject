import { request, toQueryString } from '../utils/request'

// groups, with filters (search, category, city, state)
const getGroups = (filters = {}) => request(`/api/groups${toQueryString(filters)}`)

// one group with its organizer, member count and whether the person has joined
const getGroup = (groupId) => request(`/api/groups/${groupId}`)

// hosts only: create, edit and delete a group
const createGroup = (group) => request('/api/groups', { method: 'POST', body: group })
const updateGroup = (groupId, changes) => request(`/api/groups/${groupId}`, { method: 'PATCH', body: changes })
const deleteGroup = (groupId) => request(`/api/groups/${groupId}`, { method: 'DELETE' })

// the people in a group
const getGroupMembers = (groupId) => request(`/api/groups/${groupId}/members`)

// join and leave a group as the logged-in person
const joinGroup = (groupId) => request(`/api/groups/${groupId}/members`, { method: 'POST' })
const leaveGroup = (groupId) => request(`/api/groups/${groupId}/members/me`, { method: 'DELETE' })

// save and unsave a group as the logged-in person
const saveGroup = (groupId) => request(`/api/groups/${groupId}/saves`, { method: 'POST' })
const unsaveGroup = (groupId) => request(`/api/groups/${groupId}/saves/me`, { method: 'DELETE' })

export default { getGroups, getGroup, createGroup, updateGroup, deleteGroup, getGroupMembers, joinGroup, leaveGroup, saveGroup, unsaveGroup }
