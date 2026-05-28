import { useState } from "react";
import {
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShipTask {
  id: string;
  docType: string;
  orderNo: string;
  partName: string;
  partCode: string;
  boxNo: string;
  boxName: string;
  innerCode: string;
  pendingQty: number;
  shippedQty: number;
  totalQty: string;
  shipMethod: string;
  address: string;
}

interface ShipRecord {
  id: string;
  docCode: string;
  shipMethod: string;
  vehicle: string;
  logisticsCompany: string;
  trackingNo: string;
  freight: number;
  status: string;
  address: string;
  remark: string;
  createdAt: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const initShipTasks: ShipTask[] = [
  { id: "1", docType: "销售单", orderNo: "SY260519568850026", partName: "刹车片(前)", partCode: "ZP-BK001", boxNo: "大号100*120", boxName: "大号100*120", innerCode: "Z001", pendingQty: 5, shippedQty: 0, totalQty: "5/5", shipMethod: "物流", address: "云南省昆明市盘龙区北京路88号 昆明创安汽修" },
  { id: "2", docType: "销售单", orderNo: "SY260519568850026", partName: "机油滤清器", partCode: "ZP-OF002", boxNo: "中号80*100", boxName: "中号80*100", innerCode: "Z002", pendingQty: 10, shippedQty: 0, totalQty: "10/10", shipMethod: "物流", address: "云南省昆明市盘龙区北京路88号 昆明创安汽修" },
  { id: "3", docType: "销售单", orderNo: "SY260520123456789", partName: "空气滤清器", partCode: "ZP-AF003", boxNo: "小号60*80", boxName: "小号60*80", innerCode: "Z003", pendingQty: 3, shippedQty: 2, totalQty: "5/5", shipMethod: "配送", address: "四川省成都市武侯区天府大道100号 成都鑫达配件城" },
  { id: "4", docType: "销售单", orderNo: "SY260521987654321", partName: "火花塞", partCode: "ZP-SP004", boxNo: "大号100*120", boxName: "大号100*120", innerCode: "Z004", pendingQty: 8, shippedQty: 0, totalQty: "8/8", shipMethod: "物流", address: "重庆市渝北区新南路55号 重庆宏远汽车服务" },
  { id: "5", docType: "销售单", orderNo: "SY260522567890123", partName: "转向拉杆", partCode: "ZP-SR005", boxNo: "特大150*200", boxName: "特大150*200", innerCode: "Z005", pendingQty: 2, shippedQty: 0, totalQty: "2/2", shipMethod: "物流", address: "贵州省贵阳市南明区花溪路20号 贵阳天鸿汽配" },
];

const initShipRecords: ShipRecord[] = [
  { id: "1", docCode: "FH20260519001", shipMethod: "物流", vehicle: "--", logisticsCompany: "顺丰速运", trackingNo: "SF1234567890", freight: 25.00, status: "已签收", address: "云南省昆明市西山区滇池路 李总", remark: "", createdAt: "2026-05-19 10:45:00" },
  { id: "2", docCode: "FH20260519002", shipMethod: "配送", vehicle: "云A12345", logisticsCompany: "--", trackingNo: "--", freight: 0, status: "已签收", address: "云南省昆明市官渡区关上中路 王经理", remark: "当日达", createdAt: "2026-05-19 14:00:00" },
  { id: "3", docCode: "FH20260520001", shipMethod: "物流", vehicle: "--", logisticsCompany: "韵达快递", trackingNo: "YD9876543210", freight: 18.50, status: "运输中", address: "四川省成都市锦江区红星路 张总", remark: "", createdAt: "2026-05-20 09:30:00" },
  { id: "4", docCode: "FH20260521001", shipMethod: "物流", vehicle: "--", logisticsCompany: "德邦物流", trackingNo: "DB5432109876", freight: 45.00, status: "已发货", address: "重庆市渝中区解放碑步行街 赵经理", remark: "大件货物", createdAt: "2026-05-21 11:20:00" },
  { id: "5", docCode: "FH20260522001", shipMethod: "配送", vehicle: "云A67890", logisticsCompany: "--", trackingNo: "--", freight: 0, status: "运输中", address: "云南省昆明市五华区学府路 孙总", remark: "", createdAt: "2026-05-22 08:50:00" },
  { id: "6", docCode: "FH20260523001", shipMethod: "物流", vehicle: "--", logisticsCompany: "顺丰速运", trackingNo: "SF0987654321", freight: 32.00, status: "已发货", address: "贵州省贵阳市云岩区中华北路 周经理", remark: "加急件", createdAt: "2026-05-23 15:10:00" },
];

// ─── Shipping Management Tab ──────────────────────────────────────────────────

function ShippingManagementTab() {
  const [tasks] = useState(initShipTasks);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [docType, setDocType] = useState("");
  const [shipMethod, setShipMethod] = useState("");
  const [kwOrderNo, setKwOrderNo] = useState("");

  const filtered = tasks.filter(t =>
    (!docType || t.docType === docType) &&
    (!shipMethod || t.shipMethod === shipMethod) &&
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
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">单据类型：</span>
            <FauxSelect className="flex-1" value={docType} onChange={(e) => setDocType(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              <option value="销售单">销售单</option>
              <option value="调拨单">调拨单</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">发货方式：</span>
            <FauxSelect className="flex-1" value={shipMethod} onChange={(e) => setShipMethod(e.target.value)} placeholder="请选择">
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
            <button onClick={() => { setDocType(""); setShipMethod(""); setKwOrderNo(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
              <RefreshIcon sx={{ fontSize: 16 }} />重置
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
          <CheckBoxIcon sx={{ fontSize: 16 }} />确认发货
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单据类型</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单单据</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件编码</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱子名称</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">箱内编码</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">待发货数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">已发货数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">订单数量/总数量</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">发货方式</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货信息</th>
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
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.docType}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-blue-600 whitespace-nowrap">{item.orderNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.partName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.partCode}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.boxNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.boxName}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.innerCode}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`font-medium ${item.pendingQty > 0 ? "text-red-600" : "text-gray-400"}`}>{item.pendingQty}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.shippedQty}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.totalQty}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.shipMethod === "配送" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{item.shipMethod}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[200px] truncate">{item.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-gray-400">暂无数据</div>}
      </div>
    </div>
  );
}

// ─── Shipping Records Tab ─────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  "已发货": "bg-blue-100 text-blue-700",
  "运输中": "bg-yellow-100 text-yellow-700",
  "已签收": "bg-gray-100 text-gray-600",
};

function ShippingRecordsTab() {
  const [records] = useState(initShipRecords);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [shipMethod, setShipMethod] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filtered = records.filter(r => (!shipMethod || r.shipMethod === shipMethod));
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="grid grid-cols-4 gap-x-4 gap-y-2 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">时间范围：</span>
            <div className="flex items-center gap-1 flex-1 min-w-0">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              <span className="text-gray-400 text-xs shrink-0">至</span>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 whitespace-nowrap shrink-0">发货方式：</span>
            <FauxSelect className="flex-1" value={shipMethod} onChange={(e) => setShipMethod(e.target.value)} placeholder="请选择">
              <option value="">全部</option>
              <option value="配送">配送</option>
              <option value="物流">物流</option>
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5">
              <SearchIcon sx={{ fontSize: 16 }} />搜索
            </button>
            <button onClick={() => { setDateFrom(""); setDateTo(""); setShipMethod(""); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 flex items-center gap-1.5">
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单据编码</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">发货方式</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配送车辆</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">物流公司</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">物流单号</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">运费</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">发货状态</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">收货信息</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">备注</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap w-16">操作</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((item, idx) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-2.5 text-sm text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                <td className="px-4 py-2.5 text-sm font-medium text-blue-600">{item.docCode}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${item.shipMethod === "配送" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{item.shipMethod}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.vehicle}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.logisticsCompany}</td>
                <td className="px-4 py-2.5 text-sm text-gray-600">{item.trackingNo}</td>
                <td className="px-4 py-2.5 text-sm text-gray-700">{item.freight > 0 ? `¥${item.freight.toFixed(2)}` : "--"}</td>
                <td className="px-4 py-2.5 text-sm">
                  <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[item.status] || "bg-gray-100 text-gray-600"}`}>{item.status}</span>
                </td>
                <td className="px-4 py-2.5 text-sm text-gray-500 max-w-[180px] truncate">{item.address}</td>
                <td className="px-4 py-2.5 text-sm text-gray-500">{item.remark || "--"}</td>
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

type TabKey = "manage" | "records";

export function ShippingManagement() {
  const [activeTab, setActiveTab] = useState<TabKey>("manage");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "manage", label: "发货管理" },
    { key: "records", label: "发货记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <h2 className="text-lg font-bold text-gray-800">发货管理</h2>
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

      {activeTab === "manage" && <ShippingManagementTab />}
      {activeTab === "records" && <ShippingRecordsTab />}
    </div>
  );
}
