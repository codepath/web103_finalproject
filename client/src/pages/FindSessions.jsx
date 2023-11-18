import React, { useEffect, useRef, useState } from "react";
import { Layout } from "../components";

export const FindSessions = () => {
  const [isTimeEnter, setIsTimeEnter] = useState(false);
  const [isTutorEnter, setIsTutorEnter] = useState(false);
  const [tutors, setTutors] = useState([]);
  const timeRef = useRef(null);

  const handleTimeSubmit = async (event) => {
    event.preventDefault();
    const timeBlock = timeRef.current.value.slice(0, 2);

    try {
      const response = await fetch(`/api/availabilities/${timeBlock}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      console.log(data);
      setIsTimeEnter(true);
      setTutors(data);
      return data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleTutorSubmit = async (id) => {
    // try {
    //     const response = await fetch(`/api/user_sessions/${timeBlock}`, {
    //       method: "POST",
    //       credentials: "include",
    //       body: JSON.stringify({
    //         tutor_id: user.id,
    //         time_block: parseInt(timeRef.current.value.slice(0, 2)),
    //       }),
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     });
    //     const data = await response.json();
    //     console.log(data);
    //     setIsTutorEnter(true);
    //     return data;
    //   } catch (err) {
    //     console.error(err);
    //   }
    setIsTutorEnter(true);
  };

  useEffect(() => {
    console.log(tutors);
  }, [tutors]);
  return (
    <Layout>
      <div className="flex flex-col justify-center items-center text-2xl h-full gap-4 p-3">
        {!isTutorEnter ? (
          <div>
            <form onSubmit={handleTimeSubmit} className="flex flex-col gap-4">
              <label>Choose your meeting time</label>
              <input
                type="time"
                className="rounded-md focus:outline-none border-2 p-2"
                ref={timeRef}
              />
              <button type="submit">Submit</button>
            </form>
            {isTimeEnter && (
              <div className="flex flex-col gap-4">
                <p>Choose a tutor</p>
                <div className="flex gap-4">
                  {tutors.map((tutor) => (
                    <div>
                      <img
                        src={tutor.profile_picture}
                        alt="Profile Img"
                        className="m-2 rounded-md"
                      />
                      <button
                        onClick={() => handleTutorSubmit(tutor.id)}
                        className="rounded-md border-2 p-2"
                      >
                        {tutor.username}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>You have successfully booked an appointment.</p>
        )}
      </div>
    </Layout>
  );
};
