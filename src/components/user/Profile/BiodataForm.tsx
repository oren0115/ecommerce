import React from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
} from "@heroui/react";

interface FormData {
  fullname: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
}

interface BiodataFormProps {
  formData: FormData;
  userEmail?: string;
  isLoading: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const BiodataForm: React.FC<BiodataFormProps> = ({
  formData,
  userEmail,
  isLoading,
  onInputChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardBody>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ubah Biodata Diri
          </h3>

          {/* Nama */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <Input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={onInputChange}
                label="Nama"
                placeholder="Masukkan nama lengkap"
                variant="bordered"
                className="w-full"
                classNames={{
                  input: "focus:outline-none",
                }}
              />
            </div>
          </div>

          {/* Tanggal Lahir */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <Input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={onInputChange}
                label="Tanggal Lahir"
                variant="bordered"
                className="w-full"
                classNames={{
                  input: "focus:outline-none",
                }}
              />
            </div>
          </div>

          {/* Jenis Kelamin */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <Select
                name="gender"
                value={formData.gender}
                onChange={onInputChange}
                label="Jenis Kelamin"
                placeholder="Pilih jenis kelamin"
                variant="bordered"
                className="w-full"
                classNames={{
                  trigger: "focus:outline-none",
                }}>
                <SelectItem key="male">Laki-laki</SelectItem>
                <SelectItem key="female">Perempuan</SelectItem>
              </Select>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Ubah Kontak
          </h3>

          {/* Email */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex-1">
              <Input
                type="email"
                value={userEmail || ""}
                label="Email"
                variant="bordered"
                className="w-full"
                isDisabled={true}
                classNames={{
                  input: "bg-gray-50 text-gray-500",
                  inputWrapper: "bg-gray-50",
                }}
              />
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading}
          variant="solid"
          className="px-6 py-2 bg-gray-900 text-white">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
              <span>Menyimpan...</span>
            </div>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </div>
    </form>
  );
};

export default BiodataForm;
