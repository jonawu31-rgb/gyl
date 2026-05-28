import { useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface Company {
  id: string;
  name: string;
  contact: string;
  phone: string;
  website: string;
  type: string;
  createdAt: string;
}

const mockData: Company[] = [
  { id: "1", name: "顺丰速运", contact: "张经理", phone: "400-811-1111", website: "www.sf-express.com", type: "异地", createdAt: "2026-01-10 09:00:00" },
  { id: "2", name: "韵达快递", contact: "李经理", phone: "400-821-6789", website: "www.yunda.com", type: "异地", createdAt: "2026-01-15 10:30:00" },
  { id: "3", name: "同城急送", contact: "王师傅", phone: "0571-88888888", website: "", type: "同城", createdAt: "2026-02-01 14:20:00" },
  { id: "4", name: "德邦物流", contact: "赵经理", phone: "400-828-8888", website: "www.deppon.com", type: "异地", createdAt: "2026-02-20 11:00:00" },
  { id: "5", name: "本地快运", contact: "孙总", phone: "13800138000", website: "", type: "同城", createdAt: "2026-03-05 16:45:00" },
];

interface DialogProps {
  open: boolean;
  editData: Company | null;
  onClose: () => void;
  onSave: (data: Omit<Company, "id" | "createdAt">) => void;
}

function CompanyDialog({ open, editData, onClose, onSave }: DialogProps) {
  const [form, setForm] = useState({
    name: editData?.name || "",
    phone: editData?.phone || "",
    contact: editData?.contact || "",
    website: editData?.website || "",
    type: editData?.type || "同城",
  });

  if (!open) return null;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑物流公司" : "新增物流公司"}</h2>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司名称 <span className="text-red-500">*</span></label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="请输入公司名称" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话 <span className="text-red-500">*</span></label>
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="请输入联系电话" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系人</label>
              <input value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="请输入联系人" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型</label>
              <FauxSelect className="w-full" value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="同城">同城</option>
                <option value="异地">异地</option>
                <option value="国际">国际</option>
              </FauxSelect>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">网站地址</label>
              <input value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="请输入网站地址" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={() => { onSave(form); onClose(); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700">确定</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">提示</h2>
        </div>
        <div className="p-5 text-sm text-gray-700">此操作将永久删除该数据, 是否继续?</div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确定</button>
        </div>
      </div>
    </div>
  );
}

export function LogisticsCompany() {
  const [data, setData] = useState(mockData);
  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Company | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = data.filter(r => {
    const matchKw = !keyword || r.name.includes(keyword);
    const matchType = !typeFilter || r.type === typeFilter;
    return matchKw && matchType;
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = (form: Omit<Company, "id" | "createdAt">) => {
    if (editData) {
      setData(d => d.map(r => r.id === editData.id ? { ...r, ...form } : r));
    } else {
      setData(d => [...d, { ...form, id: String(Date.now()), createdAt: new Date().toLocaleString("zh-CN").replace(/\//g, "-") }]);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    setData(d => d.filter(r => r.id !== deleteId));
    setDeleteId(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">物流公司资料</h2>
      </div>

      {/* Toolbar + Filters */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <button onClick={() => { setEditData(null); setDialogOpen(true); }} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />
            新增
          </button>
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">公司名称：</span>
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">类型：</span>
            <FauxSelect className="flex-1" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              <option value="同城">同城</option>
              <option value="异地">异地</option>
              <option value="国际">国际</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setKeyword(""); setTypeFilter(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">公司名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">联系人</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">联系电话</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.contact || "-"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.phone}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.type === "同城" ? "bg-blue-100 text-blue-700" : item.type === "异地" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{item.type}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.createdAt}</td>
                <td className="px-4 py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => { setEditData(item); setDialogOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><EditIcon sx={{ fontSize: 16 }} /></button>
                    <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><DeleteIcon sx={{ fontSize: 16 }} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{filtered.length}</span> 条</div>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">上一页</button>
            <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</button>
            <button onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))} disabled={currentPage >= (totalPages || 1)} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">下一页</button>
          </div>
        </div>
      </div>

      <CompanyDialog open={dialogOpen} editData={editData} onClose={() => { setDialogOpen(false); setEditData(null); }} onSave={handleSave} />
      {deleteId && <DeleteConfirm onClose={() => setDeleteId(null)} onConfirm={handleDelete} />}
    </div>
  );
}
