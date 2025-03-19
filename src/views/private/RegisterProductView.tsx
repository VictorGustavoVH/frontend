// views/private/RegisterProductos.tsx
import { useForm } from 'react-hook-form';
import { Product } from '../../types/product';
import { toast } from 'sonner';
import api from '../../config/axios';
import { isAxiosError } from 'axios';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RegisterProduct = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<Product>();

    const handleRegisterProduct = async (formData: Product) => {
        try {
            await api.post(`admin/product/register`, formData);

            const imageInput = document.getElementById("image") as HTMLInputElement;
            if (imageInput.files && imageInput.files[0]) {
                const imageFile = imageInput.files[0];

                const imageFormData = new FormData();
                imageFormData.append("file", imageFile);
                imageFormData.append("name", formData.name);

                const { data } = await api.post("/product/image", imageFormData)

                toast.success(data);
            }

            reset();

        } catch (error) {
            if (isAxiosError(error) && error.response) {
                toast.error(error.response.data.error);
                console.error(error.response.data.error);
            }
        }
    };

    return ( 
        <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Registrar Producto</h2>
                <form onSubmit={handleSubmit(handleRegisterProduct)} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-lg font-medium text-blue-700">Nombre del Producto</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Nombre del producto"
                            className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                            {...register('name', { required: "El nombre es obligatorio" })}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-lg font-medium text-blue-700">Descripción</label>
                        <textarea
                            id="description"
                            placeholder="Descripción del producto"
                            className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                            {...register('description', { required: "La descripción es obligatoria" })}
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-lg font-medium text-blue-700">Categoría</label>
                        <input
                            id="category"
                            type="text"
                            placeholder="Categoría del producto"
                            className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                            {...register('category', { required: "La categoría es obligatoria" })}
                        />
                        {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-blue-700">Subir Imagen</label>
                        <input
                            id="image"
                            type="file"
                            accept="image/*"
                            className="w-full p-3 mt-1 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-400"
                        />
                    </div>
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
