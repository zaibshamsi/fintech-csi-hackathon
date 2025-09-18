const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/user', require('./routes/userRoutes'));



const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
