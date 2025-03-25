// PreguntasFrecuentes.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface FAQSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string; // Se espera contenido HTML o texto
}

const PreguntasFrecuentes: React.FC = () => {
  const [sections, setSections] = useState<FAQSection[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    // Se asume que existe un endpoint público que retorna el documento de la página
    // En este ejemplo, se hace un GET a "/pagina/contenido"
    axios.get('/pagina/contenido')
      .then(res => {
        // El campo "preguntasFrecuentes" se espera sea un JSON-string
        const faqString = res.data.preguntasFrecuentes;
        try {
          const parsedFaq: FAQSection[] = JSON.parse(faqString);
          setSections(parsedFaq);
        } catch (error) {
          console.error('Error al parsear el contenido de FAQ:', error);
        }
      })
      .catch(err => {
        console.error('Error al obtener el contenido de la página:', err);
      });
  }, []);

  const handleSectionClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="header">
          <h1 className="title">Preguntas Frecuentes</h1>
          <p className="subtitle">Selecciona una categoría para ver documentación detallada</p>
        </div>
        <div className="sectionsContainer">
          {sections.map((section) => (
            <div key={section.id} className="sectionItem">
              <div
                className="sectionContent"
                onClick={() => handleSectionClick(section.id)}
              >
                <div className="iconContainer">
                  <span>{section.icon}</span>
                </div>
                <div className="textContainer">
                  <h3 className="sectionTitle">{section.title}</h3>
                  <p className="sectionDescription">{section.description}</p>
                </div>
              </div>
              <span
                className={`arrowIcon ${expandedSection === section.id ? 'expanded' : ''}`}
                onClick={() => handleSectionClick(section.id)}
              >
                ➡️
              </span>
              {expandedSection === section.id && (
                <div className="sectionContentExpand">
                  {/* Si el contenido es HTML, se puede renderizar con dangerouslySetInnerHTML */}
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />

      <style>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .title {
          font-size: 28px;
          color: #0057b8;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 18px;
          color: #555;
        }
        .sectionsContainer {
          margin-top: 20px;
        }
        .sectionItem {
          border: 1px solid #ccc;
          margin-bottom: 15px;
          border-radius: 8px;
          overflow: hidden;
        }
        .sectionContent {
          display: flex;
          align-items: center;
          padding: 10px;
          cursor: pointer;
          background: #f0f0f0;
        }
        .iconContainer {
          margin-right: 10px;
          font-size: 24px;
        }
        .sectionTitle {
          font-size: 20px;
          margin: 0;
        }
        .sectionDescription {
          font-size: 16px;
          margin: 0;
          color: #777;
        }
        .arrowIcon {
          float: right;
          margin-right: 10px;
          transition: transform 0.3s;
        }
        .arrowIcon.expanded {
          transform: rotate(90deg);
        }
        .sectionContentExpand {
          padding: 10px;
          background: #fff;
        }
      `}</style>
    </div>
  );
};

export default PreguntasFrecuentes;
