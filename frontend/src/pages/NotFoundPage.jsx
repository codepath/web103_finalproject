import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="page">
      <h1>Page not found</h1>
      <p className="page-placeholder">
        That page does not exist. <Link to="/">Back to the dashboard</Link>
      </p>
    </section>
  );
}
