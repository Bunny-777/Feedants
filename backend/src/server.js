require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const seedDatabase = require('./seed/seedData');
const competitionRoutes = require('./routes/competitionRoutes');
const Competition = require('./models/Competition');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date(), service: 'Feedants Backend' });
});

app.use('/api', competitionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// Bootstrap Server & DB
async function startServer() {
  try {
    await connectDB();

    // Auto-seed if empty
    const count = await Competition.countDocuments();
    if (count === 0) {
      console.log('Database empty. Automatically seeding competition data...');
      await seedDatabase();
    } else {
      console.log(`Found ${count} competition(s) in database.`);
    }

    const server = app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(` Feedants Backend running on port ${PORT}`);
      console.log(` Health check: http://localhost:${PORT}/api/health`);
      console.log(` Competition API: http://localhost:${PORT}/api/competitions/feedants-classical-dance`);
      console.log(`=============================================`);
    });

    return server;
  } catch (error) {
    console.error('Fatal: Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
