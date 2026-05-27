import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";

interface CategoryType {
  id: number;
  categoryName: string;
  code: string;
  parentId: number | null;
  sortValue: number;
  remark: string;
  createTime: string;
  children?: CategoryType[];
}

export function CategoryTypeManagement() {
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentCategory, setCurrentCategory] = useState<CategoryType | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CategoryType | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  const [categories, setCategories] = useState<CategoryType[]>([
    {
      id: 1,
      categoryName: "养护",
      code: "FL0001",
      parentId: null,
      sortValue: 0,
      remark: "",
      createTime: "2026-01-09 11:50:36",
    },
    {
      id: 2,
      categoryName: "维修",
      code: "FL0002",
      parentId: null,
      sortValue: 0,
      remark: "",
      createTime: "2026-01-09 11:50:36",
    },
    {
      id: 3,
      categoryName: "洗美",
      code: "FL0003",
      parentId: null,
      sortValue: 0,
      remark: "",
      createTime: "2026-01-09 11:50:36",
    },
    {
      id: 4,
      categoryName: "精品",
      code: "FL0004",
      parentId: null,
      sortValue: 0,
      remark: "",
      createTime: "2026-01-09 11:50:36",
    },
    {
      id: 5,
      categoryName: "其他",
      code: "FL0005",
      parentId: null,
      sortValue: 1,
      remark: "",
      createTime: "2026-01-21 13:23:09",
    },
  ]);

  const [formData, setFormData] = useState({
    categoryName: "",
    parentId: null as number | null,
    sortValue: 0,
    remark: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 生成下一个编码
  const generateCode = () => {
    const maxCode = categories.reduce((max, cat) => {
      const num = parseInt(cat.code.replace("FL", ""));
      return num > max ? num : max;
    }, 0);
    return `FL${String(maxCode + 1).padStart(4, "0")}`;
  };

  // 构建树形结构
  const buildTree = (items: CategoryType[]): CategoryType[] => {
    const map = new Map<number, CategoryType>();
    const roots: CategoryType[] = [];

    // 创建映射
    items.forEach((item) => {
      map.set(item.id, { ...item, children: [] });
    });

    // 构建树
    items.forEach((item) => {
      const node = map.get(item.id)!;
      if (item.parentId === null) {
        roots.push(node);
      } else {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children!.push(node);
        }
      }
    });

    // 排序
    const sortNodes = (nodes: CategoryType[]) => {
      nodes.sort((a, b) => a.sortValue - b.sortValue);
      nodes.forEach((node) => {
        if (node.children && node.children.length > 0) {
          sortNodes(node.children);
        }
      });
    };

    sortNodes(roots);
    return roots;
  };

  // 搜索过滤
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const nameMatch = searchName
        ? cat.categoryName.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const codeMatch = searchCode ? cat.code === searchCode : true;
      return nameMatch && codeMatch;
    });
  }, [categories, searchName, searchCode]);

  // 树形结构
  const treeData = useMemo(() => {
    return buildTree(filteredCategories);
  }, [filteredCategories]);

  // 扁平化树形数据用于分页
  const flattenTree = (nodes: CategoryType[], level = 0): Array<CategoryType & { level: number }> => {
    let result: Array<CategoryType & { level: number }> = [];
    nodes.forEach((node) => {
      result.push({ ...node, level });
      if (expandedIds.has(node.id) && node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, level + 1));
      }
    });
    return result;
  };

  const flatData = useMemo(() => flattenTree(treeData), [treeData, expandedIds]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return flatData.slice(startIndex, startIndex + itemsPerPage);
  }, [flatData, currentPage]);

  const totalPages = Math.ceil(flatData.length / itemsPerPage);

  // 切换展开/折叠
  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 重置
  const handleReset = () => {
    setSearchName("");
    setSearchCode("");
    setCurrentPage(1);
  };

  // 打开新增弹框
  const handleAdd = (parentId: number | null = null) => {
    setDialogMode("add");
    setFormData({
      categoryName: "",
      parentId,
      sortValue: 0,
      remark: "",
    });
    setShowDialog(true);
  };

  // 打开编辑弹框
  const handleEdit = (category: CategoryType) => {
    setDialogMode("edit");
    setCurrentCategory(category);
    setFormData({
      categoryName: category.categoryName,
      parentId: category.parentId,
      sortValue: category.sortValue,
      remark: category.remark,
    });
    setShowDialog(true);
  };

  // 打开删除确认框
  const handleDeleteClick = (category: CategoryType) => {
    setDeleteTarget(category);
    setShowDeleteDialog(true);
  };

  // 确认删除
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      // 检查是否有子品类
      const hasChildren = categories.some((cat) => cat.parentId === deleteTarget.id);
      if (hasChildren) {
        alert("该品类下有子品类，无法删除");
        setShowDeleteDialog(false);
        return;
      }

      setCategories(categories.filter((c) => c.id !== deleteTarget.id));
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      alert("删除成功");
    }
  };

  // 提交表单
  const handleSubmit = () => {
    if (!formData.categoryName.trim()) {
      alert("请输入品类名称");
      return;
    }

    if (dialogMode === "add") {
      const newCategory: CategoryType = {
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        categoryName: formData.categoryName,
        code: generateCode(),
        parentId: formData.parentId,
        sortValue: formData.sortValue,
        remark: formData.remark,
        createTime: new Date().toISOString().replace("T", " ").slice(0, 19),
      };
      setCategories([...categories, newCategory]);
      alert("新增成功");
    } else {
      if (currentCategory) {
        setCategories(
          categories.map((c) =>
            c.id === currentCategory.id
              ? {
                  ...c,
                  categoryName: formData.categoryName,
                  parentId: formData.parentId,
                  sortValue: formData.sortValue,
                  remark: formData.remark,
                }
              : c
          )
        );
        alert("编辑成功");
      }
    }
    setShowDialog(false);
  };

  // 获取品类选项（用于上级品类下拉）
  const getCategoryOptions = (excludeId?: number): CategoryType[] => {
    return categories.filter((cat) => cat.id !== excludeId);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">品类管理</h2>
          <button
            onClick={() => handleAdd(null)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            <AddIcon sx={{ fontSize: 18 }} />
            新增
          </button>
        </div>
      </div>

      {/* Search Area */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="请输入品类名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>
          <div className="flex-1 max-w-xs">
            <input
              type="text"
              placeholder="请输入编码"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            <SearchIcon sx={{ fontSize: 16 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
          >
            重置
          </button>
        </div>
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
                品类名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                编码
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
            {paginatedData.map((item, index) => {
              const hasChildren = categories.some((cat) => cat.parentId === item.id);
              const isExpanded = expandedIds.has(item.id);

              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    <div
                      className="flex items-center gap-1"
                      style={{ paddingLeft: `${item.level * 24}px` }}
                    >
                      {hasChildren ? (
                        <button
                          onClick={() => toggleExpand(item.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <ExpandMoreIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <ChevronRightIcon sx={{ fontSize: 18 }} />
                          )}
                        </button>
                      ) : (
                        <span className="w-[18px]" />
                      )}
                      <span>{item.categoryName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.code}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {item.sortValue}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.remark || "-"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.createTime}
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-blue-600 hover:text-blue-700 hover:underline mr-2"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteClick(item)}
                      className="text-red-600 hover:text-red-700 hover:underline mr-2"
                    >
                      删除
                    </button>
                    <button
                      onClick={() => handleAdd(item.id)}
                      className="text-green-600 hover:text-green-700 hover:underline"
                    >
                      新增
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            共 {flatData.length} 条数据，每页 {itemsPerPage} 条
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <span className="text-gray-600">
              第 {currentPage} 页，共 {totalPages} 页
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                {dialogMode === "add" ? "新增品类" : "编辑品类"}
              </h3>
            </div>
            <div className="px-5 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  上级品类
                </label>
                <select
                  value={formData.parentId ?? ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      parentId: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm"
                >
                  <option value="">无（一级品类）</option>
                  {getCategoryOptions(currentCategory?.id).map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="text-red-500">*</span> 品类名称
                </label>
                <input
                  type="text"
                  placeholder="请输入品类名称"
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
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
                  placeholder="请输入描述"
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
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
              <h3 className="text-lg font-semibold text-gray-800">提示</h3>
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
