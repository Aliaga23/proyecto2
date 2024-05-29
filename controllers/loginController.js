const { getUserById } = require('../models/userModel');
const bcrypt = require('bcrypt');
const { addRegistro } = require('../models/bitacoraModel');
const io = require('../index');

const loginUser = async (req, res) => {
  const { id, pass } = req.body;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const isMatch = await bcrypt.compare(pass, user.CONTRA);
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }
    if (user && isMatch) {
      res.json({ message: 'Login exitoso', user: { id: user.ID, apellidos: user.APELLIDOS, nombres: user.NOMBRES }, role: user.IDROL });
      
      // Obtener IP del cliente desde el request
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

      // Obtener fecha y hora en la zona horaria deseada
      const now = new Date();
      const offset = -4; // UTC-4 for Bolivia
      const localDate = new Date(now.getTime() + offset * 60 * 60 * 1000);
      
      const fecha = localDate.toISOString().split('T')[0];
      const hora = localDate.toISOString().split('T')[1].split('.')[0];

      // Registrar la acción en la bitácora
      const registro = {
        IDACCION: 1, // ID de INICIAR SESION
        IDUSUARIO: user.ID,
        IP: ipAddress,
        FECHA: fecha,
        HORAACCION: hora,
        ELEMENTOMODIFICADO: 'LOGIN'
      };
      const registroId = await addRegistro(registro);

      // Emitir evento de nueva acción
      io.emit('nuevaAccion', { ...registro, NRO: registroId });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

module.exports = { loginUser };
