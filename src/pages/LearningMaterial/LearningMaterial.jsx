import React from "react";
import "./LearningMaterial.scss";
import BackButton from "../../components/BackButton/BackButton";

const courseData = [
  {
    id: 1,
    title: "Full-Stack Web Development",
    description: "Learn MERN stack from scratch.",
    price: 4999,
    image:
      "https://plus.unsplash.com/premium_photo-1661427053933-d3da1618d8c4?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y29tcHV0ZXIlMjBzdHVkeXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    id: 2,
    title: "Data Structures & Algorithms",
    description: "Master coding interviews.",
    price: 3499,
    image:
      "https://img.freepik.com/premium-vector/boy-has-his-computer-study-from-home_253881-1.jpg",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Design sleek and user-friendly interfaces.",
    price: 2999,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8nAmSrsoJ-4MtYDNxx53p-rWOkSgXDTPNTA&s",
  },
];

const LearningMaterial = () => {
  return (
    <div className="learning-material">
      <BackButton />
      <h2>Buy Courses</h2>
      <div className="course-grid">
        {courseData.map((course) => (
          <div className="course-card" key={course.id}>
            <img src={course.image} alt={course.title} />
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <div className="course-footer">
              <span className="price">₹{course.price}</span>
              <button>Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningMaterial;
