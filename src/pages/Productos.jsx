"use client"

import axios from "axios"
import { ArrowLeft, Search, Filter, DollarSign, Tag, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Productos = () => {
  const [productos, setProductos] = useState([])
  const [filteredProductos, setFilteredProductos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const getProducts = async () => {
      try {
        setIsLoading(true)
        console.log(import.meta.env.VITE_API_URL)
        const data = await axios.get(import.meta.env.VITE_API_URL + "/productos")
        setProductos(data.data)
        setFilteredProductos(data.data)
        console.log(data)

        return data
      } catch (error) {
        console.log(error)
        setErrorMessage(error.message)
      } finally {
        setIsLoading(false)
      }
    }
    getProducts()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProductos(productos)
    } else {
      const filtered = productos.filter(
        (producto) =>
          producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          producto.categoria?.nombre.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredProductos(filtered)
    }
  }, [searchTerm, productos])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }
  // Box message
  function showMessage(message) {
    return (
      <div className="text-center py-8 text-gray-500">
        {message}
      </div>
    )
  }
  function showProducts() {
    if (errorMessage) return showMessage(`${errorMessage}`);
    if (productos.length === 0 && isLoading === false) return showMessage('No se encontraron productos disponibles.');
    if (filteredProductos.length === 0 && isLoading === false) return showMessage('No se encontraron productos que coincidan con la búsqueda');
    if (isLoading) return showMessage('Cargando..');
    return (
      filteredProductos.map((producto) => (
        <Link
          to={`/products/${producto.id_producto}`}
          key={producto.id_producto}
          className="p-4 rounded-lg shadow-sm w-full bg-white hover:shadow-md transition-all hover:bg-gray-50 cursor-pointer block"
        >
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
              {producto.imagen ? (
                <img
                  src={producto.imagen || "/placeholder.svg"}
                  alt={producto.nombre}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="text-gray-400 text-xs text-center">Sin imagen</div>
              )}
            </div>
            <div className="flex-1 bg-[#fffef5] p-2">
              <h3 className="text-xl font-medium text-[#7d4b45] mb-1">{producto.nombre}</h3>
              <p className="text-gray-600">Categoría: {producto.categoria?.nombre}</p>
              {producto.precio && <p className="text-sm font-medium mt-1">Precio: {producto.precio} CLP</p>}
              <p className="text-gray-600">Fecha de vencimiento: {producto.fecha_vencimiento}</p>
            </div>
          </div>
        </Link>
      ))
    )


  }

  return (
    <div className="min-h-screen w-full ">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* Header con Volver y Añadir Producto */}
        <div className="flex justify-between items-center mb-6">
          <Link to={"/"} className="text-[#9d7871] hover:text-[#7d4b45] flex items-center">
            <ArrowLeft className="mr-2" />
            Volver
          </Link>
          <Link
            to="/productos/nuevo"
            className="bg-[#9d7871] hover:bg-[#7d4b45] text-white px-4 py-2 rounded-lg transition-colors flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Añadir Producto
          </Link>
        </div>

        {/* Barra de búsqueda y filtros en línea */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="w-full py-2.5 px-4 pr-10 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9d7871]/20"
                value={searchTerm}
                onChange={handleSearch}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-white rounded-lg text-[#7d4b45] flex items-center border border-gray-200 hover:bg-gray-50">
              <Tag className="w-4 h-4 mr-2" />
              Categorías
            </button>
            <button className="px-4 py-2.5 bg-white rounded-lg text-[#7d4b45] flex items-center border border-gray-200 hover:bg-gray-50">
              <DollarSign className="w-4 h-4 mr-2" />
              Precio
            </button>
            <button className="px-4 py-2.5 bg-white rounded-lg text-[#7d4b45] flex items-center border border-gray-200 hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="space-y-4 mt-6">
          {showProducts()}
        </div>

        {/* Botón flotante para móvil */}
        <div className="md:hidden fixed bottom-6 right-6">
          <Link
            to="/productos/nuevo"
            className="flex items-center justify-center bg-[#9d7871] hover:bg-[#7d4b45] text-white w-14 h-14 rounded-full shadow-lg transition-colors"
          >
            <Plus className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Productos

