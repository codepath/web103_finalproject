import { Link } from "react-router"

const SideMenuItem = ({ icon, text, to}) => {
  return (
    <Link className="menu-item" to={to}>
      {icon}
      <span>{text}</span>
    </Link>
  )
}

export default SideMenuItem