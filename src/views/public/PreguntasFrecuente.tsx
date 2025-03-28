import React, { useState, useEffect } from 'react';
import api from '../../config/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface FAQSection {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string;
}

const PreguntasFrecuentes: React.FC = () => {
  const [sections, setSections] = useState<FAQSection[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    api.get('/pagina/contenido')
      .then(res => {
        // Si no hay contenido, usamos "[]"
        const faqString = res.data.preguntasFrecuentes || "[]";
        console.log("FAQ string recibido:", faqString);
        let parsedFaq: any[] = [];
        try {
          parsedFaq = JSON.parse(faqString);
          console.log("FAQ parseadas:", parsedFaq);
        } catch (error) {
          console.error("Error al parsear el JSON de FAQs:", error);
        }
        // Transformamos cada objeto para adaptarlo al formato esperado
        const transformed = parsedFaq
          .map((faq, index) => {
            // Si ya tiene 'title', asumimos que está en el formato nuevo
            if (faq.title !== undefined) {
              return {
                id: faq.id ? faq.id : String(index),
                title: faq.title,
                description: faq.description || "",
                icon: faq.icon || "❓",
                content: faq.content || "",
              };
            }
            // Si no tiene 'title' pero sí 'question', transformamos del formato antiguo
            else if (faq.question !== undefined) {
              return {
                id: String(index),
                title: faq.question,
                description: "",
                icon: "❓",
                content: faq.answer,
              };
            }
            return null;
          })
          .filter(faq => faq !== null) as FAQSection[];

        setSections(transformed);
      })
      .catch(err => {
        console.error("Error al obtener el contenido de la página:", err);
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
          <p className="subtitle">Selecciona una categoría para ver la documentación</p>
        </div>
        <div className="sectionsContainer">
          {sections.length === 0 ? (
            <p>No hay preguntas disponibles</p>
          ) : (
            sections.map(section => (
              <div key={section.id} className="sectionItem">
                <div className="sectionContent" onClick={() => handleSectionClick(section.id)}>
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
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                  </div>
                )}
              </div>
            ))
          )}
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
