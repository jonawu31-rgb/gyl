import { useState } from "react";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Close as CloseIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Box {
  id: string;
  boxNo: string;
  boxName: string;
  cost: number;
  remark: string;
  isPacked: boolean;
  packCount: number;
  isShipped: boolean;
  shipMethod: string;
  trackingNo: string;
  createdAt: string;
}

interface PackTask {
  id: string;
  orderNo: string;
  customer: string;
  shipMethod: string;
  carrier: string;
  packer: string;
  address: string;
  createdAt: string;
}

interface PackRecord {
  id: string;
  taskId: string;
  boxInfo: string;
  orderNo: string;
  customer: string;
  opType: string;
  packCount: number;
  boxCount: number;
  operator: string;
  createdAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const initBoxes: Box[] = [
  { id: "1", boxNo: "大号100*120", boxName: "大号100*120", cost: 5, remark: "", isPacked: false, packCount: 0, isShipped: false, shipMethod: "--", trackingNo: "", createdAt: "2026-05-27 22:45:06" },
  { id: "2", boxNo: "中号80*100", boxName: "中号80*100", cost: 3.5, remark: "常用尺寸", isPacked: true, packCount: 8, isShipped: false, shipMethod: "物流", trackingNo: "", createdAt: "2026-05-26 10:20:00" },
  { id: "3", boxNo: "小号60*80", boxName: "小号60*80", cost: 2, remark: "", isPacked: true, packCount: 12, isShipped: true, shipMethod: "配送", trackingNo: "SF1234567890", createdAt: "2026-05-25 14:30:00" },
  { id: "4", boxNo: "特大150*200", boxName: "特大150*200", cost: 12, remark: "大件专用", isPacked: false, packCount: 0, isShipped: false, shipMethod: "--", trackingNo: "", createdAt: "2026-05-24 09:00:00" },
];

const initPackTasks: PackTask[] = [
  { id: "1", orderNo: "SY260519568850026", customer: "昆明创安汽修", shipMethod: "物流", carrier: "顺丰速运", packer: "张三", address: "云南省昆明市盘龙区北京路88号", createdAt: "2026-05-20 09:00:00" },
  { id: "2", orderNo: "SY260520123456789", customer: "成都鑫达配件城", shipMethod: "配送", carrier: "--", packer: "李四", address: "四川省成都市武侯区天府大道100号", createdAt: "2026-05-21 10:30:00" },
  { id: "3", orderNo: "SY260521987654321", customer: "重庆宏远汽车服务", shipMethod: "物流", carrier: "韵达快递", packer: "", address: "重庆市渝北区新南路55号", createdAt: "2026-05-22 14:00:00" },
  { id: "4", orderNo: "SY260522567890123", customer: "贵阳天鸿汽配", shipMethod: "物流", carrier: "德邦物流", packer: "王五", address: "贵州省贵阳市南明区花溪路20号", createdAt: "2026-05-23 11:15:00" },
];

const initPackRecords: PackRecord[] = [
  { id: "1", taskId: "TASK20260519001", boxInfo: "大号100*120(大号100*120)", orderNo: "SY260518568850001", customer: "昆明创安汽修", opType: "装箱", packCount: 5, boxCount: 1, operator: "张三", createdAt: "2026-05-19 15:30:00" },
  { id: "2", taskId: "TASK20260519002", boxInfo: "中号80*100(中号80*100)", orderNo: "SY260518568850002", customer: "成都鑫达配件城", opType: "装箱", packCount: 8, boxCount: 2, operator: "李四", createdAt: "2026-05-19 16:00:00" },
  { id: "3", taskId: "TASK20260518001", boxInfo: "小号60*80(小号60*80)", orderNo: "SY260517568850003", customer: "重庆宏远汽车服务", opType: "确认打包", packCount: 12, boxCount: 3, operator: "张三", createdAt: "2026-05-18 10:00:00" },
  { id: "4", taskId: "TASK20260518002", boxInfo: "大号100*120(大号100*120)", orderNo: "SY260517568850004", customer: "贵阳天鸿汽配", opType: "装箱", packCount: 3, boxCount: 1, operator: "王五", createdAt: "2026-05-18 11:30:00" },
  { id: "5", taskId: "TASK20260517001", boxInfo: "中号80*100(中号80*100)", orderNo: "SY260516568850005", customer: "西安汽车配件总汇", opType: "确认打包", packCount: 6, boxCount: 2, operator: "李四", createdAt: "2026-05-17 09:45:00" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

interface BoxDialogProps {
  open: boolean;
  editData: Box | null;
  onClose: () => void;
  onSave: (data: Pick<Box, "boxNo" | "boxName" | "cost" | "remark">) => void;
}

function BoxDialog({ open, editData, onClose, onSave }: BoxDialogProps) {
  const [form, setForm] = useState({
    boxNo: editData?.boxNo || "",
    boxName: editData?.boxName || "",
    cost: editData?.cost?.toString() || "",
    remark: editData?.remark || "",
  });

  if (!open) return null;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑箱子" : "新增箱子"}</h2>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">箱号 <span className="text-red-500">*</span></label>
            <input value={form.boxNo} onChange={(e) => set("boxNo", e.target.value)} placeholder="请输入箱号" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">箱子名称 <span className="text-red-500">*</span></label>
            <input value={form.boxName} onChange={(e) => set("boxName", e.target.value)} placeholder="请输入箱子名称" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">箱子成本 <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">¥</span>
              <input type="number" value={form.cost} onChange={(e) => set("cost", e.target.value)} placeholder="请输入箱子成本" className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
            <textarea value={form.remark} onChange={(e) => set("remark", e.target.value)} placeholder="请输入备注" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 resize-none" />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">取消</button>
          <button onClick={() => { onSave({ boxNo: form.boxNo, boxName: form.boxName, cost: Number(form.cost), remark: form.remark }); onClose(); }} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700">确定</button>
        </div>
      </div>
    </div>
  );
}

// ─── Box Management Tab ───────────────────────────────────────────────────────

function BoxManagementTab() {
  const [boxes, setBoxes] = useState(initBoxes);
  const [kwBoxNo, setKwBoxNo] = useState("");
  const [kwBoxName, setKwBoxName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Box | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = boxes.filter(b =>
    (!kwBoxNo || b.boxNo.includes(kwBoxNo)) &&
    (!kwBoxName || b.boxName.includes(kwBoxName))
  );
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = (data: Pick<Box, "boxNo" | "boxName" | "cost" | "remark">) => {
    if (editData) {
      setBoxes(bs => bs.map(b => b.id === editData.id ? { ...b, ...data } : b));
    } else {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, "0");
      const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      setBoxes(bs => [...bs, { ...data, id: String(Date.now()), isPacked: false, packCount: 0, isShipped: false, shipMethod: "--", trackingNo: "", createdAt: ts }]);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Filters */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">箱号：</span>
            <input value={kwBoxNo} onChange={(e) => setKwBoxNo(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">箱子名称：</span>
            <input value={kwBoxName} onChange={(e) => setKwBoxName(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setKwBoxNo(""); setKwBoxName(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
      {/* Action buttons */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button onClick={() => { setEditData(null); setDialogOpen(true); }} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
          <AddIcon sx={{ fontSize: 16 }} />新增
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱子名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱子成本</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">备注</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">是否打包</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">打包数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">是否发货</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">发货方式</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">物流单号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-20">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.boxNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.boxName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">¥{item.cost}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.remark || "-"}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.isPacked ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{item.isPacked ? "是" : "否"}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.packCount}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.isShipped ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"}`}>{item.isShipped ? "是" : "否"}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.shipMethod}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.trackingNo || "-"}</td>
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

      <BoxDialog open={dialogOpen} editData={editData} onClose={() => { setDialogOpen(false); setEditData(null); }} onSave={handleSave} />
      {deleteId && <DeleteConfirm onClose={() => setDeleteId(null)} onConfirm={() => { setBoxes(bs => bs.filter(b => b.id !== deleteId)); setDeleteId(null); }} />}
    </div>
  );
}

// ─── Packing Management Tab ───────────────────────────────────────────────────

function PackingManagementTab() {
  const [tasks] = useState(initPackTasks);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [kwShipMethod, setKwShipMethod] = useState("");
  const [kwOrderNo, setKwOrderNo] = useState("");

  const filtered = tasks.filter(t =>
    (!kwShipMethod || t.shipMethod === kwShipMethod) &&
    (!kwOrderNo || t.orderNo.includes(kwOrderNo))
  );

  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(t => t.id)));
  };

  const toggle = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">发货方式：</span>
            <FauxSelect className="flex-1" value={kwShipMethod} onChange={(e) => setKwShipMethod(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              <option value="配送">配送</option>
              <option value="物流">物流</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">单据编号：</span>
            <input value={kwOrderNo} onChange={(e) => setKwOrderNo(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setKwShipMethod(""); setKwOrderNo(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
          <CheckBoxIcon sx={{ fontSize: 16 }} />确认打包
        </button>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 w-10">
                <button onClick={toggleAll} className="text-gray-400 hover:text-blue-600">
                  {selected.size === filtered.length && filtered.length > 0 ? <CheckBoxIcon sx={{ fontSize: 18 }} className="text-blue-600" /> : <CheckBoxOutlineBlankIcon sx={{ fontSize: 18 }} />}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单单据</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送方式</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">承运方</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">打包员</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货信息</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${selected.has(item.id) ? "bg-blue-50/40" : ""}`}>
                <td className="px-4 py-2.5">
                  <button onClick={() => toggle(item.id)} className="text-gray-400 hover:text-blue-600">
                    {selected.has(item.id) ? <CheckBoxIcon sx={{ fontSize: 18 }} className="text-blue-600" /> : <CheckBoxOutlineBlankIcon sx={{ fontSize: 18 }} />}
                  </button>
                </td>
                <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{item.orderNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.customer}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.shipMethod === "配送" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{item.shipMethod}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.carrier || "--"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.packer || "--"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[200px] truncate">{item.address}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
      </div>
    </div>
  );
}

// ─── Packing Records Tab ──────────────────────────────────────────────────────

function PackingRecordsTab() {
  const [records] = useState(initPackRecords);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [opType, setOpType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = records.filter(r => (!opType || r.opType === opType));
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">创建时间：</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <span className="text-gray-400 text-xs shrink-0">至</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">操作类型：</span>
            <FauxSelect className="flex-1" value={opType} onChange={(e) => setOpType(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              <option value="装箱">装箱</option>
              <option value="确认打包">确认打包</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setDateFrom(""); setDateTo(""); setOpType(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">任务ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱子名称(箱子编号)</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单据编号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">客户名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">打包数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱子数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">操作员</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-16">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{item.taskId}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.boxInfo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.orderNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.customer}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.opType === "确认打包" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{item.opType}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.packCount}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.boxCount}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.operator}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.createdAt}</td>
                <td className="px-4 py-2.5 text-center">
                  <button className="px-2.5 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200">详情</button>
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
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type TabKey = "boxes" | "packing" | "records";

export function PackagingManagement() {
  const [activeTab, setActiveTab] = useState<TabKey>("boxes");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "boxes", label: "打包箱管理" },
    { key: "packing", label: "打包管理" },
    { key: "records", label: "打包记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">打包装箱</h2>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex items-center gap-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab.key
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t" />
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "boxes" && <BoxManagementTab />}
      {activeTab === "packing" && <PackingManagementTab />}
      {activeTab === "records" && <PackingRecordsTab />}
    </div>
  );
}
