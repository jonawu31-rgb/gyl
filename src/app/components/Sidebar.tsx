import { useState } from "react";
import { Logo } from "./Logo";
import { ExpandMore as ExpandMoreIcon, ChevronRight as ChevronRightIcon } from "@mui/icons-material";
import { menuItems, type Level2Item, type Level3Item, type MenuItem } from "../navigation";

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const [expandedL1, setExpandedL1] = useState<string>("");
  const [expandedL2, setExpandedL2] = useState<string>("");

  const handleL1Click = (item: MenuItem) => {
    if (item.children) {
      setExpandedL1(expandedL1 === item.label ? "" : item.label);
      setExpandedL2("");
    } else {
      onPageChange(item.page ?? item.label);
      setExpandedL1("");
      setExpandedL2("");
    }
  };

  const handleL2Click = (child: Level2Item) => {
    if (child.children) {
      setExpandedL2(expandedL2 === child.label ? "" : child.label);
    } else {
      onPageChange(child.page ?? child.label);
    }
  };

  const handleL3Click = (grandChild: Level3Item) => {
    onPageChange(grandChild.page ?? grandChild.label);
  };

  const isL3Active = (grandChild: Level3Item) =>
    currentPage === (grandChild.page ?? grandChild.label);

  const isL2Active = (child: Level2Item) =>
    currentPage === (child.page ?? child.label);

  return (
    <aside
      className="w-44 xl:w-52 bg-white flex flex-col shrink-0 relative z-10"
      style={{ boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="px-3 xl:px-4 pt-5 xl:pt-6 pb-3 xl:pb-4 shrink-0">
        <div className="flex items-center gap-2 xl:gap-3">
          <Logo />
          <div className="min-w-0">
            <div className="text-sm xl:text-base font-bold text-gray-800 leading-tight tracking-wide truncate">
              车配智数
            </div>
            <div className="text-[11px] xl:text-xs text-gray-400 mt-0.5">
              供应链平台
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-1 xl:py-2">
        <ul className="space-y-0.5 xl:space-y-1 px-1.5 xl:px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.children ? (
                <>
                  <button
                    onClick={() => handleL1Click(item)}
                    className={`w-full flex items-center justify-between gap-2 px-2.5 xl:px-3 py-2 xl:py-2.5 rounded-lg transition-all ${
                      expandedL1 === item.label
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon sx={{ fontSize: 18 }} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {expandedL1 === item.label ? (
                      <ExpandMoreIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <ChevronRightIcon sx={{ fontSize: 16 }} />
                    )}
                  </button>

                  {expandedL1 === item.label && (
                    <ul className="mt-1 space-y-0.5">
                      {item.children.map((child, ci) => (
                        <li key={ci}>
                          {child.children ? (
                            <>
                              <button
                                onClick={() => handleL2Click(child)}
                                className={`w-full flex items-center justify-between gap-2 pl-8 pr-2.5 py-1.5 rounded-lg transition-all text-sm ${
                                  expandedL2 === child.label
                                    ? "bg-gray-50 text-gray-900"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                <span>{child.label}</span>
                                {expandedL2 === child.label ? (
                                  <ExpandMoreIcon sx={{ fontSize: 14 }} />
                                ) : (
                                  <ChevronRightIcon sx={{ fontSize: 14 }} />
                                )}
                              </button>

                              {expandedL2 === child.label && (
                                <ul className="mt-0.5 space-y-0.5">
                                  {child.children.map((grandChild, gci) => (
                                    <li key={gci}>
                                      <button
                                        onClick={() => handleL3Click(grandChild)}
                                        className={`w-full flex items-center gap-2 pl-12 pr-2.5 py-1.5 rounded-lg transition-all text-sm ${
                                          isL3Active(grandChild)
                                            ? "bg-gradient-to-r from-[#18b7de] to-[#2e63ff] text-white shadow-md shadow-blue-400/20"
                                            : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                      >
                                        <span>{grandChild.label}</span>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          ) : (
                            <button
                              onClick={() => handleL2Click(child)}
                              className={`w-full flex items-center gap-2 pl-8 pr-2.5 py-1.5 rounded-lg transition-all text-sm ${
                                isL2Active(child)
                                  ? "bg-gradient-to-r from-[#18b7de] to-[#2e63ff] text-white shadow-md shadow-blue-400/20"
                                  : "text-gray-600 hover:bg-gray-50"
                              }`}
                            >
                              <span>{child.label}</span>
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <button
                  onClick={() => handleL1Click(item)}
                  className={`w-full flex items-center gap-2.5 px-2.5 xl:px-3 py-2 xl:py-2.5 rounded-lg transition-all ${
                    currentPage === (item.page ?? item.label)
                      ? "bg-gradient-to-r from-[#18b7de] to-[#2e63ff] text-white shadow-lg shadow-blue-500/30"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon sx={{ fontSize: 18 }} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 py-2 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">© 2026 车配智数</div>
      </div>
    </aside>
  );
}
