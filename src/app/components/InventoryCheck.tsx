import { useState } from "react";
import {
  FileDownload as FileDownloadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  Print as PrintIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PartItem {
  partsId: string;
  partsName: string;
  spec: string;
  drawingNo: string;
  category: string;
  warehouse: string;
  bookQty: number;
  actualQty: number;
  diffQty: number;
}

interface CheckRecord {
  id: string;
  orderNo: string;
  inventoryType: string;
  checkerName: string;
  createTime: string;
  itemCount: number;
}

interface VoidRecord extends CheckRecord {
  voidTime: string;
  voiderName: string;
}

const mockParts: PartItem[] = [
  { partsId: "P001", partsName: "刹车油", spec: "DOT4", drawingNo: "T-001", category: "刹车系统", warehouse: "总仓库", bookQty: 100, actualQty: 100, diffQty: 0 },
  { partsId: "P002", partsName: "机油滤清器", spec: "标准型", drawingNo: "T-002", category: "润滑系统", warehouse: "总仓库", bookQty: 50, actualQty: 50, diffQty: 0 },
  { partsId: "P003", partsName: "空气滤清器", spec: "高效型", drawingNo: "T-003", category: "进气系统", warehouse: "总仓库", bookQty: 80, actualQty: 80, diffQty: 0 },
  { partsId: "P004", partsName: "火花塞", spec: "铂金型", drawingNo: "T-004", category: "点火系统", warehouse: "副仓库", bookQty: 200, actualQty: 200, diffQty: 0 },
  { partsId: "P005", partsName: "前刹车片", spec: "通用型", drawingNo: "T-005", category: "刹车系统", warehouse: "总仓库", bookQty: 60, actualQty: 60, diffQty: 0 },
];

const mockCategories = ["全部", "刹车系统", "润滑系统", "进气系统", "点火系统"];
const mockCheckers = ["张三", "李四", "王五", "赵六"];

const mockRecords: CheckRecord[] = [
  { id: "1", orderNo: "INV20260528001", inventoryType: "普通盘点", checkerName: "张三", createTime: "2026-05-28 09:00", itemCount: 12 },
  { id: "2", orderNo: "INV20260520001", inventoryType: "周期盘点", checkerName: "李四", createTime: "2026-05-20 14:00", itemCount: 8 },
];

const mockDrafts: CheckRecord[] = [
  { id: "D1", orderNo: "INV20260528002", inventoryType: "普通盘点", checkerName: "王五", createTime: "2026-05-28 11:30", itemCount: 5 },
];

const mockVoidRecords: VoidRecord[] = [
  { id: "V1", orderNo: "INV20260510001", inventoryType: "普通盘点", checkerName: "张三", createTime: "2026-05-10 10:00", itemCount: 6, voidTime: "2026-05-11 09:00", voiderName: "管理员" },
];

type TabKey = "create" | "draft" | "records" | "voided";

const InventoryCheck: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("create");

  const tabs = [
    { key: "create" as TabKey, label: "盘点开单" },
    { key: "draft" as TabKey, label: "盘点草稿" },
    { key: "records" as TabKey, label: "盘点记录" },
    { key: "voided" as TabKey, label: "作废记录" },
  ];

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h2 className="text-lg font-bold text-gray-800">库存盘点</h2>
      </div>

      <div className="border-b border-gray-200 bg-gray-50 px-4">
        <div className="flex gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-medium transition-all relative ${
                activeTab === tab.key ? "text-blue-600 bg-white" : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "create" && <CreateTab />}
        {activeTab === "draft" && <DraftTab />}
        {activeTab === "records" && <RecordsTab />}
        {activeTab === "voided" && <VoidedTab />}
      </div>
    </div>
  );
};

const CreateTab: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");
  const [inventoryType, setInventoryType] = useState("普通盘点");
  const [checker, setChecker] = useState("");
  const [parts, setParts] = useState<PartItem[]>([]);

  const handleSearch = () => {
    const q = searchText.toLowerCase();
    const filtered = mockParts.filter(p =>
      (!q || p.partsName.includes(q) || p.spec.includes(q) || p.drawingNo.includes(q)) &&
      (categoryFilter === "全部" || !categoryFilter || p.category === categoryFilter)
    );
    setParts(filtered.map(p => ({ ...p, actualQty: p.bookQty, diffQty: 0 })));
  };

  const handleSelectAll = () => {
    setParts(mockParts.map(p => ({ ...p, actualQty: p.bookQty, diffQty: 0 })));
  };

  const updateActualQty = (id: string, qty: number) => {
    setParts(prev => prev.map(p =>
      p.partsId === id ? { ...p, actualQty: qty, diffQty: qty - p.bookQty } : p
    ));
  };

  const handleReset = () => {
    setParts([]);
    setSearchText("");
    setCategoryFilter("全部");
    setInventoryType("普通盘点");
    setChecker("");
  };

  const handleSubmit = () => {
    if (parts.length === 0) { alert("请先搜索并选择配件"); return; }
    if (!checker) { alert("请选择盘点员"); return; }
    alert("盘点单提交成功！");
    handleReset();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Top toolbar - pinned */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-700 shrink-0">配件查询</span>
          <div className="relative flex-1 min-w-40">
            <SearchIcon sx={{ fontSize: 16 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="名称/规格/条码/编码/OE码/图号"
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">品类筛选</label>
            <FauxSelect value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-32">
              {mockCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </FauxSelect>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 盘点方式</label>
            <FauxSelect value={inventoryType} onChange={e => setInventoryType(e.target.value)} className="w-32">
              <option value="普通盘点">普通盘点</option>
              <option value="周期盘点">周期盘点</option>
            </FauxSelect>
          </div>
          <button onClick={handleSearch} className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => { setSearchText(""); setCategoryFilter("全部"); }} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
          <button onClick={handleSelectAll} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">选择全部</button>
        </div>
      </div>

      {/* Scrollable middle */}
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["配件名称", "规格", "图号", "品类", "仓库", "账面数量", "盘点数量", "差异数量"].map(h => (
                <th key={h} className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">请搜索配件以进行盘点，或点击"选择全部"加载所有配件</td></tr>
            ) : parts.map(part => (
              <tr key={part.partsId} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-3 py-2 text-sm text-gray-900 font-medium whitespace-nowrap">{part.partsName}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.spec}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.drawingNo}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.category}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.warehouse}</td>
                <td className="px-3 py-2 text-sm text-gray-700">{part.bookQty}</td>
                <td className="px-3 py-2">
                  <input type="number" min={0} value={part.actualQty}
                    onChange={e => updateActualQty(part.partsId, Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:border-blue-400" />
                </td>
                <td className={`px-3 py-2 text-sm font-semibold ${part.diffQty > 0 ? "text-green-600" : part.diffQty < 0 ? "text-red-600" : "text-gray-600"}`}>
                  {part.diffQty > 0 ? `+${part.diffQty}` : part.diffQty}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom footer - pinned */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0"><span className="text-red-500">*</span> 盘点员</label>
            <FauxSelect value={checker} onChange={e => setChecker(e.target.value)} className="w-36">
              <option value="">请选择</option>
              {mockCheckers.map(c => <option key={c} value={c}>{c}</option>)}
            </FauxSelect>
          </div>
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{parts.length}</span> 种配件
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => alert("已保存为草稿！")} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">草稿</button>
            <button onClick={handleReset} className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200">重置</button>
            <button className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
              <PrintIcon sx={{ fontSize: 16 }} />打印
            </button>
            <button onClick={handleSubmit} className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm">提交</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DraftTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = mockDrafts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = mockDrafts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">关键字</label>
            <input type="text" placeholder="搜索..." value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-52 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => setKeyword("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号", "单号", "盘点方式", "保存时间", "配件数量", "盘点员", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">暂无草稿</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{r.orderNo}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.inventoryType}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.itemCount}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.checkerName}</td>
                <td className="px-4 py-3 flex items-center gap-1">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <EditIcon sx={{ fontSize: 16 }} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{total}</span> 条</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">上一页</button>
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};

const RecordsTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = mockRecords.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = mockRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <FileDownloadIcon sx={{ fontSize: 16 }} />导出
          </button>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">关键字</label>
            <input type="text" placeholder="搜索..." value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-52 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => setKeyword("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号", "单号", "盘点方式", "开单时间", "配件数量", "盘点员", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{r.orderNo}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.inventoryType}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.itemCount}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.checkerName}</td>
                <td className="px-4 py-3">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{total}</span> 条</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">上一页</button>
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};

const VoidedTab: React.FC = () => {
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const total = mockVoidRecords.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = mockVoidRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700 shrink-0">关键字</label>
            <input type="text" placeholder="搜索..." value={keyword} onChange={e => setKeyword(e.target.value)}
              className="w-52 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 bg-white" />
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">搜索</button>
          <button onClick={() => setKeyword("")} className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200">重置</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b border-gray-200">
              {["序号", "单号", "盘点方式", "撤销时间", "开单时间", "配件数量", "盘点员", "撤单员", "操作"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">暂无数据</td></tr>
            ) : paged.map((r, i) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">{(currentPage - 1) * pageSize + i + 1}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">{r.orderNo}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.inventoryType}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.voidTime}</td>
                <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{r.createTime}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.itemCount}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.checkerName}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{r.voiderName}</td>
                <td className="px-4 py-3">
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <VisibilityIcon sx={{ fontSize: 16 }} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="text-sm text-gray-600">共 <span className="font-semibold text-gray-800">{total}</span> 条</div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">上一页</button>
          <span className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg">{currentPage}</span>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 border border-gray-200 disabled:opacity-50">下一页</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryCheck;
