import { Layout } from "../components";
import { useUser } from "../hooks";

export const Home = () => {
  const { user, isLoading } = useUser();

  // TODO: replace this with a loading spinner
  if (isLoading) {
    return (
      <Layout>
        <div className="flex-grow flex justify-center items-center normal-case text-4xl">
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex justify-center items-center text-6xl h-60">
        Welcome back, {user.username}!
      </div>
    </Layout>
  );
};
