import { faker } from "@faker-js/faker";
import subjectsData from "./data/subjects.json" assert { type: "json" };
import schoolsData from "./data/schools.json" assert { type: "json" };
import fs from "fs";

let tutors = [];

const numberOfFakeTutors = process.env.NUM_FAKE_TUTORS;

for (let i = 0; i < numberOfFakeTutors; i++) {
  let user = {
    email: faker.internet.email(),
    githubId: Math.floor(Math.random() * 1000000),
    username: faker.internet.userName(),
    profilePicture: faker.internet.avatar(),
    accessToken: faker.internet.password(),
    role: "tutor",
    bio: faker.hacker.phrase(),
    schoolId: Math.floor(Math.random() * schoolsData.length) + 1,
    subjectId: Math.floor(Math.random() * subjectsData.length) + 1,
    year: faker.date.future({ years: 3 }).getFullYear(),
  };
  tutors.push(user);
}

fs.writeFile(
  "./src/utils/data/tutors.json",
  JSON.stringify(tutors, null, 2),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("🎉 tutors.json created successfully");
  }
);

let availabilities = [];

for (let i = 0; i < numberOfFakeTutors; i++) {
  const unique = new Set();
  while (unique.size < 3) {
    unique.add(Math.floor(Math.random() * 168) + 1);
  }
  unique.forEach((timeBlock) => {
    let availability = {
      tutorId: i + 1,
      timeBlock,
    };
    availabilities.push(availability);
  });
}

fs.writeFile(
  "./src/utils/data/availabilities.json",
  JSON.stringify(availabilities, null, 2),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("🎉 availabilities.json created successfully");
  }
);
