"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AñadirProducto = () => {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [upload, setIsUpload] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    categoria: "",
    precio: "",
    fechaVencimiento: "",
    imagen: null,
    contenido_nto: 0.0,
    seccion: "",
    unidad: "",
    precio_por_kilo: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUpload(true)
    try {
      const formDataToSend = new FormData()

      formDataToSend.append("nombre", formData.nombre)
      formDataToSend.append("id_categoria", formData.categoria)
      formDataToSend.append("precio", formData.precio)
      formDataToSend.append("fecha_vencimiento", formData.fechaVencimiento)
      formDataToSend.append("contenido_nto", formData.contenido_nto)
      formDataToSend.append("seccion", formData.seccion)
      formDataToSend.append("unidad", formData.unidad)
      formDataToSend.append("precio_por_kilo", formData.precio_por_kilo ? "1" : "0")

      if (formData.imagen) {
        formDataToSend.append("imagen", formData.imagen)
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
      console.log(formDataToSend)
      const res = await axios.post(import.meta.env.VITE_API_URL + "/productos", formDataToSend, config)

      if (res.status === 201) {
        // Producto creado exitosamente
        console.log(res)
        navigate("/products")
      }
    } catch (error) {
      console.error("Error al crear el producto:", error)
    } finally{
      setIsUpload(false)
    }
  }

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true)
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/categorias")
        console.log(response.data)
        setCategorias(response.data)
        setError(null)
      } catch (error) {
        console.log(error)
        setError("Error al cargar las categorías")
      } finally {
        setLoading(false)
      }
    }
    getCategories()
  }, [])

  return (
    <div className="w-full mx-auto bg-gray-50 min-h-screen">
      {/* Barra superior */}
      <div className="p-4 border-b bg-white">
        <button
          onClick={() => {
            navigate("/products")
          }}
          className="flex items-center gap-2 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 bg-[#f2f2f2]"
        >
          <ArrowLeft size={20} />
          <span>Productos</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <h2 className="text-2xl font-semibold mb-6 text-center">Añadir Nuevo Producto</h2>

        {/* Contenedor principal con dos columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Columna izquierda - Formulario */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium mb-4">Formulario</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Imagen */}
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-64 ">
                {formData.imagen ? (
                  <img
                    src={URL.createObjectURL(formData.imagen) || "/placeholder.svg"}
                    alt="Vista previa"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center ">
                    <p className="text-sm text-gray-500 mb-4 ">Sin imagen</p>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 bg-[#f2f2f2] text-gray-600"
                      onClick={() => document.getElementById("imagen-input").click()}
                    >
                      <Upload size={18} />
                      <span>Subir imagen</span>
                    </button>
                    <input
                      id="imagen-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFormData((prev) => ({
                            ...prev,
                            imagen: e.target.files[0],
                          }))
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Datos del producto */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del producto <span className="text-red-500">*</span>
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: MAYONESA MEDIANA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contenido_nto" className="block text-sm font-medium text-gray-700 mb-1">
                    Contenido neto
                  </label>
                  <input
                    id="contenido_nto"
                    name="contenido_nto"
                    value={formData.contenido_nto}
                    onChange={handleChange}
                    type="number"
                    step="0.01"
                    placeholder="Ej: 250"
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
                  />
                </div>

                <div>
                  <label htmlFor="unidad" className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad
                  </label>
                  <select
                    id="unidad"
                    name="unidad"
                    value={formData.unidad}
                    onChange={handleSelectChange}
                    className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
                  >
                    <option value="" disabled>
                      Seleccionar unidad
                    </option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                    <option value="und">und</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
                  required
                  disabled={loading}
                >
                  <option value="" disabled>
                    {loading ? "Cargando categorías..." : "Seleccionar categoría"}
                  </option>
                  {error ? (
                    <option value="" disabled>
                      {error}
                    </option>
                  ) : (
                    categorias.map((categoria) => (
                      <option key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre}
                      </option>
                    ))
                  )}
                </select>
                {loading && <p className="text-xs text-gray-500 mt-1">Cargando categorías...</p>}
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <div>
                <label htmlFor="seccion" className="block text-sm font-medium text-gray-700 mb-1">
                  Sección
                </label>
                <input
                  id="seccion"
                  name="seccion"
                  value={formData.seccion}
                  onChange={handleChange}
                  maxLength={2}
                  placeholder="Ej: A1"
                  className="w-full px-3 py-2 border text-gray-400 border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1 ">
                    Precio (CLP) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="precio"
                    name="precio"
                    value={formData.precio}
                    s
                    onChange={handleChange}
                    type="number"
                    placeholder="Ej: 1700"
                    className="w-full px-3 py-2 border border-gray-300 text-gray-400 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de vencimiento <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="fechaVencimiento"
                    name="fechaVencimiento"
                    value={formData.fechaVencimiento}
                    onChange={handleChange}
                    type="date"
                    // placeholder="222-2-2-2-"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white  text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <div className="relative flex items-center">
                  <input
                    id="precio_por_kilo"
                    name="precio_por_kilo"
                    type="checkbox"
                    checked={formData.precio_por_kilo}
                    onChange={handleChange}
                    className="sr-only" // Oculta el checkbox real pero mantiene la funcionalidad
                  />
                  <div
                    className={`h-5 w-5 flex items-center justify-center border rounded cursor-pointer ${
                      formData.precio_por_kilo ? "bg-[#a67a76] border-[#a67a76]" : "bg-white border-gray-300"
                    }`}
                    onClick={() => setFormData((prev) => ({ ...prev, precio_por_kilo: !prev.precio_por_kilo }))}
                  >
                    {formData.precio_por_kilo && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 text-white"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="precio_por_kilo"
                  className="ml-2 block text-sm text-gray-700 cursor-pointer"
                  onClick={() => setFormData((prev) => ({ ...prev, precio_por_kilo: !prev.precio_por_kilo }))}
                >
                  Precio por kilo
                </label>
              </div>
              <div className="text-xs text-gray-500 mt-2 mb-2">
                <span className="text-red-500">*</span> Campos obligatorios
              </div>
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-[#a67a76] hover:bg-[#8e6762] text-white px-4 py-2 rounded-md"
                >
                  {
                    upload ? '...' : 'Guardar Producto'
                  }

                </button>
              </div>
            </form>
          </div>

          {/* Columna derecha - Vista previa */}
          <div className="bg-white p-6 rounded-lg shadow-sm bg-green-50">
            <h3 className="text-lg font-medium  lg:h-[5%] mb-2 ">Vista previa</h3>

            <div className="flex flex-col items-center justify-between  lg:h-[94%]">
              <div className="w-full flex-grow flex flex-col items-center justify-center bg-gray-50 p-4 rounded-lg ">
                {formData.imagen ? (
                  <img
                    src={URL.createObjectURL(formData.imagen) || "/placeholder.svg"}
                    alt="Vista previa"
                    className="max-h-64 max-w-full object-contain mb-4"
                  />
                ) : (
                  <p className="text-sm text-gray-500 mb-4">Sin imagen</p>
                )}

                {formData.nombre && (
                  <div className="text-center mt-4 w-full">
                    <h2 className="text-xl font-bold text-[#8e6762]">{formData.nombre}</h2>
                    <p className="text-gray-700 mt-2">
                      Categoría:{" "}
                      {loading
                        ? "Cargando..."
                        : categorias.find((cat) => cat.id_categoria.toString() === formData.categoria)?.nombre || ""}
                    </p>
                    {formData.contenido_nto && formData.unidad && (
                      <p className="text-gray-700">
                        Contenido: {formData.contenido_nto} {formData.unidad}
                      </p>
                    )}
                    {formData.seccion && <p className="text-gray-700">Sección: {formData.seccion}</p>}
                    <p className="text-gray-700">
                      Precio: {formData.precio} CLP {formData.precio_por_kilo ? "(por kilo)" : ""}
                    </p>
                    <p className="text-gray-700">Fecha de vencimiento: {formData.fechaVencimiento}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AñadirProducto

