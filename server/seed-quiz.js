const { db } = require('./db');
const { topics, quizzes, quizQuestions, badges } = require('../shared/schema');

async function seedQuizData() {
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
    
    const quizData = [
      // DSA Quizzes
      {
        topicId: dsaTopic.id,
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
        topicId: javaTopic.id,
        title: "Java Basics",
        description: "Variables, data types, and basic syntax",
        level: "beginner",
        totalQuestions: 6,
        timeLimit: 12,
        passingScore: 70,
        pointsPerQuestion: 15,
        isPublished: true
      }
    ];

    const insertedQuizzes = await db.insert(quizzes).values(quizData).returning();
    console.log(`Inserted ${insertedQuizzes.length} quizzes`);

    console.log("Quiz data seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding quiz data:", error);
    throw error;
  }
}

seedQuizData().then(() => process.exit(0)).catch(() => process.exit(1));