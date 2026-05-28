import { useState } from "react";
import { Logo } from "./Logo";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  AccountBalance as AccountBalanceIcon,
  LocalShipping as LocalShippingIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

interface Level3Item {
  label: string;
  page?: string;
}

interface Level2Item {
  label: string;
  page?: string;
  children?: Level3Item[];
}

interface MenuItem {
  icon: any;
  label: string;
  page?: string;
  children?: Level2Item[];
}

const menuItems: MenuItem[] = [
  { icon: HomeIcon, label: "首页", page: "首页" },
  {
    icon: PeopleIcon,
    label: "员工/绩效",
    children: [
      {
        label: "员工设置",
        children: [
          { label: "员工管理", page: "员工管理" },
          { label: "部门管理", page: "部门管理" },
          { label: "角色管理", page: "角色管理" },
        ],
      },
      {
        label: "绩效设置",
        children: [
          { label: "单据提成设置" },
        ],
      },
      {
        label: "员工工资",
        children: [
          { label: "工资报表" },
        ],
      },
    ],
  },
  {
    icon: SettingsIcon,
    label: "资料/设置",
    children: [
      {
        label: "基本资料",
        children: [
          { label: "单位管理", page: "单位管理" },
          { label: "车型管理", page: "车型管理" },
          { label: "类别管理", page: "类别管理" },
          { label: "支付管理", page: "支付管理" },
          { label: "规则设置", page: "规则设置" },
          { label: "打印模版", page: "打印模版" },
          { label: "系统配置", page: "系统配置" },
        ],
      },
      {
        label: "消息通知",
        children: [
          { label: "消息设置" },
          { label: "消息列表" },
        ],
      },
    ],
  },
  {
    icon: InventoryIcon,
    label: "商品/仓库",
    children: [
      {
        label: "商品管理",
        children: [
          { label: "配件资料", page: "配件资料" },
          { label: "产地管理", page: "产地管理" },
          { label: "品牌管理", page: "品牌管理" },
          { label: "通用件管理" },
          { label: "品类管理", page: "品类管理" },
          { label: "配件标签管理", page: "配件标签管理" },
        ],
      },
      {
        label: "仓库管理",
        children: [
          { label: "供应商管理" },
          { label: "采购管理", page: "采购管理" },
          { label: "仓库管理" },
          { label: "库存查询" },
          { label: "采购金额排行" },
          { label: "商品销售排行" },
          { label: "领料出库", page: "领料出库" },
          { label: "报损管理", page: "报损管理" },
          { label: "库存盘点", page: "库存盘点" },
          { label: "供应商退货", page: "供应商退货" },
          { label: "调拨管理", page: "调拨管理" },
          { label: "库存预警" },
          { label: "滞销库存" },
          { label: "库存周转率" },
        ],
      },
      {
        label: "套件管理",
        children: [
          { label: "模版管理", page: "模版管理" },
          { label: "套件组装", page: "套件组装" },
          { label: "套件拆装", page: "套件拆装" },
        ],
      },
    ],
  },
  {
    icon: StoreIcon,
    label: "客户/销售",
    children: [
      {
        label: "客户管理",
        children: [
          { label: "客户资料", page: "客户资料" },
          { label: "客户拜访登记" },
          { label: "客户拜访审核" },
          { label: "客户贡献率" },
          { label: "近期采购客户", page: "近期采购客户" },
        ],
      },
      {
        label: "销售业务",
        children: [
          { label: "销售/报价开单", page: "销售/报价开单" },
          { label: "销售历史订单", page: "销售历史订单" },
          { label: "报价/草稿单据", page: "报价订单" },
          { label: "销售手推车", page: "销售手推车" },
          { label: "作废单据", page: "作废单据" },
          { label: "挂账/欠款记录", page: "挂账/欠款记录" },
          { label: "还款记录", page: "还款记录" },
          { label: "客户退货", page: "客户退货" },
          { label: "采购流失比" },
        ],
      },
    ],
  },
  {
    icon: AccountBalanceIcon,
    label: "财务/资金",
    children: [
      {
        label: "财务管理",
        children: [
          { label: "营收汇总", page: "营收汇总" },
          { label: "账单明细" },
          { label: "采购应付" },
          { label: "采购统计" },
          { label: "毛利统计" },
          { label: "品类汇总", page: "品类汇总" },
          { label: "客户预收款", page: "客户预收款" },
          { label: "客户欠款", page: "客户欠款" },
          { label: "供应商预付款" },
        ],
      },
      {
        label: "费用管理",
        children: [
          { label: "支出费用" },
          { label: "费用报销" },
          { label: "收入费用" },
        ],
      },
    ],
  },
  {
    icon: LocalShippingIcon,
    label: "物流/配送",
    children: [
      {
        label: "配送管理",
        children: [
          { label: "配送车辆" },
          { label: "物流公司资料" },
        ],
      },
      {
        label: "物流业务",
        children: [
          { label: "拣货管理" },
          { label: "打包装箱" },
          { label: "发货管理" },
        ],
      },
    ],
  },
];

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
    <aside className="w-44 xl:w-52 bg-white flex flex-col shrink-0 relative z-10" style={{ boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)' }}>
      {/* Logo */}
      <div className="px-3 xl:px-4 pt-5 xl:pt-6 pb-3 xl:pb-4 shrink-0">
        <div className="flex items-center gap-2 xl:gap-3">
          <Logo />
          <div className="min-w-0">
            <div className="text-sm xl:text-base font-bold text-gray-800 leading-tight tracking-wide truncate">
              车配智数
            </div>
            <div className="text-[11px] xl:text-xs text-gray-400 mt-0.5">供应链平台</div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-1 xl:py-2">
        <ul className="space-y-0.5 xl:space-y-1 px-1.5 xl:px-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.children ? (
                <>
                  {/* Level 1 - has children */}
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

                  {/* Level 2 */}
                  {expandedL1 === item.label && (
                    <ul className="mt-1 space-y-0.5">
                      {item.children.map((child, ci) => (
                        <li key={ci}>
                          {child.children ? (
                            <>
                              {/* Level 2 - has children */}
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

                              {/* Level 3 */}
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
                            /* Level 2 - no children */
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
                /* Level 1 - no children */
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

      {/* Footer */}
      <div className="px-3 py-2 border-t border-gray-200">
        <div className="text-xs text-gray-400 text-center">© 2026 车配智数</div>
      </div>
    </aside>
  );
}
