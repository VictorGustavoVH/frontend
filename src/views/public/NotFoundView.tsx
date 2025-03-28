export default function NotFoundView() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-600 flex flex-col justify-center items-center">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">404</h1>
      <div className="bg-red-500 px-3 py-1 rounded rotate-12 absolute">
        Página no encontrada
      </div>
      <p className="mt-5 text-2xl text-white font-medium">
        Lo sentimos, la página que buscas no existe.
      </p>
      <a
        href="/"
        className="mt-10 px-6 py-3 bg-white text-gray-800 rounded-full text-lg hover:bg-gray-300 transition duration-200"
      >
        Volver al inicio
      </a>
    </div>
  );
}
