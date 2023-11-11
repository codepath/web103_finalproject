import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../UserContext";

import "./Home.css";

export default function Home() {
  const { userContext, setUserContext } = useContext(UserContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    setUserContext(null);
  };
  const navigateToPosts = () => {
    navigate("/posts");
  };
  const navigateToCreatePosts = () => {
    navigate("/posts/create");
  };
  return (
    <>
      <div>
        <p className="top">
          Welcome | <button onClick={handleLogout}>logout</button>
        </p>
      </div>

      <div className="row1-home">
        <br />
        <div className="col-home">
          <img
            className="image-home"
            src="https://res.cloudinary.com/highereducation/images/f_auto,q_auto/v1662748086/ComputerScience.org/Students-on-desktop-computers-typing/Students-on-desktop-computers-typing.jpg?_i=AA"
            alt=""
          />
        </div>
        <div className="col-home">
          <h2>Explore tech today</h2>
          <p>
            Tech Explorer Hub envisions being the premier online destination for
            computer science students, offering a dynamic platform designed to
            ignite curiosity and foster exploration within the vast realm of
            technology. Our vision is to provide students with an immersive
            experience, enabling them to navigate through diverse fields within
            computer science, from coding and software development to artificial
            intelligence and cybersecurity. Tech Explorer Hub aims to serve as a
            central hub where students can access comprehensive resources,
            engaging tutorials, and real-world projects, empowering them to not
            only grasp theoretical knowledge but also apply it practically. We
            aspire to cultivate a vibrant and collaborative community where
            students, educators, and industry professionals converge to share
            insights, collaborate on innovative projects, and stay abreast of
            the latest technological advancements. Ultimately, Tech Explorer Hub
            seeks to inspire the next generation of tech leaders, equipping them
            with the skills and knowledge needed to navigate the ever-evolving
            landscape of computer science.
          </p>
          <button>View opportunities</button>
        </div>
      </div>
      <div className="row2-home">
        <br />
        <div className="col-home">
          <img
            className="image-home"
            src="https://img.freepik.com/free-vector/social-interaction-concept-illustration_114360-4864.jpg"
            alt=""
          />
        </div>
        <div className="col-home">
          <h2>Increase your knowledge through our verified posts</h2>
          <p>
            Within this segment of the application, the vision is to elevate
            knowledge acquisition through a curated collection of verified
            posts. The aspiration is to establish a trusted repository of
            information that computer science students can rely on for accurate,
            up-to-date, and insightful content. Our vision is to create a
            seamless learning experience, where users can effortlessly explore a
            diverse range of topics within the tech industry, gaining deeper
            insights into emerging trends, best practices, and innovative
            solutions. By emphasizing the importance of verification, we aim to
            ensure the reliability of the content, fostering a community of
            learners who can confidently enhance their understanding of complex
            computer science concepts. Through this commitment to verified
            posts, we envision empowering students to navigate the vast
            landscape of technology with confidence, continuously expanding
            their knowledge base and staying well-informed in this rapidly
            evolving field.
          </p>
          <button onClick={navigateToCreatePosts}>Create Post</button>
          &nbsp;&nbsp;&nbsp;
          <button onClick={navigateToPosts}>View Post</button>
        </div>
      </div>
      <div className="row3-home">
        <br />
        <div className="col-home">
          <img
            className="image-home"
            src="https://www.forbes.com/advisor/wp-content/uploads/2022/02/Where_To_Advertise_Your_Jobs_-_article_image.jpg"
            alt=""
          />
        </div>
        <div className="col-home">
          <h2>Are you hiring?</h2>
          <p>
            The "Are You Hiring?" section of our application envisions becoming
            a pivotal bridge between aspiring computer science professionals and
            forward-thinking employers. Our vision is to create a seamless
            platform where tech companies and startups can effortlessly connect
            with talented individuals actively seeking opportunities within the
            computer science field. We aspire to be more than a job board; Tech
            Explorer Hub aims to be a dynamic talent hub where hiring managers
            can explore a diverse pool of skilled candidates with varying
            expertise levels. Through innovative features and personalized
            matchmaking algorithms, we strive to streamline the recruitment
            process, facilitating meaningful connections that go beyond
            traditional resumes. Tech Explorer Hub envisions playing a key role
            in shaping the future workforce by fostering collaborations that
            lead to fulfilling careers, ensuring a win-win scenario for both
            employers seeking top-tier talent and individuals eager to embark on
            impactful professional journeys.
          </p>
          <button>Post a job</button>
        </div>
      </div>
      <div className="row4-home">
        <h2>Already in the process?</h2>
        <br />
        <p>
          Have you already started a job process and have a few jobs bookmarked.
          Click here to continue the job process
        </p>
        <button>View bookmarked jobs</button>
      </div>
    </>
  );
}
