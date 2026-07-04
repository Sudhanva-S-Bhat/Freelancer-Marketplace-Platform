require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const freelancerRoutes = require('./routes/freelancerRoutes');

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/freelancer', freelancerRoutes);

app.get('/api/health', (req, res) => res.json({ success: true, message: 'API is running' }));

// Central error handler (e.g. multer file-size errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Something went wrong' });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
