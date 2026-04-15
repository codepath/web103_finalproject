
const Footer = () => {
  return (
    <>
      <footer className="border-t border-border bg-app-bg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-sm text-app-muted">
            © {new Date().getFullYear()} CodeFolio. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer