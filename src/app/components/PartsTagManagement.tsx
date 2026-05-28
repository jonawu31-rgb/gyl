import { useMemo, useState, type ReactNode } from "react";
import {
  Add as AddIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

type TagRow = {
  id: string;
  name: string;
  sortValue: number;
};

const initialRows: TagRow[] = [
  { id: "1", name: "新款到货", sortValue: 0 },
  { id: "2", name: "热销推荐", sortValue: 0 },
];

function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  maxWidth = "max-w-lg",
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl ${maxWidth}`}>
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
            aria-label="关闭"
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-4">{children}</div>

        {footer ? <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export function PartsTagManagement() {
  const [rows, setRows] = useState<TagRow[]>(initialRows);
  const [searchDraft, setSearchDraft] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);

  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "delete" | null>(null);
  const [editingRow, setEditingRow] = useState<TagRow | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formSortValue, setFormSortValue] = useState<number>(0);

  const filteredRows = useMemo(() => {
    const keyword = searchQuery.trim();
    if (!keyword) return rows;
    return rows.filter((row) => row.name.includes(keyword));
  }, [rows, searchQuery]);

  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageRows = filteredRows.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openCreate = () => {
    setEditingRow(null);
    setFormName("");
    setFormSortValue(0);
    setDialogMode("create");
  };

  const openEdit = (row: TagRow) => {
    setEditingRow(row);
    setFormName(row.name);
    setFormSortValue(row.sortValue);
    setDialogMode("edit");
  };

  const openDelete = (id: string) => {
    setPendingDeleteId(id);
    setDialogMode("delete");
  };

  const runSearch = () => {
    setSearchQuery(searchDraft);
    setPage(1);
  };

  const resetSearch = () => {
    setSearchDraft("");
    setSearchQuery("");
    setPage(1);
  };

  const handleSave = () => {
    const name = formName.trim();
    if (!name) return;

    if (dialogMode === "create") {
      setRows((current) => [{ id: String(Date.now()), name, sortValue: formSortValue }, ...current]);
    }

    if (dialogMode === "edit" && editingRow) {
      setRows((current) =>
        current.map((row) => (row.id === editingRow.id ? { ...row, name, sortValue: formSortValue } : row)),
      );
    }

    setDialogMode(null);
    setEditingRow(null);
  };

  const handleDelete = () => {
    if (!pendingDeleteId) return;
    setRows((current) => current.filter((row) => row.id !== pendingDeleteId));
    setPendingDeleteId(null);
    setDialogMode(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            </span>
            <h2 className="text-lg font-bold text-gray-800">配件标签管理</h2>
          </div>
        </div>

        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2563eb]"
            >
              <AddIcon sx={{ fontSize: 16 }} />
              新增
            </button>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <button
                onClick={runSearch}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2563eb]"
              >
                <SearchIcon sx={{ fontSize: 16 }} />
                搜索
              </button>
              <button
                onClick={resetSearch}
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                <RefreshIcon sx={{ fontSize: 16 }} />
                重置
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 bg-white px-4 py-3">
          <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.4fr_auto] xl:items-end">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr] md:items-end">
              <div className="text-sm text-gray-700">标签名称</div>
              <div className="relative">
                <SearchIcon sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchDraft}
                  onChange={(e) => setSearchDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") runSearch();
                  }}
                  placeholder="标签名称"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            <table className="w-full table-auto">
              <thead className="sticky top-0 z-10 bg-[#eff6ff]">
                <tr className="border-b border-[#dbeafe]">
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">序号</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">标签名称</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">排序值</th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length > 0 ? (
                  pageRows.map((row, index) => (
                    <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/40">
                      <td className="px-3 py-2 text-sm text-blue-600">{(safePage - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{row.name}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{row.sortValue}</td>
                      <td className="px-3 py-2 text-center">
                        <div className="inline-flex items-center gap-3 whitespace-nowrap">
                          <button
                            onClick={() => openEdit(row)}
                            className="inline-flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-700"
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                            编辑
                          </button>
                          <button
                            onClick={() => openDelete(row.id)}
                            className="inline-flex items-center gap-1 text-red-500 transition-colors hover:text-red-600"
                          >
                            <DeleteIcon sx={{ fontSize: 16 }} />
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="h-[320px] text-center text-sm text-gray-400">
                      暂无数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-600">
          <div>共 {total} 条数据</div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <FauxSelect
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="appearance-none rounded-lg border border-gray-200 bg-white px-3 py-1.5 pr-8 text-sm text-gray-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                {[10, 20, 30, 40, 50].map((item) => (
                  <option key={item} value={item}>
                    {item}条/页
                  </option>
                ))}
              </FauxSelect>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
            </div>

            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-500 disabled:opacity-50"
            >
              ‹
            </button>
            <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">{safePage}</button>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-500 disabled:opacity-50"
            >
              ›
            </button>
            <div className="flex items-center gap-1">
              <span>前往</span>
              <input
                value={safePage}
                readOnly
                className="h-7 w-10 rounded border border-gray-200 bg-white text-center text-sm text-gray-700 outline-none"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </section>

      <Modal
        open={dialogMode === "create"}
        title="新增标签"
        onClose={() => setDialogMode(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDialogMode(null)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white hover:bg-[#2563eb]"
            >
              确定
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-[90px_1fr] items-center gap-3">
            <label className="text-sm text-gray-700">
              标签名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="请输入标签名称"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/15"
            />
          </div>
          <div className="grid grid-cols-[90px_1fr] items-center gap-3">
            <label className="text-sm text-gray-700">
              排序值 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formSortValue}
              onChange={(e) => setFormSortValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/15"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={dialogMode === "edit"}
        title="编辑标签"
        onClose={() => setDialogMode(null)}
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDialogMode(null)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white hover:bg-[#2563eb]"
            >
              确定
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-[90px_1fr] items-center gap-3">
            <label className="text-sm text-gray-700">
              标签名称 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/15"
            />
          </div>
          <div className="grid grid-cols-[90px_1fr] items-center gap-3">
            <label className="text-sm text-gray-700">
              排序值 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formSortValue}
              onChange={(e) => setFormSortValue(Number(e.target.value))}
              className="w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/15"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={dialogMode === "delete"}
        title="提示"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDialogMode(null)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white hover:bg-[#2563eb]"
            >
              确定
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#fff3d6] p-2 text-[#ffb020]">
            <WarningAmberIcon sx={{ fontSize: 18 }} />
          </div>
          <div className="pt-1 text-sm text-gray-700">此操作将永久删除该数据，是否继续?</div>
        </div>
      </Modal>
    </div>
  );
}
