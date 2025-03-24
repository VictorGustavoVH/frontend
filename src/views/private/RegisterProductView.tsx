import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import api from '../../config/axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export type Product = {
  _id?: string;
  name: string;
  description: string;
  category: string;
  image: string;
  brand?: string;
  price?: number;
  stock?: number;
};

type FormData = Product & {
  newCategory?: string;
  imageFile: FileList;
};

const RegisterProduct = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const selectedCategory = watch("category");

  const handleRegisterProduct = async (data: FormData) => {
    try {
      // Manejo de categoría
      const category = selectedCategory === "Otra" 
        ? data.newCategory 
        : selectedCategory;

      if (!category) {
        toast.error('Seleccione o ingrese una categoría');
        return;
      }

      // Crear el producto
      const productData = {
        ...data,
        category,
        image: "" // La imagen se actualizará después
      };

      const resp = await api.post('/admin/product/register', productData);
      const slugName = resp.data.slug;

      // Subir imagen
      if (data.imageFile && data.imageFile[0]) {
        const imageFormData = new FormData();
        imageFormData.append('file', data.imageFile[0]);
        imageFormData.append('name', slugName);

        await api.post('/product/image', imageFormData);
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
            Registrar Nuevo Producto
          </h2>

          <form 
            onSubmit={handleSubmit(handleRegisterProduct)}
            className="space-y-6"
          >
            {/* Nombre */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Nombre del Producto *
              </label>
              <input
                type="text"
                className={`input ${errors.name ? 'input-error' : 'input-primary'}`}
                placeholder="Ej: Smartphone X12"
                {...register('name', {
                  required: 'Este campo es obligatorio',
                  minLength: {
                    value: 3,
                    message: 'Mínimo 3 caracteres'
                  }
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Descripción *
              </label>
              <textarea
                className={`textarea ${errors.description ? 'textarea-error' : 'textarea-primary'}`}
                placeholder="Descripción detallada del producto"
                rows={4}
                {...register('description', {
                  required: 'Este campo es obligatorio',
                  minLength: {
                    value: 10,
                    message: 'Mínimo 10 caracteres'
                  }
                })}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Categoría *
              </label>
              <select
                className={`select ${errors.category ? 'select-error' : 'select-primary'} w-full`}
                {...register('category', {
                  required: 'Seleccione una categoría'
                })}
                onChange={(e) => {
                  if (e.target.value !== "Otra") {
                    setValue('newCategory', '');
                  }
                }}
              >
                <option value="">Seleccione...</option>
                <option value="Electrónica">Electrónica</option>
                <option value="Hogar">Hogar</option>
                <option value="Deportes">Deportes</option>
                <option value="Otra">Otra categoría</option>
              </select>
              
              {selectedCategory === "Otra" && (
                <div className="mt-4">
                  <input
                    type="text"
                    className={`input ${errors.newCategory ? 'input-error' : 'input-primary'} w-full`}
                    placeholder="Ingrese nueva categoría"
                    {...register('newCategory', {
                      required: 'Ingrese la nueva categoría'
                    })}
                  />
                  {errors.newCategory && (
                    <p className="text-red-500 text-sm mt-1">{errors.newCategory.message}</p>
                  )}
                </div>
              )}
            </div>

            {/* Precio y Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Precio (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className={`input ${errors.price ? 'input-error' : 'input-primary'}`}
                  placeholder="0.00"
                  {...register('price', {
                    min: {
                      value: 0.01,
                      message: 'El precio debe ser mayor a 0'
                    }
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Stock
                </label>
                <input
                  type="number"
                  className={`input ${errors.stock ? 'input-error' : 'input-primary'}`}
                  placeholder="Cantidad disponible"
                  {...register('stock', {
                    valueAsNumber: true,
                    min: {
                      value: 0,
                      message: 'El stock no puede ser negativo'
                    }
                  })}
                />
                {errors.stock && (
                  <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>
                )}
              </div>
            </div>

            {/* Marca */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Marca
              </label>
              <input
                type="text"
                className="input input-primary w-full"
                placeholder="Ej: Sony, Samsung, etc."
                {...register('brand')}
              />
            </div>

            {/* Imagen */}
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Imagen del Producto *
              </label>
              <input
                type="file"
                accept="image/*"
                className={`file-input w-full ${errors.imageFile ? 'file-input-error' : 'file-input-primary'}`}
                {...register('imageFile', {
                  required: 'La imagen es obligatoria'
                })}
              />
              {errors.imageFile && (
                <p className="text-red-500 text-sm mt-1">{errors.imageFile.message}</p>
              )}
            </div>

            {/* Botón de envío */}
            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-lg font-bold transition-transform hover:scale-105"
            >
              Registrar Producto
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterProduct;