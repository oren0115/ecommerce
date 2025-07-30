import React, { useState, useEffect } from "react";
import { PromotionalSlide, CreatePromotionalSlideData } from "../../../types";
import { promotionalCarouselAPI } from "../../../api/api";
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";

interface PromotionalCarouselFormProps {
  slide?: PromotionalSlide | null;
  onSubmit: (data: CreatePromotionalSlideData) => void;
  onCancel: () => void;
}

const PromotionalCarouselForm: React.FC<PromotionalCarouselFormProps> = ({
  slide,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreatePromotionalSlideData>({
    title: "",
    subtitle: "",
    description: "",
    date: "",
    image: { url: "", publicId: "" },
    buttonText: "",
    backgroundColor: "",
    textColor: "#ffffff",
    status: "active",
    order: 0,
    linkUrl: "",
    startDate: "",
    endDate: "",
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (slide) {
      setFormData({
        title: slide.title,
        subtitle: slide.subtitle,
        description: slide.description,
        date: slide.date || "",
        image: slide.image,
        buttonText: slide.buttonText,
        backgroundColor: slide.backgroundColor,
        textColor: slide.textColor,
        status: slide.status,
        order: slide.order,
        linkUrl: slide.linkUrl || "",
        startDate: slide.startDate || "",
        endDate: slide.endDate || "",
      });
    }
  }, [slide]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await promotionalCarouselAPI.uploadImage(file);

      if ((response.data as any).success) {
        setFormData((prev) => ({
          ...prev,
          image: {
            url: (response.data as any).data.url,
            publicId: (response.data as any).data.publicId,
          },
        }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrors((prev) => ({
        ...prev,
        image: "Failed to upload image",
      }));
    } finally {
      setUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.subtitle.trim()) newErrors.subtitle = "Subtitle is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.buttonText.trim())
      newErrors.buttonText = "Button text is required";
    if (!formData.image.url) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Prepare data with default values for fields not in form but required by backend
      const submitData = {
        ...formData,
        backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        textColor: "#ffffff",
        order: 0,
        linkUrl: "",
        date: "",
        startDate: "",
        endDate: "",
      };


      onSubmit(submitData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                isIconOnly
                variant="light"
                onPress={onCancel}
                className="text-gray-600 hover:text-gray-800">
                <Icon icon="ph:arrow-left-duotone" className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {slide
                    ? "Edit Promotional Slide"
                    : "Create New Promotional Slide"}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {slide
                    ? "Update the promotional slide details"
                    : "Add a new promotional slide to your carousel"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <form className="p-8 space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>

              <Input
                name="title"
                label="Title"
                placeholder="Enter slide title"
                value={formData.title}
                onChange={handleInputChange}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "border-gray-200 hover:border-gray-300 focus-within:border-gray-900 focus-within:ring-gray-900",
                  input:
                    "focus:outline-none text-gray-900 placeholder:text-gray-400",
                  label: "text-gray-700",
                }}
              />

              <Input
                name="subtitle"
                label="Subtitle"
                placeholder="Enter subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                isInvalid={!!errors.subtitle}
                errorMessage={errors.subtitle}
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "border-gray-200 hover:border-gray-300 focus-within:border-gray-900 focus-within:ring-gray-900",
                  input:
                    "focus:outline-none text-gray-900 placeholder:text-gray-400",
                  label: "text-gray-700",
                }}
              />

              <Textarea
                name="description"
                label="Description"
                placeholder="Enter description"
                value={formData.description}
                onChange={handleInputChange}
                isInvalid={!!errors.description}
                errorMessage={errors.description}
                variant="bordered"
                minRows={3}
                classNames={{
                  inputWrapper:
                    "border-gray-200 hover:border-gray-300 focus-within:border-gray-900 focus-within:ring-gray-900",
                  input:
                    "focus:outline-none text-gray-900 placeholder:text-gray-400",
                  label: "text-gray-700",
                }}
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Image
              </h3>

              {formData.image.url ? (
                <div className="relative group">
                  <img
                    src={formData.image.url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        image: { url: "", publicId: "" },
                      }))
                    }
                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon icon="ph:x-duotone" className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center hover:border-gray-300 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-3">
                      <Icon
                        icon="ph:image-duotone"
                        className="w-12 h-12 text-gray-400"
                      />
                      <span className="text-lg text-gray-600">
                        {uploading ? "Uploading..." : "Click to upload image"}
                      </span>
                      <span className="text-sm text-gray-500">
                        JPG, PNG, WebP up to 5MB
                      </span>
                    </div>
                  </label>
                </div>
              )}
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image}</p>
              )}
            </div>

            {/* Button */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Button
              </h3>

              <Input
                name="buttonText"
                label="Button Text"
                placeholder="Shop Now"
                value={formData.buttonText}
                onChange={handleInputChange}
                isInvalid={!!errors.buttonText}
                errorMessage={errors.buttonText}
                variant="bordered"
                classNames={{
                  inputWrapper:
                    "border-gray-200 hover:border-gray-300 focus-within:border-gray-900 focus-within:ring-gray-900",
                  input:
                    "focus:outline-none text-gray-900 placeholder:text-gray-400",
                  label: "text-gray-700",
                }}
              />
            </div>

            {/* Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Status
              </h3>

              <Select
                name="status"
                label="Status"
                selectedKeys={formData.status ? [formData.status] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  setFormData((prev) => ({
                    ...prev,
                    status: selectedKey as "active" | "inactive",
                  }));
                }}
                variant="bordered"
                classNames={{
                  trigger:
                    "border-gray-200 hover:border-gray-300 focus-within:border-gray-900 focus-within:ring-gray-900",
                  label: "text-gray-700",
                }}>
                <SelectItem key="active">Active</SelectItem>
                <SelectItem key="inactive">Inactive</SelectItem>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
              <Button
                variant="light"
                onPress={onCancel}
                className="text-gray-600 hover:text-gray-800">
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                className="bg-gray-900 hover:bg-gray-800">
                {slide ? "Update Slide" : "Create Slide"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PromotionalCarouselForm;
