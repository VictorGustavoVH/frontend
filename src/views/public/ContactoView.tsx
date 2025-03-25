import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../config/axios';   // Tu cliente Axios con baseURL
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const ContactoView: React.FC = () => {
  const [contactInfo, setContactInfo] = useState('');

  useEffect(() => {
    // Se asume que en tu backend /pagina/contenido retorna { contacto: "..." }
    api.get('/pagina/contenido')
      .then((res) => {
        // En caso de no existir, ponemos un string vacío.
        setContactInfo(res.data.contacto || '');
      })
      .catch((err) => {
        console.error('Error al obtener la información de contacto:', err);
      });
  }, []);

  return (
    <>
      <Header />
      <motion.div
        className="container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.section
          className="section"
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="title">
            <FaEnvelope className="iconTitle" /> Contáctanos
          </h2>
          {/* Si contactInfo es HTML, puedes usar dangerouslySetInnerHTML */}
          <p className="text" dangerouslySetInnerHTML={{ __html: contactInfo }} />
        </motion.section>

        <motion.section
          className="section"
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <h3 className="subtitle">
            <FaPhoneAlt className="iconTitle" /> También puedes llamarnos
          </h3>
          <p className="text">
            {/* Ejemplo: si quieres poner un texto adicional o fijo */}
            Llámanos a los números que aparecen en la información de contacto anterior.
            ¡Estaremos encantados de ayudarte!
          </p>
        </motion.section>
      </motion.div>

      <Footer />

      <style>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        .section {
          background-color: #fff;
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
          display: flex;
          align-items: center;
        }
        .subtitle {
          font-size: 20px;
          font-weight: 600;
          color: #0077cc;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
        }
        .iconTitle {
          margin-right: 10px;
        }
        .text {
          font-size: 17px;
          color: #333;
          line-height: 1.5;
          text-align: justify;
        }
        @media (min-width: 768px) {
          .container {
            padding: 40px;
          }
        }
      `}</style>
    </>
  );
};

export default ContactoView;
