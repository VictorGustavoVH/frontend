import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import api from '../../config/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export type Product = {
  _id?: string; // Opcional, para referenciar el documento de Mongo
  name: string;
  description: string;
  category: string;
  image: string;
  brand?: string;
  price?: number;
  stock?: number;
};

// Se extiende la interfaz para agregar la nueva categoría si es necesario
export type FormProduct = Product & {
  newCategory?: string;
};

const RegisterProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormProduct>();

  // Observar el valor de "category" para mostrar condicionalmente el input de nueva categoría
  const selectedCategory = watch('category');

  const handleRegisterProduct = async (formData: FormProduct) => {
    try {
      // Si se seleccionó "otra", usar el valor ingresado en newCategory
      const finalCategory = formData.category === 'otra' ? formData.newCategory : formData.category;
      if (formData.category === 'otra' && !finalCategory) {
        toast.error('Debe ingresar la nueva categoría');
        return;
      }

      // Construir el objeto producto final a enviar
      const productData: Product = {
        ...formData,
        category: finalCategory || '',
      };

      // 1) Crear el producto
      const resp = await api.post('/admin/product/GestionProductos/Register', productData);
      const slugName = resp.data.slug; // Se obtiene el slug generado

      // 2) Subir imagen si existe
      const imageInput = document.getElementById('image') as HTMLInputElement;
      if (imageInput?.files && imageInput.files[0]) {
        const imageFile = imageInput.files[0];
        const imageFormData = new FormData();
        imageFormData.append('file', imageFile);
        // Enviar el slug para relacionar la imagen al producto
        imageFormData.append('name', slugName);

        const { data } = await api.post('/product/image', imageFormData);
        toast.success(String(data));
      }

      toast.success('Producto registrado correctamente');
      reset();
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Error interno al registrar producto');
        console.error(error);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Registrar Producto
          </h2>
          <form onSubmit={handleSubmit(handleRegisterProduct)} className="space-y-5">
            {/* Nombre */}
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-blue-700">
                Nombre del Producto
              </label>
              <input
                id="name"
                type="text"
                placeholder="Nombre del producto"
                className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                {...register('name', { required: 'El nombre es obligatorio' })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-blue-700">
                Descripción
              </label>
              <textarea
                id="description"
                placeholder="Descripción del producto"
                className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                {...register('description', { required: 'La descripción es obligatoria' })}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            {/* Categoría */}
            <div>
              <label htmlFor="category" className="block text-lg font-medium text-blue-700">
                Categoría
              </label>
              <select
                id="category"
                className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                {...register('category', { required: 'La categoría es obligatoria' })}
              >
                <option value="">Seleccione una categoría</option>
                <option value="electronica">Electrónica</option>
                <option value="ropa">Ropa</option>
                <option value="hogar">Hogar</option>
                <option value="otra">Otra</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            {/* Nueva Categoría (solo si se selecciona "Otra") */}
            {selectedCategory === 'otra' && (
              <div>
                <label htmlFor="newCategory" className="block text-lg font-medium text-blue-700">
                  Ingrese nueva categoría
                </label>
                <input
                  id="newCategory"
                  type="text"
                  placeholder="Nueva categoría"
                  className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                  {...register('newCategory', { required: 'Ingrese la nueva categoría' })}
                />
                {errors.newCategory && <p className="text-red-500 text-sm">{errors.newCategory.message}</p>}
              </div>
            )}

            {/* Marca */}
            <div>
              <label htmlFor="brand" className="block text-lg font-medium text-blue-700">
                Marca
              </label>
              <input
                id="brand"
                type="text"
                placeholder="Marca del producto"
                className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                {...register('brand')}
              />
            </div>

            {/* Precio */}
            <div>
              <label htmlFor="price" className="block text-lg font-medium text-blue-700">
                Precio
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                placeholder="Precio en USD"
                className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                {...register('price', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'El precio no puede ser negativo' },
                })}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            {/* Stock */}
            <div>
              <label htmlFor="stock" className="block text-lg font-medium text-blue-700">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                step="1"
                placeholder="Cantidad en stock"
                className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                {...register('stock', {
                  valueAsNumber: true,
                  min: { value: 0, message: 'El stock no puede ser negativo' },
                })}
              />
              {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
            </div>

            {/* Imagen */}
            <div>
              <label htmlFor="image" className="block text-lg font-medium text-blue-700">
                Subir Imagen
              </label>
              <input
                id="image"
                type="file"
                accept="image/*"
                className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="w-full py-3 mt-5 text-white bg-blue-500 rounded-lg hover:bg-blue-600 font-bold text-lg transition duration-300"
            >
              REGISTRAR PRODUCTO
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterProduct;
