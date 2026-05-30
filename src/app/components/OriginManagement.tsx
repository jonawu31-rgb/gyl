import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

interface Origin {
  id: number;
  originName: string;
  sortValue: number;
  remark: string;
  createTime: string;
}

export function OriginManagement() {
  const [searchName, setSearchName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">(
    "add",
  );
  const [currentOrigin, setCurrentOrigin] =
    useState<Origin | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);
  const [deleteTarget, setDeleteTarget] =
    useState<Origin | null>(null);

  const [origins, setOrigins] = useState<Origin[]>([
    {
      id: 1,
      originName: "原厂",
      sortValue: 1,
      remark: "",
      createTime: "2026-01-22 12:49:05",
    },
    {
      id: 2,
      originName: "德国",
      sortValue: 2,
      remark: "德系品牌配件",
      createTime: "2026-01-22 13:05:12",
    },
    {
      id: 3,
      originName: "日本",
      sortValue: 3,
      remark: "日系品牌配件",
      createTime: "2026-01-22 13:10:28",
    },
    {
      id: 4,
      originName: "美国",
      sortValue: 4,
      remark: "美系品牌配件",
      createTime: "2026-01-22 13:15:45",
    },
    {
      id: 5,
      originName: "韩国",
      sortValue: 5,
      remark: "",
      createTime: "2026-01-22 13:20:33",
    },
    {
      id: 6,
      originName: "法国",
      sortValue: 6,
      remark: "",
      createTime: "2026-01-22 13:25:18",
    },
    {
      id: 7,
      originName: "国产",
      sortValue: 7,
      remark: "国产品牌配件",
      createTime: "2026-01-22 13:30:42",
    },
    {
      id: 8,
      originName: "合资",
      sortValue: 8,
      remark: "合资品牌配件",
      createTime: "2026-01-22 13:35:56",
    },
    {
      id: 9,
      originName: "台湾",
      sortValue: 9,
      remark: "",
      createTime: "2026-01-22 13:40:21",
    },
    {
      id: 10,
      originName: "意大利",
      sortValue: 10,
      remark: "",
      createTime: "2026-01-22 13:45:09",
    },
    {
      id: 11,
      originName: "英国",
      sortValue: 11,
      remark: "",
      createTime: "2026-01-22 13:50:34",
    },
    {
      id: 12,
      originName: "广东",
      sortValue: 12,
      remark: "广东地区生产",
      createTime: "2026-01-22 13:55:47",
    },
    {
      id: 13,
      originName: "浙江",
      sortValue: 13,
      remark: "浙江地区生产",
      createTime: "2026-01-22 14:00:15",
    },
    {
      id: 14,
      originName: "江苏",
      sortValue: 14,
      remark: "",
      createTime: "2026-01-22 14:05:28",
    },
    {
      id: 15,
      originName: "进口",
      sortValue: 15,
      remark: "进口配件",
      createTime: "2026-01-22 14:10:52",
    },
  ]);

  const [formData, setFormData] = useState({
    originName: "",
    sortValue: 0,
    remark: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 搜索过滤
  const filteredOrigins = useMemo(() => {
    return origins.filter((origin) => {
      const nameMatch = searchName
        ? origin.originName
            .toLowerCase()
            .includes(searchName.toLowerCase())
        : true;
      return nameMatch;
    });
  }, [origins, searchName]);

  // 分页数据
  const paginatedOrigins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrigins.slice(
      startIndex,
      startIndex + itemsPerPage,
    );
  }, [filteredOrigins, currentPage]);

  const totalPages = Math.ceil(
    filteredOrigins.length / itemsPerPage,
  );

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 重置
  const handleReset = () => {
    setSearchName("");
    setCurrentPage(1);
  };

  // 打开新增弹框
  const handleAdd = () => {
    setDialogMode("add");
    setFormData({
      originName: "",
      sortValue: 0,
      remark: "",
    });
    setShowDialog(true);
  };

  // 打开编辑弹框
  const handleEdit = (origin: Origin) => {
    setDialogMode("edit");
    setCurrentOrigin(origin);
    setFormData({
      originName: origin.originName,
      sortValue: origin.sortValue,
      remark: origin.remark,
    });
    setShowDialog(true);
  };

  // 打开删除确认框
  const handleDeleteClick = (origin: Origin) => {
    setDeleteTarget(origin);
    setShowDeleteDialog(true);
  };

  // 确认删除
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setOrigins(
        origins.filter((u) => u.id !== deleteTarget.id),
      );
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      alert("删除成功");
    }
  };

  // 提交表单
  const handleSubmit = () => {
    if (!formData.originName.trim()) {
      alert("请输入产地名称");
      return;
    }

    if (dialogMode === "add") {
      const newOrigin: Origin = {
        id: Math.max(0, ...origins.map((u) => u.id)) + 1,
        originName: formData.originName,
        sortValue: formData.sortValue,
        remark: formData.remark,
        createTime: new Date()
          .toISOString()
          .replace("T", " ")
          .slice(0, 19),
      };
      setOrigins([...origins, newOrigin]);
      alert("新增成功");
    } else {
      if (currentOrigin) {
        setOrigins(
          origins.map((u) =>
            u.id === currentOrigin.id
              ? {
                  ...u,
                  originName: formData.originName,
                  sortValue: formData.sortValue,
                  remark: formData.remark,
                }
              : u,
          ),
        );
        alert("编辑成功");
      }
    }
    setShowDialog(false);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">
            产地管理
          </h2>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-20">
              产地名称:
            </label>
            <input
              type="text"
              placeholder="请输入产地名称"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 shrink-0"
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
        <button
          onClick={handleAdd}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
        >
          <AddIcon sx={{ fontSize: 16 }} />
          新增
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                序号
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                产地名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                排序值
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                备注
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                创建时间
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedOrigins.map((origin, index) => (
              <tr
                key={origin.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-700">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {origin.originName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {origin.sortValue}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {origin.remark || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {origin.createTime}
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    onClick={() => handleEdit(origin)}
                    className="text-blue-600 hover:text-blue-700 hover:underline mr-3 text-[14px]"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteClick(origin)}
                    className="text-red-600 hover:text-red-700 hover:underline text-[14px]"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            共 {filteredOrigins.length} 条数据，每页{" "}
            {itemsPerPage} 条
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <span className="text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1),
                )
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                {dialogMode === "add" ? "新增产地" : "编辑产地"}
              </h3>
            </div>
            <div className="px-5 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span>{" "}
                  产地名称
                </label>
                <input
                  type="text"
                  placeholder="请输入产地名称"
                  value={formData.originName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      originName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> 排序值
                </label>
                <input
                  type="number"
                  value={formData.sortValue}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sortValue: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注
                </label>
                <input
                  type="text"
                  placeholder="请输入备注"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      remark: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                />
              </div>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDialog(false)}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                提示
              </h3>
            </div>
            <div className="px-5 py-6">
              <p className="text-sm text-gray-700">
                此操作将永久删除该数据, 是否继续?
              </p>
            </div>
            <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
