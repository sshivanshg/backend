const express = require('express');
const dotenv = require('dotenv');
const prisma = require('./models/prismaClient');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const cors = require('cors');

dotenv.config();

const app = express();


app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS','DELETE','PUT'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Specify allowed headers if needed
}));

app.options('*', cors());


app.get("/start",(req, res)=>{
  return res.status(200).send({message:"Server is running"})
})


app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/task', taskRoutes);




const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
