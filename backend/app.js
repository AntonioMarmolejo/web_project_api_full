const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middleware/auth');
const errorHandler = require('./middleware/error');
const { requestLogger, errorLogger } = require('./middleware/logger');
const { validateSignin, validateSignup } = require('./middleware/validation');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

const corsOptions = {
  origin: [
    'https://www.proyectodiecinueve.mooo.com',
    'https://proyectodiecinueve.mooo.com',
    'http://localhost:3001',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('El servidor va a caer');
  }, 0);
});

app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

app.use(errorLogger);
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('✅ Conexión exitosa a MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectarse a MongoDB:', err);
  });

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('🔴 Conexión a MongoDB cerrada');
    process.exit(0);
  });
});
