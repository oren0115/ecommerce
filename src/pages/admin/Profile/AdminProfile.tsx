import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Divider,
  Avatar,
  Chip,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../../contexts/AuthContext";

const AdminProfile = () => {
  const { user, updateProfile, updatePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states for profile update
  const [profileForm, setProfileForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Form states for password change
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(profileForm);
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match!" });
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage({ type: "success", text: "Password changed successfully!" });
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.fullname) return "A";
    return user.fullname
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account information and security
          </p>
        </div>
      </div>

      {/* Message Alert */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card className="w-full">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-semibold">Profile Information</p>
                <p className="text-small text-default-500">
                  Update your personal information
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {!isEditing ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar
                      name={getUserInitials()}
                      size="lg"
                      className="bg-gray-900 text-white"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        {user?.fullname}
                      </h3>
                      <p className="text-gray-600">{user?.email}</p>
                      <Chip
                        color="primary"
                        variant="flat"
                        size="sm"
                        className="mt-1">
                        {user?.role}
                      </Chip>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <p className="text-gray-900">{user?.fullname}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Phone
                      </label>
                      <p className="text-gray-900">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Role
                      </label>
                      <p className="text-gray-900 capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <Button
                    color="primary"
                    onClick={() => setIsEditing(true)}
                    startContent={<Icon icon="lucide:edit" />}>
                    Edit Profile
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      value={profileForm.fullname}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          fullname: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      required
                    />
                    <Input
                      label="Phone"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      color="primary"
                      isLoading={isLoading}
                      startContent={<Icon icon="lucide:save" />}>
                      Save Changes
                    </Button>
                    <Button
                      variant="bordered"
                      onClick={() => {
                        setIsEditing(false);
                        setProfileForm({
                          fullname: user?.fullname || "",
                          email: user?.email || "",
                          phone: user?.phone || "",
                        });
                      }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Security Settings */}
        <div className="lg:col-span-1">
          <Card className="w-full">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-md font-semibold">Security</p>
                <p className="text-small text-default-500">
                  Manage your password
                </p>
              </div>
            </CardHeader>
            <Divider />
            <CardBody>
              {!isChangingPassword ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Icon icon="lucide:shield" className="text-gray-400" />
                    <span className="text-sm text-gray-600">Password</span>
                  </div>
                  <Button
                    color="secondary"
                    variant="bordered"
                    onClick={() => setIsChangingPassword(true)}
                    startContent={<Icon icon="lucide:key" />}>
                    Change Password
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <div className="flex space-x-2">
                    <Button
                      type="submit"
                      color="primary"
                      isLoading={isLoading}
                      startContent={<Icon icon="lucide:save" />}>
                      Update Password
                    </Button>
                    <Button
                      variant="bordered"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordForm({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
