// BodyContent.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaLightbulb, FaCheckCircle, FaLeaf, FaUsers, FaBalanceScale } from 'react-icons/fa';

const BodyContent: React.FC = () => {
  const [content, setContent] = useState({
    quienesSomos: '',
    mision: '',
    vision: '',
    valores: '',
  });

  useEffect(() => {
    // Se hace la petición al endpoint público que retorna el documento de contenido
    axios.get('/pagina')
      .then(res => {
        setContent({
          quienesSomos: res.data.quienesSomos,
          mision: res.data.mision,
          vision: res.data.vision,
          valores: res.data.valores,
        });
      })
      .catch(err => {
        console.error('Error al obtener el contenido de la página:', err);
      });
  }, []);

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Sección "Quiénes Somos" */}
      <motion.section
        className="section"
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="title">¿Quiénes Somos?</h2>
        <p className="text">{content.quienesSomos}</p>
      </motion.section>

      {/* Sección Misión */}
      <motion.section
        className="section"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h2 className="title">Nuestra Misión</h2>
        <p className="text">{content.mision}</p>
      </motion.section>

      {/* Sección Visión */}
      <motion.section
        className="section"
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <h2 className="title">Nuestra Visión</h2>
        <p className="text">{content.vision}</p>
      </motion.section>

      {/* Sección Valores */}
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
              staggerChildren: 0.2,
            },
          },
        }}
      >
        <h2 className="title">Nuestros Valores</h2>
        <motion.ul className="text">
          <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <FaLightbulb className="icon" /> Innovación
          </motion.li>
          <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <FaCheckCircle className="icon" /> Compromiso con la calidad
          </motion.li>
          <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <FaLeaf className="icon" /> Sostenibilidad
          </motion.li>
          <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <FaUsers className="icon" /> Responsabilidad social
          </motion.li>
          <motion.li variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
            <FaBalanceScale className="icon" /> Ética profesional
          </motion.li>
        </motion.ul>
      </motion.section>

      <style>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        .section {
          background-color: #ffffff;
          margin-bottom: 30px;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .title {
          font-size: 24px;
          font-weight: bold;
          color: #0057b8;
          margin-bottom: 12px;
        }
        .text {
          font-size: 17px;
          color: #222;
          text-align: justify;
          line-height: 1.5;
        }
        ul {
          padding-left: 20px;
        }
        li {
          list-style: none;
        }
        .icon {
          margin-right: 10px;
        }
        @media (min-width: 768px) {
          .container {
            padding: 40px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default BodyContent;
