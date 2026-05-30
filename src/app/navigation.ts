import type { ComponentType } from "react";
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Inventory as InventoryIcon,
  Store as StoreIcon,
  AccountBalance as AccountBalanceIcon,
  LocalShipping as LocalShippingIcon,
} from "@mui/icons-material";

export interface Level3Item {
  label: string;
  page?: string;
}

export interface Level2Item {
  label: string;
  page?: string;
  children?: Level3Item[];
}

export interface MenuItem {
  icon: ComponentType<any>;
  label: string;
  page?: string;
  children?: Level2Item[];
}

export interface SearchTarget {
  label: string;
  page: string;
  category: string;
  keywords?: string[];
}

export const menuItems: MenuItem[] = [
  {
    icon: HomeIcon,
    label: "首页",
    page: "首页",
  },
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
          { label: "单据提成设置", page: "单据提成设置" },
          { label: "分类提成设置", page: "分类提成设置" },
        ],
      },
      {
        label: "员工工资",
        children: [{ label: "工资报表", page: "工资报表" }],
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
          { label: "消息设置", page: "消息设置" },
          { label: "消息列表", page: "消息列表" },
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
          { label: "通用件管理", page: "通用件管理" },
          { label: "品类管理", page: "品类管理" },
          { label: "配件标签管理", page: "配件标签管理" },
        ],
      },
      {
        label: "仓库管理",
        children: [
          { label: "供应商管理", page: "供应商管理" },
          { label: "采购管理", page: "采购管理" },
          { label: "仓库管理", page: "仓库管理" },
          { label: "库存查询", page: "库存查询" },
          { label: "采购金额排行", page: "采购金额排行" },
          { label: "商品销售排行", page: "商品销售排行" },
          { label: "领料出库", page: "领料出库" },
          { label: "报损管理", page: "报损管理" },
          { label: "库存盘点", page: "库存盘点" },
          { label: "供应商退货", page: "供应商退货" },
          { label: "调拨管理", page: "调拨管理" },
          { label: "库存预警", page: "库存预警" },
          { label: "滞销库存", page: "滞销库存" },
          { label: "库存周转率", page: "库存周转率" },
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
          { label: "客户拜访登记", page: "客户拜访登记" },
          { label: "客户拜访审核", page: "客户拜访审核" },
          { label: "近期采购客户", page: "近期采购客户" },
          { label: "客户贡献率", page: "客户贡献率" },
        ],
      },
      {
        label: "销售业务",
        children: [
          { label: "销售/报价开单", page: "销售/报价开单" },
          { label: "销售历史订单", page: "销售历史订单" },
          { label: "报价/草稿单据", page: "报价/草稿单据" },
          { label: "作废单据", page: "作废单据" },
          { label: "挂账/欠款记录", page: "挂账/欠款记录" },
          { label: "还款记录", page: "还款记录" },
          { label: "客户退货", page: "客户退货" },
          { label: "采购流失比", page: "采购流失比" },
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
          { label: "账单明细", page: "账单明细" },
          { label: "营收汇总", page: "营收汇总" },
          { label: "采购应付", page: "采购应付" },
          { label: "采购统计", page: "采购统计" },
          { label: "毛利统计", page: "毛利统计" },
          { label: "品类汇总", page: "品类汇总" },
          { label: "客户预收款", page: "客户预收款" },
          { label: "客户欠款", page: "客户欠款" },
          { label: "供应商预付款", page: "供应商预付款" },
        ],
      },
      {
        label: "费用管理",
        children: [
          { label: "支出费用", page: "支出费用" },
          { label: "费用报销", page: "费用报销" },
          { label: "收入费用", page: "收入费用" },
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
          { label: "配送车辆", page: "配送车辆" },
          { label: "物流公司资料", page: "物流公司资料" },
        ],
      },
      {
        label: "物流业务",
        children: [
          { label: "拣货管理", page: "拣货管理" },
          { label: "打包装箱", page: "打包装箱" },
          { label: "发货管理", page: "发货管理" },
        ],
      },
    ],
  },
];

export function buildSearchTargets(items: MenuItem[]): SearchTarget[] {
  const targets: SearchTarget[] = [];

  const walk = (menuItems: MenuItem[], ancestors: string[] = []) => {
    for (const item of menuItems) {
      const nextAncestors = [...ancestors, item.label];

      if (item.children?.length) {
        for (const child of item.children) {
          const childAncestors = [...nextAncestors, child.label];

          if (child.children?.length) {
            for (const grandChild of child.children) {
              targets.push({
                label: grandChild.label,
                page: grandChild.page ?? grandChild.label,
                category: [item.label, child.label].join(" / "),
                keywords: [...childAncestors, grandChild.label],
              });
            }
          } else {
            targets.push({
              label: child.label,
              page: child.page ?? child.label,
              category: item.label,
              keywords: nextAncestors,
            });
          }
        }
      } else {
        targets.push({
          label: item.label,
          page: item.page ?? item.label,
          category: ancestors.join(" / "),
          keywords: nextAncestors,
        });
      }
    }
  };

  walk(items);
  return targets;
}
