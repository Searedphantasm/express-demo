const Joi = require("joi");
const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];
// defining route

router.get("/", (req, res) => {
  res.send(courses);
});

router.post("/", (req, res) => {
  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
  //     look up the course
  // if not existing , return 404
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id),
  );
  if (!course) return res.status(404).send("Course Not Found");
  //     Validate
  //     if invalid , return 400 - bad request

  const { error } = validateCourse(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //     Update course
  //     Return the updated course
  course.name = req.body.name;
  res.send(course);
});

router.get("/:id", (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id),
  );
  if (!course) return res.status(404).send("No course found.");
  res.send(course);
});

router.delete("/:id", (req, res) => {
  const course = courses.find(
    (course) => course.id === parseInt(req.params.id),
  );
  if (!course) return res.status(404).send("No course found.");

  //     Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //     Return nothing
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

module.exports = router;
