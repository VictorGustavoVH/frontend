import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../config/axios';  // Tu cliente Axios con baseURL
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaFileContract } from 'react-icons/fa';

const TerminosView: React.FC = () => {
  const [terminosContent, setTerminosContent] = useState('');

  useEffect(() => {
    // Se asume que /pagina/contenido retorna { terminos: "..." }
    api.get('/pagina/contenido')
      .then((res) => {
        // En caso de no existir, ponemos un string vacío
        setTerminosContent(res.data.terminos || '');
      })
      .catch((err) => {
        console.error('Error al obtener los Términos y Condiciones:', err);
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
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="title">
            <FaFileContract className="iconTitle" /> Términos y Condiciones
          </h2>
          {/* Si son HTML, usar dangerouslySetInnerHTML */}
          <p className="text" dangerouslySetInnerHTML={{ __html: terminosContent }} />
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
          display: flex;
          align-items: center;
        }
        .iconTitle {
          margin-right: 10px;
        }
        .text {
          font-size: 17px;
          color: #222;
          text-align: justify;
          line-height: 1.5;
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

export default TerminosView;
