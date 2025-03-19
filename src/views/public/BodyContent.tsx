///views/BodyComponents
import { useState } from "react";
import "./BodyContent.css"; // Importa el archivo CSS
import Footer from "../../components/Footer";
import Header from "../../components/Header";

// Importa las imágenes correctamente
import teamImage from "../../assets/team.png";
import contactImage from "../../assets/contacto.png";
import missionImage from "../../assets/target.png";
import visionImage from "../../assets/target.png";
import valuesImage from "../../assets/target.png";

const BodyContent = () => {
  const [images] = useState({
    team: teamImage,
    contact: contactImage,
    mission: missionImage,
    vision: visionImage,
    values: valuesImage,
  });

  return (
    <div>
      <Header />
      <div className="container">
        {/* Sección "Quiénes Somos" */}
        <div className="section">
          <h2 className="title">¿Quiénes Somos?</h2>
          <img src={images.team} alt="Quiénes Somos" className="image" style={{ width: "50px", height: "50px" }} />
          <p className="text">
            Somos una empresa dedicada a la innovación y venta de ventanas automatizadas,
            con un enfoque en la eficiencia energética y la comodidad para nuestros clientes.
            Nuestro compromiso es ofrecer productos de alta calidad y tecnología de vanguardia.
          </p>
        </div>

        {/* Sección Contacto */}
        <div className="section">
          <h2 className="title">Contacto</h2>
          <img src={images.contact} alt="Contacto" className="image" style={{ width: "50px", height: "50px" }} />
          <p className="text">
            Para más información o consultas, no dudes en ponerte en contacto con nosotros a través de los siguientes medios:
          </p>
          <ul className="list">
            <li className="listItem">Email: contacto@ventanasautomatizadas.com</li>
            <li className="listItem">Teléfono: (123) 456-7890</li>
            <li className="listItem">Dirección: Calle Ficticia 123, Ciudad, País</li>
          </ul>
        </div>

        {/* Sección Misión */}
        <div className="section">
          <h2 className="title">Nuestra Misión</h2>
          <img src={images.mission} alt="Misión" className="image" style={{ width: "50px", height: "50px" }} />
          <p className="text">
            Brindar soluciones automatizadas y sostenibles a través de la tecnología, mejorando la calidad de vida de nuestros clientes
            y optimizando el consumo de energía en los hogares y empresas.
          </p>
        </div>

        {/* Sección Visión */}
        <div className="section">
          <h2 className="title">Nuestra Visión</h2>
          <img src={images.vision} alt="Visión" className="image" style={{ width: "50px", height: "50px" }} />
          <p className="text">
            Ser una empresa líder en el mercado de ventanas automatizadas, reconocida por su innovación, calidad de productos y compromiso con la sostenibilidad.
          </p>
        </div>

        {/* Sección Valores */}
        <div className="section">
          <h2 className="title">Nuestros Valores</h2>
          <img src={images.values} alt="Valores" className="image" style={{ width: "50px", height: "50px" }} />
          <ul className="list">
            <li className="listItem">Innovación</li>
            <li className="listItem">Compromiso con la calidad</li>
            <li className="listItem">Sostenibilidad</li>
            <li className="listItem">Responsabilidad social</li>
            <li className="listItem">Ética profesional</li>
          </ul>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BodyContent;