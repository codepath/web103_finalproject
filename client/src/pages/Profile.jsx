import { useState, useEffect, useRef } from "react";
import placeholder from "./assets/blank-profile-image.png";
import { Layout } from "../components";
import { getSchools, getSubjects, updateUser } from "../api";
import { useUser } from "../hooks";

export const Profile = () => {
  const { user, isLoading } = useUser();

  const initialProfile = useRef(null);
  const [profile, setProfile] = useState(null);
  const [schools, setSchools] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (user) {
      const userProfile = {
        id: user.id,
        role: user.role,
        username: user.username,
        profilePicture: user.profile_picture,
        bio: user.bio,
        email: user.email,
        schoolId: user.school_id,
        subjectId: user.subject_id,
        year: user.year,
      };
      initialProfile.current = userProfile;
      setProfile(userProfile);
    }
  }, [user]);

  useEffect(() => {
    const fetchSchools = async () => {
      const schools = await getSchools();
      setSchools(schools);
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchSubjects = async () => {
      const subjects = await getSubjects();
      setSubjects(subjects);
    };
    fetchSubjects();
  }, []);

  // Determine if profile has changed from initial state
  const hasProfileChanged =
    JSON.stringify(profile) !== JSON.stringify(initialProfile.current);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue;
    if (value === "null") {
      newValue = null;
    } else if (value === "") {
      newValue = null;
    } else if (!isNaN(value)) {
      newValue = parseInt(value);
    } else {
      newValue = value;
    }
    setProfile({ ...profile, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateUser(profile.id, {
      role: profile.role,
      bio: profile.bio,
      school_id: profile.schoolId,
      subject_id: profile.subjectId,
      year: profile.year,
    });
    window.location.reload();
  };

  // TODO: replace with loading spinner
  if (isLoading || !profile) {
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
      <div className="m-14 flex-grow border-2 rounded-lg p-2 flex text-2xl">
        <div className="flex flex-col">
          <p className="text-center m-5">Student ID: #{profile.id}</p>{" "}
          <div className="avatar">
            <div className="w-48 rounded-xl">
              <img
                src={profile.profilePicture || placeholder}
                alt="profile picture"
              />
            </div>
          </div>
          <textarea
            className="textarea textarea-bordered flex-grow mt-5"
            placeholder="Bio"
            value={profile.bio}
            form="change-profile"
            name="bio"
            onChange={handleChange}
          />
        </div>
        <div className="w-full ml-10 p-3 mt-16">
          <div className="border-b-4">
            <form name="change-profile" onSubmit={handleSubmit}>
              <div className="grid grid-cols-6 gap-4 gap-y-10 p-4 pb-16 ">
                <label htmlFor="username" className="col-span-1">
                  Username
                </label>
                <input
                  name="username"
                  type="text"
                  className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
                  disabled
                  value={profile.username}
                  onChange={handleChange}
                />
                <label htmlFor="email" className="col-span-1">
                  Email
                </label>
                <input
                  name="email"
                  type="text"
                  className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
                  disabled
                  value={profile.email}
                  onChange={handleChange}
                />
                <label htmlFor="schoolId" className="col-span-1">
                  School
                </label>
                <select
                  name="schoolId"
                  className="select select-bordered max-w-xs flex-1 focus:outline-none border-2 rounded-md col-span-2"
                  value={profile.schoolId}
                  onChange={handleChange}
                >
                  <option value="null">Pick your school</option>
                  {schools.map((school) => (
                    <option key={school.id} value={parseInt(school.id)}>
                      {school.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="subjectId" className="col-span-1">
                  Subject
                </label>
                <select
                  name="subjectId"
                  className="select select-bordered max-w-xs flex-1 focus:outline-none border-2 rounded-md col-span-2"
                  value={profile.subjectId}
                  onChange={handleChange}
                >
                  <option value="null">Pick your subject</option>
                  {subjects.map((subject) => (
                    <option key={subject.id} value={parseInt(subject.id)}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                <label htmlFor="role" className="col-span-1">
                  Role
                </label>
                <select
                  name="role"
                  className="select select-bordered max-w-xs flex-1 focus:outline-none border-2 rounded-md col-span-2"
                  value={profile.role}
                  onChange={handleChange}
                >
                  <option value="null">Pick your role</option>
                  <option value="student">Student</option>
                  <option value="tutor">Tutor</option>
                </select>
                <label htmlFor="year" className="col-span-1">
                  Year
                </label>
                <input
                  name="year"
                  type="number"
                  step={1}
                  className="flex-1 focus:outline-none border-2 rounded-md col-span-2"
                  value={profile.year}
                  onChange={handleChange}
                  placeholder="Your graduation year"
                />
              </div>
              <div className="flex justify-end mb-7 p-4">
                <button
                  className="p-2 rounded-md border-2"
                  disabled={!hasProfileChanged}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};
