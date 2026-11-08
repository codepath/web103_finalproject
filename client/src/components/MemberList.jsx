export default function MemberList({ members }) {
  return (
    <ul className="member-list">
      {members.map((member) => (
        <li key={member.user_id}>
          <span>{member.name}</span>
          <span className="badge">{member.role}</span>
        </li>
      ))}
    </ul>
  )
}
