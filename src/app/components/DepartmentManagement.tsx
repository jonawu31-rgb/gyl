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

interface Department {
  id: string;
  deptName: string;
  parentId: string | null;
  parentName: string | null;
  sortValue: number;
  status: "启用" | "停用";
  createTime: string;
}

const mockDepartments: Department[] = [
  {
    id: "1",
    deptName: "总经办",
    parentId: null,
    parentName: null,
    sortValue: 1,
    status: "启用",
    createTime: "2024-01-10 09:00:00",
  },
  {
    id: "2",
    deptName: "财务部",
    parentId: null,
    parentName: null,
    sortValue: 2,
    status: "启用",
    createTime: "2024-01-10 09:15:00",
  },
  {
    id: "3",
    deptName: "销售部",
    parentId: null,
    parentName: null,
    sortValue: 3,
    status: "启用",
    createTime: "2024-01-10 09:30:00",
  },
  {
    id: "4",
    deptName: "售后部",
    parentId: null,
    parentName: null,
    sortValue: 4,
    status: "启用",
    createTime: "2024-01-10 09:45:00",
  },
  {
    id: "5",
    deptName: "仓储部",
    parentId: null,
    parentName: null,
    sortValue: 5,
    status: "启用",
    createTime: "2024-01-10 10:00:00",
  },
  {
    id: "6",
    deptName: "销售一组",
    parentId: "3",
    parentName: "销售部",
    sortValue: 1,
    status: "启用",
    createTime: "2024-01-15 10:00:00",
  },
  {
    id: "7",
    deptName: "销售二组",
    parentId: "3",
    parentName: "销售部",
    sortValue: 2,
    status: "启用",
    createTime: "2024-01-15 10:15:00",
  },
  {
    id: "8",
    deptName: "仓库管理组",
    parentId: "5",
    parentName: "仓储部",
    sortValue: 1,
    status: "启用",
    createTime: "2024-01-20 11:00:00",
  },
  {
    id: "9",
    deptName: "物流配送组",
    parentId: "5",
    parentName: "仓储部",
    sortValue: 2,
    status: "停用",
    createTime: "2024-01-20 11:15:00",
  },
];

// 新增/编辑部门弹框
function DepartmentDialog({
  open,
  onClose,
  onSave,
  editData,
  allDepartments,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  editData?: Department;
  allDepartments: Department[];
}) {
  const [formData, setFormData] = useState({
    parentId: editData?.parentId || "",
    deptName: editData?.deptName || "",
    sortValue: editData?.sortValue?.toString() || "0",
    status: editData?.status || "启用",
  });
  const [parentSearch, setParentSearch] = useState("");

  const availableParents = useMemo(() => {
    // 过滤掉当前正在编辑的部门（不能选自己作为上级）
    let filtered = allDepartments.filter((d) => d.id !== editData?.id);
    if (parentSearch) {
      filtered = filtered.filter((d) =>
        d.deptName.toLowerCase().includes(parentSearch.toLowerCase())
      );
    }
    return filtered;
  }, [allDepartments, editData, parentSearch]);

  if (!open) return null;

  const handleSave = () => {
    if (!formData.deptName.trim()) {
      alert("部门名称不能为空");
      return;
    }
    onSave({
      ...formData,
      sortValue: parseInt(formData.sortValue) || 0,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div
          className="px-5 py-3 border-b border-gray-200 flex items-center justify-between"
          style={{ backgroundColor: "#F9FAFB" }}
        >
          <h3 className="text-base font-bold text-gray-800">
            {editData ? "编辑部门" : "新增部门"}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* 上级部门 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              上级部门
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="请选择或搜索上级部门"
                value={
                  formData.parentId
                    ? allDepartments.find((d) => d.id === formData.parentId)
                        ?.deptName || ""
                    : parentSearch
                }
                onChange={(e) => {
                  setParentSearch(e.target.value);
                  if (!e.target.value) {
                    setFormData({ ...formData, parentId: "" });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
              />
              {parentSearch && availableParents.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                  <div
                    onClick={() => {
                      setFormData({ ...formData, parentId: "" });
                      setParentSearch("");
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 cursor-pointer"
                  >
                    无上级部门
                  </div>
                  {availableParents.map((dept) => (
                    <div
                      key={dept.id}
                      onClick={() => {
                        setFormData({ ...formData, parentId: dept.id });
                        setParentSearch("");
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                    >
                      {dept.deptName}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 部门名称 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              部门名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="请输入部门名称"
              value={formData.deptName}
              onChange={(e) =>
                setFormData({ ...formData, deptName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>

          {/* 排序值 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              排序值 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const val = parseInt(formData.sortValue) || 0;
                  setFormData({
                    ...formData,
                    sortValue: Math.max(0, val - 1).toString(),
                  });
                }}
                className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                -
              </button>
              <input
                type="number"
                value={formData.sortValue}
                onChange={(e) =>
                  setFormData({ ...formData, sortValue: e.target.value })
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm text-center placeholder:text-gray-400"
                placeholder="0"
              />
              <button
                onClick={() => {
                  const val = parseInt(formData.sortValue) || 0;
                  setFormData({ ...formData, sortValue: (val + 1).toString() });
                }}
                className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* 启用状态 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              启用状态 <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "启用"}
                  onChange={() => setFormData({ ...formData, status: "启用" })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">启用</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "停用"}
                  onChange={() => setFormData({ ...formData, status: "停用" })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">停用</span>
              </label>
            </div>
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

export function DepartmentManagement() {
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [data, setData] = useState<Department[]>(mockDepartments);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Department | undefined>(
    undefined
  );
  const [deleteItem, setDeleteItem] = useState<Department | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchName = !searchName || item.deptName.includes(searchName);
      const matchStatus = !searchStatus || item.status === searchStatus;
      return matchName && matchStatus;
    });
  }, [data, searchName, searchStatus]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleReset = () => {
    setSearchName("");
    setSearchStatus("");
    setCurrentPage(1);
  };

  const handleDelete = (item: Department) => {
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
          item.id === editingItem.id
            ? {
                ...item,
                ...formData,
                parentName:
                  data.find((d) => d.id === formData.parentId)?.deptName ||
                  null,
              }
            : item
        )
      );
    } else {
      // 新增
      const newDept: Department = {
        id: Date.now().toString(),
        deptName: formData.deptName,
        parentId: formData.parentId || null,
        parentName:
          data.find((d) => d.id === formData.parentId)?.deptName || null,
        sortValue: formData.sortValue,
        status: formData.status,
        createTime: new Date().toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };
      setData((prev) => [...prev, newDept]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">部门管理</h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-20">
              部门名称:
            </label>
            <input
              type="text"
              placeholder="请输入部门名称"
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
              状态:
            </label>
            <FauxSelect
              value={searchStatus}
              onChange={(e) => {
                setSearchStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-36 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all"
            >
              <option value="">请选择状态</option>
              <option value="启用">启用</option>
              <option value="停用">停用</option>
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
            新增
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                部门名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                排序
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">
                状态
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                创建日期
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
                  colSpan={5}
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
                  <td className="px-4 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {item.deptName}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-gray-700 whitespace-nowrap">
                    {item.sortValue}
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
      <DepartmentDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        editData={editingItem}
        allDepartments={data}
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={deleteItem ? deleteItem.deptName : ""}
      />
    </div>
  );
}
