import SideMenuItem from "../ui/SideMenuItem"

// icons
import ArticleIcon from '@mui/icons-material/Article';
import GroupsIcon from '@mui/icons-material/Groups';
import Person2Icon from '@mui/icons-material/Person2';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';

const LeftSidebar = () => {
  const menu = [
    { text: 'Projects', icon: <ArticleIcon />, to: '/projects' },
    { text: 'Community', icon: <GroupsIcon />, to: '/community' },
    { text: 'Network', icon: <WifiTetheringIcon />, to: '/network' },
    { text: 'Bookmarks', icon: <BookmarkIcon />, to: '/bookmarks' },
  ]

  return (
    <aside>
      {menu.map((item) => (
        <SideMenuItem
          key={item.text}
          icon={item.icon}
          text={item.text}
          to={item.to}
        />
      ))}
    </aside>
  )
}

export default LeftSidebar