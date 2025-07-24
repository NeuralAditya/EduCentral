import { db } from "./db";
import { topics, quizzes, quizQuestions, badges } from "@shared/schema";

export async function seedQuizData() {
  try {
    console.log("Seeding quiz data...");

    // Insert topics
    const topicData = [
      {
        name: "DSA",
        description: "Data Structures and Algorithms fundamentals",
        icon: "database",
        color: "blue"
      },
      {
        name: "Java", 
        description: "Java programming language concepts",
        icon: "code2",
        color: "orange"
      },
      {
        name: "Python",
        description: "Python programming language essentials", 
        icon: "brain",
        color: "green"
      }
    ];

    const insertedTopics = await db.insert(topics).values(topicData).returning();
    console.log(`Inserted ${insertedTopics.length} topics`);

    // Insert quizzes for each topic
    const dsaTopic = insertedTopics.find(t => t.name === "DSA");
    const javaTopic = insertedTopics.find(t => t.name === "Java");
    const pythonTopic = insertedTopics.find(t => t.name === "Python");

    const quizData = [
      // DSA Quizzes
      {
        topicId: dsaTopic!.id,
        title: "Arrays and Strings Basics",
        description: "Understanding arrays, strings, and basic operations",
        level: "beginner",
        totalQuestions: 5,
        timeLimit: 10,
        passingScore: 70,
        pointsPerQuestion: 20,
        isPublished: true
      },
      {
        topicId: dsaTopic!.id,
        title: "Linked Lists and Stacks",
        description: "Working with linked lists and stack data structures",
        level: "intermediate", 
        totalQuestions: 8,
        timeLimit: 15,
        passingScore: 75,
        pointsPerQuestion: 25,
        isPublished: true
      },
      {
        topicId: dsaTopic!.id,
        title: "Trees and Graphs",
        description: "Advanced tree and graph algorithms",
        level: "advanced",
        totalQuestions: 10,
        timeLimit: 20,
        passingScore: 80,
        pointsPerQuestion: 30,
        isPublished: true
      },
      
      // Java Quizzes
      {
        topicId: javaTopic!.id,
        title: "Java Basics",
        description: "Variables, data types, and basic syntax",
        level: "beginner",
        totalQuestions: 6,
        timeLimit: 12,
        passingScore: 70,
        pointsPerQuestion: 15,
        isPublished: true
      },
      {
        topicId: javaTopic!.id,
        title: "Object-Oriented Programming",
        description: "Classes, objects, inheritance, and polymorphism",
        level: "intermediate",
        totalQuestions: 8,
        timeLimit: 18,
        passingScore: 75,
        pointsPerQuestion: 25,
        isPublished: true
      },
      {
        topicId: javaTopic!.id,
        title: "Java Advanced Features",
        description: "Streams, lambda expressions, and concurrency",
        level: "advanced",
        totalQuestions: 10,
        timeLimit: 25,
        passingScore: 80,
        pointsPerQuestion: 35,
        isPublished: true
      },

      // Python Quizzes
      {
        topicId: pythonTopic!.id,
        title: "Python Fundamentals",
        description: "Variables, functions, and basic Python syntax",
        level: "beginner",
        totalQuestions: 5,
        timeLimit: 10,
        passingScore: 70,
        pointsPerQuestion: 18,
        isPublished: true
      },
      {
        topicId: pythonTopic!.id,
        title: "Data Structures in Python",
        description: "Lists, dictionaries, sets, and tuples",
        level: "intermediate",
        totalQuestions: 7,
        timeLimit: 15,
        passingScore: 75,
        pointsPerQuestion: 22,
        isPublished: true
      },
      {
        topicId: pythonTopic!.id,
        title: "Advanced Python",
        description: "Decorators, generators, and advanced concepts",
        level: "advanced",
        totalQuestions: 10,
        timeLimit: 20,
        passingScore: 80,
        pointsPerQuestion: 28,
        isPublished: true
      }
    ];

    const insertedQuizzes = await db.insert(quizzes).values(quizData).returning();
    console.log(`Inserted ${insertedQuizzes.length} quizzes`);

    // Insert sample questions for DSA Array quiz
    const arrayQuiz = insertedQuizzes.find(q => q.title === "Arrays and Strings Basics");
    if (arrayQuiz) {
      const questionData = [
        {
          quizId: arrayQuiz.id,
          question: "What is the time complexity of accessing an element in an array by index?",
          options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
          correctAnswer: "O(1)",
          explanation: "Array elements can be accessed directly using their index in constant time.",
          orderIndex: 1
        },
        {
          quizId: arrayQuiz.id,
          question: "Which of the following operations has O(n) time complexity in an array?",
          options: ["Access by index", "Insert at beginning", "Update by index", "Get array length"],
          correctAnswer: "Insert at beginning",
          explanation: "Inserting at the beginning requires shifting all existing elements, which takes O(n) time.",
          orderIndex: 2
        },
        {
          quizId: arrayQuiz.id,
          question: "What is the maximum number of elements that can be stored in an array of size 10?",
          options: ["9", "10", "11", "Unlimited"],
          correctAnswer: "10",
          explanation: "An array of size 10 can store exactly 10 elements, indexed from 0 to 9.",
          orderIndex: 3
        },
        {
          quizId: arrayQuiz.id,
          question: "Which method would you use to find the length of a string in most programming languages?",
          options: ["size()", "length()", "count()", "len()"],
          correctAnswer: "length()",
          explanation: "Most programming languages use length() method to get string length, though some use len().",
          orderIndex: 4
        },
        {
          quizId: arrayQuiz.id,
          question: "What happens when you try to access an array element beyond its bounds?",
          options: ["Returns null", "Returns 0", "Throws an exception", "Creates new element"],
          correctAnswer: "Throws an exception",
          explanation: "Accessing array elements beyond bounds typically throws an IndexOutOfBoundsException or similar error.",
          orderIndex: 5
        }
      ];

      await db.insert(quizQuestions).values(questionData);
      console.log(`Inserted ${questionData.length} questions for Arrays quiz`);
    }

    // Insert badges
    const badgeData = [
      {
        name: "First Steps",
        description: "Complete your first quiz",
        icon: "trophy",
        color: "yellow",
        requirement: { type: "quiz_count", value: 1 },
        points: 50
      },
      {
        name: "Quick Learner",
        description: "Score 90% or higher on 3 quizzes",
        icon: "star",
        color: "purple",
        requirement: { type: "high_score_count", value: 3, threshold: 90 },
        points: 150
      },
      {
        name: "Consistent",
        description: "Complete quizzes 5 days in a row",
        icon: "target",
        color: "green",
        requirement: { type: "streak", value: 5 },
        points: 200
      },
      {
        name: "DSA Master", 
        description: "Complete all DSA quizzes with 80%+ average",
        icon: "award",
        color: "blue",
        requirement: { type: "topic_mastery", topic: "DSA", threshold: 80 },
        points: 300
      }
    ];

    await db.insert(badges).values(badgeData);
    console.log(`Inserted ${badgeData.length} badges`);

    console.log("Quiz data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding quiz data:", error);
    throw error;
  }
}