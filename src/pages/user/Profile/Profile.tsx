import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthRedirect } from "../../../hooks/useAuthRedirect";
import api from "../../../api/api";
import { Card, CardBody } from "@heroui/react";
import {
  ProfileHeader,
  ProfilePicture,
  ProfileTabs,
  MessageAlert,
  BiodataForm,
  AddressForm,
  NotificationForm,
} from "../../../components/user/Profile";

type TabType = "biodata" | "alamat" | "notifikasi";

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useAuthRedirect();
  const [activeTab, setActiveTab] = useState<TabType>("biodata");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    dateOfBirth: user?.dateOfBirth || "",
    gender: user?.gender || "",
    phone: user?.phone || "",
    shippingAddress: user?.shippingAddress || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newProducts: true,
    blogUpdates: false,
  });

  // Show loading while checking authentication
  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
  };

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        setMessage({
          type: "error",
          text: "File terlalu besar. Maksimum 2MB.",
        });
        return;
      }

      // Validate file type
      if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
        setMessage({
          type: "error",
          text: "Format file tidak didukung. Gunakan JPG, JPEG, atau PNG.",
        });
        return;
      }

      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("image", file);

        const response = await api.post("/api/upload/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000, // 30 second timeout
        });

        if ((response.data as any).success) {
          // Update user profile with new avatar
          await updateProfile({
            avatar: (response.data as any).data.secureUrl,
            avatarPublicId: (response.data as any).data.publicId,
          });
          setMessage({
            type: "success",
            text: "Foto profil berhasil diupload!",
          });
        } else {
          setMessage({
            type: "error",
            text:
              (response.data as any).error?.detail?.message || "Upload gagal",
          });
        }
      } catch (error: any) {
        setMessage({
          type: "error",
          text:
            error.response?.data?.error?.detail?.message ||
            "Gagal upload foto profil",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(formData);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: "biodata", label: "Biodata Diri", icon: "lucide:user" },
    { id: "alamat", label: "Alamat", icon: "lucide:map-pin" },
    { id: "notifikasi", label: "Notifikasi", icon: "lucide:bell" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-sm border border-gray-200">
          {/* Header */}
          <ProfileHeader
            title="Profile Settings"
            subtitle="Kelola informasi profil Anda"
          />

          <CardBody className="p-0">
            <div className="flex flex-col lg:flex-row">
              {/* Left Side - Profile Picture */}
              <div className="lg:w-1/3 p-6 border-r border-gray-200">
                <ProfilePicture
                  avatar={user?.avatar}
                  isLoading={isLoading}
                  onFileUpload={handleFileUpload}
                />
              </div>

              {/* Right Side - Tabs and Content */}
              <div className="lg:w-2/3 p-6">
                {/* Tabs */}
                <ProfileTabs
                  tabs={tabs}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                />

                {/* Tab Content */}
                <div className="space-y-6">
                  {/* Message */}
                  <MessageAlert message={message} />

                  {/* Biodata Diri Tab */}
                  {activeTab === "biodata" && (
                    <BiodataForm
                      formData={formData}
                      userEmail={user?.email}
                      isLoading={isLoading}
                      onInputChange={handleInputChange}
                      onSubmit={handleSubmit}
                    />
                  )}

                  {/* Alamat Tab */}
                  {activeTab === "alamat" && (
                    <AddressForm
                      formData={formData}
                      onInputChange={handleInputChange}
                    />
                  )}

                  {/* Notifikasi Tab */}
                  {activeTab === "notifikasi" && (
                    <NotificationForm
                      notificationSettings={notificationSettings}
                      onNotificationChange={handleNotificationChange}
                    />
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
