import {Question} from "../../../types/questions"

export const sampleQuestions: Question[] = [
  {
    question_id: "math-alg-001",
    section: "Math",
    topic: "Algebra",
    subtopic: ["Linear Equations", "One Variable"],
    difficulty: "Easy",
    time_estimate: 60,
    question_type: "multiple_choice",
    text: "If 3x + 7 = 22, what is the value of x?",
    equation: "3x + 7 = 22",
    diagram: "",
    multiple_choices: {
      "A": "3",
      "B": "5",
      "C": "7",
      "D": "9"
    },
    answer_key: "B"
  },
  {
    question_id: "math-geo-014",
    section: "Math",
    topic: "Geometry",
    subtopic: ["Triangles", "Area"],
    difficulty: "Medium",
    time_estimate: 90,
    question_type: "multiple_choice",
    text: "A triangle has a base of 12 and a height of 8. What is its area?",
    equation: "A = (1/2)(b)(h)",
    diagram: "triangle-base-12-height-8.svg",
    multiple_choices: {
      "A": "20",
      "B": "48",
      "C": "96",
      "D": "24"
    },
    answer_key: "B"
  },
  {
    question_id: "math-func-022",
    section: "Math",
    topic: "Functions",
    subtopic: ["Quadratic Functions", "Vertex Form"],
    difficulty: "Hard",
    time_estimate: 120,
    question_type: "grid_in",
    text: "If f(x) = 2x^2 - 8x + 3, what is the x-coordinate of the vertex of the parabola?",
    equation: "f(x) = 2x^2 - 8x + 3",
    diagram: "",
    multiple_choices: null,
    answer_key: "2"
  },
  {
    question_id: "math-stat-007",
    section: "Math",
    topic: "Statistics",
    subtopic: ["Data Analysis", "Mean and Median"],
    difficulty: "Easy",
    time_estimate: 75,
    question_type: "multiple_choice",
    text: "A set of 5 test scores has a mean of 80. If four of the scores are 75, 82, 88, and 78, what is the fifth score?",
    equation: "(75 + 82 + 88 + 78 + x) / 5 = 80",
    diagram: "",
    multiple_choices: {
      "A": "75",
      "B": "77",
      "C": "80",
      "D": "82"
    },
    answer_key: "B"
  },
  {
    question_id: "math-alg-045",
    section: "Math",
    topic: "Algebra",
    subtopic: ["Systems of Equations", "Two Variables"],
    difficulty: "Medium",
    time_estimate: 100,
    question_type: "grid_in",
    text: "If 2x + y = 11 and x - y = 1, what is the value of x?",
    equation: "2x + y = 11, x - y = 1",
    diagram: "",
    multiple_choices: null,
    answer_key: "4"
  },
  {
    question_id: "math-geo-031",
    section: "Math",
    topic: "Geometry",
    subtopic: ["Circles", "Circumference"],
    difficulty: "Medium",
    time_estimate: 90,
    question_type: "multiple_choice",
    text: "A circle has a radius of 6. What is its circumference, in terms of π?",
    equation: "C = 2πr",
    diagram: "circle-radius-6.svg",
    multiple_choices: {
      "A": "6π",
      "B": "12π",
      "C": "36π",
      "D": "18π"
    },
    answer_key: "B"
  },
  {
    question_id: "math-alg-058",
    section: "Math",
    topic: "Algebra",
    subtopic: ["Inequalities", "One Variable"],
    difficulty: "Easy",
    time_estimate: 60,
    question_type: "multiple_choice",
    text: "Which of the following represents the solution to 4x - 3 > 9?",
    equation: "4x - 3 > 9",
    diagram: "",
    multiple_choices: {
      "A": "x > 1.5",
      "B": "x > 3",
      "C": "x < 3",
      "D": "x > 6"
    },
    answer_key: "B"
  },
  {
    question_id: "math-func-063",
    section: "Math",
    topic: "Functions",
    subtopic: ["Exponential Functions", "Growth"],
    difficulty: "Hard",
    time_estimate: 110,
    question_type: "multiple_choice",
    text: "A population of bacteria doubles every 3 hours. If the population starts at 200, which function models the population P after t hours?",
    equation: "P(t) = 200 · 2^(t/3)",
    diagram: "",
    multiple_choices: {
      "A": "P(t) = 200 · 2^(t/3)",
      "B": "P(t) = 200 · 3^(t/2)",
      "C": "P(t) = 200 + 2t",
      "D": "P(t) = 200 · t^2"
    },
    answer_key: "A"
  }
]