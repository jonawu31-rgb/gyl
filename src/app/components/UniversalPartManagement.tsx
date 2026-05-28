import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface UniversalPart {
  id: string;
  code: string;
  name: string;
  substituteRelation: string;
  remark: string;
  createdAt: string;
}

const mockData: UniversalPart[] = [
  { id: "1", code: "UC00001", name: "60038", substituteRelation: "AB通用", remark: "", createdAt: "2026-01-21 16:57:41" },
  { id: "2", code: "UC00002", name: "6565",  substituteRelation: "AB通用", remark: "5233", createdAt: "2026-02-27 10:56:22" },
  { id: "3", code: "UC00003", name: "刹车片通用件", substituteRelation: "AB通用", remark: "前盘刹车片", createdAt: "2026-03-10 09:30:00" },
  { id: "4", code: "UC00004", name: "机油滤芯通用", substituteRelation: "AB通用", remark: "", createdAt: "2026-03-15 14:20:00" },
  { id: "5", code: "UC00005", name: "空调滤芯通用", substituteRelation: "AB通用", remark: "外置空调", createdAt: "2026-04-01 11:00:00" },
];

const partsMock = [
  { id: "P001", name: "前刹车片A", code: "BRK-001" },
  { id: "P002", name: "前刹车片B", code: "BRK-002" },
  { id: "P003", name: "后刹车片A", code: "BRK-003" },
  { id: "P004", name: "机油滤芯X", code: "OIL-001" },
  { id: "P005", name: "空调滤芯Y", code: "AIR-001" },
];

interface DialogProps {
  mode: "add" | "edit";
  record?: UniversalPart;
  onClose: () => void;
  onSave: (data: Partial<UniversalPart>) => void;
}

function PartDialog({ mode, record, onClose, onSave }: DialogProps) {
  const [tab, setTab] = useState<0 | 1>(0);
  const [name, setName] = useState(record?.name ?? "");
  const [relation, setRelation] = useState(record?.substituteRelation ?? "AB通用");
  const [remark, setRemark] = useState(record?.remark ?? "");
  const [linkedParts, setLinkedParts] = useState<typeof partsMock>(
    mode === "edit" ? partsMock.slice(0, 2) : []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const title = mode === "add" ? "新增通用件" : "编辑通用件";

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "通用件名称不能为空";
    if (!relation) e.relation = "替代关系不能为空";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({ name, substituteRelation: relation, remark });
    onClose();
  };

  const togglePart = (part: typeof partsMock[0]) => {
    if (linkedParts.find(p => p.id === part.id)) {
      setLinkedParts(prev => prev.filter(p => p.id !== part.id));
    } else {
      setLinkedParts(prev => [...prev, part]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-5 shrink-0">
          <div className="flex gap-0">
            {["通用件信息", "配件明细"].map((t, i) => (
              <button
                key={t}
                onClick={() => setTab(i as 0 | 1)}
                className={`px-4 py-2.5 text-sm relative transition-colors ${tab === i ? "text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
              >
                {t}
                {tab === i && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tab === 0 && (
            <div className="px-5 py-4 space-y-4">
              <div>
                <label className="text-sm text-gray-700 mb-1.5 block"><span className="text-red-500">*</span> 通用件名称</label>
                <input
                  value={name}
                  onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: "" })); }}
                  placeholder="请输入通用件名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1.5 block"><span className="text-red-500">*</span> 替代关系</label>
                <FauxSelect className="w-full" value={relation} onChange={e => { setRelation(e.target.value); setErrors(p => ({ ...p, relation: "" })); }} placeholder="请选择替代关系">
                  <option value="AB通用">AB通用</option>
                  <option value="互换通用">互换通用</option>
                  <option value="单向通用">单向通用</option>
                </FauxSelect>
                {errors.relation && <p className="text-xs text-red-500 mt-1">{errors.relation}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-700 mb-1.5 block">备注</label>
                <input
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                  placeholder="请输入备注"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
          )}

          {tab === 1 && (
            <div className="px-5 py-4 space-y-3">
              <div className="text-sm text-gray-600 mb-2">已关联配件（点击移除）：</div>
              {linkedParts.length > 0 ? (
                <div className="space-y-2">
                  {linkedParts.map(p => (
                    <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
                      <div>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{p.code}</span>
                      </div>
                      <button onClick={() => togglePart(p)} className="text-xs text-red-500 hover:text-red-700">移除</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-400 py-4 text-center">暂无关联配件</div>
              )}
              <div className="border-t border-gray-200 pt-3">
                <div className="text-sm text-gray-600 mb-2">可关联配件（点击添加）：</div>
                <div className="space-y-2">
                  {partsMock.filter(p => !linkedParts.find(lp => lp.id === p.id)).map(p => (
                    <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 cursor-pointer" onClick={() => togglePart(p)}>
                      <div>
                        <span className="text-sm font-medium text-gray-800">{p.name}</span>
                        <span className="text-xs text-gray-500 ml-2">{p.code}</span>
                      </div>
                      <button className="text-xs text-blue-600 hover:text-blue-800">添加</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSave} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">提示</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-6 text-sm text-gray-700">此操作将永久删除该数据, 是否继续?</div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确定</button>
        </div>
      </div>
    </div>
  );
}

export function UniversalPartManagement() {
  const [data, setData] = useState(mockData);
  const [searchName, setSearchName] = useState("");
  const [searchCode, setSearchCode] = useState("");
  const [searchRelation, setSearchRelation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [dialog, setDialog] = useState<{ mode: "add" | "edit"; record?: UniversalPart } | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = data.filter(r =>
    (!searchName || r.name.includes(searchName)) &&
    (!searchCode || r.code === searchCode) &&
    (!searchRelation || r.substituteRelation === searchRelation)
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchName(""); setSearchCode(""); setSearchRelation(""); setCurrentPage(1); };

  const genCode = () => {
    const max = data.reduce((m, r) => Math.max(m, parseInt(r.code.replace("UC", ""), 10)), 0);
    return `UC${String(max + 1).padStart(5, "0")}`;
  };

  const handleSave = (d: Partial<UniversalPart>) => {
    if (dialog?.mode === "add") {
      const newRecord: UniversalPart = {
        id: String(Date.now()),
        code: genCode(),
        name: d.name ?? "",
        substituteRelation: d.substituteRelation ?? "AB通用",
        remark: d.remark ?? "",
        createdAt: new Date().toISOString().slice(0, 19).replace("T", " "),
      };
      setData(prev => [newRecord, ...prev]);
    } else if (dialog?.mode === "edit" && dialog.record) {
      setData(prev => prev.map(r => r.id === dialog.record!.id ? { ...r, ...d } : r));
    }
  };

  const handleDelete = () => {
    if (deleteId) { setData(prev => prev.filter(r => r.id !== deleteId)); setDeleteId(null); }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">通用件管理</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">通用件名称：</span>
            <input value={searchName} onChange={e => { setSearchName(e.target.value); setCurrentPage(1); }} placeholder="请输入通用件名称" className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">通用件码：</span>
            <input value={searchCode} onChange={e => { setSearchCode(e.target.value); setCurrentPage(1); }} placeholder="请输入通用件码" className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">替代关系：</span>
            <FauxSelect className="w-32" value={searchRelation} onChange={e => { setSearchRelation(e.target.value); setCurrentPage(1); }} placeholder="请选择">
              <option value="">全部</option>
              <option value="AB通用">AB通用</option>
              <option value="互换通用">互换通用</option>
              <option value="单向通用">单向通用</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => setDialog({ mode: "add" })} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">通用码</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">通用名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">替代关系</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">备注</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-mono text-blue-600">{item.code}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="px-4 py-2.5">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">{item.substituteRelation}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.remark || "—"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.createdAt}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <button onClick={() => setDialog({ mode: "edit", record: item })} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                      <EditIcon sx={{ fontSize: 13 }} />编辑
                    </button>
                    <button onClick={() => setDeleteId(item.id)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
                      <DeleteIcon sx={{ fontSize: 13 }} />删除
                    </button>
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

      {dialog && (
        <PartDialog mode={dialog.mode} record={dialog.record} onClose={() => setDialog(null)} onSave={handleSave} />
      )}
      {deleteId && <DeleteConfirm onClose={() => setDeleteId(null)} onConfirm={handleDelete} />}
    </div>
  );
}
