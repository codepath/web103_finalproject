import LeftSidebar from "../components/layout/LeftSidebar"
import RightSidebar from "../components/layout/RightSidebar"

const BodyLayout = ({ element }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      {/* Left Sidebar */}
      <aside className="hidden lg:block lg:w-56 shrink-0">
        <LeftSidebar />
      </aside>

      {/* Main */}
      <main className="w-full flex-1 min-w-0">
        {element}
      </main>

      {/* Right Sidebar */}
      <aside className="hidden xl:block xl:w-56 shrink-0">
        <RightSidebar />
      </aside>
    </div>
  )
}

export default BodyLayout