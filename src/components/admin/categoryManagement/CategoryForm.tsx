import React, { useState, useEffect } from "react";
import { Category } from "../../../types";
import { categoryAPI } from "../../../api/api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface CategoryFormProps {
  category?: Category | null;
  onSubmit: (data: {
    name: string;
    description?: string;
    thumbnailImage?: string;
    thumbnailImagePublicId?: string;
  }) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [thumbnailImage, setThumbnailImage] = useState<string>("");
  const [thumbnailImagePublicId, setThumbnailImagePublicId] =
    useState<string>("");

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
      });
      if (category.thumbnailImage) {
        setImagePreview(category.thumbnailImage);
        setThumbnailImage(category.thumbnailImage);
        setThumbnailImagePublicId(category.thumbnailImagePublicId || "");
      }
    }
  }, [category]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size must be less than 5MB",
        }));
        return;
      }

      setSelectedImage(file);
      setErrors((prev) => ({ ...prev, image: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (
    file: File
  ): Promise<{ url: string; publicId: string }> => {
    try {
      setUploadingImage(true);
      const response = await categoryAPI.uploadImage(file);
      return {
        url: (response.data as any).data.url,
        publicId: (response.data as any).data.publicId,
      };
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to upload image"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let finalThumbnailImage = thumbnailImage;
      let finalThumbnailImagePublicId = thumbnailImagePublicId;

      // Upload new image if selected
      if (selectedImage) {
        const uploadResult = await uploadImage(selectedImage);
        finalThumbnailImage = uploadResult.url;
        finalThumbnailImagePublicId = uploadResult.publicId;
      }

      onSubmit({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        thumbnailImage: finalThumbnailImage || undefined,
        thumbnailImagePublicId: finalThumbnailImagePublicId || undefined,
      });
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, image: error.message }));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    setThumbnailImage("");
    setThumbnailImagePublicId("");
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  return (
    <Modal isOpen={true} onClose={onCancel} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {category ? "Edit Category" : "Add New Category"}
        </ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div>
              <Input
                type="text"
                name="name"
                label="Category Name"
                placeholder="Enter category name"
                value={formData.name}
                onChange={handleInputChange}
                isInvalid={!!errors.name}
                errorMessage={errors.name}
                isRequired
                classNames={{
                  inputWrapper: "border-gray-200 hover:border-gray-300",
                  input: "focus:ring-0 focus:outline-none",
                }}
              />
            </div>

            {/* Description */}
            <div>
              <Textarea
                name="description"
                label="Description"
                placeholder="Enter category description (optional)"
                value={formData.description}
                onChange={handleInputChange}
                minRows={4}
                classNames={{
                  inputWrapper: "border-gray-200 hover:border-gray-300",
                  input: "focus:ring-0 focus:outline-none",
                }}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category Image
              </label>
              <div className="space-y-4">
                {/* Image Preview */}
                {imagePreview && (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Category preview"
                      className="w-32 h-32 object-cover rounded-lg border border-default-200"
                    />
                    <Button
                      isIconOnly
                      size="sm"
                      color="danger"
                      variant="solid"
                      className="absolute -top-2 -right-2"
                      onClick={removeImage}>
                      <Icon icon="lucide:x" className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-default-300 rounded-lg cursor-pointer bg-default-50 hover:bg-default-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Icon
                        icon="lucide:upload"
                        className="w-8 h-8 mb-4 text-default-500"
                      />
                      <p className="mb-2 text-sm text-default-500">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-default-500">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
                {errors.image && (
                  <p className="text-sm text-danger">{errors.image}</p>
                )}
                {uploadingImage && (
                  <div className="flex items-center text-sm text-primary">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mr-2"></div>
                    Uploading image...
                  </div>
                )}
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onCancel}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={uploadingImage}
            disabled={uploadingImage}
            className="bg-gray-900 text-white">
            {category ? "Update Category" : "Create Category"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CategoryForm;
