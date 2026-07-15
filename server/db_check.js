const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const run = async () => {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    const Project = require('./src/models/Project');
    const Review = require('./src/models/Review');

    const projects = await Project.find().sort({ createdAt: -1 }).limit(5);
    console.log("\n--- LATEST 5 PROJECTS ---");
    for (const p of projects) {
      console.log(`ID: ${p._id}`);
      console.log(`Name: ${p.name}`);
      console.log(`Upload Type: ${p.uploadType}`);
      console.log(`Path: ${p.projectPath}`);
      console.log(`Status: ${p.status}`);
      console.log(`Exists on local disk? ${fs.existsSync(p.projectPath)}`);
      
      const reviews = await Review.find({ projectId: p._id });
      console.log(`Reviews count: ${reviews.length}`);
      console.log("------------------------");
    }

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected.");
  }
};

run();
