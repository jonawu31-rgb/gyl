import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

interface Category {
  id: string;
  categoryName: string;
  categoryCode: string;
  remark: string;
  createTime: string;
}

const mockCategories: Category[] = [
  {
    id: "1",
    categoryName: "四滤",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 10:48",
  },
  {
    id: "2",
    categoryName: "轮胎",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 10:48",
  },
  {
    id: "3",
    categoryName: "蓄电池",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 10:49",
  },
  {
    id: "4",
    categoryName: "润滑油",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 10:49",
  },
  {
    id: "5",
    categoryName: "刹车片",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 10:49",
  },
  {
    id: "6",
    categoryName: "点火系统",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 10:49",
  },
  {
    id: "7",
    categoryName: "养护",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 10:50",
  },
  {
    id: "8",
    categoryName: "LED灯",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 12:19",
  },
  {
    id: "9",
    categoryName: "雨刮片",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-21 12:53",
  },
  {
    id: "10",
    categoryName: "全车件",
    categoryCode: "",
    remark: "",
    createTime: "2026-01-22 12:12",
  },
];

// 新增/编辑类别弹框
function CategoryDialog({
  open,
  onClose,
  onSave,
  editData,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Category;
}) {
  const [formData, setFormData] = useState({
    categoryName: editData?.categoryName || "",
    categoryCode: editData?.categoryCode || "",
    remark: editData?.remark || "",
  });

  if (!open) return null;

  const handleSave = () => {
    if (!formData.categoryName.trim()) {
      alert("类别名称不能为空");
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
            {editData ? "编辑类别" : "新增类别"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 类别名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <span className="text-red-500">*</span> 类别名称
            </label>
            <input
              type="text"
              placeholder="请输入类别名称"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 类别编码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              类别编码
            </label>
            <input
              type="text"
              placeholder="请输入类别编码"
              value={formData.categoryCode}
              onChange={(e) =>
                setFormData({ ...formData, categoryCode: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 备注 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <input
              type="text"
              placeholder="请输入备注"
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

export function CategoryManagement() {
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [data, setData] = useState<Category[]>(mockCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Category | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName = !searchName || item.categoryName.includes(searchName);
      const matchCode = !searchCode || item.categoryCode.includes(searchCode);
      return matchName && matchCode;
    });
  }, [data, searchName, searchCode]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReset = () => {
    setSearchName("");
    setSearchCode("");
    setCurrentPage(1);
  };

  const handleDelete = (item: Category) => {
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
      const newCategory: Category = {
        id: Date.now().toString(),
        ...formData,
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
      setData((prev) => [...prev, newCategory]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">类别管理</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              placeholder="请输入类别名称"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              placeholder="请输入类型编码"
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
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
                类别名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                类别编码
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                备注
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ width: "150px" }}>
                创建时间
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ width: "120px" }}>
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
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
                    {item.categoryName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-600 whitespace-nowrap">
                    {item.categoryCode || "—"}
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
      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        editData={editingItem}
      />

      <DeleteConfirmDialog
        open={deleteItem !== null}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={deleteItem?.categoryName || ""}
      />
    </div>
  );
}
