import { useState } from "react";
import { Close as CloseIcon, Home as HomeIcon } from "@mui/icons-material";

interface Tab {
  id: string;
  label: string;
  icon?: any;
  closable: boolean;
}

export function TabBar() {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "home",      label: "首页",   icon: HomeIcon, closable: false },
    { id: "customers", label: "客户管理",               closable: true },
    { id: "sales",     label: "销售订单",               closable: true },
    { id: "inventory", label: "库存管理",               closable: true },
  ]);
  const [activeTab, setActiveTab] = useState("home");

  const closeTab = (tabId: string) => {
    const next = tabs.filter((t) => t.id !== tabId);
    setTabs(next);
    if (activeTab === tabId) setActiveTab(next[0]?.id ?? "");
  };

  return (
    <div className="bg-white border-b border-gray-100 px-3 h-9 flex items-center gap-1 overflow-x-auto shrink-0">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group relative flex items-center gap-1.5 px-3 h-6 rounded-md cursor-pointer transition-all select-none whitespace-nowrap ${
              isActive
                ? "bg-[#e8f0fe] text-[#2e63ff]"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {tab.icon && <tab.icon sx={{ fontSize: 13 }} />}
            <span className={`text-xs ${isActive ? "font-semibold" : "font-medium"}`}>
              {tab.label}
            </span>
            {tab.closable && (
              <button
                onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}
                className="ml-0.5 rounded hover:bg-blue-200/60 opacity-0 group-hover:opacity-100 transition-all p-px"
              >
                <CloseIcon sx={{ fontSize: 11 }} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
