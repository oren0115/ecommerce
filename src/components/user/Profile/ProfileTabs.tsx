import React from "react";
import { Icon } from "@iconify/react";
import { Tabs, Tab } from "@heroui/react";

type TabType = "biodata" | "alamat" | "notifikasi";

interface Tab {
  id: TabType;
  label: string;
  icon: string;
}

interface ProfileTabsProps {
  tabs: Tab[];
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <Tabs
      selectedKey={activeTab}
      onSelectionChange={(key) => onTabChange(key as TabType)}
      className="mb-6"
      variant="underlined"
      color="default">
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          title={
            <div className="flex items-center space-x-2">
              <Icon icon={tab.icon} className="w-4 h-4" />
              <span>{tab.label}</span>
            </div>
          }
        />
      ))}
    </Tabs>
  );
};

export default ProfileTabs;
