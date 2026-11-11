export default function LoadingState({ message = "Loading..." }) {
  return (
    <p className="loading-state" role="status">
      {message}
    </p>
  );
}
