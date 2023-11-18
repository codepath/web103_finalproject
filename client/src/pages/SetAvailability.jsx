import React, { useRef, useState } from "react";
import { useUser } from "../hooks";
import { Layout } from "../components";

export const SetAvailability = () => {
  const { user, isLoading } = useUser();
  const [timeAdded, setTimeAdded] = useState(false);
  const timeRef = useRef(null);

  const handleAddAvailability = async (e) => {
    e.preventDefault();
    console.log(timeRef.current.value.slice(0, 2));
    try {
      const response = await fetch("/api/availabilities", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          tutor_id: user.id,
          time_block: parseInt(timeRef.current.value.slice(0, 2)),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTimeAdded(true);
      return data;
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <Layout>
      {isLoading && <div>Loading...</div>}
      {!timeAdded && !isLoading ? (
        <form name="change-profile" onSubmit={handleAddAvailability}>
          <div className="flex flex-col justify-center items-center gap-4 gap-y-10 p-4 pb-16 ">
            <label htmlFor="username">Time</label>
            <input
              name="username"
              type="time"
              className="flex-1 focus:outline-none border-2 rounded-md p-1"
              ref={timeRef}
            />
            <button type="submit" className="p-2 border-2 rounded-md">
              Add
            </button>
          </div>
        </form>
      ) : (
        timeAdded && (
          <div className="text-xl h-36 font-bold flex justify-center items-center">
            New Time Added
          </div>
        )
      )}
    </Layout>
  );
};
