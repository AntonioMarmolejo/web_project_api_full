const express = require("express");
const mongoose = require("mongoose");
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards'); // ✅ Asegúrate de que existe

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json()); // Middleware para procesar JSON

// Middleware para identificar al usuario actual
app.use((req, res, next) => {
  req.user = {
    _id: '67b6b1d20a197cc86afaf935' //ID de usuario de prueba
  };
  next(); //Se agregó next para continúe la ejecución
});

// Usamos prefijos en las rutas
app.use('/users', usersRouter);
app.use('/cards', cardsRouter); // ✅ Solo si está implementado

// Respuesta 404 para rutas no configuradas
app.use((req, res) => {
  res.status(404).json({ message: "Recurso solicitado no encontrado" });
});

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  // Manejo de errores en la conexión a MongoDB
  .then(() => {
    console.log("✅ Conexión exitosa a MongoDB");

    // Inicializa el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  // Error en la conexión a MongoDB
  .catch((err) => {
    console.error('❌ Error al conectarse a MongoDB:', err);
  });

// Cierre elegante de la aplicación
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('🔴 Conexión a MongoDB cerrada');
    process.exit(0);
  });
});
