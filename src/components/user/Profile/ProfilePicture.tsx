import React, { useRef } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import PasswordForm from "./PasswordForm";

interface ProfilePictureProps {
  avatar?: string;
  isLoading: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  avatar,
  isLoading,
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <CardBody className="text-center">
        {/* Profile Picture */}
        <div className="relative mx-auto w-48 h-48 bg-yellow-100 rounded-lg border-2 border-dashed border-yellow-300 flex items-center justify-center mb-4 overflow-hidden">
          {avatar ? (
            <img
              src={avatar}
              alt="Profile Picture"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <Icon
                icon="lucide:user"
                className="w-16 h-16 text-yellow-600 mx-auto mb-2"
              />
              <p className="text-sm text-yellow-700">Profile Picture</p>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          className="w-full mb-4 bg-gray-900 text-white"
          color="default"
          variant="solid">
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <Icon icon="lucide:loader-2" className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            "Pilih Foto"
          )}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={onFileUpload}
          className="hidden"
        />

        {/* File Upload Info */}
        <div className="text-xs text-gray-500 mb-4">
          <p>Besar file: maksimum 2.000.000 bytes (2 Megabytes)</p>
          <p>Ekstensi file yang diperbolehkan: .JPG .JPEG .PNG</p>
        </div>

        {/* Create Password Button */}
        <Button
          className="w-full bg-gray-900 text-white"
          variant="bordered"
          color="default"
          onPress={onOpen}>
          Buat Kata Sandi
        </Button>
      </CardBody>

      {/* Password Form Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Ubah Kata Sandi
          </ModalHeader>
          <ModalBody>
            <PasswordForm
              onSuccess={() => {
                onClose();
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfilePicture;
