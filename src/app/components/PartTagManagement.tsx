import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

interface PartTag {
  id: string;
  labelName: string;
  sortValue: number;
}

const INITIAL_TAGS: PartTag[] = [
  { id: "1", labelName: "新款到货", sortValue: 0 },
  { id: "2", labelName: "热销推荐", sortValue: 1 },
  { id: "3", labelName: "限时特惠", sortValue: 2 },
  { id: "4", labelName: "原厂配件", sortValue: 3 },
  { id: "5", labelName: "品牌直供", sortValue: 4 },
  { id: "6", labelName: "临期清仓", sortValue: 5 },
];

type DialogMode = "add" | "edit" | "delete" | null;

export function PartTagManagement() {
  const [tags, setTags] = useState<PartTag[]>(INITIAL_TAGS);

  // 搜索
  const [searchName, setSearchName] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  // 分页
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState("1");

  // 弹框
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [editingTag, setEditingTag] = useState<PartTag | null>(null);
  const [deletingTag, setDeletingTag] = useState<PartTag | null>(null);

  // 表单
  const [formName, setFormName] = useState("");
  const [formSort, setFormSort] = useState(0);
  const [nameError, setNameError] = useState("");

  // 过滤 + 排序
  const filtered = useMemo(() => {
    const kw = activeSearch.trim().toLowerCase();
    return [...tags]
      .filter((t) => !kw || t.labelName.toLowerCase().includes(kw))
      .sort((a, b) => a.sortValue - b.sortValue || a.id.localeCompare(b.id));
  }, [tags, activeSearch]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearch = () => {
    setActiveSearch(searchName);
    setCurrentPage(1);
    setJumpPage("1");
  };

  const handleReset = () => {
    setSearchName("");
    setActiveSearch("");
    setCurrentPage(1);
    setJumpPage("1");
  };

  // 打开新增
  const openAdd = () => {
    setFormName("");
    setFormSort(0);
    setNameError("");
    setDialogMode("add");
  };

  // 打开编辑
  const openEdit = (tag: PartTag) => {
    setEditingTag(tag);
    setFormName(tag.labelName);
    setFormSort(tag.sortValue);
    setNameError("");
    setDialogMode("edit");
  };

  // 打开删除
  const openDelete = (tag: PartTag) => {
    setDeletingTag(tag);
    setDialogMode("delete");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setEditingTag(null);
    setDeletingTag(null);
  };

  const adjustSort = (delta: number) => {
    setFormSort((prev) => Math.max(0, prev + delta));
  };

  const handleSortInput = (v: string) => {
    const n = parseInt(v, 10);
    setFormSort(isNaN(n) ? 0 : Math.max(0, n));
  };

  const validateAndSave = () => {
    const trimmed = formName.trim();
    if (!trimmed) {
      setNameError("标签名称不能为空");
      return;
    }
    // 唯一性校验（编辑时排除自身）
    const duplicate = tags.some(
      (t) =>
        t.labelName === trimmed &&
        (dialogMode === "add" || t.id !== editingTag?.id)
    );
    if (duplicate) {
      setNameError("标签名称已存在，请勿重复添加");
      return;
    }

    if (dialogMode === "add") {
      const newTag: PartTag = {
        id: Date.now().toString(),
        labelName: trimmed,
        sortValue: formSort,
      };
      setTags((prev) => [...prev, newTag]);
    } else if (dialogMode === "edit" && editingTag) {
      setTags((prev) =>
        prev.map((t) =>
          t.id === editingTag.id
            ? { ...t, labelName: trimmed, sortValue: formSort }
            : t
        )
      );
    }
    closeDialog();
  };

  const handleDelete = () => {
    if (!deletingTag) return;
    setTags((prev) => prev.filter((t) => t.id !== deletingTag.id));
    closeDialog();
  };

  const goToPage = (p: number) => {
    const clamped = Math.min(totalPages, Math.max(1, p));
    setCurrentPage(clamped);
    setJumpPage(String(clamped));
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 页面标题 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">配件标签管理</h2>
      </div>

      {/* 搜索区 */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0 whitespace-nowrap">标签名称</span>
            <input
              type="text"
              placeholder="请输入标签名称"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-56 px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
          >
            <SearchIcon sx={{ fontSize: 16 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
          >
            重置
          </button>
        </div>
      </div>

      {/* 操作栏 */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button
          onClick={openAdd}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
        >
          <AddIcon sx={{ fontSize: 16 }} />
          新增
        </button>
      </div>

      {/* 列表 */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-20">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">标签名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-40">排序值</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 w-36">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-16 text-center text-sm text-gray-400">
                  暂无数据
                </td>
              </tr>
            ) : (
              paged.map((tag, idx) => (
                <tr
                  key={tag.id}
                  className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {(currentPage - 1) * pageSize + idx + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                    {tag.labelName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {tag.sortValue}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(tag)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <EditIcon sx={{ fontSize: 14 }} />
                        编辑
                      </button>
                      <button
                        onClick={() => openDelete(tag)}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        <DeleteIcon sx={{ fontSize: 14 }} />
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

      {/* 分页 */}
      <div className="shrink-0 border-t border-gray-200 px-4 py-2.5 flex items-center justify-between bg-white">
        <div className="text-sm text-gray-600">
          共 <span className="font-semibold text-gray-800">{filtered.length}</span> 条数据
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); goToPage(1); }}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-blue-400"
          >
            {[10, 20, 30, 40, 50].map((n) => (
              <option key={n} value={n}>{n}条/页</option>
            ))}
          </select>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            上一页
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
            .map((p, i, arr) => (
              <span key={p} className="flex items-center gap-2">
                {i > 0 && arr[i - 1] !== p - 1 && (
                  <span className="text-gray-400 text-sm">…</span>
                )}
                <button
                  onClick={() => goToPage(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    currentPage === p
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {p}
                </button>
              </span>
            ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            下一页
          </button>
          <span className="text-sm text-gray-600">前往</span>
          <input
            type="number"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToPage(Number(jumpPage))}
            className="w-14 px-2 py-1.5 text-center bg-white border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
          />
          <span className="text-sm text-gray-600">页</span>
        </div>
      </div>

      {/* ===== 新增 / 编辑弹框 ===== */}
      {(dialogMode === "add" || dialogMode === "edit") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col w-[480px]">
            {/* Header */}
            <div
              className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <h2 className="text-lg font-bold text-gray-800">
                {dialogMode === "add" ? "新增标签" : "编辑标签"}
              </h2>
              <button
                onClick={closeDialog}
                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              {/* 标签名称 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入标签名称"
                  value={formName}
                  onChange={(e) => {
                    setFormName(e.target.value);
                    if (nameError) setNameError("");
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm placeholder:text-gray-400 transition-colors ${
                    nameError
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-gray-300 focus:border-blue-400 focus:ring-blue-100"
                  }`}
                />
                {nameError && (
                  <p className="mt-1 text-xs text-red-500">{nameError}</p>
                )}
              </div>

              {/* 排序值 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  排序值 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center w-40">
                  <button
                    onClick={() => adjustSort(-1)}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-l-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-lg leading-none transition-colors select-none"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={formSort}
                    onChange={(e) => handleSortInput(e.target.value)}
                    className="w-0 flex-1 h-9 px-2 border-t border-b border-gray-300 text-center text-sm focus:outline-none focus:border-blue-400 focus:ring-0 text-gray-800"
                  />
                  <button
                    onClick={() => adjustSort(1)}
                    className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-r-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-lg leading-none transition-colors select-none"
                  >
                    +
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">数值越小越靠前，默认为 0</p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                取消
              </button>
              <button
                onClick={validateAndSave}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== 删除确认弹框 ===== */}
      {dialogMode === "delete" && deletingTag && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl flex flex-col w-[420px]">
            <div
              className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0"
              style={{ backgroundColor: "#F9FAFB" }}
            >
              <h2 className="text-lg font-bold text-gray-800">删除确认</h2>
              <button
                onClick={closeDialog}
                className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </button>
            </div>

            <div className="p-6 flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <WarningIcon sx={{ fontSize: 22 }} className="text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  此操作将永久删除该数据，是否继续？
                </p>
                <p className="text-sm text-gray-500">
                  即将删除标签：<span className="font-medium text-gray-700">「{deletingTag.labelName}」</span>，删除后不可恢复。
                </p>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={closeDialog}
                className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-sm"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
