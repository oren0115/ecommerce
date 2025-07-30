import React from "react";
import { Button, Input, Textarea, Card, CardBody } from "@heroui/react";

interface AddressFormData {
  shippingAddress: string;
  city: string;
  postalCode: string;
}

interface AddressFormProps {
  formData: AddressFormData;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
}

const AddressForm: React.FC<AddressFormProps> = ({
  formData,
  onInputChange,
}) => {
  return (
    <Card>
      <CardBody className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Informasi Alamat
        </h3>

        <div className="space-y-4">
          {/* Alamat Lengkap */}
          <div>
            <Textarea
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={onInputChange}
              label="Alamat Lengkap"
              placeholder="Masukkan alamat lengkap"
              variant="bordered"
              minRows={3}
              className="w-full"
              classNames={{
                input: "focus:outline-none",
              }}
            />
          </div>

          {/* Kota */}
          <div>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={onInputChange}
              label="Kota"
              placeholder="Masukkan nama kota"
              variant="bordered"
              className="w-full"
              classNames={{
                input: "focus:outline-none",
              }}
            />
          </div>

          {/* Kode Pos */}
          <div>
            <Input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={onInputChange}
              label="Kode Pos"
              placeholder="Masukkan kode pos"
              variant="bordered"
              className="w-full"
              classNames={{
                input: "focus:outline-none",
              }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="solid" className="px-6 py-2 bg-gray-900 text-white">
            Simpan Alamat
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default AddressForm;
