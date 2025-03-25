//user profile
import React, { useState, ChangeEvent, FormEvent } from 'react';
import './style.css';

interface FormData {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  password: string;
}

const UserProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log('Datos guardados:', formData);
    alert('Cambios guardados con éxito');
  };

  return (
    <div className="form-container"> {/* Cambiado a form-container */}
      <div className="form-header"> {/* Añadido form-header */}
        Editar Perfil
      </div>
      <div className="form-content"> {/* Añadido form-content */}
        <form onSubmit={handleSubmit} className="userForm">
          <label>
            Nombre completo:
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} />
          </label>
          <label>
            Nombre de usuario:
            <input type="text" name="username" value={formData.username} onChange={handleChange} />
          </label>
          <label>
            Correo electrónico:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>
          <label>
            Teléfono:
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          </label>
          <label>
            Contraseña:
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>
          <button type="submit" className="saveButton">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
};

export default UserProfileForm;
