// "use client"

import { AlertCircle, Loader2 } from 'lucide-react'

export const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, productName, loadingDelete }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md w-full animate-in fade-in duration-200">
        <div className="text-red-500 text-5xl mb-4">
          <AlertCircle className="mx-auto" size={48} />
        </div>
        <h2 className="text-xl font-bold mb-2">Confirmar eliminación</h2>
        <p className="text-gray-700 mb-6">
          ¿Estás seguro que deseas eliminar el producto <span className="font-semibold">{productName}</span>? Esta
          acción no se puede deshacer.
        </p>
        
        {loadingDelete ? (
          <div className="flex flex-col items-center justify-center py-2">
            <Loader2 className="h-8 w-8 text-red-500 animate-spin mb-2" />
            <p className="text-gray-600">Eliminando producto...</p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onClose}
              disabled={loadingDelete}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 py-2 px-4 rounded-md flex justify-center items-center"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loadingDelete}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md flex justify-center items-center"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
