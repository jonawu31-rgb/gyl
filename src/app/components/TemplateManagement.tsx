import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface KitPart {
  partId: string;
  partName: string;
  partCode: string;
  spec: string;
  quantity: number;
  costPrice: number;
  subtotal: number;
}

interface Template {
  id: string;
  code: string;
  name: string;
  category: string;
  sellingPrice: number;
  costPrice: number;
  partsCount: number;
  status: "启用" | "停用";
  remark: string;
  parts: KitPart[];
  createTime: string;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    code: "KIT001",
    name: "机油保养套餐",
    category: "保养套件",
    sellingPrice: 380,
    costPrice: 250,
    partsCount: 3,
    status: "启用",
    remark: "常规保养套件",
    parts: [
      { partId: "P001", partName: "机油", partCode: "OIL001", spec: "5W-30 4L", quantity: 1, costPrice: 150, subtotal: 150 },
      { partId: "P002", partName: "机油滤清器", partCode: "FIL001", spec: "标准型", quantity: 1, costPrice: 50, subtotal: 50 },
      { partId: "P003", partName: "空气滤清器", partCode: "FIL002", spec: "标准型", quantity: 1, costPrice: 50, subtotal: 50 },
    ],
    createTime: "2024-05-10 09:00",
  },
  {
    id: "2",
    code: "KIT002",
    name: "刹车系统套件",
    category: "刹车系统",
    sellingPrice: 850,
    costPrice: 600,
    partsCount: 4,
    status: "启用",
    remark: "前轮刹车套件",
    parts: [
      { partId: "P004", partName: "刹车片", partCode: "BRK001", spec: "前轮", quantity: 4, costPrice: 100, subtotal: 400 },
      { partId: "P005", partName: "刹车盘", partCode: "BRK002", spec: "前轮", quantity: 2, costPrice: 80, subtotal: 160 },
      { partId: "P006", partName: "刹车油", partCode: "BRK003", spec: "DOT4", quantity: 1, costPrice: 40, subtotal: 40 },
    ],
    createTime: "2024-05-12 10:30",
  },
  {
    id: "3",
    code: "KIT003",
    name: "空调系统套件",
    category: "空调系统",
    sellingPrice: 650,
    costPrice: 420,
    partsCount: 3,
    status: "启用",
    remark: "空调维护套件",
    parts: [],
    createTime: "2024-05-15 14:20",
  },
];

// 配件选择弹框
function PartsSelectionDialog({
  open,
  onClose,
  onConfirm,
  selectedParts,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: (parts: KitPart[]) => void;
  selectedParts: KitPart[];
}) {
  const [searchText, setSearchText] = useState("");
  const [tempSelectedParts, setTempSelectedParts] = useState<KitPart[]>(selectedParts);

  // 模拟配件数据
  const availableParts = [
    { id: "P001", code: "OIL001", name: "机油", spec: "5W-30 4L", costPrice: 150 },
    { id: "P002", code: "FIL001", name: "机油滤清器", spec: "标准型", costPrice: 50 },
    { id: "P003", code: "FIL002", name: "空气滤清器", spec: "标准型", costPrice: 50 },
    { id: "P004", code: "BRK001", name: "刹车片", spec: "前轮", costPrice: 100 },
    { id: "P005", code: "BRK002", name: "刹车盘", spec: "前轮", costPrice: 80 },
    { id: "P006", code: "BRK003", name: "刹车油", spec: "DOT4", costPrice: 40 },
  ];

  if (!open) return null;

  const filteredParts = availableParts.filter(
    (p) =>
      !searchText ||
      p.name.includes(searchText) ||
      p.code.includes(searchText)
  );

  const handleAddPart = (part: typeof availableParts[0]) => {
    const existing = tempSelectedParts.find((p) => p.partId === part.id);
    if (existing) {
      alert("该配件已添加");
      return;
    }
    const newPart: KitPart = {
      partId: part.id,
      partName: part.name,
      partCode: part.code,
      spec: part.spec,
      quantity: 1,
      costPrice: part.costPrice,
      subtotal: part.costPrice,
    };
    setTempSelectedParts([...tempSelectedParts, newPart]);
  };

  const handleRemovePart = (partId: string) => {
    setTempSelectedParts(tempSelectedParts.filter((p) => p.partId !== partId));
  };

  const handleQuantityChange = (partId: string, quantity: number) => {
    setTempSelectedParts(
      tempSelectedParts.map((p) =>
        p.partId === partId
          ? { ...p, quantity, subtotal: p.costPrice * quantity }
          : p
      )
    );
  };

  const handleConfirm = () => {
    onConfirm(tempSelectedParts);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        <div
          className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h2 className="text-lg font-bold text-gray-800">选择配件</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* 左侧：可选配件列表 */}
            <div>
              <div className="mb-3">
                <input
                  type="text"
                  placeholder="搜索配件名称/编码"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700">可选配件</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {filteredParts.map((part) => (
                    <div
                      key={part.id}
                      className="px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900">{part.name}</div>
                          <div className="text-xs text-gray-500 mt-0.5">编码: {part.code}</div>
                          <div className="text-xs text-gray-500">规格: {part.spec}</div>
                          <div className="text-xs text-gray-600 mt-1">成本: ¥{part.costPrice.toFixed(2)}</div>
                        </div>
                        <button
                          onClick={() => handleAddPart(part)}
                          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors shrink-0"
                        >
                          添加
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 右侧：已选配件 */}
            <div>
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-700">
                  已选配件 ({tempSelectedParts.length})
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  {tempSelectedParts.length === 0 ? (
                    <div className="px-4 py-12 text-center text-sm text-gray-400">
                      暂未选择配件
                    </div>
                  ) : (
                    tempSelectedParts.map((part) => (
                      <div
                        key={part.partId}
                        className="px-4 py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{part.partName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              编码: {part.partCode} | 规格: {part.spec}
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemovePart(part.partId)}
                            className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
                          >
                            移除
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 w-12">数量:</label>
                          <input
                            type="number"
                            min="1"
                            value={part.quantity}
                            onChange={(e) =>
                              handleQuantityChange(part.partId, parseInt(e.target.value) || 1)
                            }
                            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          />
                          <span className="text-xs text-gray-600">
                            小计: ¥{part.subtotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {tempSelectedParts.length > 0 && (
                  <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-800">
                      成本合计: ¥
                      {tempSelectedParts.reduce((sum, p) => sum + p.subtotal, 0).toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
          >
            确定
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}

// 新增/编辑模版弹框
function TemplateDialog({
  open,
  onClose,
  onSave,
  editData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Template;
}) {
  const [formData, setFormData] = useState({
    name: editData?.name || "",
    category: editData?.category || "",
    sellingPrice: editData?.sellingPrice?.toString() || "",
    remark: editData?.remark || "",
    status: editData?.status || "启用",
  });
  const [parts, setParts] = useState<KitPart[]>(editData?.parts || []);
  const [partsDialogOpen, setPartsDialogOpen] = useState(false);

  if (!open) return null;

  const costPrice = parts.reduce((sum, p) => sum + p.subtotal, 0);

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert("模版名称不能为空");
      return;
    }
    onSave({
      ...formData,
      sellingPrice: parseFloat(formData.sellingPrice) || 0,
      costPrice,
      parts,
      partsCount: parts.length,
    });
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden">
          <div
            className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between"
            style={{ backgroundColor: "#F9FAFB" }}
          >
            <h2 className="text-lg font-bold text-gray-800">
              {editData ? "编辑模版" : "新增模版"}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </div>

          <div className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                  <span className="text-red-500">*</span> 模版名称:
                </label>
                <input
                  type="text"
                  placeholder="请输入"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-20 shrink-0">分类:</label>
                <FauxSelect
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">请选择</option>
                  <option value="保养套件">保养套件</option>
                  <option value="刹车系统">刹车系统</option>
                  <option value="空调系统">空调系统</option>
                  <option value="发动机系统">发动机系统</option>
                </FauxSelect>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-20 shrink-0">销售价:</label>
                <div className="flex-1 flex items-center gap-1">
                  <span className="text-sm text-gray-500">¥</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-20 shrink-0">成本价:</label>
                <div className="flex-1 flex items-center gap-1">
                  <span className="text-sm text-gray-500">¥</span>
                  <input
                    type="text"
                    value={costPrice.toFixed(2)}
                    disabled
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded bg-gray-50 text-gray-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 w-20 shrink-0">
                  <span className="text-red-500">*</span> 启用状态:
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === "启用"}
                      onChange={() => setFormData({ ...formData, status: "启用" })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">启用</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={formData.status === "停用"}
                      onChange={() => setFormData({ ...formData, status: "停用" })}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">停用</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <label className="text-sm font-medium text-gray-700 w-20 shrink-0 pt-1.5">备注:</label>
              <textarea
                placeholder="请输入"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                rows={2}
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none placeholder:text-gray-400"
              />
            </div>

            <div className="border-t border-gray-200 pt-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-700">配件清单 ({parts.length})</h3>
                <button
                  onClick={() => setPartsDialogOpen(true)}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  选择配件
                </button>
              </div>
              {parts.length === 0 ? (
                <div className="text-sm text-gray-400 text-center py-4 bg-gray-50 rounded border border-dashed border-gray-200">
                  暂未添加配件
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">配件名称</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">编码</th>
                        <th className="px-3 py-2 text-left font-semibold text-gray-700">规格</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">数量</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">成本</th>
                        <th className="px-3 py-2 text-right font-semibold text-gray-700">小计</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((part) => (
                        <tr key={part.partId} className="border-b border-gray-100 last:border-0">
                          <td className="px-3 py-2 text-gray-900">{part.partName}</td>
                          <td className="px-3 py-2 text-gray-600">{part.partCode}</td>
                          <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                          <td className="px-3 py-2 text-right text-gray-700">{part.quantity}</td>
                          <td className="px-3 py-2 text-right text-gray-700">¥{part.costPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right text-gray-900 font-medium">¥{part.subtotal.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
            >
              保存
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
            >
              关闭
            </button>
          </div>
        </div>
      </div>

      <PartsSelectionDialog
        open={partsDialogOpen}
        onClose={() => setPartsDialogOpen(false)}
        onConfirm={(selectedParts) => setParts(selectedParts)}
        selectedParts={parts}
      />
    </>
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

export function TemplateManagement() {
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [data, setData] = useState<Template[]>(mockTemplates);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Template | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<Template | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName = !searchName || item.name.includes(searchName);
      const matchCategory = !searchCategory || item.category === searchCategory;
      return matchName && matchCategory;
    });
  }, [data, searchName, searchCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReset = () => {
    setSearchName("");
    setSearchCategory("");
    setCurrentPage(1);
  };

  const handleDelete = (item: Template) => {
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
      setData((prev) =>
        prev.map((item) =>
          item.id === editingItem.id ? { ...item, ...formData } : item
        )
      );
    } else {
      const newTemplate: Template = {
        id: Date.now().toString(),
        code: `KIT${String(data.length + 1).padStart(3, '0')}`,
        ...formData,
        createTime: (() => {
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const day = String(now.getDate()).padStart(2, '0');
          const hour = String(now.getHours()).padStart(2, '0');
          const minute = String(now.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day} ${hour}:${minute}`;
        })(),
      };
      setData((prev) => [...prev, newTemplate]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">模版管理</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-20">
              模版名称:
            </label>
            <input
              type="text"
              placeholder="请输入模版名称"
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
              分类:
            </label>
            <FauxSelect
              value={searchCategory}
              onChange={(e) => {
                setSearchCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-36 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
            >
              <option value="">全部</option>
              <option value="保养套件">保养套件</option>
              <option value="刹车系统">刹车系统</option>
              <option value="空调系统">空调系统</option>
              <option value="发动机系统">发动机系统</option>
            </FauxSelect>
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
            新增模版
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full" style={{ minWidth: "1000px" }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                模版编号
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                模版名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                分类
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">
                销售价
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">
                成本价
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                配件数量
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                状态
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                创建时间
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-16 text-center text-sm text-gray-400"
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              pagedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">
                    {item.code}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">
                    {item.category || "—"}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-900 text-right font-medium">
                    ¥{item.sellingPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 text-right">
                    ¥{item.costPrice.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 text-center">
                    {item.partsCount}
                  </td>
                  <td className="px-4 py-2.5 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "启用"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.status}
                    </span>
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
            共 <span className="font-semibold text-gray-800">{filteredData.length}</span> 条数据
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
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              前往
              <input
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = parseInt((e.target as HTMLInputElement).value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }
                }}
                className="w-12 px-2 py-1 text-center border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
              />
              页
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <TemplateDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        editData={editingItem}
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={deleteItem ? deleteItem.name : ""}
      />
    </div>
  );
}
