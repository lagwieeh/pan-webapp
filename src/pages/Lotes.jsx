"use client"

import React, { useState } from "react"
import {
  ClipboardList,
  Search,
  Plus,
  ChevronDown,
  ChevronUp,
  Filter,
  Package,
  Calendar,
  Truck,
  BarChart4,
  SortAsc,
  SortDesc,
  ArrowLeft,
} from "lucide-react"

// Sample data based on the provided images
const sampleLotes = [
  {
    id_lote: 1,
    nombre_proveedor: "TRANSGLOBAL CALAMA SPA.",
    fecha_recepcion: "2023-10-15",
    total_productos: 10,
    estado: "Activo",
  },
  {
    id_lote: 2,
    nombre_proveedor: "TRANSGLOBAL CALAMA SPA.",
    fecha_recepcion: "2023-11-20",
    total_productos: 5,
    estado: "Activo",
  },
  {
    id_lote: 3,
    nombre_proveedor: "DISTRIBUIDORA NORTE SUR",
    fecha_recepcion: "2023-12-05",
    total_productos: 8,
    estado: "Activo",
  },
  {
    id_lote: 4,
    nombre_proveedor: "COMERCIAL ANDINA LTDA.",
    fecha_recepcion: "2024-01-10",
    total_productos: 12,
    estado: "Activo",
  },
]

const sampleLineasProducto = [
  {
    id_linea_producto: 1,
    fecha_vencimiento: "2025-03-28",
    cantidad: 4,
    marca: "SOPROLE",
    codigo_barras: "7802575220127",
    id_lote: 1,
  },
  {
    id_linea_producto: 2,
    fecha_vencimiento: "2025-04-15",
    cantidad: 6,
    marca: "COLUN",
    codigo_barras: "7801234567890",
    id_lote: 1,
  },
  {
    id_linea_producto: 3,
    fecha_vencimiento: "2024-12-10",
    cantidad: 10,
    marca: "NESTLÉ",
    codigo_barras: "7809876543210",
    id_lote: 2,
  },
  {
    id_linea_producto: 4,
    fecha_vencimiento: "2024-11-05",
    cantidad: 5,
    marca: "WATTS",
    codigo_barras: "7805432109876",
    id_lote: 3,
  },
  {
    id_linea_producto: 5,
    fecha_vencimiento: "2025-02-20",
    cantidad: 8,
    marca: "SOPROLE",
    codigo_barras: "7802575220134",
    id_lote: 3,
  },
]

const Lotes = () => {
  const [expandedLote, setExpandedLote] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("id_lote")
  const [sortDirection, setSortDirection] = useState("asc")
  const [filterProvider, setFilterProvider] = useState("")
  const [viewMode, setViewMode] = useState("cards") // 'cards' or 'list'

  const toggleLoteExpansion = (loteId) => {
    if (expandedLote === loteId) {
      setExpandedLote(null)
    } else {
      setExpandedLote(loteId)
    }
  }

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Get unique providers for filter dropdown
  const uniqueProviders = [...new Set(sampleLotes.map((lote) => lote.nombre_proveedor))]

  // Filter lotes based on search term and provider filter
  const filteredLotes = sampleLotes.filter(
    (lote) =>
      (lote.nombre_proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lote.id_lote.toString().includes(searchTerm)) &&
      (filterProvider === "" || lote.nombre_proveedor === filterProvider),
  )

  // Sort lotes based on sort field and direction
  const sortedLotes = [...filteredLotes].sort((a, b) => {
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1
    } else {
      return a[sortField] < b[sortField] ? 1 : -1
    }
  })

  // Calculate summary statistics
  const totalLotes = sampleLotes.length
  const totalProductos = sampleLotes.reduce((sum, lote) => sum + lote.total_productos, 0)
  const totalProveedores = uniqueProviders.length

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-1 bg-[#f8f5f4] hover:bg-[#e9e4e3] text-[#7d4b45] px-4 py-2 rounded-lg transition-colors mr-3"
        >
          <ArrowLeft size={18} />
          Volver
        </button>
        <h1 className="text-2xl font-bold text-[#7d4b45] mb-4 md:mb-0">
          <ClipboardList className="inline-block mr-2" />
          Gestión de Lotes
        </h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por proveedor o ID"
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9d7871] w-full sm:w-auto"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center justify-center gap-1 bg-[#9d7871] hover:bg-[#7d4b45] text-white px-4 py-2 rounded-lg transition-colors">
            <Plus size={18} />
            Nuevo Lote
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4 flex items-center">
          <div className="bg-[#f8f5f4] p-3 rounded-lg mr-4">
            <ClipboardList size={24} className="text-[#7d4b45]" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Lotes</p>
            <p className="text-2xl font-bold text-[#7d4b45]">{totalLotes}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center">
          <div className="bg-[#f8f5f4] p-3 rounded-lg mr-4">
            <Package size={24} className="text-[#7d4b45]" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Productos</p>
            <p className="text-2xl font-bold text-[#7d4b45]">{totalProductos}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-4 flex items-center">
          <div className="bg-[#f8f5f4] p-3 rounded-lg mr-4">
            <Truck size={24} className="text-[#7d4b45]" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Proveedores</p>
            <p className="text-2xl font-bold text-[#7d4b45]">{totalProveedores}</p>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#7d4b45]" />
          <span className="text-[#7d4b45] font-medium">Filtrar por:</span>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9d7871]"
            value={filterProvider}
            onChange={(e) => setFilterProvider(e.target.value)}
          >
            <option value="">Todos los proveedores</option>
            {uniqueProviders.map((provider) => (
              <option key={provider} value={provider}>
                {provider}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7d4b45] font-medium">Ordenar por:</span>
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#9d7871]"
            value={sortField}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="id_lote">ID Lote</option>
            <option value="nombre_proveedor">Proveedor</option>
            <option value="fecha_recepcion">Fecha</option>
            <option value="total_productos">Cantidad</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="border rounded-lg p-2 hover:bg-gray-100"
          >
            {sortDirection === "asc" ? <SortAsc size={18} /> : <SortDesc size={18} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#7d4b45] font-medium">Vista:</span>
          <div className="flex border rounded-lg overflow-hidden">
            <button
              className={`px-3 py-2 ${viewMode === "cards" ? "bg-[#f8f5f4] text-[#7d4b45]" : "bg-white text-gray-500"}`}
              onClick={() => setViewMode("cards")}
            >
              Tarjetas
            </button>
            <button
              className={`px-3 py-2 ${viewMode === "list" ? "bg-[#f8f5f4] text-[#7d4b45]" : "bg-white text-gray-500"}`}
              onClick={() => setViewMode("list")}
            >
              Lista
            </button>
          </div>
        </div>
      </div>

      {/* Lotes Cards/List */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedLotes.map((lote) => (
            <div key={lote.id_lote} className="bg-white rounded-xl shadow overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block bg-[#f8f5f4] text-[#7d4b45] px-2 py-1 rounded-lg text-sm font-medium mb-2">
                      Lote #{lote.id_lote}
                    </span>
                    <h3 className="font-bold text-lg text-[#7d4b45] mb-1">{lote.nombre_proveedor}</h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar size={14} className="mr-1" />
                      {lote.fecha_recepcion}
                    </div>
                  </div>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {lote.estado}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Package size={16} className="text-[#9d7871] mr-1" />
                    <span className="text-gray-600">{lote.total_productos} productos</span>
                  </div>
                  <button
                    onClick={() => toggleLoteExpansion(lote.id_lote)}
                    className="text-[#9d7871] hover:text-[#7d4b45] flex items-center text-sm font-medium"
                  >
                    {expandedLote === lote.id_lote ? (
                      <>
                        <ChevronUp size={16} className="mr-1" /> Ocultar detalles
                      </>
                    ) : (
                      <>
                        <ChevronDown size={16} className="mr-1" /> Ver detalles
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded Product Lines */}
              {expandedLote === lote.id_lote && (
                <div className="bg-gray-50 p-4">
                  <h4 className="font-medium mb-3 text-[#7d4b45] flex items-center">
                    <BarChart4 size={16} className="mr-2" />
                    Líneas de Productos
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                      <thead className="bg-[#f8f5f4] text-[#7d4b45] text-sm">
                        <tr>
                          <th className="py-2 px-3 text-left">ID</th>
                          <th className="py-2 px-3 text-left">Vencimiento</th>
                          <th className="py-2 px-3 text-left">Cant.</th>
                          <th className="py-2 px-3 text-left">Marca</th>
                          <th className="py-2 px-3 text-left">Código</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {sampleLineasProducto
                          .filter((linea) => linea.id_lote === lote.id_lote)
                          .map((linea) => (
                            <tr key={linea.id_linea_producto} className="border-t hover:bg-[#fffef5]">
                              <td className="py-2 px-3">{linea.id_linea_producto}</td>
                              <td className="py-2 px-3">{linea.fecha_vencimiento}</td>
                              <td className="py-2 px-3">{linea.cantidad}</td>
                              <td className="py-2 px-3">{linea.marca}</td>
                              <td className="py-2 px-3">{linea.codigo_barras}</td>
                            </tr>
                          ))}
                        {sampleLineasProducto.filter((linea) => linea.id_lote === lote.id_lote).length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-4 text-center text-gray-500">
                              No hay líneas de productos para este lote
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}

          {sortedLotes.length === 0 && (
            <div className="col-span-full bg-white rounded-xl shadow p-8 text-center text-gray-500">
              No se encontraron lotes que coincidan con los criterios de búsqueda
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#f8f5f4] text-[#7d4b45]">
              <tr>
                <th className="py-3 px-4 text-left">ID Lote</th>
                <th className="py-3 px-4 text-left">Proveedor</th>
                <th className="py-3 px-4 text-left">Fecha Recepción</th>
                <th className="py-3 px-4 text-left">Total Productos</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedLotes.map((lote) => (
                <React.Fragment key={lote.id_lote}>
                  <tr className="border-b hover:bg-[#fffef5]">
                    <td className="py-3 px-4">{lote.id_lote}</td>
                    <td className="py-3 px-4">{lote.nombre_proveedor}</td>
                    <td className="py-3 px-4">{lote.fecha_recepcion}</td>
                    <td className="py-3 px-4">{lote.total_productos}</td>
                    <td className="py-3 px-4">
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        {lote.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => toggleLoteExpansion(lote.id_lote)}
                        className="text-[#9d7871] hover:text-[#7d4b45] inline-flex items-center"
                      >
                        {expandedLote === lote.id_lote ? (
                          <>
                            <ChevronUp size={16} className="mr-1" /> Ocultar
                          </>
                        ) : (
                          <>
                            <ChevronDown size={16} className="mr-1" /> Ver líneas
                          </>
                        )}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Product Lines */}
                  {expandedLote === lote.id_lote && (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <div className="bg-gray-50 p-4">
                          <h4 className="font-medium mb-3 text-[#7d4b45] flex items-center">
                            <BarChart4 size={16} className="mr-2" />
                            Líneas de Productos
                          </h4>

                          <div className="overflow-x-auto">
                            <table className="min-w-full bg-white rounded-lg overflow-hidden">
                              <thead className="bg-[#f8f5f4] text-[#7d4b45] text-sm">
                                <tr>
                                  <th className="py-2 px-3 text-left">ID</th>
                                  <th className="py-2 px-3 text-left">Vencimiento</th>
                                  <th className="py-2 px-3 text-left">Cant.</th>
                                  <th className="py-2 px-3 text-left">Marca</th>
                                  <th className="py-2 px-3 text-left">Código</th>
                                </tr>
                              </thead>
                              <tbody className="text-sm">
                                {sampleLineasProducto
                                  .filter((linea) => linea.id_lote === lote.id_lote)
                                  .map((linea) => (
                                    <tr key={linea.id_linea_producto} className="border-t hover:bg-[#fffef5]">
                                      <td className="py-2 px-3">{linea.id_linea_producto}</td>
                                      <td className="py-2 px-3">{linea.fecha_vencimiento}</td>
                                      <td className="py-2 px-3">{linea.cantidad}</td>
                                      <td className="py-2 px-3">{linea.marca}</td>
                                      <td className="py-2 px-3">{linea.codigo_barras}</td>
                                    </tr>
                                  ))}
                                {sampleLineasProducto.filter((linea) => linea.id_lote === lote.id_lote).length ===
                                  0 && (
                                  <tr>
                                    <td colSpan={5} className="py-4 text-center text-gray-500">
                                      No hay líneas de productos para este lote
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}

              {sortedLotes.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500">
                    No se encontraron lotes que coincidan con los criterios de búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Lotes

