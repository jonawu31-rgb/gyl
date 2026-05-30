import { useState } from "react";
import { Add as AddIcon, Close as CloseIcon, Search as SearchIcon } from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface CommissionRule {
  id: string;
  role: string;
  method: "固定金额" | "按比例";
  value: string;
  tiers: { lower: string; upper: string; value: string }[];
  effectDate: string;
  status: "启用" | "禁用";
  remark: string;
}

const MOCK_RULES: CommissionRule[] = [
  { id: "1", role: "业务员", method: "按比例", value: "5%", tiers: [], effectDate: "2026-01-01", status: "启用", remark: "" },
  { id: "2", role: "店长", method: "固定金额", value: "200", tiers: [], effectDate: "2026-01-01", status: "启用", remark: "每单固定奖励" },
];

const ROLES = ["业务员", "店长", "区域经理", "销售总监", "客服专员"];

function RuleDialog({ onClose, onSave }: { onClose: () => void; onSave: (r: Partial<CommissionRule>) => void }) {
  const [form, setForm] = useState({ role: "", method: "按比例" as "固定金额" | "按比例", value: "", effectDate: "", remark: "" });
  const [tiers, setTiers] = useState([{ lower: "0", upper: "", value: "" }]);

  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col" style={{ width: 580, maxHeight: "85vh" }}>
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between shrink-0" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">新增提成规则</h2>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">员工角色 <span className="text-red-500">*</span></label>
              <FauxSelect value={form.role} onChange={e => set("role", e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400">
                <option value="">请选择</option>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </FauxSelect>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">提成方式 <span className="text-red-500">*</span></label>
              <FauxSelect value={form.method} onChange={e => set("method", e.target.value as any)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400">
                <option value="按比例">按比例</option>
                <option value="固定金额">固定金额</option>
              </FauxSelect>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.method === "按比例" ? "提成比例 (%)" : "提成金额 (元)"} <span className="text-red-500">*</span>
              </label>
              <input type="number" placeholder="请输入" value={form.value} onChange={e => set("value", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">生效时间 <span className="text-red-500">*</span></label>
              <input type="date" value={form.effectDate} onChange={e => set("effectDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">阶梯设置</label>
              <button onClick={() => setTiers(p => [...p, { lower: "", upper: "", value: "" }])}
                className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-0.5">
                <AddIcon sx={{ fontSize: 14 }} />新增阶梯
              </button>
            </div>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    {["下限", "上限", form.method === "按比例" ? "比例(%)" : "金额(元)", "操作"].map(h => (
                      <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((t, i) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-3 py-1.5">
                        <input value={t.lower} onChange={e => setTiers(p => p.map((x, j) => j === i ? { ...x, lower: e.target.value } : x))}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400" />
                      </td>
                      <td className="px-3 py-1.5">
                        <input value={t.upper} onChange={e => setTiers(p => p.map((x, j) => j === i ? { ...x, upper: e.target.value } : x))}
                          placeholder="不限"
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400 placeholder:text-gray-400" />
                      </td>
                      <td className="px-3 py-1.5">
                        <input value={t.value} onChange={e => setTiers(p => p.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                          className="w-full px-2 py-1 border border-gray-200 rounded text-xs focus:outline-none focus:border-blue-400" />
                      </td>
                      <td className="px-3 py-1.5">
                        <button onClick={() => setTiers(p => p.filter((_, j) => j !== i))} className="text-xs text-red-500 hover:text-red-700">删除</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <input type="text" placeholder="请输入备注" value={form.remark} onChange={e => set("remark", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 placeholder:text-gray-400" />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">取消</button>
          <button onClick={() => { onSave({ ...form, tiers, status: "启用" }); onClose(); }}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

export function CommissionSettingsTemplate({ title }: { title: string }) {
  const [rules, setRules] = useState<CommissionRule[]>(MOCK_RULES);
  const [filterRole, setFilterRole] = useState("");
  const [filterType, setFilterType] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = rules.filter(r =>
    (!filterRole || r.role === filterRole) &&
    (!filterType || r.method === filterType)
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0">员工角色</span>
            <FauxSelect value={filterRole} onChange={e => { setFilterRole(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:border-blue-400">
              <option value="">全部</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 shrink-0">提成类型</span>
            <FauxSelect value={filterType} onChange={e => { setFilterType(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white focus:outline-none focus:border-blue-400">
              <option value="">全部</option>
              <option value="按比例">按比例</option>
              <option value="固定金额">固定金额</option>
            </FauxSelect>
          </div>
          <button onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
            <SearchIcon sx={{ fontSize: 16 }} />搜索
          </button>
          <button onClick={() => { setFilterRole(""); setFilterType(""); setCurrentPage(1); }}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">
            重置
          </button>
        </div>
      </div>
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => setShowAdd(true)}
          className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增提成规则
        </button>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号", "员工角色", "提成方式", "提成比例/金额", "生效时间", "状态", "备注", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-600">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-800">{r.role}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{r.method}</td>
                <td className="px-4 py-2.5 text-sm text-gray-900">{r.value}{r.method === "按比例" && !r.value.includes("%") ? "%" : ""}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{r.effectDate}</td>
                <td className="px-4 py-2.5">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${r.status === "启用" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{r.remark || "-"}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2 text-sm">
                    <button className="text-blue-600 hover:text-blue-800 hover:underline">编辑</button>
                    <button onClick={() => setDeleteId(r.id)} className="text-red-500 hover:text-red-700 hover:underline">删除</button>
                  </div>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">暂无数据</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2.5 border-t border-gray-200 bg-gray-50 flex items-center justify-between shrink-0">
        <span className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{filtered.length}</span> 条数据</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            上一页
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`px-3 py-1.5 text-sm rounded-lg border ${currentPage === p ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100"}`}>
              {p}
            </button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
            下一页
          </button>
        </div>
      </div>

      {showAdd && <RuleDialog onClose={() => setShowAdd(false)} onSave={data => setRules(p => [...p, { ...data, id: Date.now().toString(), tiers: data.tiers || [], status: "启用" } as CommissionRule])} />}

      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl" style={{ width: 400 }}>
            <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
              <h2 className="text-lg font-bold text-gray-800">删除确认</h2>
              <button onClick={() => setDeleteId(null)} className="p-1 text-gray-600 hover:bg-gray-200 rounded"><CloseIcon sx={{ fontSize: 18 }} /></button>
            </div>
            <div className="p-6"><p className="text-sm text-gray-600">确认删除该提成规则？此操作不可恢复。</p></div>
            <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg border border-gray-200 hover:bg-gray-100">取消</button>
              <button onClick={() => { setRules(p => p.filter(r => r.id !== deleteId)); setDeleteId(null); }}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 shadow-sm">确定删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
