import { API_URL } from "../config";

export const Home = () => {
  return (
    <div className="h-screen flex justify-center items-center font-caveat">
      <div className="flex flex-col gap-y-12">
        <div className="text-6xl">Welcome To Study Meet</div>
        <input
          type="text"
          className="p-2 rounded-md focus:outline-none border-2 text-3xl"
        />
        <button className="text-4xl bg-slate-300 rounded-md p-2 mx-20">
          {/* TODO: Tailwind magic thing here */}
          <a href={`${API_URL}/auth/github`}>🔒 Login via Github</a>
        </button>
      </div>
    </div>
  );
};
