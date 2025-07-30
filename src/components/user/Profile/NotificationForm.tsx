import React from "react";
import { Button, Switch, Card, CardBody } from "@heroui/react";

interface NotificationSettings {
  emailNotifications: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newProducts: boolean;
  blogUpdates: boolean;
}

interface NotificationFormProps {
  notificationSettings: NotificationSettings;
  onNotificationChange: (setting: string) => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  notificationSettings,
  onNotificationChange,
}) => {
  const getNotificationLabel = (key: string) => {
    switch (key) {
      case "emailNotifications":
        return "Notifikasi Email";
      case "orderUpdates":
        return "Update Pesanan";
      case "promotions":
        return "Promosi dan Diskon";
      case "newProducts":
        return "Produk Baru";
      case "blogUpdates":
        return "Update Blog";
      default:
        return key;
    }
  };

  const getNotificationDescription = (key: string) => {
    switch (key) {
      case "emailNotifications":
        return "Terima notifikasi melalui email";
      case "orderUpdates":
        return "Update status pesanan Anda";
      case "promotions":
        return "Informasi promosi dan diskon terbaru";
      case "newProducts":
        return "Produk baru yang mungkin Anda suka";
      case "blogUpdates":
        return "Artikel blog terbaru";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardBody className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Pengaturan Notifikasi
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Pilih jenis notifikasi yang ingin Anda terima
        </p>

        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700">
                  {getNotificationLabel(key)}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  {getNotificationDescription(key)}
                </p>
              </div>
              <Switch
                isSelected={value}
                onValueChange={() => onNotificationChange(key)}
                size="sm"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="solid" className="px-6 py-2 bg-gray-900 text-white">
            Simpan Pengaturan
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default NotificationForm;
