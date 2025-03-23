import React, { useEffect, useState } from 'react'
import {
  getProducts,
  registerProduct,
  uploadProductImage,
  updateProduct as apiUpdateProduct,
  deleteProduct as apiDeleteProduct,
  // Imagínate que exista un endpoint para borrar todo:
 
} from '../../api/DevTreeAPI'
import { Product } from '../../types/product'
import { toast } from 'sonner'

const PAGE_SIZE = 5 // Tamaño de página de ejemplo

const ProductCrud: React.FC = () => {
  // Lista completa de productos (los que vienen de la BD)
  const [allProducts, setAllProducts] = useState<Product[]>([])

  // Datos de paginación
  const [currentPage, setCurrentPage] = useState<number>(1)

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Modal Create
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({})

  // Modal Update
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [editProduct, setEditProduct] = useState<Partial<Product>>({})

  // Modal Delete (confirmación para eliminar uno)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)

  // Modal Delete ALL (confirmación para eliminar todo)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)

  // Al montar, traemos productos
  useEffect(() => {
    fetchAllProducts()
  }, [])

  // Llamada a la API para obtener productos
  const fetchAllProducts = async () => {
    try {
      const data = await getProducts()
      setAllProducts(data || [])
    } catch (err) {
      console.error('Error fetching products:', err)
      toast.error('Error cargando productos')
    }
  }

  /* ---------------- CREAR PRODUCTO ---------------- */
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 1) Crear en la BD sin imagen
      const resp = await registerProduct(newProduct)
      // 2) Subir imagen si existe
      if (newProduct.image) {
        const slugName = resp.slug || newProduct.name
        await uploadProductImage(newProduct.image as unknown as File, slugName!)
      }
      toast.success('Producto creado')
      setShowCreateModal(false)
      setNewProduct({})
      // Refetch
      fetchAllProducts()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error creando producto')
    }
  }

  /* ---------------- EDITAR PRODUCTO ---------------- */
  const openEditModal = (prod: Product) => {
    setEditProduct(prod)
    setShowUpdateModal(true)
  }
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!editProduct._id) {
        toast.error('No hay producto seleccionado')
        return
      }
      const { image, ...fields } = editProduct
      // 1) Actualizar campos en BD
      await apiUpdateProduct(editProduct._id, fields)
      // 2) Subir imagen si existe
      if (image && typeof image !== 'string') {
        await uploadProductImage(image as File, editProduct.name!)
      }
      toast.success('Producto actualizado')
      setShowUpdateModal(false)
      setEditProduct({})
      fetchAllProducts()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error actualizando producto')
    }
  }

  /* ---------------- ELIMINAR UNO ---------------- */
  const openDeleteModal = (productId: string) => {
    setDeleteProductId(productId)
    setShowDeleteModal(true)
  }
  const handleDeleteProduct = async () => {
    if (!deleteProductId) return
    try {
      await apiDeleteProduct(deleteProductId)
      toast.success('Producto eliminado')
      setDeleteProductId(null)
      setShowDeleteModal(false)
      fetchAllProducts()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Error eliminando producto')
    }
  }

  /* ---------------- ELIMINAR TODOS (opcional) ---------------- */
  

  /* ---------------- SEARCH & FILTER local ---------------- */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Volvemos a la página 1 al cambiar search
  }

  // Ejemplo: toggle de categorías al hacer check
  const handleToggleCategory = (cat: string) => {
    setCurrentPage(1)
    setSelectedCategories(prev => {
      if (prev.includes(cat)) {
        // quitar
        return prev.filter(c => c !== cat)
      } else {
        // agregar
        return [...prev, cat]
      }
    })
  }

  // Filtramos localmente
  const filteredProducts = allProducts.filter(prod => {
    // Filtra por searchTerm en name (o brand si quieres)
    const matchesSearch =
      prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.brand?.toLowerCase().includes(searchTerm.toLowerCase())

    // Filtra por categorías seleccionadas (si hay)
    // (Si no hay categorías marcadas, no filtramos nada)
    const matchesCategory =
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(prod.category || '')

    return matchesSearch && matchesCategory
  })

  // Paginado local
  const total = filteredProducts.length
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

  // Funciones para la paginación
  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev))
  }
  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))
  }

  /* ---------------- Handlers de inputs Create y Update ---------------- */
  const handleNewProductChange = (field: keyof Product, value: any) => {
    setNewProduct(prev => ({ ...prev, [field]: value }))
  }
  const handleEditChange = (field: keyof Product, value: any) => {
    setEditProduct(prev => ({ ...prev, [field]: value }))
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5 antialiased">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        {/* Contenedor principal */}
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">

          {/* HEADER / TOOLBAR */}
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 
                          md:space-y-0 md:space-x-4 p-4">
            {/* Searchbar */}
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 
                           8 4 4 0 000-8zM2 
                           8a6 6 0 1110.89 
                           3.476l4.817 4.817a1 
                           1 0 01-1.414 
                           1.414l-4.816-4.816A6 
                           6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                               rounded-lg focus:ring-primary-500 focus:border-primary-500 
                               block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 
                               dark:placeholder-gray-400 dark:text-white 
                               dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search by name or brand..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </form>
            </div>
            {/* Botones / acciones */}
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 
                            md:space-y-0 items-stretch md:items-center justify-end 
                            md:space-x-3 flex-shrink-0">
              {/* Botón de crear producto */}
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center justify-center text-white 
                           bg-primary-700 hover:bg-primary-800 focus:ring-4 
                           focus:ring-primary-300 font-medium rounded-lg text-sm 
                           px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 
                           focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 
                       0 011 1v5h5a1 1 
                       0 110 2h-5v5a1 
                       1 0 11-2 0v-5H4a1 
                       1 0 110-2h5V4a1 
                       1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add product
              </button>

              {/* Menú de acciones (ejemplo) */}
              <div className="flex items-center space-x-3 w-full md:w-auto">
                {/* Mass Edit (solo de adorno) */}
                <button
                  onClick={() => alert('Funcionalidad mass edit...')}
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm 
                             font-medium text-gray-900 focus:outline-none bg-white 
                             rounded-lg border border-gray-200 hover:bg-gray-100 
                             hover:text-primary-700 focus:z-10 focus:ring-4 
                             focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 
                             dark:text-gray-400 dark:border-gray-600 dark:hover:text-white 
                             dark:hover:bg-gray-700"
                  type="button"
                >
                  Mass Edit
                </button>

                {/* Delete All */}
                
              </div>
            </div>
          </div>

          {/* FILTROS DE CATEGORÍA (opcional) */}
          <div className="px-4 pb-4">
            <h6 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Categorías (filtro local)
            </h6>
            <div className="flex flex-wrap gap-2 text-sm">
              {['PC', 'Phone', 'Tablet', 'Gaming/Console', 'Watch', 'Photo', 'TV/Monitor', 'Other'].map(cat => (
                <label key={cat} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleToggleCategory(cat)}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* TABLA */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead
                className="text-xs text-gray-700 uppercase bg-gray-50 
                           dark:bg-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th scope="col" className="px-4 py-3">Imagen</th>
                  <th scope="col" className="px-4 py-3">Product Name</th>
                  <th scope="col" className="px-4 py-3">Category</th>
                  <th scope="col" className="px-4 py-3">Brand</th>
                  <th scope="col" className="px-4 py-3">Price</th>
                  <th scope="col" className="px-4 py-3 text-right">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((prod) => (
                  <tr key={prod._id || prod.name} className="border-b dark:border-gray-700">
                    <td className="px-4 py-3">
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {prod.name}
                    </td>
                    <td className="px-4 py-3">{prod.category}</td>
                    <td className="px-4 py-3">{prod.brand}</td>
                    <td className="px-4 py-3">
                      ${prod.price?.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 flex items-center justify-end space-x-1">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(prod._id!)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {paginatedProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-3 text-center">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINACIÓN */}
          <nav
            className="flex flex-col md:flex-row justify-between items-start md:items-center 
                       space-y-3 md:space-y-0 p-4"
            aria-label="Table navigation"
          >
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
              Showing
              <span className="font-semibold text-gray-900 dark:text-white mx-1">
                {startIndex + 1} - {endIndex > total ? total : endIndex}
              </span>
              of
              <span className="font-semibold text-gray-900 dark:text-white ml-1">
                {total}
              </span>
            </span>
            <ul className="inline-flex items-stretch -space-x-px">
              <li>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center h-full py-1.5 px-3 ml-0 
                             text-gray-500 bg-white rounded-l-lg border border-gray-300 
                             hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 
                             dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
                             dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 
                         5.293a1 1 0 
                         010 1.414L9.414 
                         10l3.293 
                         3.293a1 1 
                         0 
                         01-1.414 
                         1.414l-4-4a1 
                         1 0 
                         010-1.414l4-4a1 
                         1 0 
                         011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>

              {/* Páginas “cortas” de ejemplo */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                <li key={pg}>
                  <button
                    onClick={() => setCurrentPage(pg)}
                    className={`flex items-center justify-center text-sm py-2 px-3 leading-tight 
                                border border-gray-300 bg-white hover:bg-gray-100 
                                hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 
                                dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
                                ${pg === currentPage
                                  ? 'z-10 bg-primary-50 text-primary-600 border-primary-300'
                                  : 'text-gray-500'
                                }
                               `}
                  >
                    {pg}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center h-full py-1.5 px-3 leading-tight 
                             text-gray-500 bg-white rounded-r-lg border border-gray-300 
                             hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 
                             dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 
                             dark:hover:bg-gray-700 dark:hover:text-white"
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 
                         14.707a1 1 0 
                         010-1.414L10.586 
                         10 7.293 
                         6.707a1 1 0 
                         011.414-1.414l4 
                         4a1 1 0 
                         010 1.414l-4 
                         4a1 1 0 
                         01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* ---------------------- MODAL CREATE ---------------------- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b 
                              sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Add Product
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
                             rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
                             dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 
                         4.293a1 1 0 
                         011.414 0L10 
                         8.586l4.293-4.293a1 
                         1 0 
                         111.414 1.414L11.414 
                         10l4.293 
                         4.293a1 1 0 
                         01-1.414 
                         1.414L10 
                         11.414l-4.293 
                         4.293a1 1 
                         0 
                         01-1.414-1.414L8.586 
                         10 4.293 
                         5.707a1 1 0 
                         010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {/* Body */}
              <form onSubmit={handleCreateProduct}>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={newProduct.name || ''}
                      onChange={(e) => handleNewProductChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Brand
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={newProduct.brand || ''}
                      onChange={(e) => handleNewProductChange('brand', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Price
                    </label>
                    <input
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="299"
                      value={newProduct.price || ''}
                      onChange={(e) => handleNewProductChange('price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Category
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-500 focus:border-primary-500 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="PC, Phone, etc."
                      value={newProduct.category || ''}
                      onChange={(e) => handleNewProductChange('category', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 
                                 rounded-lg border border-gray-300 focus:ring-primary-500 
                                 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Some details..."
                      value={newProduct.description || ''}
                      onChange={(e) => handleNewProductChange('description', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleNewProductChange('image', e.target.files[0])
                        }
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 
                             focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium 
                             rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 
                             dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  Create product
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- MODAL UPDATE ---------------------- */}
      {showUpdateModal && editProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
              <div className="flex justify-between items-center pb-4 mb-4 
                              rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Update Product
                </h3>
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 
                             rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
                             dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 
                         4.293a1 1 0 
                         011.414 0L10 
                         8.586l4.293-4.293a1 
                         1 0 111.414 
                         1.414L11.414 
                         10l4.293 
                         4.293a1 1 0 
                         01-1.414 
                         1.414L10 
                         11.414l-4.293 
                         4.293a1 1 
                         0 01-1.414-1.414L8.586 
                         10 4.293 
                         5.707a1 1 
                         0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdateProduct}>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Name
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={editProduct.name || ''}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Brand
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={editProduct.brand || ''}
                      onChange={(e) => handleEditChange('brand', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Price
                    </label>
                    <input
                      type="number"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-600 focus:border-primary-600 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={editProduct.price || ''}
                      onChange={(e) => handleEditChange('price', Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Category
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm 
                                 rounded-lg focus:ring-primary-500 focus:border-primary-500 
                                 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={editProduct.category || ''}
                      onChange={(e) => handleEditChange('category', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 
                                 rounded-lg border border-gray-300 focus:ring-primary-500 
                                 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 
                                 dark:placeholder-gray-400 dark:text-white 
                                 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      value={editProduct.description || ''}
                      onChange={(e) => handleEditChange('description', e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Nueva imagen
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleEditChange('image', e.target.files[0])
                        }
                      }}
                    />
                    {/* Si editProduct.image es un string, significa que ya existe una */}
                    {typeof editProduct.image === 'string' && editProduct.image && (
                      <div className="mt-2">
                        <img
                          src={editProduct.image}
                          alt="Current"
                          className="w-16 h-16 object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    className="text-white bg-primary-700 hover:bg-primary-800 
                               focus:ring-4 focus:outline-none focus:ring-primary-300 
                               font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                               dark:bg-primary-600 dark:hover:bg-primary-700 
                               dark:focus:ring-primary-800"
                  >
                    Update product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                    className="text-gray-500 hover:text-gray-900 border border-gray-200 
                               hover:bg-gray-100 focus:ring-4 focus:outline-none 
                               focus:ring-gray-200 font-medium rounded-lg text-sm 
                               px-5 py-2.5 dark:border-gray-600 dark:text-gray-300 
                               dark:hover:text-white dark:hover:bg-gray-600 
                               dark:focus:ring-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- MODAL DELETE (UNO) ---------------------- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative p-4 text-center bg-white rounded-lg 
                            shadow dark:bg-gray-800 sm:p-5">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent 
                           hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 
                           ml-auto inline-flex items-center dark:hover:bg-gray-600 
                           dark:hover:text-white"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 
                       4.293a1 1 0 
                       011.414 0L10 
                       8.586l4.293-4.293a1 
                       1 0 
                       111.414 1.414L11.414 
                       10l4.293 
                       4.293a1 1 0 
                       01-1.414 
                       1.414L10 
                       11.414l-4.293 
                       4.293a1 1 0 
                       01-1.414-1.414L8.586 
                       10 4.293 
                       5.707a1 1 0 
                       010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <svg
                className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 
                     00-.894.553L7.382 4H4a1 1 
                     0 000 2v10a2 2 0 002 2h8a2 
                     2 0 002-2V6a1 1 0 
                     100-2h-3.382l-.724-1.447A1 
                     1 0 0011 2H9zM7 8a1 1 0 
                     012 0v6a1 1 0 11-2 
                     0V8zm5-1a1 1 0 
                     00-1 1v6a1 1 0 
                     102 0V8a1 1 0 
                     00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="mb-4 text-gray-500 dark:text-gray-300">
                Are you sure you want to delete this product?
              </p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  type="button"
                  className="py-2 px-3 text-sm font-medium text-gray-500 bg-white 
                             rounded-lg border border-gray-200 hover:bg-gray-100 
                             focus:ring-4 focus:outline-none focus:ring-primary-300 
                             hover:text-gray-900 focus:z-10 dark:bg-gray-700 
                             dark:text-gray-300 dark:border-gray-500 
                             dark:hover:text-white dark:hover:bg-gray-600 
                             dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  type="button"
                  className="py-2 px-3 text-sm font-medium text-center text-white 
                             bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 
                             focus:outline-none focus:ring-red-300 dark:bg-red-500 
                             dark:hover:bg-red-600 dark:focus:ring-red-900"
                >
                  Yes, I'm sure
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- MODAL DELETE ALL ---------------------- */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative p-4 text-center bg-white rounded-lg shadow 
                            dark:bg-gray-800 sm:p-5">
              <button
                type="button"
                onClick={() => setShowDeleteAllModal(false)}
                className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent 
                           hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 
                           ml-auto inline-flex items-center dark:hover:bg-gray-600 
                           dark:hover:text-white"
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 
                       4.293a1 1 0 
                       011.414 0L10 
                       8.586l4.293-4.293a1 
                       1 0 
                       111.414 1.414L11.414 
                       10l4.293 
                       4.293a1 1 0 
                       01-1.414 
                       1.414L10 
                       11.414l-4.293 
                       4.293a1 1 0 
                       01-1.414-1.414L8.586 
                       10 4.293 
                       5.707a1 1 0 
                       010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <svg
                className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 
                     00-.894.553L7.382 4H4a1 1 
                     0 000 2v10a2 2 0 002 2h8a2 
                     2 0 002-2V6a1 1 0 
                     100-2h-3.382l-.724-1.447A1 
                     1 0 0011 2H9zM7 8a1 1 0 
                     012 0v6a1 1 0 11-2 
                     0V8zm5-1a1 1 0 
                     00-1 1v6a1 1 0 
                     102 0V8a1 1 0 
                     00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="mb-4 text-gray-500 dark:text-gray-300">
                Are you sure you want to delete ALL products?
              </p>
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => setShowDeleteAllModal(false)}
                  type="button"
                  className="py-2 px-3 text-sm font-medium text-gray-500 bg-white 
                             rounded-lg border border-gray-200 hover:bg-gray-100 
                             focus:ring-4 focus:outline-none focus:ring-primary-300 
                             hover:text-gray-900 focus:z-10 dark:bg-gray-700 
                             dark:text-gray-300 dark:border-gray-500 
                             dark:hover:text-white dark:hover:bg-gray-600 
                             dark:focus:ring-gray-600"
                >
                  No, cancel
                </button>
               
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ProductCrud
