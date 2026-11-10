import { Link, useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";
import BooksAPI from "../services/BooksAPI";

const AddBookPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <h1>Add a Book</h1>
      <BookForm submitLabel="Add book" onSubmit={BooksAPI.createBook} onSuccess={() => navigate("/")} />
      <Link to="/">Back to Home</Link>
    </>
  );
};

export default AddBookPage;