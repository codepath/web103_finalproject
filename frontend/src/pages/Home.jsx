import React from "react";

const Home = ({ setLogIn }) => {
  return (
    <div className="h-screen flex justify-center items-center font-caveat">
      <div className="flex flex-col gap-y-12">
        <div className="text-6xl">Welcome To Study Meet</div>
        <input
          type="text"
          className="p-2 rounded-md focus:outline-none border-2 text-3xl"
        />
        <button
          onClick={() => setLogIn(true)}
          className="text-4xl bg-slate-300 rounded-md p-2 mx-20"
        >
          CTA
        </button>
      </div>
    </div>
  );
};

export default Home;
