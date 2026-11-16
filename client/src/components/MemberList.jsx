export default function MemberList({ members }) {
  return (
    <ul className="member-list">
      {members.map((member) => (
        <li key={member.user_id}>
          <span className="member-name"><span className="member-avatar" aria-hidden="true">{member.name.trim().charAt(0).toUpperCase()}</span>{member.name}</span>
          <span className="badge">{member.role}</span>
        </li>
      ))}
    </ul>
  )
}
