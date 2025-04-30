"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Calendar, DollarSign, Package, Tag, MapPin, Info } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal"

const DetalleProducto = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [error, setError] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/productos/${id}`)
        console.log(response.data)
        setProducto(response.data)
        setError(null)
      } catch (error) {
        console.error("Error al cargar el producto:", error)
        setError("Error al cargar los datos del producto")
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()
  }, [id])

  const handleDeleteProduct = async () => {
    let public_id;
    setLoadingDelete(true)
    if (producto.imagen){
      public_id = producto.imagen.split('/').pop().split('.')[0];
      console.log(public_id)

    } 
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/productos/${id}`,{
        data: { public_id }})
      navigate("/products")
      
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
      setError("Error al eliminar el producto")
      setLoadingDelete(false)
      setIsDeleteModalOpen(false)
    } finally{
      setLoadingDelete(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#a67a76] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Cargando datos del producto...</p>
        </div>
      </div>
    )
  }

  if (error || !producto) {
    return (
      <div className="w-full mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <Info className="mx-auto" size={48} />
          </div>
          <p className="text-lg text-red-500 mb-6">{error || "No se encontró el producto"}</p>
          <button
            onClick={() => navigate("/products")}
            className="flex items-center gap-2 text-white px-4 py-2 rounded-md bg-[#a67a76] hover:bg-[#8e6762] mx-auto"
          >
            <ArrowLeft size={20} />
            <span>Volver a Productos</span>
          </button>
        </div>
      </div>
    )
  }

  // Formatear la fecha para mostrarla
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible"
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="w-full mx-auto bg-gray-50 min-h-screen">
      {/* Modal de confirmación de eliminación */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => !loadingDelete && setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
        productName={producto.nombre}
        loadingDelete={loadingDelete}
      />

      {/* Barra superior */}
      <div className="p-4 border-b bg-white flex justify-between items-center">
        <button
          onClick={() => navigate("/products")}
          className="flex items-center gap-2 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 bg-[#f2f2f2]"
        >
          <ArrowLeft size={20} />
          <span>Volver a Productos</span>
        </button>

        <button
          onClick={() => navigate(`/products/editar/${id}`)}
          className="flex items-center gap-2 text-white px-3 py-2 rounded-md hover:bg-[#8e6762] bg-[#a67a76]"
        >
          <span>Editar Producto</span>
        </button>
      </div>

      {/* Resto del componente permanece igual */}
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Encabezado con imagen de fondo y nombre del producto */}
          <div className="relative h-48 bg-gradient-to-r from-[#a67a76] to-[#8e6762]">
            <div className="absolute inset-0 flex items-end p-6 text-white">
              <div className="max-w-3xl">
                <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 mr-2" />
                  <span>{producto.categoria?.nombre || "Sin categoría"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 p-6">
            {/* Columna izquierda - Imagen y detalles básicos */}
            <div className="md:col-span-1">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="aspect-square rounded-lg overflow-hidden mb-4 flex items-center justify-center bg-white border">
                  {producto.imagen ? (
                    <img
                      src={producto.imagen || "/placeholder.svg"}
                      alt={producto.nombre}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <Package size={64} className="mx-auto mb-2 opacity-30" />
                      <p>Sin imagen disponible</p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="text-3xl font-bold text-[#a67a76] mb-2">
                    {producto.precio} CLP
                    {producto.precio_por_kilo && <span className="text-sm ml-1">(por kilo)</span>}
                  </div>
                  <div className="text-sm text-gray-500">Código: #{producto.id_producto}</div>
                </div>
              </div>
            </div>

            {/* Columna derecha - Información detallada */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Detalles del producto */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#8e6762] flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Detalles del Producto
                  </h2>

                  <ul className="space-y-4">
                    {producto.contenido_nto && producto.unidad && (
                      <li className="flex items-start">
                        <Package className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Contenido neto</p>
                          <p className="font-medium">
                            {producto.contenido_nto} {producto.unidad}
                          </p>
                        </div>
                      </li>
                    )}

                    <li className="flex items-start">
                      <Calendar className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Fecha de vencimiento</p>
                        <p className="font-medium">{formatDate(producto.fecha_vencimiento)}</p>
                      </div>
                    </li>

                    {producto.seccion && (
                      <li className="flex items-start">
                        <MapPin className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">Sección</p>
                          <p className="font-medium">{producto.seccion}</p>
                        </div>
                      </li>
                    )}

                    <li className="flex items-start">
                      <DollarSign className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Precio</p>
                        <p className="font-medium">
                          {producto.precio} CLP
                          {producto.precio_por_kilo && <span className="text-sm ml-1">(por kilo)</span>}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* Información adicional */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4 text-[#8e6762]">Información Adicional</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Fecha de registro</p>
                      <p className="font-medium">{formatDate(producto.created_at || new Date())}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Última actualización</p>
                      <p className="font-medium">{formatDate(producto.updated_at || new Date())}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-2">Estado del producto</p>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <p className="font-medium">Activo</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate(`/products/editar/${id}`)}
                  className="flex-1 bg-[#a67a76] hover:bg-[#8e6762] text-white py-3 px-4 rounded-lg flex justify-center items-center"
                >
                  Editar Producto
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex-1 border border-red-500 text-red-500 hover:bg-red-50 py-3 px-4 rounded-lg flex justify-center items-center"
                >
                  Eliminar Producto
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto

