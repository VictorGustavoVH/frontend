import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importar Router y Routes
import Home from './views/public/Home';
import './index.css';
import './App.css';
import Register from './views/public/Register';
import Login from './views/public/Login';
import PreguntasFrecuente from './views/public/PreguntasFrecuente';
import BodyContent from './views/public/BodyContent';
import Catalogo from './views/public/Catalogo';

function App() {
  return (
    <Router>  {/* Envolver la aplicación en BrowserRouter */}
      <Routes>  {/* Definir las rutas */}
        <Route path="/" element={<Home />} />  {/* Definir la ruta de inicio */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/preguntasFrecuentes" element={<PreguntasFrecuente />} />
        <Route path="/quienes-somos" element={<BodyContent />} />
        <Route path="/contactanos" element={<BodyContent />} />
        <Route path="/Catalogo" element={<Catalogo />} />

        {/* Aquí puedes agregar más rutas según las necesites */}
        {/* Ejemplo de ruta adicional */}
        {/* <Route path="/contacto" element={<Contacto />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
