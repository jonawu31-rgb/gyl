import { useState } from "react";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
  Save as SaveIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

type TabKey = "order" | "draft" | "record";

interface RefundItem { id: string; productName: string; spec: string; quantity: number; unitPrice: number; amount: number; }
interface Draft { id: string; customerName: string; createdAt: string; itemCount: number; }
interface RefundRecord { id: string; orderNo: string; customerName: string; refundDate: string; totalAmount: number; reason: string; operator: string; status: "active" | "voided"; voidReason?: string; }

const CUSTOMERS = ["广州恒达汽配行", "深圳鑫源汽配店", "东莞汇美汽配城", "佛山通达汽车配件", "中山荣兴汽配商行"];
const PRODUCTS = [
  { name: "刹车片（前）", spec: "适配丰田卡罗拉2020", unitPrice: 180 },
  { name: "机油滤清器", spec: "通用型", unitPrice: 35 },
  { name: "空气滤清器", spec: "适配本田思域", unitPrice: 60 },
  { name: "火花塞", spec: "NGK型/4支装", unitPrice: 120 },
  { name: "雨刮片", spec: "24寸+18寸", unitPrice: 85 },
];
const REASONS = ["质量问题", "发错货", "数量有误", "客户取消", "其他"];

const initDrafts: Draft[] = [
  { id: "DF001", customerName: "广州恒达汽配行", createdAt: "2026-05-24 15:30", itemCount: 3 },
  { id: "DF002", customerName: "深圳鑫源汽配店", createdAt: "2026-05-23 10:12", itemCount: 1 },
];
const initRecords: RefundRecord[] = [
  { id: "RR001", orderNo: "RF20260520001", customerName: "东莞汇美汽配城", refundDate: "2026-05-20 14:22", totalAmount: 360, reason: "质量问题", operator: "王强", status: "active" },
  { id: "RR002", orderNo: "RF20260518002", customerName: "广州恒达汽配行", refundDate: "2026-05-18 09:05", totalAmount: 700, reason: "发错货", operator: "张明", status: "voided", voidReason: "已与客户重新结算" },
  { id: "RR003", orderNo: "RF20260515003", customerName: "中山荣兴汽配商行", refundDate: "2026-05-15 16:40", totalAmount: 180, reason: "质量问题", operator: "陈静", status: "active" },
];

function VoidDialog({ record, onClose, onConfirm }: { record: RefundRecord; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-1">确认作废退货单</h3>
        <p className="text-sm text-gray-500 mb-4">单号：{record.orderNo} · {record.customerName}</p>
        <p className="text-xs text-red-500 mb-3">作废后将恢复库存和客户挂账金额，操作不可撤销。</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">作废原因 <span className="text-red-500">*</span></label>
          <textarea rows={3} placeholder="请输入作废原因" value={reason} onChange={e => { setReason(e.target.value); setError(""); }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 resize-none ${error ? "border-red-400" : "border-gray-300"}`} />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={() => { if (!reason.trim()) { setError("请填写作废原因"); return; } onConfirm(reason); onClose(); }}
            className="px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600">确认作废</button>
        </div>
      </div>
    </div>
  );
}

function OrderTab() {
  const [customer, setCustomer] = useState("");
  const [reason, setReason] = useState("质量问题");
  const [remark, setRemark] = useState("");
  const [items, setItems] = useState<RefundItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const addItem = () => {
    const p = PRODUCTS[items.length % PRODUCTS.length];
    const qty = 1;
    setItems(prev => [...prev, { id: String(Date.now()), productName: p.name, spec: p.spec, quantity: qty, unitPrice: p.unitPrice, amount: qty * p.unitPrice }]);
  };
  const updateItem = (id: string, field: keyof RefundItem, val: string | number) => {
    setItems(prev => prev.map(it => {
      if (it.id !== id) return it;
      const updated = { ...it, [field]: val };
      if (field === "quantity" || field === "unitPrice") updated.amount = updated.quantity * updated.unitPrice;
      return updated;
    }));
  };
  const removeItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id));
  const total = items.reduce((s, it) => s + it.amount, 0);

  if (submitted) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <SendIcon sx={{ fontSize: 28 }} className="text-green-600" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-1">退货单已提交</h3>
        <p className="text-sm text-gray-400 mb-4">单号 RF{Date.now().toString().slice(-8)} 已成功提交</p>
        <button onClick={() => { setCustomer(""); setItems([]); setReason("质量问题"); setRemark(""); setSubmitted(false); }}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg">继续开退货单</button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-auto p-5 min-h-0">
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">客户 <span className="text-red-500">*</span></label>
          <select value={customer} onChange={e => setCustomer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
            <option value="">请选择客户</option>
            {CUSTOMERS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">退货原因 <span className="text-red-500">*</span></label>
          <select value={reason} onChange={e => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm">
            {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <input type="text" placeholder="请输入备注说明" value={remark} onChange={e => setRemark(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400" />
        </div>
      </div>

      {/* Items table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              {["商品名称", "规格", "数量", "单价（元）", "金额（元）", ""].map(h => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">暂无商品，点击下方「添加商品」</td></tr>
            ) : items.map(it => (
              <tr key={it.id} className="border-b border-gray-100">
                <td className="px-4 py-2">
                  <select value={it.productName} onChange={e => { const p = PRODUCTS.find(p => p.name === e.target.value); if (p) { updateItem(it.id, "productName", p.name); updateItem(it.id, "spec", p.spec); updateItem(it.id, "unitPrice", p.unitPrice); } }}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400">
                    {PRODUCTS.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                  </select>
                </td>
                <td className="px-4 py-2 text-sm text-gray-600 whitespace-nowrap">{it.spec}</td>
                <td className="px-4 py-2 w-24">
                  <input type="number" min={1} value={it.quantity} onChange={e => updateItem(it.id, "quantity", Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-4 py-2 w-28">
                  <input type="number" min={0} value={it.unitPrice} onChange={e => updateItem(it.id, "unitPrice", Number(e.target.value))}
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className="px-4 py-2 text-sm font-semibold text-gray-900">¥{it.amount.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <button onClick={() => removeItem(it.id)} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-2 border-t border-gray-100">
          <button onClick={addItem} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors">
            <AddIcon sx={{ fontSize: 16 }} />添加商品
          </button>
        </div>
      </div>

      {/* Total & Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          共 <span className="font-semibold">{items.length}</span> 种商品 · 合计退款：<span className="font-semibold text-red-600 text-base">¥{total.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <PrintIcon sx={{ fontSize: 16 }} />打印
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
            <SaveIcon sx={{ fontSize: 16 }} />保存草稿
          </button>
          <button disabled={!customer || items.length === 0} onClick={() => setSubmitted(true)}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed">
            <SendIcon sx={{ fontSize: 16 }} />提交退货
          </button>
        </div>
      </div>
    </div>
  );
}

function DraftTab() {
  const [drafts, setDrafts] = useState<Draft[]>(initDrafts);
  return (
    <div className="flex-1 overflow-auto min-h-0">
      <table className="w-full">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr className="border-b border-gray-200">
            {["草稿编号", "客户名称", "创建时间", "商品种类", "操作"].map(h => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {drafts.length === 0 ? (
            <tr><td colSpan={5} className="px-4 py-16 text-center text-sm text-gray-400">暂无草稿</td></tr>
          ) : drafts.map(d => (
            <tr key={d.id} className="border-b border-gray-100 hover:bg-blue-50/50">
              <td className="px-4 py-3 text-sm text-blue-600 font-mono">{d.id}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.customerName}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{d.createdAt}</td>
              <td className="px-4 py-3 text-sm text-gray-700">{d.itemCount} 种</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="继续编辑"><EditIcon sx={{ fontSize: 16 }} /></button>
                  <button onClick={() => setDrafts(prev => prev.filter(x => x.id !== d.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="删除草稿"><DeleteIcon sx={{ fontSize: 16 }} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordTab() {
  const [records, setRecords] = useState<RefundRecord[]>(initRecords);
  const [voidTarget, setVoidTarget] = useState<RefundRecord | null>(null);
  const [keyword, setKeyword] = useState("");

  const filtered = records.filter(r => !keyword || r.customerName.toLowerCase().includes(keyword.toLowerCase()) || r.orderNo.includes(keyword));

  const handleVoid = (reason: string) => {
    if (!voidTarget) return;
    setRecords(prev => prev.map(r => r.id === voidTarget.id ? { ...r, status: "voided", voidReason: reason } : r));
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="px-4 py-2.5 border-b border-gray-200 shrink-0">
        <div className="relative w-72">
          <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="搜索客户名称/单号..." value={keyword} onChange={e => setKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 text-sm placeholder:text-gray-400 bg-gray-50 focus:bg-white" />
        </div>
      </div>
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["退货单号", "客户名称", "退货日期", "退货金额", "退货原因", "操作人", "状态", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${r.status === "voided" ? "opacity-60" : ""}`}>
                <td className="px-4 py-3 text-sm text-blue-600 font-mono">{r.orderNo}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.customerName}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.refundDate}</td>
                <td className="px-4 py-3 text-sm font-semibold text-red-600">¥{r.totalAmount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.reason}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.operator}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${r.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                    {r.status === "active" ? "正常" : "已作废"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="查看详情"><VisibilityIcon sx={{ fontSize: 16 }} /></button>
                    {r.status === "active" && (
                      <button onClick={() => setVoidTarget(r)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="作废"><BlockIcon sx={{ fontSize: 16 }} /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {voidTarget && <VoidDialog record={voidTarget} onClose={() => setVoidTarget(null)} onConfirm={handleVoid} />}
    </div>
  );
}

const TABS: { key: TabKey; label: string }[] = [
  { key: "order", label: "退货单" },
  { key: "draft", label: "草稿管理" },
  { key: "record", label: "退货记录" },
];

export function CustomerRefund() {
  const [activeTab, setActiveTab] = useState<TabKey>("order");

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">客户退货</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex items-center gap-2 py-2">
          {TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab.key ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"}`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        {activeTab === "order" && <OrderTab />}
        {activeTab === "draft" && <DraftTab />}
        {activeTab === "record" && <RecordTab />}
      </div>
    </div>
  );
}
