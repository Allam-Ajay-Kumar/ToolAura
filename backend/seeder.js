// backend/seeder.js
// Run this once to populate the database with sample data
// Command: node seeder.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User     = require('./models/User');
const Category = require('./models/Category');
const Tool     = require('./models/Tool');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected for seeding...');
};

function createSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const rawCategories = [
  { name: 'Chatbot & Assistant',   description: 'Conversational AI and general-purpose assistants' },
  { name: 'Code Assistant',        description: 'AI tools for developers and programmers' },
  { name: 'Image Generation',      description: 'Create and edit images using AI' },
  { name: 'Video Generation',      description: 'AI-powered video creation and editing' },
  { name: 'Audio & Speech',        description: 'Voice cloning, TTS, and music generation' },
  { name: 'Writing & Productivity',description: 'AI writing assistants and productivity tools' },
  { name: 'Research & Search',     description: 'AI-enhanced research and information retrieval' },
  { name: 'Design & Creative',     description: 'AI tools for designers and creative professionals' },
];

const categories = rawCategories.map(c => ({
  ...c,
  slug: createSlug(c.name)
}));

const seed = async () => {
  await connectDB();

  try {
    // Clear existing collections & indexes
    try {
      await mongoose.connection.collection('tools').drop();
    } catch (e) {}
    try {
      await mongoose.connection.collection('categories').drop();
    } catch (e) {}
    try {
      await mongoose.connection.collection('users').drop();
    } catch (e) {}

    console.log('✅ Cleared existing collections & indexes');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.name] = c._id; });

    // Create admin user (pass plain text; User model pre-save hook will hash it once)
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@aitools.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log(`✅ Admin created: admin@aitools.com / admin123`);

    // Create sample user (pass plain text; User model pre-save hook will hash it once)
    const sampleUser = await User.create({
      name: 'Nandini Sharma',
      email: 'user@aitools.com',
      password: 'user123',
      role: 'user',
    });
    console.log(`✅ Sample user created: user@aitools.com / user123`);

    // Create AI tools
    const rawTools = [
      {
        name: 'ChatGPT',
        description: 'ChatGPT is an AI chatbot developed by OpenAI that can understand and generate human-like text. It helps with writing, coding, answering questions, brainstorming ideas, and much more.',
        category: catMap['Chatbot & Assistant'],
        websiteUrl: 'https://chat.openai.com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png',
        status: 'approved', isFeatured: true, submittedBy: admin._id,
      },
      {
        name: 'Gemini',
        description: 'Google Gemini (formerly Bard) is a conversational generative AI chatbot developed by Google. It can generate text, code, translate languages, and answer questions using Google Search.',
        category: catMap['Chatbot & Assistant'],
        websiteUrl: 'https://gemini.google.com',
        logoUrl: 'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
        status: 'approved', isFeatured: true, submittedBy: admin._id,
      },
      {
        name: 'Claude',
        description: 'Claude is an AI assistant made by Anthropic, designed to be helpful, harmless, and honest. It excels at analysis, writing, summarization, coding, and nuanced conversations.',
        category: catMap['Chatbot & Assistant'],
        websiteUrl: 'https://claude.ai',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Claude_AI_logo.svg/1200px-Claude_AI_logo.svg.png',
        status: 'approved', isFeatured: true, submittedBy: admin._id,
      },
      {
        name: 'GitHub Copilot',
        description: 'GitHub Copilot is an AI-powered code completion tool developed by GitHub and OpenAI. It suggests whole lines or blocks of code as you type, based on the context of your project.',
        category: catMap['Code Assistant'],
        websiteUrl: 'https://github.com/features/copilot',
        logoUrl: 'https://github.githubassets.com/images/icons/emoji/copilot.png',
        status: 'approved', isFeatured: true, submittedBy: admin._id,
      },
      {
        name: 'Midjourney',
        description: 'Midjourney is an AI image generation service that creates highly detailed, artistic images from text prompts. It is known for producing stunning visual art, illustrations, and concept art.',
        category: catMap['Image Generation'],
        websiteUrl: 'https://www.midjourney.com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Midjourney_Emblem.png/320px-Midjourney_Emblem.png',
        status: 'approved', isFeatured: true, submittedBy: admin._id,
      },
      {
        name: 'Perplexity AI',
        description: 'Perplexity AI is an AI-powered search engine that provides accurate, trusted answers with real-time web citations. It combines the power of large language models with live web search.',
        category: catMap['Research & Search'],
        websiteUrl: 'https://www.perplexity.ai',
        logoUrl: '',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'ElevenLabs',
        description: 'ElevenLabs is an AI voice platform that offers ultra-realistic text-to-speech, voice cloning, and dubbing capabilities. Used by content creators, game developers, and publishers.',
        category: catMap['Audio & Speech'],
        websiteUrl: 'https://elevenlabs.io',
        logoUrl: '',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'Canva AI',
        description: 'Canva is a graphic design platform with powerful AI features including Magic Design, text-to-image generation, background remover, and AI-powered presentation creation.',
        category: catMap['Design & Creative'],
        websiteUrl: 'https://www.canva.com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Canva_Logo.svg/1200px-Canva_Logo.svg.png',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'Runway ML',
        description: 'Runway is an AI creative platform for video generation and editing. It offers text-to-video, image-to-video, video-to-video, and AI-powered editing tools for filmmakers and creators.',
        category: catMap['Video Generation'],
        websiteUrl: 'https://runwayml.com',
        logoUrl: '',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'Cursor',
        description: 'Cursor is an AI-first code editor built on VS Code. It allows you to write, edit, and discuss code using natural language, chat with your codebase, and get AI code suggestions.',
        category: catMap['Code Assistant'],
        websiteUrl: 'https://cursor.sh',
        logoUrl: '',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'DALL-E 3',
        description: 'DALL-E 3 is OpenAI\'s image generation model that creates highly accurate images from text descriptions. It understands nuance and detail better than any previous version.',
        category: catMap['Image Generation'],
        websiteUrl: 'https://openai.com/dall-e-3',
        logoUrl: '',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'Notion AI',
        description: 'Notion AI is an AI writing assistant built into Notion. It can help you write, brainstorm, summarize, translate, and improve documents without leaving your workspace.',
        category: catMap['Writing & Productivity'],
        websiteUrl: 'https://www.notion.so/product/ai',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'Suno AI',
        description: 'Suno is an AI music generation platform that creates original songs with lyrics, melody, and production quality from simple text prompts. No musical knowledge required.',
        category: catMap['Audio & Speech'],
        websiteUrl: 'https://suno.com',
        logoUrl: '',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'Grammarly',
        description: 'Grammarly is an AI writing assistant that checks grammar, spelling, style, tone, and clarity. It integrates with browsers, Microsoft Office, Google Docs, and more.',
        category: catMap['Writing & Productivity'],
        websiteUrl: 'https://www.grammarly.com',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Grammarly_logo.svg/1280px-Grammarly_logo.svg.png',
        status: 'approved', isFeatured: false, submittedBy: admin._id,
      },
      {
        name: 'Pika Labs',
        description: 'Pika is an AI video generation platform that turns text and images into short videos using advanced diffusion models.',
        category: catMap['Video Generation'],
        websiteUrl: 'https://pika.art',
        logoUrl: '',
        status: 'pending', submittedBy: sampleUser._id,
      },
    ];

    const tools = rawTools.map(t => ({
      ...t,
      slug: createSlug(t.name)
    }));

    const createdTools = await Tool.insertMany(tools);
    console.log(`✅ Created ${createdTools.length} tools`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('────────────────────────────────');
    console.log('Admin login  → admin@aitools.com  / admin123');
    console.log('User login   → user@aitools.com   / user123');
    console.log('────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();
