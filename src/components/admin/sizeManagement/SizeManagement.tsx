import React, { useState, useEffect } from "react";
import { Size } from "../../../types";
import { sizeAPI } from "../../../api/api";
import SizeList from "./SizeList";
import SizeForm from "./SizeForm";

const SizeManagement: React.FC = () => {
  const [sizes, setSizes] = useState<Size[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSize, setEditingSize] = useState<Size | null>(null);

  // Fetch sizes on component mount
  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await sizeAPI.getAll();
      const sizesData = (response.data as any)?.data || [];

      setSizes(Array.isArray(sizesData) ? sizesData : []);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch sizes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSize = () => {
    setEditingSize(null);
    setShowForm(true);
  };

  const handleEditSize = (size: Size) => {
    setEditingSize(size);
    setShowForm(true);
  };

  const handleDeleteSize = async (sizeId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this size? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await sizeAPI.delete(sizeId);
      fetchSizes(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete size");
    }
  };

  const handleFormSubmit = async (sizeData: {
    name: string;
    code: string;
    order?: number;
  }) => {
    try {
      if (editingSize) {
        await sizeAPI.update(editingSize._id, sizeData);
      } else {
        await sizeAPI.create(sizeData);
      }
      setShowForm(false);
      setEditingSize(null);
      fetchSizes(); // Refresh the list
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save size");
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingSize(null);
  };

  if (loading && sizes.length === 0) {
    return (
      <div>
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Size Management
          </h1>
          <p className="text-gray-600 text-sm">
            Manage product sizes for your inventory
          </p>
        </div>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-gray-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Size Management
            </h1>
            <p className="text-gray-600 text-sm">
              Manage product sizes for your inventory
            </p>
          </div>
          <button
            onClick={handleAddSize}
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add New Size
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sizes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sizes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Sizes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {sizes.filter((size) => size.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Inactive Sizes
              </p>
              <p className="text-2xl font-semibold text-gray-900">
                {sizes.filter((size) => !size.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Size Form Modal */}
      {showForm && (
        <SizeForm
          size={editingSize}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}

      {/* Size List */}
      <SizeList
        sizes={sizes}
        onEdit={handleEditSize}
        onDelete={handleDeleteSize}
        loading={loading}
      />
    </div>
  );
};

export default SizeManagement;
