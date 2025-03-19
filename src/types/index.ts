// types.ts

// Este tipo representa al usuario tal como lo maneja el backend.
// Se omite el campo "password" al exponer la información del usuario al cliente.
export type User = {
  _id: string;           // Identificador asignado por MongoDB
  username: string;      // Nombre de usuario único (todo en minúsculas)
  nombre: string;        // Nombre completo
  email: string;         // Correo electrónico
  telefono: string;      // Teléfono (cadena de 10 dígitos)
  direccion: string;     // Dirección
  rol: 'usuario' | 'admin'; // Rol del usuario
  createdAt: string;     // Fecha de creación (como string ISO)
  updatedAt: string;     // Fecha de última actualización (como string ISO)
};

// Tipo para el formulario de registro.
// Incluye todos los campos requeridos para crear un usuario, junto con
// "password_confirmation" para validación en el frontend.
export type RegisterForm = {
  username: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  password: string;
  password_confirmation: string;
  preguntaSecreta: string;
  respuestaSecreta: string;
};

// Tipo para el formulario de inicio de sesión.
export type LoginForm = {
  email: string;
  password: string;
};

// Tipo para el formulario de actualización del perfil.
// Aquí se permiten actualizar los campos básicos del usuario.
// Puedes ampliar o reducir los campos según tus requerimientos.
export type ProfileForm = {
  username: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  // Si deseas permitir la actualización de las preguntas de seguridad:
  preguntaSecreta?: string;
  respuestaSecreta?: string;
};
