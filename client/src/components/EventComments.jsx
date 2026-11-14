import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import CommentsAPI from '../services/CommentsAPI'
import { useLoad } from '../utils/useLoad'
import ErrorMessage from './ErrorMessage'
import Spinner from './Spinner'
import '../css/EventComments.css'

const relativeTime = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateString).toLocaleDateString()
}

const CommentItem = ({ comment, eventId, user, onToggleLike }) => (
  <li className="comment-item">
    <div className="comment-header">
      {comment.user_image_url ? (
        <img className="comment-avatar" src={comment.user_image_url} alt="" />
      ) : (
        <div className="comment-avatar-placeholder" aria-hidden="true">
          {comment.full_name.charAt(0)}
        </div>
      )}
      <div className="comment-meta">
        <Link to={`/users/${comment.user_id}`} className="comment-author">
          {comment.full_name}
        </Link>
        <span className="comment-time">{relativeTime(comment.created_at)}</span>
      </div>
    </div>
    <p className="comment-text">{comment.comment_text}</p>
    <div className="comment-actions">
      {user ? (
        <button
          type="button"
          className={`like-button${comment.liked_by_me ? ' liked' : ''}`}
          onClick={() => onToggleLike(comment)}
          aria-label={comment.liked_by_me ? 'Unlike' : 'Like'}
        >
          {comment.liked_by_me ? '👍' : '👍'} {comment.like_count}
        </button>
      ) : (
        <Link
          to="/login"
          state={{ from: `/events/${eventId}` }}
          className="like-button"
          aria-label="Like"
        >
          👍 {comment.like_count}
        </Link>
      )}
    </div>
  </li>
)

const EventComments = ({ eventId }) => {
  const { user } = useSession()
  const { data, loading, error, reload } = useLoad(() => CommentsAPI.getComments(eventId), [eventId])
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)
  const [postError, setPostError] = useState(null)

  useEffect(() => {
    if (data) setComments(data)
  }, [data])

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setPosting(true)
    setPostError(null)
    try {
      const created = await CommentsAPI.createComment(eventId, text)
      setComments((prev) => [created, ...prev])
      setText('')
    } catch (err) {
      setPostError(err.message)
    } finally {
      setPosting(false)
    }
  }

  const toggleLike = async (comment) => {
    setComments((prev) =>
      prev.map((c) =>
        c.comment_id === comment.comment_id
          ? { ...c, liked_by_me: !c.liked_by_me, like_count: c.like_count + (c.liked_by_me ? -1 : 1) }
          : c
      )
    )
    try {
      if (comment.liked_by_me) {
        await CommentsAPI.unlikeComment(eventId, comment.comment_id)
      } else {
        await CommentsAPI.likeComment(eventId, comment.comment_id)
      }
    } catch {
      setComments((prev) =>
        prev.map((c) =>
          c.comment_id === comment.comment_id
            ? { ...c, liked_by_me: comment.liked_by_me, like_count: comment.like_count }
            : c
        )
      )
    }
  }

  if (loading) return <Spinner />
  if (error) return <ErrorMessage message={error} onRetry={reload} />

  return (
    <section className="event-comments">
      <h2>Comments ({comments.length})</h2>

      {user ? (
        <form className="comment-form" onSubmit={submit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment..."
            rows={3}
            maxLength={1000}
            aria-label="Comment text"
          />
          <div className="comment-form-actions">
            <button type="submit" disabled={posting || !text.trim()}>
              {posting ? 'Posting...' : 'Post comment'}
            </button>
            {postError && <p className="comment-error">{postError}</p>}
          </div>
        </form>
      ) : (
        <p className="comment-login-prompt">
          <Link to="/login" state={{ from: `/events/${eventId}` }}>Log in</Link> to leave a comment.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="comment-empty">No comments yet. Be the first!</p>
      ) : (
        <ul className="comment-list" aria-label="Comments">
          {comments.map((comment) => (
            <CommentItem
              key={comment.comment_id}
              comment={comment}
              eventId={eventId}
              user={user}
              onToggleLike={toggleLike}
            />
          ))}
        </ul>
      )}
    </section>
  )
}

export default EventComments
