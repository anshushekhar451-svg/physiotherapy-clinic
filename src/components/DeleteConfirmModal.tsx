'use client'

import { AlertCircle } from 'lucide-react'

interface DeleteConfirmModalProps {
  title: string
  message: string
  itemName?: string
  isOpen: boolean
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteConfirmModal({
  title,
  message,
  itemName,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>

          <p className="text-gray-600 mb-2">{message}</p>
          {itemName && (
            <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded mb-4">
              <strong>Item:</strong> {itemName}
            </p>
          )}

          <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {isLoading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
