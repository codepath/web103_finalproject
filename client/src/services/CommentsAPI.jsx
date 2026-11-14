import { request } from '../utils/request'

const getComments = (eventId) => request(`/api/events/${eventId}/comments`)
const createComment = (eventId, text) => request(`/api/events/${eventId}/comments`, { method: 'POST', body: { comment_text: text } })
const likeComment = (eventId, commentId) => request(`/api/events/${eventId}/comments/${commentId}/likes`, { method: 'POST' })
const unlikeComment = (eventId, commentId) => request(`/api/events/${eventId}/comments/${commentId}/likes`, { method: 'DELETE' })

export default { getComments, createComment, likeComment, unlikeComment }
