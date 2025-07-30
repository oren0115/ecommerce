import React, { useState, useEffect } from "react";
import { Size } from "../../../types";

interface SizeFormProps {
  size?: Size | null;
  onSubmit: (data: { name: string; code: string; order?: number }) => void;
  onCancel: () => void;
}

const SizeForm: React.FC<SizeFormProps> = ({ size, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    order: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (size) {
      setFormData({
        name: size.name,
        code: size.code,
        order: size.order,
      });
    }
  }, [size]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "code" ? value.toUpperCase() : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Size name is required";
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = "Size name must be at least 2 characters";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Size code is required";
    }

    if (formData.code.trim().length < 1) {
      newErrors.code = "Size code must be at least 1 character";
    }

    if (formData.code.trim().length > 10) {
      newErrors.code = "Size code must be less than 10 characters";
    }

    if (formData.order < 0) {
      newErrors.order = "Order must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      code: formData.code.trim(),
      order: formData.order,
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {size ? "Edit Size" : "Add New Size"}
            </h3>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Size Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Extra Small, Small, Medium"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Size Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Size Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., XS, S, M, L, XL"
                maxLength={10}
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Code will be automatically converted to uppercase
              </p>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleInputChange}
                min="0"
                className={`w-full px-3 py-2 border rounded-md text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.order ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">{errors.order}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Lower numbers appear first in lists
              </p>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {size ? "Update Size" : "Create Size"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SizeForm;
