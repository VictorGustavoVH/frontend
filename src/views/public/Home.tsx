// src/pages/Home.tsx (o la ruta que tengas para tu página de inicio)
import React, { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ImgMenu from '../../assets/Menu.png';

// Clases de Tailwind reutilizables
const ctaButtonClasses = `
  inline-block
  px-6
  py-3
  bg-blue-600
  hover:bg-blue-700
  text-white
  font-semibold
  rounded-lg
  shadow-md
  transform
  transition
  duration-300
  hover:scale-105
`;
const titleClasses = 'text-3xl font-bold mb-6 text-gray-800';
const paragraphClasses = 'text-lg mb-4 text-gray-700';

const Home: React.FC = () => {
  // Ejemplo de estado para el acordeón de FAQs
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  return (
    <div>
      <Header />

      {/*
        Sección principal con la clase "animate-fadeIn"
        para que aparezca suavemente al montar el componente
      */}
      <section className="bg-white py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between animate-fadeIn">
        <div className="md:w-1/2">
          <h1 className="text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            VENTANA AUTOMATIZADA
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Innovamos para brindarte un hogar más seguro, cómodo y conectado.
            Con apertura y cierre automático, sensores climáticos de última generación
            y control total desde la palma de tu mano.
          </p>
          <a href="#" className={ctaButtonClasses}>
            Más información
          </a>
        </div>

        {/* Imagen sin Card */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={ImgMenu}
            alt="Ventana Inteligente"
            className="w-full max-w-lg h-auto drop-shadow-lg"
          />
        </div>
      </section>

      {/* Sección de Introducción animada */}
      <section className="py-12 px-4 md:px-8 bg-gray-100 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h2 className={titleClasses}>¿Por qué una Ventana automatizada?</h2>
          <p className={paragraphClasses}>
            Nuestra Ventana automatizada te ayuda a mantener tu casa fresca, ahorrar energía
            y proteger tu hogar frente a la lluvia o intrusos. Olvídate de estar pendiente
            de las inclemencias del tiempo: la ventana se ajusta sola según tus preferencias.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Apertura Automática:</strong> Deja que la ventana se abra para ventilar
              tus espacios cuando sea necesario.
            </li>
            <li>
              <strong>Protección en Mal Clima:</strong> Se cierra a tiempo para evitar lluvia o viento.
            </li>
            <li>
              <strong>Notificaciones al Instante:</strong> Recibe un aviso en tu teléfono ante
              cambios bruscos o situaciones de riesgo.
            </li>
            <li>
              <strong>Ahorro de Energía:</strong> Al regular la ventilación, reduces el uso de
              aire acondicionado o calefacción.
            </li>
          </ul>
        </div>
      </section>

      {/* Sección de Cómo Funciona */}
      <section className="py-12 px-4 md:px-8 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h2 className={titleClasses}>¿Cómo Funciona?</h2>
          <p className={`${paragraphClasses} max-w-3xl`}>
            Con una combinación de sensores climáticos, un motor silencioso y una app intuitiva, 
            la Ventana Inteligente se encarga de todo. Estos son los pasos esenciales:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {/* Paso 1 */}
            <div className="bg-white p-6 shadow-md rounded-lg text-center">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Detecta el Clima</h3>
              <p className="text-gray-700">
                Sensores de temperatura, lluvia y viento analizan el ambiente.
              </p>
            </div>
            {/* Paso 2 */}
            <div className="bg-white p-6 shadow-md rounded-lg text-center">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Envía Datos a tu App</h3>
              <p className="text-gray-700">
                Recibe notificaciones y monitorea el estado de tu ventana en todo momento.
              </p>
            </div>
            {/* Paso 3 */}
            <div className="bg-white p-6 shadow-md rounded-lg text-center">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Acción Automática</h3>
              <p className="text-gray-700">
                La ventana se abre o cierra según la configuración que hayas elegido.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Características Principales */}
      <section className="py-12 px-4 md:px-8 bg-gray-100 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h2 className={titleClasses}>Características Principales</h2>
          <p className={paragraphClasses}>
            La Ventana Inteligente ofrece múltiples funciones para que te sientas más cómodo y seguro.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tarjeta 1 */}
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">Control en tu Teléfono</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Abre o cierra la ventana sin moverte del sillón.</li>
                <li>
                  Recibe alertas cuando detecte lluvia o un cambio brusco de temperatura.
                </li>
                <li>Configura horarios para automatizar su apertura o cierre.</li>
              </ul>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">Diseño Seguro</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Cierra la ventana al detectar situaciones fuera de lo normal.</li>
                <li>Protege tu hogar sin necesidad de vigilar constantemente.</li>
                <li>Te avisa si alguien o algo ha golpeado la ventana.</li>
              </ul>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">Instalación Amigable</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Se adapta fácilmente a la mayoría de los marcos.</li>
                <li>Disponible en distintos tamaños y estilos.</li>
                <li>No requiere grandes obras ni complicaciones.</li>
              </ul>
            </div>

            {/* Tarjeta 4 */}
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-2xl font-semibold mb-2">Ahorro de Energía</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Evita pérdida de calor en invierno o frescura en verano.</li>
                <li>Menor uso de aire acondicionado o calefacción.</li>
                <li>Contribuye al cuidado del medio ambiente.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Testimonios */}
      <section className="py-12 px-4 md:px-8 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h2 className={titleClasses}>Lo Que Dicen Nuestros Clientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Testimonio 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="italic text-gray-700 mb-4">
                "Desde que instalé la Ventana Inteligente, ya no me preocupo cuando salgo de casa.
                Sé que se va a cerrar si empieza a llover. ¡Es fantástica!"
              </p>
              <div className="text-right font-semibold text-gray-800">
                – Ana Gómez
              </div>
            </div>
            {/* Testimonio 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <p className="italic text-gray-700 mb-4">
                "Me gusta que puedo controlar todo desde mi celular. Y en días calurosos
                se abre automáticamente para ventilar, ahorrándome energía."
              </p>
              <div className="text-right font-semibold text-gray-800">
                – Carlos Pérez
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Preguntas Frecuentes (FAQ) */}
      <section className="py-12 px-4 md:px-8 bg-gray-100 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h2 className={titleClasses}>Preguntas Frecuentes</h2>
          <div className="space-y-4 mt-8">
            {[
              {
                pregunta: '¿Necesito Wi-Fi para que funcione?',
                respuesta:
                  'Sí, la ventana se conecta a la red Wi-Fi para enviar y recibir datos, así podrás controlarla desde tu app.'
              },
              {
                pregunta: '¿Es difícil de instalar?',
                respuesta:
                  'La instalación es sencilla y se adapta a la mayoría de los marcos de ventanas. Además, nuestro equipo ofrece soporte si lo necesitas.'
              },
              {
                pregunta: '¿Qué pasa si se va la luz?',
                respuesta:
                  'En caso de corte eléctrico, la ventana se bloquea en posición cerrada por seguridad. Cuando vuelve la electricidad, retoma su funcionamiento normal.'
              },
              {
                pregunta: '¿Es resistente al agua?',
                respuesta:
                  'La ventana está diseñada con materiales resistentes a la humedad. Además, el motor interno está sellado para evitar daños por agua.'
              }
            ].map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left bg-white p-4 rounded-md shadow-md flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-800">
                    {item.pregunta}
                  </span>
                  <span className="ml-2 text-gray-600">
                    {activeFAQ === idx ? '–' : '+'}
                  </span>
                </button>
                {activeFAQ === idx && (
                  <div className="bg-white mt-2 p-4 rounded-md shadow-inner text-gray-700">
                    {item.respuesta}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Ventajas */}
      <section className="py-12 px-4 md:px-8 animate-fadeIn">
        <div className="max-w-5xl mx-auto">
          <h2 className={titleClasses}>Ventajas de Tener una Ventana automatizada</h2>
          <ul className="list-decimal list-inside space-y-3 mt-4 text-gray-700">
            <li>
              <strong>Control Total:</strong> Decide cuándo abrirla o cerrarla sin necesidad
              de estar en casa.
            </li>
            <li>
              <strong>Menos Estrés:</strong> No te preocupes si empieza a llover; la ventana
              actúa por sí sola.
            </li>
            <li>
              <strong>Mayor Seguridad:</strong> Reduce el riesgo de intrusiones al asegurar la
              ventana automáticamente.
            </li>
            <li>
              <strong>Datos Útiles:</strong> Conoce la temperatura, humedad y más desde tu app.
            </li>
            <li>
              <strong>Adaptable a Ti:</strong> Ideal para personas con movilidad reducida o
              rutinas ocupadas.
            </li>
          </ul>
        </div>
      </section>

      {/* Sección CTA (Call To Action) */}
      <section className="py-12 px-4 md:px-8 text-center bg-white animate-fadeIn">
        <div className="max-w-xl mx-auto">
          <h2 className={titleClasses}>¿Te interesa una Ventana automatizada?</h2>
          <p className="text-lg mb-8 text-gray-700">
            Contáctanos para conocer más detalles, precios y formas de instalación. 
            Dale un giro práctico y moderno a tu hogar.
          </p>
          <a href="#" className={ctaButtonClasses}>
            Quiero más detalles
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
