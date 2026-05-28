import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface Supplier {
  id: string;
  name: string;
  address: string;
  contact: string;
  phone: string;
  fax: string;
  settlement: string;
  initialDebt: number;
  prepayment: number;
  discount: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  boundCustomer: string;
  remark: string;
  createdAt: string;
}

const mockData: Supplier[] = [
  {
    id: "1", name: "广州达华汽配有限公司", address: "广州市白云区均和街广和路12号", contact: "陈达华", phone: "13800138001",
    fax: "020-88881234", settlement: "月结", initialDebt: 5000, prepayment: 0, discount: "95%",
    bankName: "中国工商银行广州分行", bankAccount: "62220012345678", accountHolder: "陈达华",
    boundCustomer: "", remark: "长期合作供应商", createdAt: "2026-01-05 08:00:00",
  },
  {
    id: "2", name: "深圳鑫宇汽车零部件", address: "深圳市龙华区汽配城3栋208", contact: "李鑫宇", phone: "13900139002",
    fax: "", settlement: "现结", initialDebt: 0, prepayment: 2000, discount: "98%",
    bankName: "", bankAccount: "", accountHolder: "",
    boundCustomer: "广州宏达汽配", remark: "", createdAt: "2026-02-10 10:00:00",
  },
  {
    id: "3", name: "佛山泰安汽配贸易", address: "佛山市南海区桂城街道工业大道15号", contact: "王泰安", phone: "18688886003",
    fax: "0757-66543210", settlement: "月结", initialDebt: 0, prepayment: 0, discount: "92%",
    bankName: "农业银行佛山支行", bankAccount: "62284056789012", accountHolder: "王泰安",
    boundCustomer: "", remark: "专供刹车系统配件", createdAt: "2026-03-15 14:30:00",
  },
];

const settlementOptions = ["月结", "现结", "周结", "季结"];

interface FormData {
  name: string;
  address: string;
  contact: string;
  phone: string;
  fax: string;
  settlement: string;
  initialDebt: string;
  discount: string;
  bankName: string;
  bankAccount: string;
  accountHolder: string;
  remark: string;
}

const emptyForm: FormData = {
  name: "", address: "", contact: "", phone: "", fax: "",
  settlement: "", initialDebt: "", discount: "",
  bankName: "", bankAccount: "", accountHolder: "", remark: "",
};

function DeleteConfirm({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">删除确认</h3>
          <button onClick={onCancel} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="px-5 py-4 text-sm text-gray-700">
          确定要删除供应商 <span className="font-semibold text-gray-900">"{name}"</span> 吗？删除后不可恢复。
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onCancel} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={onConfirm} className="px-4 py-1.5 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600">确定删除</button>
        </div>
      </div>
    </div>
  );
}

function SupplierFormDialog({
  title,
  initial,
  onSave,
  onClose,
}: {
  title: string;
  initial: FormData;
  onSave: (data: FormData) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<FormData>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = () => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) errs.name = "必填项";
    if (!form.contact.trim()) errs.contact = "必填项";
    if (!form.phone.trim()) errs.phone = "必填项";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave(form);
  };

  const field = (label: string, key: keyof FormData, required = false, placeholder = "") => (
    <div className="flex items-center gap-3">
      <label className="w-24 shrink-0 text-sm text-gray-600 text-right">{required && <span className="text-red-500">*</span>} {label}</label>
      <div className="flex-1">
        <input value={form[key] as string} onChange={e => set(key, e.target.value)} className={`w-full px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:border-blue-500 ${errors[key] ? "border-red-400" : "border-gray-200"}`} placeholder={placeholder || (required ? `请输入${label}` : "选填")} />
        {errors[key] && <p className="text-xs text-red-500 mt-0.5">{errors[key]}</p>}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {field("供应商名称", "name", true)}
          {field("住址", "address")}
          {field("联系人", "contact", true)}
          {field("联系电话", "phone", true, "手机/固话")}
          {field("传真", "fax")}
          <div className="flex items-center gap-3">
            <label className="w-24 shrink-0 text-sm text-gray-600 text-right">结算方式</label>
            <FauxSelect className="flex-1" value={form.settlement} onChange={e => set("settlement", e.target.value)} placeholder="请选择">
              <option value="">请选择</option>
              {settlementOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </FauxSelect>
          </div>
          {field("期初欠款", "initialDebt", false, "0.00")}
          <div className="flex items-center gap-3">
            <label className="w-24 shrink-0 text-sm text-gray-600 text-right">预付款</label>
            <input disabled value="0.00" className="flex-1 px-3 py-1.5 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed" />
          </div>
          {field("采购折扣", "discount", false, "如：95%")}
          {field("开户行名称", "bankName")}
          {field("开户账号", "bankAccount")}
          {field("开户名", "accountHolder")}
          <div className="flex items-start gap-3">
            <label className="w-24 shrink-0 text-sm text-gray-600 text-right pt-1.5">备注</label>
            <textarea value={form.remark} onChange={e => set("remark", e.target.value)} rows={3} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none" placeholder="选填" />
          </div>
        </div>
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-200 shrink-0">
          <button onClick={onClose} className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">取消</button>
          <button onClick={handleSubmit} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm">确定</button>
        </div>
      </div>
    </div>
  );
}

export function SupplierManagement() {
  const [data, setData] = useState<Supplier[]>(mockData);
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Supplier | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Supplier | null>(null);

  const filtered = data.filter(r =>
    (!searchName || r.name.includes(searchName)) &&
    (!searchPhone || r.phone.includes(searchPhone))
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleReset = () => { setSearchName(""); setSearchPhone(""); setCurrentPage(1); };

  const handleAdd = (form: FormData) => {
    const rec: Supplier = {
      id: String(Date.now()),
      name: form.name, address: form.address, contact: form.contact, phone: form.phone,
      fax: form.fax, settlement: form.settlement, initialDebt: parseFloat(form.initialDebt) || 0,
      prepayment: 0, discount: form.discount, bankName: form.bankName,
      bankAccount: form.bankAccount, accountHolder: form.accountHolder,
      boundCustomer: "", remark: form.remark, createdAt: new Date().toLocaleString("zh-CN"),
    };
    setData(prev => [rec, ...prev]);
    setShowAdd(false);
  };

  const handleEdit = (form: FormData) => {
    if (!editTarget) return;
    setData(prev => prev.map(r => r.id === editTarget.id ? {
      ...r, name: form.name, address: form.address, contact: form.contact,
      phone: form.phone, fax: form.fax, settlement: form.settlement,
      initialDebt: parseFloat(form.initialDebt) || 0, discount: form.discount,
      bankName: form.bankName, bankAccount: form.bankAccount, accountHolder: form.accountHolder, remark: form.remark,
    } : r));
    setEditTarget(null);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setData(prev => prev.filter(r => r.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">供应商管理</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">供应商名称：</span>
            <input
              type="text"
              placeholder="请输入供应商名称"
              value={searchName}
              onChange={e => { setSearchName(e.target.value); setCurrentPage(1); }}
              className="w-44 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">联系电话：</span>
            <input
              type="text"
              placeholder="请输入联系电话"
              value={searchPhone}
              onChange={e => { setSearchPhone(e.target.value); setCurrentPage(1); }}
              className="w-36 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={handleReset} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(true)} className="px-4 py-1.5 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-sm flex items-center gap-1.5">
            <AddIcon sx={{ fontSize: 16 }} />新增
          </button>
          <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
            <DownloadIcon sx={{ fontSize: 16 }} />模版下载
          </button>
          <button className="px-4 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center gap-1.5">
            <UploadIcon sx={{ fontSize: 16 }} />导入
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">供应商名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">联系电话</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">传真</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">地址</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">绑定客户</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">备注</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((row, idx) => (
              <tr key={row.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm text-gray-800 font-medium">{row.name}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.phone}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.fax || "—"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[180px] truncate" title={row.address}>{row.address || "—"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{row.boundCustomer || "—"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{row.remark || "—"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500 whitespace-nowrap">{row.createdAt}</td>
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-3">
                    <button onClick={() => setEditTarget(row)} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800">
                      <EditIcon sx={{ fontSize: 13 }} />编辑
                    </button>
                    <button onClick={() => setDeleteTarget(row)} className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700">
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

      {showAdd && <SupplierFormDialog title="新增供应商" initial={emptyForm} onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editTarget && (
        <SupplierFormDialog
          title="编辑供应商"
          initial={{ name: editTarget.name, address: editTarget.address, contact: editTarget.contact, phone: editTarget.phone, fax: editTarget.fax, settlement: editTarget.settlement, initialDebt: String(editTarget.initialDebt), discount: editTarget.discount, bankName: editTarget.bankName, bankAccount: editTarget.bankAccount, accountHolder: editTarget.accountHolder, remark: editTarget.remark }}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
      {deleteTarget && <DeleteConfirm name={deleteTarget.name} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />}
    </div>
  );
}
