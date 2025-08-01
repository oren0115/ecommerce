import React, {
  useState,
  useEffect,
  DragEvent,
  ChangeEvent,
  FormEvent,
} from "react";
import { Product, Category, CreateProductData, ProductImage } from "@/types";
import { productAPI } from "@/api/api";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Card,
  CardBody,
  Alert,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import SafeImage from "../../common/SafeImage";

interface ProductFormProps {
  product?: Product | null;
  categories: Category[];
  onSubmit: (data: CreateProductData) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  categories,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    price: 0,
    description: "",
    detail: "",
    images: [],
    categoryIds: [],
    stock: 0,
    discountPercent: 0,
    tags: [],
    attributes: {},
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"basic" | "media" | "details">(
    "basic"
  );
  const [removedImageIndexes, setRemovedImageIndexes] = useState<number[]>([]); // Track removed images

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description || "",
        detail: product.detail || "",
        images: product.images || [],
        categoryIds: product.categoryIds.map((c) => c._id),
        stock: product.stock,
        discountPercent: product.discountPercent,
        tags: product.tags || [],
        attributes: product.attributes || {},
      });
      setPreviews(product.images?.map((img) => img.url) || []);
      setImageFiles([]);
      setRemovedImageIndexes([]); // Reset removed indexes
    } else {
      setFormData({
        name: "",
        price: 0,
        description: "",
        detail: "",
        images: [],
        categoryIds: [],
        stock: 0,
        discountPercent: 0,
        tags: [],
        attributes: {},
      });
      setPreviews([]);
      setImageFiles([]);
      setRemovedImageIndexes([]);
    }
  }, [product]);

  // Cleanup effect to ensure imageFiles array is valid
  useEffect(() => {
    const validImageFiles = imageFiles.filter(
      (file) => file && file instanceof File
    );
    if (validImageFiles.length !== imageFiles.length) {
      setImageFiles(validImageFiles);
    }
  }, [imageFiles]);

  const handleInputChange = (name: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [name]: ["price", "stock", "discountPercent"].includes(name)
        ? Number(value)
        : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCategoryChange = (selectedKeys: any) => {
    const selected = Array.from(selectedKeys) as string[];
    setFormData((p) => ({ ...p, categoryIds: selected }));
    if (errors.categoryIds) setErrors((p) => ({ ...p, categoryIds: "" }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type:", file.type);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      console.error("No valid image files selected");
      return;
    }

    setImageFiles((p) => [...p, ...validFiles]);

    const newPreviews: string[] = [];
    let processedCount = 0;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const base64 = event.target?.result as string;
          // Validate that the base64 string is properly formatted
          if (base64 && base64.startsWith("data:image/")) {
            newPreviews.push(base64);
          } else {
            console.error("Invalid base64 data for file:", file.name);
          }
        } catch (error) {
          console.error("Error processing file:", file.name, error);
        }
        processedCount++;

        if (processedCount === validFiles.length) {
          setPreviews((p) => [...p, ...newPreviews]);
        }
      };
      reader.onerror = () => {
        console.error("Error reading file:", file.name);
        processedCount++;
        if (processedCount === validFiles.length) {
          setPreviews((p) => [...p, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragStart = (e: DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newPreviews = [...previews];
    const newImageFiles = [...imageFiles];
    const draggedItem = newPreviews[draggedIndex];
    const draggedFile = newImageFiles[draggedIndex];

    // Validate that we have valid items to move
    if (draggedItem === undefined || draggedFile === undefined) {
      console.error("Invalid drag operation - undefined items detected");
      return;
    }

    newPreviews.splice(draggedIndex, 1);
    newImageFiles.splice(draggedIndex, 1);
    newPreviews.splice(dropIdx, 0, draggedItem);
    newImageFiles.splice(dropIdx, 0, draggedFile);

    setPreviews(newPreviews);
    setImageFiles(newImageFiles);
    setDraggedIndex(null);
  };

  const removeImage = (idx: number) => {
    setPreviews((p) => p.filter((_, i) => i !== idx));
    setImageFiles((p) => p.filter((_, i) => i !== idx));

    // If this is an existing image (not a new file), track it as removed
    if (idx < formData.images.length) {
      setRemovedImageIndexes((prev) => [...prev, idx]);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (formData.price <= 0) newErrors.price = "Price must be greater than 0";
    if (formData.stock < 0) newErrors.stock = "Stock cannot be negative";
    if (formData.discountPercent < 0 || formData.discountPercent > 100) {
      newErrors.discountPercent = "Discount must be between 0 and 100";
    }
    if (formData.categoryIds.length === 0)
      newErrors.categoryIds = "At least one category is required";

    // Validate image files
    const invalidFiles = imageFiles.filter(
      (file) => !file || !(file instanceof File)
    );
    if (invalidFiles.length > 0) {
      newErrors.images =
        "Some image files are invalid. Please remove and re-add them.";
      console.error("Invalid files detected:", invalidFiles);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async (file: File) => {
    const response = await productAPI.uploadImage(file);
    return (response as any)?.data?.data?.url;
  };

  const handleSubmit = async (e?: FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validate()) return;

    try {
      setUploading(true);

      // Upload new image files
      const uploadedImages: ProductImage[] = [];

      // Add existing images that weren't removed (clean URLs for backend)
      const existingImages = formData.images
        .filter((_, index) => !removedImageIndexes.includes(index)) // Filter out removed images
        .map((img, index) => ({
          ...img,
          url: img.url.split("?")[0], // Remove any query parameters
          order: index,
        }));
      uploadedImages.push(...existingImages);

      // Upload new files - filter out undefined files
      const validImageFiles = imageFiles.filter(
        (file) => file && file instanceof File
      );
      console.log("Valid image files to upload:", validImageFiles.length);

      for (const file of validImageFiles) {
        try {
          console.log("Uploading file:", file.name, file.size);
          const imageUrl = await uploadImage(file);
          if (imageUrl) {
            uploadedImages.push({
              url: imageUrl, // Don't add cache busting here - backend should store clean URLs
              order: uploadedImages.length,
            });
          }
        } catch (uploadError) {
          console.error("Failed to upload file:", file.name, uploadError);
          setErrors({
            submit: `Failed to upload image: ${file.name}. Please try again.`,
          });
          return;
        }
      }

      const submitData: CreateProductData = {
        ...formData,
        images: uploadedImages,
      };

      onSubmit(submitData);
    } catch (error) {
      console.error("Error uploading images:", error);
      setErrors({ submit: "Failed to upload images. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  const handleAttributeChange = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [key]: value },
    }));
  };

  const handleAddAttribute = () => {
    const newKey = `attribute_${Object.keys(formData.attributes || {}).length + 1}`;
    setFormData((prev) => ({
      ...prev,
      attributes: { ...(prev.attributes || {}), [newKey]: "" },
    }));
  };

  const handleRemoveAttribute = (key: string) => {
    const newAttributes = { ...formData.attributes };
    delete newAttributes[key];
    setFormData((prev) => ({ ...prev, attributes: newAttributes }));
  };

  return (
    <Modal isOpen={true} onClose={onCancel} size="4xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-semibold">
            {product ? "Edit Product" : "Add New Product"}
          </h2>
        </ModalHeader>

        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
              <Alert color="danger" variant="flat" className="mb-4">
                {errors.submit}
              </Alert>
            )}
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as any)}
              color="default"
              variant="underlined"
              classNames={{
                tabList: "gap-6",
                tab: "text-gray-500",
                tabContent: "group-data-[selected=true]:text-black",
                cursor: "bg-black",
              }}>
              <Tab key="basic" title="Basic Information">
                <div className="space-y-4 pt-4">
                  {/* Product Name */}
                  <Input
                    label="Product Name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onValueChange={(value) => handleInputChange("name", value)}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    isRequired
                    // hapus outline ring
                    classNames={{
                      input: "focus:ring-0 focus:outline-none",
                      inputWrapper: "focus:ring-0 focus:outline-none",
                    }}
                  />

                  {/* Price */}
                  <Input
                    label="Price"
                    placeholder="0"
                    type="number"
                    value={formData.price.toString()}
                    onValueChange={(value) => handleInputChange("price", value)}
                    isInvalid={!!errors.price}
                    errorMessage={errors.price}
                    startContent={<span className="text-default-400">Rp</span>}
                    isRequired
                    classNames={{
                      input: "focus:ring-0 focus:outline-none",
                      inputWrapper: "focus:ring-0 focus:outline-none",
                    }}
                  />

                  {/* Stock */}
                  <Input
                    label="Stock"
                    placeholder="0"
                    type="number"
                    value={formData.stock.toString()}
                    onValueChange={(value) => handleInputChange("stock", value)}
                    isInvalid={!!errors.stock}
                    errorMessage={errors.stock}
                    isRequired
                    classNames={{
                      input: "focus:ring-0 focus:outline-none",
                      inputWrapper: "focus:ring-0 focus:outline-none",
                    }}
                  />

                  {/* Discount */}
                  <Input
                    label="Discount Percentage"
                    placeholder="0"
                    type="number"
                    value={formData.discountPercent.toString()}
                    onValueChange={(value) =>
                      handleInputChange("discountPercent", value)
                    }
                    isInvalid={!!errors.discountPercent}
                    errorMessage={errors.discountPercent}
                    endContent={<span className="text-default-400">%</span>}
                    classNames={{
                      input: "focus:ring-0 focus:outline-none",
                      inputWrapper: "focus:ring-0 focus:outline-none",
                    }}
                  />

                  {/* Categories */}
                  <Select
                    label="Categories"
                    placeholder="Select categories"
                    selectedKeys={formData.categoryIds}
                    onSelectionChange={handleCategoryChange}
                    isInvalid={!!errors.categoryIds}
                    errorMessage={errors.categoryIds}
                    selectionMode="multiple"
                    isRequired
                    aria-label="Select product categories">
                    {Array.isArray(categories)
                      ? categories.map((category) => (
                          <SelectItem key={category._id}>
                            {category.name}
                          </SelectItem>
                        ))
                      : null}
                  </Select>

                  {/* Description */}
                  <Textarea
                    label="Description"
                    placeholder="Enter product description"
                    value={formData.description}
                    onValueChange={(value) =>
                      handleInputChange("description", value)
                    }
                    minRows={3}
                  />

                  {/* Tags */}
                  <Input
                    label="Tags"
                    placeholder="Enter tags separated by commas"
                    value={(formData.tags || []).join(", ")}
                    onValueChange={handleTagsChange}
                    description="Separate tags with commas"
                    classNames={{
                      input: "focus:ring-0 focus:outline-none",
                      inputWrapper: "focus:ring-0 focus:outline-none",
                    }}
                  />
                </div>
              </Tab>

              <Tab key="media" title="Media">
                <div className="space-y-4 pt-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Product Images
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        as="span"
                        variant="bordered"
                        startContent={<Icon icon="ph:upload-duotone" />}
                        className="w-full bg-gray-900 text-white hover:bg-gray-900">
                        Upload Images
                      </Button>
                    </label>
                    {errors.images && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.images}
                      </p>
                    )}
                  </div>

                  {/* Image Previews */}
                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {previews.map((preview, index) => (
                        <Card key={index} className="relative group">
                          <CardBody className="p-2">
                            <SafeImage
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                              fallbackSrc="https://via.placeholder.com/96x96?text=Error"
                              draggable
                              onDragStart={(e: React.DragEvent) =>
                                handleDragStart(e, index)
                              }
                              onDragOver={handleDragOver}
                              onDrop={(e: React.DragEvent) =>
                                handleDrop(e, index)
                              }
                            />
                            <Button
                              isIconOnly
                              size="sm"
                              color="danger"
                              variant="flat"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(index)}>
                              <Icon icon="ph:x" className="w-4 h-4" />
                            </Button>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Tab>

              <Tab key="details" title="Details">
                <div className="space-y-4 pt-4">
                  {/* Detail Description */}
                  <Textarea
                    label="Detailed Description"
                    placeholder="Enter detailed product description"
                    classNames={{
                      input: "focus:ring-0 focus:outline-none",
                      inputWrapper: "focus:ring-0 focus:outline-none",
                    }}
                    value={formData.detail}
                    onValueChange={(value) =>
                      handleInputChange("detail", value)
                    }
                    minRows={5}
                  />

                  {/* Attributes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium">
                        Attributes
                      </label>
                      <Button
                        size="sm"
                        variant="flat"
                        color="primary"
                        onClick={handleAddAttribute}
                        startContent={<Icon icon="ph:plus" />}>
                        Add Attribute
                      </Button>
                    </div>

                    {Object.entries(formData.attributes || {}).map(
                      ([key, value]) => (
                        <div key={key} className="flex gap-2 mb-2">
                          <Input
                            placeholder="Attribute name"
                            value={key}
                            className="flex-1"
                            isReadOnly
                            classNames={{
                              input: "focus:ring-0 focus:outline-none",
                              inputWrapper: "focus:ring-0 focus:outline-none",
                            }}
                          />
                          <Input
                            placeholder="Attribute value"
                            value={value}
                            onValueChange={(newValue) =>
                              handleAttributeChange(key, newValue)
                            }
                            className="flex-1"
                            classNames={{
                              input: "focus:ring-0 focus:outline-none",
                              inputWrapper: "focus:ring-0 focus:outline-none",
                            }}
                          />
                          <Button
                            isIconOnly
                            size="sm"
                            color="danger"
                            variant="flat"
                            onClick={() => handleRemoveAttribute(key)}>
                            <Icon icon="ph:trash" className="w-4 h-4" />
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </Tab>
            </Tabs>
          </form>
        </ModalBody>

        <ModalFooter>
          <Button variant="flat" onPress={onCancel}>
            Cancel
          </Button>
          <Button
            color="primary"
            className="bg-gray-900 text-white"
            isLoading={uploading}
            onPress={() => handleSubmit()}>
            {product ? "Update Product" : "Create Product"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductForm;
