"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Save, X, Upload, AlertCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"

const EditarProducto = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [imagenPreview, setImagenPreview] = useState(null)
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

  // Cargar datos del producto
  useEffect(() => {
    const fetchProducto = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/productos/${id}`)
        console.log(response.data)
        setProducto(response.data)

        // Formatear la fecha para el input date
        const fechaVencimiento = response.data.fecha_vencimiento
          ? new Date(response.data.fecha_vencimiento).toISOString().split("T")[0]
          : ""
        console.log(response.data)
        setFormData({
          nombre: response.data.nombre || "",
          categoria: response.data.categoria?.id_categoria || "",
          precio: response.data.precio?.toString() || "",
          fechaVencimiento: fechaVencimiento,
          imagen: null,
          contenido_nto: response.data.contenido_nto || 0.0,
          seccion: response.data.seccion || "",
          unidad: response.data.unidad || "",
          precio_por_kilo: response.data.precio_por_kilo === "1" || response.data.precio_por_kilo === true,
          url: response.data.imagen
        })

        // Si hay una URL de imagen, la guardamos para mostrarla
        if (response.data.imagen_url) {
          setImagenPreview(response.data.imagen_url)
        } else if (response.data.imagen) {
          setImagenPreview(response.data.imagen)
        }

        setError(null)
      } catch (error) {
        console.error("Error al cargar el producto:", error)
        setError("Error al cargar los datos del producto")
      } finally {
        setLoading(false)
      }
    }

    const getCategories = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/categorias`)
        setCategorias(response.data)
      } catch (error) {
        console.error("Error al cargar las categorías:", error)
      }
    }

    fetchProducto()
    getCategories()
  }, [id])

  const handleChange = (e) => {
      const { name, value, type, checked } = e.target
      console.log(name,value,type,checked)
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Limpiar el error del campo cuando el usuario lo modifica
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }))
    }
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({
        ...prev,
        imagen: file,
        url:null
      }))
      setImagenPreview(URL.createObjectURL(file))
    }
  }

  const validateForm = () => {
    
    
    const errors = {}

    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del producto es obligatorio"
    }

    if (!formData.categoria) {
      errors.categoria = "La categoría es obligatoria"
    }

    if (!formData.precio || isNaN(formData.precio) || Number(formData.precio) <= 0) {
      errors.precio = "El precio debe ser un número mayor que cero"
    }

    if (!formData.fechaVencimiento) {
      errors.fechaVencimiento = "La fecha de vencimiento es obligatoria"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(categorias)
    console.log(formData.categoria)
    const categoria = categorias.find((cat)=>
       {console.log(typeof cat.id_categoria,typeof formData.categoria);
        return cat.id_categoria ===  parseInt(formData.categoria)}
    )
    console.log(categoria)
    console.log(formData)
    if (!validateForm()) {
      return
    }

    setSaving(true)

    try {
      const formDataToSend = new FormData()
      console.log(producto.imagen)
      
      console.log(formData.url)
      // return
      formDataToSend.append("nombre", formData.nombre)
      formDataToSend.append("id_categoria", categoria.id_categoria)
      formDataToSend.append("precio", formData.precio)
      formDataToSend.append("fecha_vencimiento", formData.fechaVencimiento)
      formDataToSend.append("contenido_nto", formData.contenido_nto)
      formDataToSend.append("seccion", formData.seccion)
      formDataToSend.append("unidad", formData.unidad)
      formDataToSend.append("precio_por_kilo", formData.precio_por_kilo ? "1" : "0")

      if (producto.imagen && formData.url === null){
        const public_id = producto.imagen.split('/').pop().split('.')[0];
        console.log(public_id)
        formDataToSend.append("public_id", public_id)
      }
      if (formData.imagen) {
        formDataToSend.append("imagen", formData.imagen)
      }

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }

      const res = await axios.patch(`${import.meta.env.VITE_API_URL}/productos/${id}`, formDataToSend, config)
      console.log(formDataToSend, formData)
      console.log(res)
      if (res.status === 200) {
        setProducto(res.data)
        // Redirigir a la página de detalle del producto
        // navigate(`/products/${id}`)
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error)
      setError("Error al guardar los cambios. Por favor, inténtelo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    navigate(`/products/${id}`)
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

  if (error && !producto) {
    return (
      <div className="w-full mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-5xl mb-4">
            <AlertCircle className="mx-auto" size={48} />
          </div>
          <p className="text-lg text-red-500 mb-6">{error}</p>
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

  return (
    <div className="w-full mx-auto bg-gray-50 min-h-screen">
      {/* Barra superior */}
      <div className="p-4 border-b bg-white flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <button
          onClick={handleCancel}
          className="flex items-center gap-2 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 bg-[#f2f2f2]"
        >
          <ArrowLeft size={20} />
          <span>Cancelar</span>
        </button>

        <h1 className="text-xl font-semibold text-center text-gray-800">Editar Producto</h1>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-md hover:bg-[#8e6762] bg-[#a67a76] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <Save size={18} />
          <span>{saving ? "Guardando..." : "Guardar"}</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Sección de imagen */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium mb-4 text-gray-800">Imagen del producto</h2>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-full md:w-1/3">
                <div className="aspect-square rounded-lg overflow-hidden flex items-center justify-center bg-gray-50 border border-gray-200">
                  {imagenPreview ? (
                    <img
                      src={imagenPreview || "/placeholder.svg"}
                      alt="Vista previa"
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-center p-4">
                      <Upload size={48} className="mx-auto mb-2 opacity-30" />
                      <p>Sin imagen</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <p className="text-sm text-gray-600 mb-3">
                  Sube una imagen del producto. Se recomienda una imagen cuadrada de al menos 500x500 píxeles.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => document.getElementById("imagen-input").click()}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center"
                  >
                    <Upload size={16} className="mr-2" />
                    {imagenPreview ? "Cambiar imagen" : "Subir imagen"}
                  </button>

                  {imagenPreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagenPreview(null)
                        setFormData((prev) => ({ ...prev, imagen: null }))
                        setFormData((prev) => ({ ...prev, url: null }))

                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 flex items-center"
                    >
                      <X size={16} className="mr-2" />
                      Eliminar imagen
                    </button>
                  )}

                  <input
                    id="imagen-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Información básica */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium mb-4 text-gray-800">Información básica</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`w-full px-3 py-2 border ${formErrors.nombre ? "border-red-500" : "border-gray-300"} rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent bg-white`}
                  required
                />
                {formErrors.nombre && <p className="mt-1 text-sm text-red-500">{formErrors.nombre}</p>}
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${formErrors.categoria ? "border-red-500" : "border-gray-300"} bg-white text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent`}
                  required
                >
                  <option value="" disabled>
                    Seleccionar categoría
                  </option>
                  {categorias.map((categoria) => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
                {formErrors.categoria && <p className="mt-1 text-sm text-red-500">{formErrors.categoria}</p>}
              </div>

              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (CLP) <span className="text-red-500">*</span>
                </label>
                <input
                  id="precio"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  type="number"
                  placeholder="Ej: 1700"
                  className={`w-full px-3 py-2 border ${formErrors.precio ? "border-red-500" : "border-gray-300"} text-gray-700 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent`}
                  required
                />
                {formErrors.precio && <p className="mt-1 text-sm text-red-500">{formErrors.precio}</p>}
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
                  className={`w-full px-3 py-2 border ${formErrors.fechaVencimiento ? "border-red-500" : "border-gray-300"} rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent`}
                  required
                />
                {formErrors.fechaVencimiento && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.fechaVencimiento}</p>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-medium mb-4 text-gray-800">Información adicional</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
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
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-white text-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
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
                  className="w-full px-3 py-2 border text-gray-700 border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#a67a76] focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center">
                <input
                  id="precio_por_kilo"
                  name="precio_por_kilo"
                  type="checkbox"
                  checked={formData.precio_por_kilo}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#a67a76] focus:ring-[#a67a76] border-gray-300 rounded"
                />
                <label htmlFor="precio_por_kilo" className="ml-2 block text-sm text-gray-700">
                  Precio por kilo
                </label>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="p-6 bg-gray-50 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              disabled={saving}
              className="sm:w-auto w-full bg-[#a67a76] hover:bg-[#8e6762] text-white px-6 py-2 rounded-md disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="sm:w-auto w-full border border-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditarProducto

