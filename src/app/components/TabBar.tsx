import { useState } from "react";
import { Home as HomeIcon } from "@mui/icons-material";

interface Tab {
  id: string;
  label: string;
  icon?: any;
  closable: boolean;
}

export function TabBar() {
  const [tabs] = useState<Tab[]>([
    { id: "home", label: "首页", icon: HomeIcon, closable: false },
  ]);

  return (
    <div className="bg-white border-b border-gray-100 px-3 h-9 flex items-center gap-1 overflow-x-auto shrink-0">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className="group relative flex items-center gap-1.5 px-3 h-6 rounded-md cursor-default transition-all select-none whitespace-nowrap bg-[#e8f0fe] text-[#2e63ff]"
        >
          {tab.icon && <tab.icon sx={{ fontSize: 13 }} />}
          <span className="text-xs font-semibold">{tab.label}</span>
        </div>
      ))}
    </div>
  );
}
