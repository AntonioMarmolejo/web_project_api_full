const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const auth = require('./middleware/auth');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(cors());
app.use(express.json());

// Rutas públicas (sin autenticación)
app.post('/signin', login);
app.post('/signup', createUser);

// Middleware de autenticación para todas las rutas siguientes
app.use(auth);

// Rutas protegidas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Recurso solicitado no encontrado' });
});

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
