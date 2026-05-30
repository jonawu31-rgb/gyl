import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";

interface Role {
  id: string;
  roleName: string;
  remark: string;
  permissions: string[];
  createTime: string;
}

interface PermissionNode {
  id: string;
  label: string;
  children?: PermissionNode[];
}

const mockRoles: Role[] = [
  {
    id: "1",
    roleName: "店长",
    remark: "门店店长，拥有门店最高权限",
    permissions: [],
    createTime: "2023-01-10 09:00",
  },
  {
    id: "2",
    roleName: "财务",
    remark: "账务报表，单据列表",
    permissions: [],
    createTime: "2023-01-10 09:05",
  },
  {
    id: "3",
    roleName: "内勤",
    remark: "接待、开单、收银",
    permissions: [],
    createTime: "2023-01-10 09:10",
  },
  {
    id: "4",
    roleName: "业务",
    remark: "开单、收银、查询、商机管理",
    permissions: [],
    createTime: "2023-01-10 09:15",
  },
  {
    id: "5",
    roleName: "拣货发货员",
    remark: "拣货、发货、退货",
    permissions: [],
    createTime: "2023-01-10 09:20",
  },
  {
    id: "6",
    roleName: "库管",
    remark: "出库、库存管理、入库审核、退货管理",
    permissions: [],
    createTime: "2023-01-10 09:25",
  },
];

// 权限树数据结构
const permissionTree: PermissionNode[] = [
  {
    id: "customer-sales",
    label: "客户/销售",
    children: [
      {
        id: "sales-business",
        label: "销售业务",
        children: [
          {
            id: "sales-order",
            label: "销售/报价开单",
            children: [
              { id: "sales-order-quote", label: "报价" },
              { id: "sales-order-settle", label: "结算" },
            ],
          },
          {
            id: "sales-history",
            label: "销售历史订单",
            children: [
              { id: "sales-history-list", label: "列表" },
              { id: "sales-history-void", label: "作废" },
              { id: "sales-history-export", label: "导出" },
              { id: "sales-history-replace", label: "替换" },
            ],
          },
          {
            id: "quotation-draft",
            label: "报价/草稿单据",
            children: [
              { id: "quotation-draft-list", label: "列表" },
              { id: "quotation-draft-delete", label: "删除" },
              { id: "quotation-draft-export", label: "导出" },
            ],
          },
          {
            id: "void-order",
            label: "作废单据",
            children: [
              { id: "void-order-list", label: "列表" },
              { id: "void-order-export", label: "导出" },
            ],
          },
          {
            id: "credit-record",
            label: "挂账/欠款记录",
            children: [
              { id: "credit-record-list", label: "列表" },
              { id: "credit-record-payment", label: "还款" },
              { id: "credit-record-export", label: "导出" },
            ],
          },
          {
            id: "payment-record",
            label: "还款记录",
            children: [
              { id: "payment-record-list", label: "列表" },
              { id: "payment-record-void", label: "作废" },
              { id: "payment-record-export", label: "导出" },
            ],
          },
          {
            id: "customer-return",
            label: "客户退货",
            children: [
              { id: "customer-return-list", label: "列表" },
              { id: "customer-return-draft", label: "草稿" },
              { id: "customer-return-submit", label: "提交" },
              { id: "customer-return-delete", label: "删除" },
              { id: "customer-return-void", label: "作废" },
              { id: "customer-return-export", label: "导出" },
            ],
          },
          { id: "purchase-loss-rate", label: "采购流失比" },
        ],
      },
      {
        id: "customer-mgmt",
        label: "客户管理",
        children: [
          {
            id: "customer-data",
            label: "客户资料",
            children: [
              { id: "customer-data-list", label: "列表" },
              { id: "customer-data-add", label: "新增" },
              { id: "customer-data-edit", label: "编辑" },
              { id: "customer-data-delete", label: "删除" },
              { id: "customer-data-tag", label: "打标" },
              { id: "customer-data-import", label: "导入" },
            ],
          },
          {
            id: "employee-account",
            label: "员工账号",
            children: [
              { id: "employee-account-add", label: "新增员工账号" },
              { id: "employee-account-edit", label: "编辑员工账号" },
              { id: "employee-account-delete", label: "删除员工账号" },
            ],
          },
          {
            id: "customer-visit",
            label: "客户拜访登记",
            children: [
              { id: "customer-visit-list", label: "列表" },
              { id: "customer-visit-add", label: "新增" },
              { id: "customer-visit-edit", label: "编辑" },
              { id: "customer-visit-delete", label: "删除" },
              { id: "customer-visit-detail", label: "详情" },
              { id: "customer-visit-approve", label: "审核" },
            ],
          },
          {
            id: "customer-preference",
            label: "客户偏好",
            children: [
              { id: "customer-preference-list", label: "列表" },
              { id: "customer-preference-add", label: "新增" },
              { id: "customer-preference-edit", label: "编辑" },
              { id: "customer-preference-delete", label: "删除" },
            ],
          },
          { id: "customer-contribution", label: "客户贡献率" },
          { id: "customer-visit-stat", label: "客户拜访统计" },
          { id: "recent-purchase", label: "近期采购客户" },
        ],
      },
    ],
  },
  {
    id: "logistics",
    label: "物流/配送",
    children: [
      {
        id: "delivery-mgmt",
        label: "配送管理",
        children: [
          { id: "delivery-vehicle", label: "配送车辆" },
          { id: "delivery-company", label: "物流公司资料" },
        ],
      },
      {
        id: "logistics-business",
        label: "物流业务",
        children: [
          { id: "picking-mgmt", label: "拣货管理" },
          { id: "packing-box-mgmt", label: "打包箱管理" },
          { id: "packing-mgmt", label: "打包装箱" },
          { id: "shipping-mgmt", label: "发货管理" },
        ],
      },
    ],
  },
  {
    id: "product-warehouse",
    label: "商品/仓库",
    children: [
      {
        id: "warehouse-mgmt",
        label: "仓库管理",
        children: [
          { id: "supplier-mgmt", label: "供应商管理" },
          { id: "warehouse", label: "仓库管理" },
          { id: "purchase-mgmt", label: "采购管理" },
          { id: "inventory-query", label: "库存查询" },
          { id: "material-delivery", label: "领料出库" },
          { id: "loss-mgmt", label: "报损管理" },
          { id: "inventory-check", label: "库存盘点" },
          { id: "supplier-return", label: "供应商退货" },
          { id: "transfer-mgmt", label: "调拨管理" },
          { id: "inventory-alert", label: "库存预警" },
          { id: "purchase-amount-rank", label: "采购金额排行" },
          { id: "product-sales-rank", label: "商品销售排行" },
          { id: "product-profit-rank", label: "产品利润排行" },
          { id: "slow-moving-stock", label: "滞销库存" },
          { id: "inventory-turnover", label: "库存周转率" },
        ],
      },
      {
        id: "product-mgmt",
        label: "商品管理",
        children: [
          { id: "parts-data", label: "配件资料" },
          { id: "origin-mgmt", label: "产地管理" },
          { id: "brand-mgmt", label: "品牌管理" },
          { id: "universal-parts", label: "通用件管理" },
          { id: "category-mgmt", label: "品类管理" },
          { id: "parts-tag-mgmt", label: "配件标签管理" },
        ],
      },
      {
        id: "kit-mgmt",
        label: "套件管理",
        children: [
          { id: "template-mgmt", label: "模版管理" },
          { id: "kit-assembly", label: "套件组装" },
          { id: "kit-disassembly", label: "套件拆装" },
        ],
      },
    ],
  },
  {
    id: "finance",
    label: "财务/资金",
    children: [
      {
        id: "finance-mgmt",
        label: "财务管理",
        children: [
          { id: "revenue-summary", label: "营收汇总" },
          { id: "bill-detail", label: "账单明细" },
          { id: "purchase-payable", label: "采购应付" },
          { id: "purchase-stat", label: "采购统计" },
          { id: "profit-stat", label: "毛利统计" },
          { id: "category-summary", label: "品类汇总" },
          { id: "customer-prepay", label: "客户预收款" },
          { id: "customer-debt", label: "客户欠款" },
          { id: "supplier-prepay", label: "供应商预付款" },
        ],
      },
      {
        id: "expense-mgmt",
        label: "费用管理",
        children: [
          { id: "expense-out", label: "支出费用" },
          { id: "expense-reimburse", label: "费用报销" },
          { id: "expense-in", label: "收入费用" },
        ],
      },
    ],
  },
  {
    id: "employee-performance",
    label: "员工/绩效",
    children: [
      {
        id: "performance-setting",
        label: "绩效设置",
        children: [
          { id: "supervisor-category", label: "主管分类" },
          { id: "order-commission", label: "单据提成设置" },
          { id: "category-commission", label: "分类提成设置" },
          { id: "visit-commission", label: "客户拜访提成设置" },
          { id: "new-customer-commission", label: "拉新提成设置" },
          { id: "deal-commission", label: "新客户成交提成设置" },
          { id: "contribution-rate", label: "业务员新客贡献率设置" },
          { id: "sales-reward", label: "销售奖励设置" },
          { id: "payment-reward", label: "回款奖励设置" },
        ],
      },
      {
        id: "employee-salary",
        label: "员工工资",
        children: [{ id: "salary-report", label: "工资报表" }],
      },
      {
        id: "employee-setting",
        label: "员工设置",
        children: [
          {
            id: "dept-mgmt",
            label: "部门管理",
            children: [
              { id: "dept-mgmt-list", label: "列表" },
              { id: "dept-mgmt-add", label: "新增" },
              { id: "dept-mgmt-edit", label: "编辑" },
              { id: "dept-mgmt-delete", label: "删除" },
            ],
          },
          {
            id: "employee-mgmt",
            label: "员工管理",
            children: [
              { id: "employee-mgmt-list", label: "列表" },
              { id: "employee-mgmt-add", label: "新增" },
              { id: "employee-mgmt-edit", label: "编辑" },
              { id: "employee-mgmt-delete", label: "删除" },
            ],
          },
          {
            id: "role-mgmt",
            label: "角色管理",
            children: [
              { id: "role-mgmt-list", label: "列表" },
              { id: "role-mgmt-add", label: "新增" },
              { id: "role-mgmt-edit", label: "编辑" },
              { id: "role-mgmt-delete", label: "删除" },
              { id: "role-mgmt-permission", label: "权限" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "data-setting",
    label: "资料/设置",
    children: [
      {
        id: "basic-data",
        label: "基本资料",
        children: [
          { id: "unit-mgmt", label: "单位管理" },
          { id: "vehicle-type-mgmt", label: "车型管理" },
          { id: "category-mgmt-setting", label: "类别管理" },
          { id: "payment-mgmt", label: "支付管理" },
          { id: "rule-setting", label: "规则设置" },
          { id: "print-template", label: "打印模版" },
          { id: "system-config", label: "系统配置" },
        ],
      },
      {
        id: "msg-notification",
        label: "消息通知",
        children: [
          { id: "msg-setting", label: "消息设置" },
          { id: "msg-list", label: "消息列表" },
        ],
      },
    ],
  },
  {
    id: "alliance",
    label: "联盟",
    children: [
      {
        id: "alliance-mgmt",
        label: "联盟管理",
        children: [{ id: "alliance-list", label: "联盟列表" }],
      },
      {
        id: "alliance-report",
        label: "联盟报表",
        children: [{ id: "alliance-stat", label: "联盟统计" }],
      },
    ],
  },
  {
    id: "mall",
    label: "商城",
    children: [
      {
        id: "mall-setting",
        label: "商城设置",
        children: [{ id: "mall-config", label: "商城配置" }],
      },
      {
        id: "mall-product",
        label: "商城商品",
        children: [
          { id: "mall-product-list", label: "商品列表" },
          { id: "mall-product-add", label: "新增商品" },
        ],
      },
      {
        id: "freight-mgmt",
        label: "运费管理",
        children: [{ id: "freight-template", label: "运费模版" }],
      },
      {
        id: "mall-order",
        label: "商城订单",
        children: [
          { id: "mall-order-list", label: "订单列表" },
          { id: "mall-order-detail", label: "订单详情" },
        ],
      },
      {
        id: "mall-aftersale",
        label: "商城售后单",
        children: [
          { id: "mall-aftersale-list", label: "售后列表" },
          { id: "mall-aftersale-handle", label: "售后处理" },
        ],
      },
    ],
  },
];

// 新增/编辑角色弹框
function RoleDialog({
  open,
  onClose,
  onSave,
  editData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Role;
}) {
  const [formData, setFormData] = useState({
    roleName: editData?.roleName || "",
    remark: editData?.remark || "",
  });

  if (!open) return null;

  const handleSave = () => {
    if (!formData.roleName.trim()) {
      alert("角色名称不能为空");
      return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div
          className="px-5 py-3 border-b border-gray-200 flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h3 className="text-base font-bold text-gray-800">
            {editData ? "编辑角色" : "新增角色"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 角色名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500">*</span> 角色名称
            </label>
            <input
              type="text"
              placeholder="请输入角色名称"
              value={formData.roleName}
              onChange={(e) =>
                setFormData({ ...formData, roleName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <input
              type="text"
              placeholder="请输入描述"
              value={formData.remark}
              onChange={(e) =>
                setFormData({ ...formData, remark: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

// 权限配置弹框
function PermissionDialog({
  open,
  onClose,
  onSave,
  roleData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (permissions: string[]) => void;
  roleData?: Role;
}) {
  const [checkedKeys, setCheckedKeys] = useState<Set<string>>(
    new Set(roleData?.permissions || [])
  );

  if (!open) return null;

  // 获取所有子节点的ID
  const getAllChildrenIds = (node: PermissionNode): string[] => {
    const ids: string[] = [node.id];
    if (node.children) {
      node.children.forEach((child) => {
        ids.push(...getAllChildrenIds(child));
      });
    }
    return ids;
  };

  // 检查节点是否全部选中
  const isAllChildrenChecked = (node: PermissionNode): boolean => {
    if (!node.children || node.children.length === 0) {
      return checkedKeys.has(node.id);
    }
    return node.children.every((child) => isAllChildrenChecked(child));
  };

  // 检查节点是否部分选中
  const isSomeChildrenChecked = (node: PermissionNode): boolean => {
    if (!node.children || node.children.length === 0) {
      return checkedKeys.has(node.id);
    }
    return node.children.some((child) => isSomeChildrenChecked(child));
  };

  // 切换节点选中状态
  const toggleCheck = (node: PermissionNode) => {
    const newCheckedKeys = new Set(checkedKeys);
    const allIds = getAllChildrenIds(node);
    const isChecked = isAllChildrenChecked(node);

    if (isChecked) {
      // 取消选中所有子节点
      allIds.forEach((id) => newCheckedKeys.delete(id));
    } else {
      // 选中所有子节点
      allIds.forEach((id) => newCheckedKeys.add(id));
    }

    setCheckedKeys(newCheckedKeys);
  };

  // 渲染树节点
  const renderTreeNode = (node: PermissionNode, level: number = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isChecked = isAllChildrenChecked(node);
    const isIndeterminate = !isChecked && isSomeChildrenChecked(node);
    const childrenAreLeaves =
      hasChildren && node.children!.every((child) => !child.children?.length);

    return (
      <div key={node.id} className="space-y-2">
        <div
          className={`flex items-center gap-2 py-1.5 rounded ${
            level === 0 ? "bg-gray-50/60 px-3" : ""
          }`}
          style={{ paddingLeft: level === 0 ? "12px" : `${level * 20}px` }}
        >
          <div className="w-5 flex items-center justify-center">
            {hasChildren ? (
              <ExpandMoreIcon sx={{ fontSize: 16 }} className="text-gray-500" />
            ) : null}
          </div>
          <label className="flex items-center gap-2 cursor-pointer flex-1">
            <input
              type="checkbox"
              checked={isChecked}
              ref={(el) => {
                if (el) {
                  el.indeterminate = isIndeterminate;
                }
              }}
              onChange={() => toggleCheck(node)}
              className="w-4 h-4 accent-blue-600 focus:ring-blue-500 rounded"
            />
            <span
              className={`text-sm ${
                hasChildren ? "font-medium text-gray-800" : "text-gray-700"
              }`}
            >
              {node.label}
            </span>
          </label>
        </div>
        {hasChildren && (
          <div
            className={
              childrenAreLeaves
                ? "flex flex-wrap gap-2 pl-7"
                : "space-y-2"
            }
            style={childrenAreLeaves ? undefined : { paddingLeft: `${(level + 1) * 20}px` }}
          >
            {node.children!.map((child) => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const handleSave = () => {
    onSave(Array.from(checkedKeys));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div
          className="px-5 py-3 border-b border-gray-200 flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h3 className="text-base font-bold text-gray-800">分配权限</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          <div className="space-y-3">
            {permissionTree.map((node) => renderTreeNode(node))}
          </div>
        </div>

        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

// 删除确认弹框
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-80 overflow-hidden">
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <WarningIcon sx={{ fontSize: 28 }} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800 mb-1">
              此操作将永久删除该数据, 是否继续?
            </p>
            <p className="text-xs text-gray-500">{itemName}</p>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

export function RoleManagement() {
  const [searchName, setSearchName] = useState("");
  const [searchRemark, setSearchRemark] = useState("");
  const [data, setData] = useState<Role[]>(mockRoles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Role | undefined>(undefined);
  const [permissionItem, setPermissionItem] = useState<Role | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<Role | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName = !searchName || item.roleName.includes(searchName);
      const matchRemark = !searchRemark || item.remark.includes(searchRemark);
      return matchName && matchRemark;
    });
  }, [data, searchName, searchRemark]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReset = () => {
    setSearchName("");
    setSearchRemark("");
    setCurrentPage(1);
  };

  const handleDelete = (item: Role) => {
    setDeleteItem(item);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  const handleSave = (formData: any) => {
    if (editingItem) {
      // 编辑
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
    } else {
      // 新增
      const newRole: Role = {
        id: Date.now().toString(),
        ...formData,
        permissions: [],
        createTime: (() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const day = String(now.getDate()).padStart(2, "0");
          const hour = String(now.getHours()).padStart(2, "0");
          const minute = String(now.getMinutes()).padStart(2, "0");
          return `${year}-${month}-${day} ${hour}:${minute}`;
        })(),
      };
      setData((prev) => [...prev, newRole]);
    }
  };

  const handleSavePermission = (permissions: string[]) => {
    if (permissionItem) {
      setData((prev) =>
        prev.map((item) =>
          item.id === permissionItem.id ? { ...item, permissions } : item
        )
      );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">角色管理</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-20">
              角色名称:
            </label>
            <input
              type="text"
              placeholder="请输入角色名称"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-12">
              备注:
            </label>
            <input
              type="text"
              placeholder="请输入备注"
              value={searchRemark}
              onChange={(e) => {
                setSearchRemark(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1.5 shrink-0"
          >
            <SearchIcon sx={{ fontSize: 15 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shrink-0"
          >
            重置
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingItem(undefined);
              setDialogOpen(true);
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            新增
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-16">
                序号
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                角色名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                备注
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ width: "150px" }}>
                创建时间
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ width: "180px" }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              pagedData.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-2.5 text-xs text-gray-500">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {item.roleName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600">
                    {item.remark || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">
                    {item.createTime}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setDialogOpen(true);
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => {
                          setPermissionItem(item);
                          setPermissionDialogOpen(true);
                        }}
                        className="text-sm text-green-600 hover:text-green-800 hover:underline transition-colors"
                      >
                        权限
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-sm text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共{" "}
            <span className="font-semibold text-gray-800">
              {filteredData.length}
            </span>{" "}
            条数据
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{pageSize}条/页</span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 text-sm rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <RoleDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        editData={editingItem}
      />

      <PermissionDialog
        open={permissionDialogOpen}
        onClose={() => setPermissionDialogOpen(false)}
        onSave={handleSavePermission}
        roleData={permissionItem}
      />

      <DeleteConfirmDialog
        open={deleteItem !== null}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={deleteItem?.roleName || ""}
      />
    </div>
  );
}
