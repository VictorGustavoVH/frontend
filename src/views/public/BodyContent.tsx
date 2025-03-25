import React from "react";
import { motion } from "framer-motion"; // Importamos motion
import { FaLightbulb, FaCheckCircle, FaLeaf, FaUsers, FaBalanceScale } from "react-icons/fa";
import "./App.css";

const BodyContent: React.FC = () => {
  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}         // Inicia transparente
      animate={{ opacity: 1 }}         // Se desvanece hacia visible
      transition={{ duration: 1.5 }}   // Duración de la animación
    >
      {/* Sección "Quiénes Somos" */}
      <motion.section
        className="section"
        initial={{ x: -100 }}          // Empieza desde la izquierda
        animate={{ x: 0 }}             // Llega a su posición original
        transition={{ duration: 1 }}
      >
        <h2 className="title">¿Quiénes Somos?</h2>
        <p className="text">
          Somos una empresa dedicada a la innovación y venta de ventanas automatizadas,
          con un enfoque en la eficiencia energética y la comodidad para nuestros clientes.
        </p>
      </motion.section>

      {/* Sección Misión con efecto de subida */}
      <motion.section
        className="section"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h2 className="title">Nuestra Misión</h2>
        <p className="text">
          Brindar soluciones automatizadas y sostenibles a través de la tecnología,
          mejorando la calidad de vida de nuestros clientes y optimizando el consumo
          de energía en los hogares y empresas.
        </p>
      </motion.section>

      {/* Sección Visión */}
      <motion.section
        className="section"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <h2 className="title">Nuestra Visión</h2>
        <p className="text">
          Ser una empresa líder en el mercado de ventanas automatizadas, reconocida
          por su innovación, calidad de productos y compromiso con la sostenibilidad.
        </p>
      </motion.section>

      {/* Sección Valores con animación "fade in" y "stagger" */}
      <motion.section
        className="section"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              delayChildren: 0.8,
              staggerChildren: 0.2, // Los ítems aparecerán de a poco
            },
          },
        }}
      >
        <h2 className="title">Nuestros Valores</h2>
        <motion.ul className="text">
          <motion.li
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <FaLightbulb style={{ color: "#1572a1", marginRight: "10px" }} /> Innovación
          </motion.li>
          <motion.li
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <FaCheckCircle style={{ color: "#0f5a8b", marginRight: "10px" }} /> Compromiso con la calidad
          </motion.li>
          <motion.li
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <FaLeaf style={{ color: "#28a745", marginRight: "10px" }} /> Sostenibilidad
          </motion.li>
          <motion.li
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <FaUsers style={{ color: "#6f42c1", marginRight: "10px" }} /> Responsabilidad social
          </motion.li>
          <motion.li
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
          >
            <FaBalanceScale style={{ color: "#fd7e14", marginRight: "10px" }} /> Ética profesional
          </motion.li>
        </motion.ul>
      </motion.section>
    </motion.div>
  );
};

export default BodyContent;

// CSS dentro del mismo archivo
import "./App.css";

const styles = `
body {
  margin: 0;
  font-family: "Arial", sans-serif;
  background-color: #f0f8ff; /* Azul claro */
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.section {
  background-color: #ffffff; /* Blanco */
  margin-bottom: 30px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Sombra suave */
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #0057b8; /* Azul oscuro */
  margin-bottom: 12px;
}

.text {
  font-size: 17px;
  color: #222; /* Mejor contraste */
  text-align: justify;
  line-height: 1.5; /* Mejor espaciado */
}

.listItem {
  font-size: 17px;
  color: #0057b8;
  margin-top: 8px; /* Espaciado entre ítems */
}

ul {
  padding-left: 20px; /* Espaciado para la lista */
}

li {
  list-style: none; /* Elimina los bullets predeterminados */
}

@media (min-width: 768px) {
  .container {
    padding: 40px;
  }
}
`;

const styleElement = document.createElement("style");
styleElement.textContent = styles;
document.head.appendChild(styleElement);
