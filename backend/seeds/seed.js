const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Post = require('../models/Post');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@blog.com',
      password: 'admin123',
      role: 'admin',
      bio: 'System administrator',
    });

    // Create author user
    const author = await User.create({
      name: 'John Author',
      email: 'author@blog.com',
      password: 'author123',
      role: 'author',
      bio: 'Passionate blogger and tech enthusiast',
    });

    // Create sample posts
    const posts = [
      {
        title: 'Getting Started with React',
        content: '<h2>Introduction to React</h2><p>React is a powerful JavaScript library for building user interfaces. In this post, we will explore the fundamentals of React and learn how to build modern web applications.</p><h3>Why React?</h3><p>React offers several advantages over traditional web development approaches:</p><ul><li>Component-based architecture</li><li>Virtual DOM for optimal performance</li><li>Rich ecosystem and community support</li><li>Unidirectional data flow</li></ul><p>Let\'s dive into the basics and start building amazing applications with React!</p>',
        excerpt: 'Learn the fundamentals of React and start building modern web applications with components, state, and props.',
        author: author._id,
        status: 'published',
        tags: ['react', 'javascript', 'frontend'],
      },
      {
        title: 'Node.js Best Practices',
        content: '<h2>Building Robust Node.js Applications</h2><p>Node.js has become one of the most popular platforms for building server-side applications. Here are some best practices to follow when developing with Node.js.</p><h3>Error Handling</h3><p>Always handle errors properly in your Node.js applications. Use try-catch blocks for synchronous code and proper error handling middleware for Express applications.</p><h3>Security</h3><p>Security should be a top priority. Use helmet middleware, validate inputs, and keep dependencies updated.</p>',
        excerpt: 'Discover essential best practices for building secure, scalable, and maintainable Node.js applications.',
        author: admin._id,
        status: 'published',
        tags: ['nodejs', 'backend', 'javascript'],
      },
      {
        title: 'MongoDB Schema Design Patterns',
        content: '<h2>Mastering MongoDB Schema Design</h2><p>MongoDB is a flexible NoSQL database that allows for dynamic schema design. However, proper schema design is crucial for application performance.</p><h3>Embedding vs Referencing</h3><p>One of the key decisions in MongoDB schema design is whether to embed related data or use references. Consider document size, access patterns, and update frequency when making this decision.</p>',
        excerpt: 'Learn the best patterns for designing MongoDB schemas that optimize for performance and scalability.',
        author: author._id,
        status: 'published',
        tags: ['mongodb', 'database', 'backend'],
      },
      {
        title: 'Draft: Understanding TypeScript',
        content: '<h2>TypeScript in 2024</h2><p>TypeScript continues to grow in popularity, offering type safety and enhanced developer experience. This draft explores advanced TypeScript features.</p>',
        excerpt: 'An exploration of advanced TypeScript features and how they improve code quality.',
        author: author._id,
        status: 'draft',
        tags: ['typescript', 'javascript'],
      },
    ];

    await Post.create(posts);

    console.log('✅ Seed data created successfully!');
    console.log('');
    console.log('📧 Admin Login:');
    console.log('   Email: admin@blog.com');
    console.log('   Password: admin123');
    console.log('');
    console.log('📧 Author Login:');
    console.log('   Email: author@blog.com');
    console.log('   Password: author123');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
