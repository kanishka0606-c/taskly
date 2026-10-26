import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import bookRoutes from "./routes/bookRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, app: 'Taskly' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/members', memberRoutes);
// Unknown address
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Any unexpected error ends up here (Express 5 catches async errors for us)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: 'Already exists' });
  res.status(500).json({ message: 'Something went wrong' });
});

export default app;