import app from './app.js';
import connectDB from './lib/mongo.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8001;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();