import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from "@mui/icons-material";

interface Brand {
  id: number;
  brandName: string;
  alias: string;
  manufacturerName: string;
  englishName: string;
  sortValue: number;
  logo: string;
  createTime: string;
}

export function BrandManagement() {
  const [searchBrandName, setSearchBrandName] = useState("");
  const [searchManufacturerName, setSearchManufacturerName] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

  const [brands, setBrands] = useState<Brand[]>([
    {
      id: 1,
      brandName: "清牛",
      alias: "",
      manufacturerName: "济南清牛汽车零部件有限公司",
      englishName: "QINGNIU",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 09:36:02",
    },
    {
      id: 2,
      brandName: "德国瑞思通",
      alias: "",
      manufacturerName: "",
      englishName: "LENSTON",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 09:58:52",
    },
    {
      id: 3,
      brandName: "奥天马",
      alias: "",
      manufacturerName: "",
      englishName: "AOTIANMA",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 11:06:30",
    },
    {
      id: 4,
      brandName: "伟华耐欧特",
      alias: "",
      manufacturerName: "",
      englishName: "HSNOT",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 11:21:04",
    },
    {
      id: 5,
      brandName: "埃索",
      alias: "",
      manufacturerName: "",
      englishName: "AISO",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 11:54:52",
    },
    {
      id: 6,
      brandName: "驰力克",
      alias: "",
      manufacturerName: "",
      englishName: "",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 12:02:07",
    },
    {
      id: 7,
      brandName: "战神",
      alias: "",
      manufacturerName: "",
      englishName: "",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 12:17:38",
    },
    {
      id: 8,
      brandName: "火尊",
      alias: "",
      manufacturerName: "",
      englishName: "HZ",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 12:23:24",
    },
    {
      id: 9,
      brandName: "海飞",
      alias: "",
      manufacturerName: "",
      englishName: "Haifei",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 12:45:38",
    },
    {
      id: 10,
      brandName: "盟虎净",
      alias: "",
      manufacturerName: "",
      englishName: "",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-21 12:51:00",
    },
    {
      id: 11,
      brandName: "原厂",
      alias: "",
      manufacturerName: "",
      englishName: "",
      sortValue: 0,
      logo: "",
      createTime: "2026-01-22 12:49:05",
    },
    {
      id: 12,
      brandName: "乐学",
      alias: "",
      manufacturerName: "",
      englishName: "",
      sortValue: 0,
      logo: "",
      createTime: "2026-03-16 14:48:18",
    },
  ]);

  const [formData, setFormData] = useState({
    brandName: "",
    alias: "",
    manufacturerName: "",
    englishName: "",
    sortValue: 0,
    logo: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 搜索过滤
  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const brandNameMatch = searchBrandName
        ? brand.brandName.toLowerCase().includes(searchBrandName.toLowerCase())
        : true;
      const manufacturerMatch = searchManufacturerName
        ? brand.manufacturerName
            .toLowerCase()
            .includes(searchManufacturerName.toLowerCase())
        : true;
      return brandNameMatch && manufacturerMatch;
    });
  }, [brands, searchBrandName, searchManufacturerName]);

  // 分页数据
  const paginatedBrands = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredBrands.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBrands, currentPage]);

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  // 搜索
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // 重置
  const handleReset = () => {
    setSearchBrandName("");
    setSearchManufacturerName("");
    setCurrentPage(1);
  };

  // 打开新增弹框
  const handleAdd = () => {
    setDialogMode("add");
    setFormData({
      brandName: "",
      alias: "",
      manufacturerName: "",
      englishName: "",
      sortValue: 0,
      logo: "",
    });
    setShowDialog(true);
  };

  // 打开编辑弹框
  const handleEdit = (brand: Brand) => {
    setDialogMode("edit");
    setCurrentBrand(brand);
    setFormData({
      brandName: brand.brandName,
      alias: brand.alias,
      manufacturerName: brand.manufacturerName,
      englishName: brand.englishName,
      sortValue: brand.sortValue,
      logo: brand.logo,
    });
    setShowDialog(true);
  };

  // 打开删除确认框
  const handleDeleteClick = (brand: Brand) => {
    setDeleteTarget(brand);
    setShowDeleteDialog(true);
  };

  // 确认删除
  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      setBrands(brands.filter((b) => b.id !== deleteTarget.id));
      setShowDeleteDialog(false);
      setDeleteTarget(null);
      alert("删除成功");
    }
  };

  // 提交表单
  const handleSubmit = () => {
    if (!formData.brandName.trim()) {
      alert("请输入品牌名称");
      return;
    }

    if (dialogMode === "add") {
      const newBrand: Brand = {
        id: Math.max(0, ...brands.map((b) => b.id)) + 1,
        brandName: formData.brandName,
        alias: formData.alias,
        manufacturerName: formData.manufacturerName,
        englishName: formData.englishName,
        sortValue: formData.sortValue,
        logo: formData.logo,
        createTime: new Date().toISOString().replace("T", " ").slice(0, 19),
      };
      setBrands([...brands, newBrand]);
      alert("新增成功");
    } else {
      if (currentBrand) {
        setBrands(
          brands.map((b) =>
            b.id === currentBrand.id
              ? {
                  ...b,
                  brandName: formData.brandName,
                  alias: formData.alias,
                  manufacturerName: formData.manufacturerName,
                  englishName: formData.englishName,
                  sortValue: formData.sortValue,
                  logo: formData.logo,
                }
              : b
          )
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
          <h2 className="text-lg font-bold text-gray-800">品牌管理</h2>
        </div>
      </div>

      {/* Search Area */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-20">
              品牌名称:
            </label>
            <input
              type="text"
              placeholder="请输入品牌名称"
              value={searchBrandName}
              onChange={(e) => {
                setSearchBrandName(e.target.value);
                setCurrentPage(1);
              }}
              className="w-48 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-20">
              厂家名称:
            </label>
            <input
              type="text"
              placeholder="请输入厂家名称"
              value={searchManufacturerName}
              onChange={(e) => {
                setSearchManufacturerName(e.target.value);
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
                品牌名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                别名
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                厂家名称
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">
                英文名
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
            {paginatedBrands.map((brand, index) => (
              <tr key={brand.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800">
                  {brand.brandName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {brand.alias || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {brand.manufacturerName || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {brand.englishName || "-"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {brand.createTime}
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <button
                    onClick={() => handleEdit(brand)}
                    className="text-blue-600 hover:text-blue-700 hover:underline mr-3"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteClick(brand)}
                    className="text-red-600 hover:text-red-700 hover:underline"
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
            共 {filteredBrands.length} 条数据，每页 {itemsPerPage} 条
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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                {dialogMode === "add" ? "新增品牌" : "编辑品牌"}
              </h3>
              <button
                onClick={() => setShowDialog(false)}
                className="p-1 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded"
              >
                ×
              </button>
            </div>
            <div className="px-5 py-5 space-y-4 max-h-[72vh] overflow-y-auto">
              <div className="flex items-start gap-3">
                <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">
                  <span className="text-red-500">*</span> 品牌名称
                </label>
                <div className="flex-1">
                <input
                  type="text"
                  placeholder="请输入品牌名称"
                  value={formData.brandName}
                  onChange={(e) =>
                    setFormData({ ...formData, brandName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">
                  品牌别名
                </label>
                <div className="flex-1">
                <input
                  type="text"
                  placeholder="请输入品牌别名"
                  value={formData.alias}
                  onChange={(e) =>
                    setFormData({ ...formData, alias: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">
                  厂家名称
                </label>
                <div className="flex-1">
                <input
                  type="text"
                  placeholder="请输入厂家名称"
                  value={formData.manufacturerName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      manufacturerName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">
                  英文名
                </label>
                <div className="flex-1">
                <input
                  type="text"
                  placeholder="请输入英文名"
                  value={formData.englishName}
                  onChange={(e) =>
                    setFormData({ ...formData, englishName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
                />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">
                  <span className="text-red-500">*</span> 排序值
                </label>
                <div className="w-36">
                  <input
                    type="number"
                    value={formData.sortValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        sortValue: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                  />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <label className="w-20 shrink-0 pt-2 text-sm font-medium text-gray-700">
                  logo
                </label>
                <div>
                  <button
                    type="button"
                    className="flex h-28 w-28 items-center justify-center rounded-lg border border-dashed border-blue-200 bg-blue-50 text-blue-400 hover:border-blue-400 hover:text-blue-500 transition-colors text-3xl"
                  >
                    +
                  </button>
                  <p className="mt-2 text-xs text-gray-400">支持 JPG/PNG，建议正方形图片</p>
                </div>
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
