import { useUser } from "../hooks";

export const NotFound = () => {
  const { isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  return (
    <div className="h-screen flex justify-center items-center font-caveat">
      <div className="flex flex-col gap-y-12">
        <div className="text-6xl text-center">Page Not Found</div>
        <input
          type="text"
          className="p-2 rounded-md focus:outline-none border-2 text-3xl"
        />
        <button className="text-4xl bg-slate-300 rounded-md p-2 mx-20">
          <a href={"/auth/github"}>🔒 Login via GitHub</a>
        </button>
      </div>
    </div>
  );
};
