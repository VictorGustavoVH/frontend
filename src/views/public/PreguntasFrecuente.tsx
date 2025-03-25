  import React, { useState } from 'react';
  import './style.css'; // Importar el archivo CSS

  import Header from '../../components/Header';
  import Footer from '../../components/Footer';

  interface Section {
    id: string;
    title: string;
    description: string;
    icon: string;
    content: React.ReactNode;
  }

  const PreguntasFrecuente: React.FC = () => {
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const sections: Section[] = [
      {
        id: 'pagos',
        title: 'Pagos',
        description: 'Información sobre métodos de pago, facturación y procesamiento de pagos',
        icon: '💳',
        content: (
          <div className="docContainer">
            <h2 className="docTitle">Documentación de Pagos</h2>
            <p className="docText">
              Aquí encontrarás información sobre los métodos de pago disponibles, facturación y cómo se procesan los pagos. 
              Asegúrate de conocer todos los detalles para realizar tus pagos de manera segura.
            </p>
          </div>
        ),
      },
      {
        id: 'productos',
        title: 'Productos',
        description: 'Catálogo de productos, especificaciones y disponibilidad',
        icon: '📦',
        content: (
          <div className="docContainer">
            <h2 className="docTitle">Documentación de Productos</h2>
            <p className="docText">
              Explora nuestro catálogo de productos, las especificaciones detalladas y la disponibilidad de cada uno.
              Cada producto está cuidadosamente diseñado para ofrecerte la mejor calidad.
            </p>
          </div>
        ),
      },
      {
        id: 'devoluciones',
        title: 'Devoluciones',
        description: 'Políticas y procedimientos para devoluciones y reembolsos',
        icon: '🔄',
        content: (
          <div className="docContainer">
            <h2 className="docTitle">Documentación de Devoluciones</h2>
            <p className="docText">
              Aquí encontrarás todo lo que necesitas saber sobre nuestras políticas y procedimientos para devoluciones y reembolsos.
              En caso de que no estés satisfecho con tu compra, te ayudamos a realizar la devolución de forma sencilla y rápida.
            </p>
          </div>
        ),
      },
      {
        id: 'cuenta',
        title: 'Cuenta y Seguridad',
        description: 'Gestión de tu cuenta, privacidad y configuración de seguridad',
        icon: '🔒',
        content: (
          <div className="docContainer">
            <h2 className="docTitle">Cuenta y Seguridad</h2>
            <p className="docText">
              Información importante sobre la gestión de tu cuenta, la privacidad de tus datos y cómo configurar las opciones de seguridad 
              para proteger tu información personal.
            </p>
          </div>
        ),
      },
    ];

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
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
        
      </div>
      <Footer />
      </div>
    );
  };

  export default PreguntasFrecuente;
