// middlewares/cors.js
import cors from 'cors';

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:5173'], // ✅ Allow both
  credentials: true,
};

export default cors(corsOptions);
