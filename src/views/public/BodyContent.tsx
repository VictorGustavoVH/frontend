import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../config/axios';
import { FaLightbulb, FaCheckCircle, FaLeaf, FaUsers, FaBalanceScale } from "react-icons/fa";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BodyContent: React.FC = () => {
  const [content, setContent] = useState({
    quienesSomos: '',
    mision: '',
    vision: '',
    valores: '',
  });

  useEffect(() => {
    api.get('/pagina/contenido')
      .then(res => setContent(res.data))
      .catch(err => console.error('Error al obtener contenido:', err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="container mx-auto flex-grow px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.5 }}>
          {/** Quiénes Somos */}
          <motion.section className="section mb-8" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 1 }}>
            <h2 className="title">¿Quiénes Somos?</h2>
            <p className="text">{content.quienesSomos}</p>
          </motion.section>

          {/** Misión */}
          <motion.section className="section mb-8" initial={{ y: 100 }} animate={{ y: 0 }} transition={{ duration: 1, delay: .3 }}>
            <h2 className="title">Nuestra Misión</h2>
            <p className="text">{content.mision}</p>
          </motion.section>

          {/** Visión */}
          <motion.section className="section mb-8" initial={{ x: 100 }} animate={{ x: 0 }} transition={{ duration: 1, delay: .6 }}>
            <h2 className="title">Nuestra Visión</h2>
            <p className="text">{content.vision}</p>
          </motion.section>

          {/** Valores */}
          <motion.section className="section" initial="hidden" animate="visible" variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { delayChildren: .8, staggerChildren: .2 } }
            }}>
            <h2 className="title">Nuestros Valores</h2>
            <motion.ul className="text list-none space-y-2">
              {[
                { icon: FaLightbulb, label: 'Innovación' },
                { icon: FaCheckCircle, label: 'Compromiso con la calidad' },
                { icon: FaLeaf, label: 'Sostenibilidad' },
                { icon: FaUsers, label: 'Responsabilidad social' },
                { icon: FaBalanceScale, label: 'Ética profesional' },
              ].map(({ icon: Icon, label }, i) => (
                <motion.li key={i} className="flex items-center" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                  <Icon className="mr-2 text-blue-600" /> {label}
                </motion.li>
              ))}
            </motion.ul>
          </motion.section>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default BodyContent;
