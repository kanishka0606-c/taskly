import 'dotenv/config';
import app from './app.js';
import connectDB from './config/db.js';

const PORT = process.env.PORT || 5001;

try {
  await connectDB();
  app.listen(PORT, () => console.log(`API running on port ${PORT}`));
} catch (err) {
  console.error('Could not start the server:', err.message);
  process.exit(1);
}