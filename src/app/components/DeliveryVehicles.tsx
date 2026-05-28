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

interface Vehicle {
  id: string;
  plate: string;
  tonnage: string;
  driver: string;
  owner: string;
  driverPhone: string;
  driverMobile: string;
  idCard: string;
  fuelCard: string;
  type: string;
  annualReview: string;
  operationReview: string;
  registerDate: string;
  scrappedDate: string;
  nextMaintain: string;
  createdAt: string;
}

const mockData: Vehicle[] = [
  { id: "1", plate: "浙A12345", tonnage: "2", driver: "张大明", owner: "公司", driverPhone: "0571-88888888", driverMobile: "13800138001", idCard: "330102199001011234", fuelCard: "FC001", type: "内部车辆", annualReview: "2027-03-01", operationReview: "2026-12-01", registerDate: "2022-06-01", scrappedDate: "2032-06-01", nextMaintain: "50000", createdAt: "2026-01-10 09:00:00" },
  { id: "2", plate: "浙A67890", tonnage: "5", driver: "李师傅", owner: "公司", driverPhone: "", driverMobile: "13912345678", idCard: "330102198506152345", fuelCard: "FC002", type: "内部车辆", annualReview: "2026-11-15", operationReview: "2026-11-15", registerDate: "2021-03-20", scrappedDate: "2031-03-20", nextMaintain: "80000", createdAt: "2026-01-15 10:30:00" },
  { id: "3", plate: "浙B11111", tonnage: "1", driver: "王运", owner: "王运本人", driverPhone: "", driverMobile: "15923456789", idCard: "", fuelCard: "", type: "外部车辆", annualReview: "2026-08-20", operationReview: "", registerDate: "", scrappedDate: "", nextMaintain: "", createdAt: "2026-03-05 14:20:00" },
];

const emptyForm = { plate: "", tonnage: "", driver: "", owner: "", driverPhone: "", driverMobile: "", idCard: "", fuelCard: "", type: "内部车辆", annualReview: "", operationReview: "", registerDate: "", scrappedDate: "", nextMaintain: "", vehicleModel: "", nextEval: "", insurance: "", insuranceExpiry: "", address: "", remark: "" };

interface VehicleDialogProps {
  open: boolean;
  editData: Vehicle | null;
  onClose: () => void;
  onSave: (data: any) => void;
}

function VehicleDialog({ open, editData, onClose, onSave }: VehicleDialogProps) {
  const [form, setForm] = useState(editData ? { ...editData } : emptyForm);
  if (!open) return null;
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  const inp = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">{editData ? "编辑配送车辆" : "新增配送车辆"}</h2>
          <button onClick={onClose} className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"><CloseIcon sx={{ fontSize: 18 }} /></button>
        </div>
        <div className="flex-1 overflow-auto p-5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">车牌号 <span className="text-red-500">*</span></label>
              <input value={(form as any).plate} onChange={(e) => set("plate", e.target.value)} placeholder="请输入车牌号" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">吨位</label>
              <input value={(form as any).tonnage} onChange={(e) => set("tonnage", e.target.value)} placeholder="请输入吨位" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类型 <span className="text-red-500">*</span></label>
              <FauxSelect className="w-full" value={(form as any).type} onChange={(e) => set("type", e.target.value)}>
                <option value="内部车辆">内部车辆</option>
                <option value="外部车辆">外部车辆</option>
              </FauxSelect>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">司机名称</label>
              <input value={(form as any).driver} onChange={(e) => set("driver", e.target.value)} placeholder="请输入司机名称" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">车主</label>
              <input value={(form as any).owner} onChange={(e) => set("owner", e.target.value)} placeholder="请输入车主" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">司机手机 <span className="text-red-500">*</span></label>
              <input value={(form as any).driverMobile} onChange={(e) => set("driverMobile", e.target.value)} placeholder="请输入司机手机" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">司机电话</label>
              <input value={(form as any).driverPhone} onChange={(e) => set("driverPhone", e.target.value)} placeholder="请输入司机电话" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">身份证</label>
              <input value={(form as any).idCard} onChange={(e) => set("idCard", e.target.value)} placeholder="请输入身份证" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">油卡</label>
              <input value={(form as any).fuelCard} onChange={(e) => set("fuelCard", e.target.value)} placeholder="请输入油卡" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">车型</label>
              <input value={(form as any).vehicleModel || ""} onChange={(e) => set("vehicleModel", e.target.value)} placeholder="请输入车型" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">年审日期</label>
              <input type="date" value={(form as any).annualReview} onChange={(e) => set("annualReview", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">营运年审日期</label>
              <input type="date" value={(form as any).operationReview} onChange={(e) => set("operationReview", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">注册日期</label>
              <input type="date" value={(form as any).registerDate} onChange={(e) => set("registerDate", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">报废日期</label>
              <input type="date" value={(form as any).scrappedDate} onChange={(e) => set("scrappedDate", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">下次技评日期</label>
              <input type="date" value={(form as any).nextEval || ""} onChange={(e) => set("nextEval", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">保险日期</label>
              <input type="date" value={(form as any).insurance || ""} onChange={(e) => set("insurance", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">保险到期日</label>
              <input type="date" value={(form as any).insuranceExpiry || ""} onChange={(e) => set("insuranceExpiry", e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">下次保养里程</label>
              <div className="flex items-center gap-2">
                <input value={(form as any).nextMaintain} onChange={(e) => set("nextMaintain", e.target.value)} placeholder="请输入里程" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
                <span className="text-sm text-gray-500 shrink-0">KM</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">地址</label>
              <input value={(form as any).address || ""} onChange={(e) => set("address", e.target.value)} placeholder="请输入地址" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
              <input value={(form as any).remark || ""} onChange={(e) => set("remark", e.target.value)} placeholder="请输入备注" className={inp} />
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

export function DeliveryVehicles() {
  const [data, setData] = useState(mockData);
  const [platekw, setPlateKw] = useState("");
  const [driverkw, setDriverKw] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editData, setEditData] = useState<Vehicle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = data.filter(r => {
    const matchPlate = !platekw || r.plate.includes(platekw);
    const matchDriver = !driverkw || r.driver.includes(driverkw);
    return matchPlate && matchDriver;
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSave = (form: any) => {
    if (editData) {
      setData(d => d.map(r => r.id === editData.id ? { ...r, ...form } : r));
    } else {
      setData(d => [...d, { ...form, id: String(Date.now()), createdAt: "2026-05-28 " + new Date().toTimeString().slice(0, 8) }]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">配送车辆</h2>
      </div>

      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">车牌号：</span>
            <input value={platekw} onChange={(e) => setPlateKw(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">司机名称：</span>
            <input value={driverkw} onChange={(e) => setDriverKw(e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400" />
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setPlateKw(""); setDriverKw(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">车牌号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">吨位</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">司机名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">车主</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">司机手机</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">年审日期</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-20">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-gray-800">{item.plate}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.tonnage ? `${item.tonnage}吨` : "-"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.driver || "-"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.owner || "-"}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.driverMobile}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.type === "内部车辆" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}>{item.type}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.annualReview || "-"}</td>
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

      <VehicleDialog open={dialogOpen} editData={editData} onClose={() => { setDialogOpen(false); setEditData(null); }} onSave={handleSave} />
      {deleteId && <DeleteConfirm onClose={() => setDeleteId(null)} onConfirm={() => { setData(d => d.filter(r => r.id !== deleteId)); setDeleteId(null); }} />}
    </div>
  );
}
