
const TopProjects = (
  { topProjects = [ "TechQuick", "BuildMySupra", "Unearthed", "Crewmates" ],
    topTags = [ "python", "react", "express", "html", "css"] }
  ) => {

  return (
    <div className="flex flex-col items-end text-right">
      <div className="w-full flex flex-col gap-2 mb-3 items-end text-right pb-2 border-b-2 border-text">
        <h4 className="heading-sm">Top Projects</h4>
        <div>
          {topProjects.map((project) => (
            <div key={project} className="mb-2">
              {project}
            </div>
          ))}
        </div>
      </div>
      <div className="w-fit flex flex-row flex-wrap gap-x-2 items-end justify-end text-muted">
        {topTags.map((tag) => (
          <span key={tag} className="hover:scale-105">#{tag}</span>
        ))}
      </div>
    </div>
  )
}

export default TopProjects