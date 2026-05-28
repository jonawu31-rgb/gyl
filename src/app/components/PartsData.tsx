import { useState, useMemo } from "react";
import {
  Add as AddIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  DirectionsCar as CarIcon,
  DriveFileRenameOutline as BatchEditIcon,
  FilterList as FilterIcon,
  Warning as WarningIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";
import { PartsDataDialog } from "./PartsDataDialog";

interface PartItem {
  id: string;
  code: string;
  name: string;
  spec: string;
  vehicleType: string;
  drawingNo: string;
  feature: string;
  brand: string;
  supplierName: string;
  origin: string;
  unit: string;
  defaultWarehouse: string;
  referencePrice: number;
  retailPrice: number;
  wholesalePrice: number;
  costPrice: number;
  category: string;
  status: "启用" | "停用";
  stock: number;
  barcode: string;
  foreignName: string;
  manufacturerName: string;
  salesRank: string;
  partClass: string;
  productManager: string;
  createdAt: string;
}

const mockData: PartItem[] = [
  {
    id: "1",
    code: "P001-2024",
    name: "前刹车片",
    spec: "D型/厚度12mm",
    vehicleType: "奥迪A6",
    drawingNo: "A6-BRK-001",
    feature: "陶瓷材质",
    brand: "博世",
    supplierName: "博世汽配",
    origin: "德国",
    unit: "套",
    defaultWarehouse: "主仓",
    referencePrice: 580,
    retailPrice: 680,
    wholesalePrice: 520,
    costPrice: 450,
    category: "刹车系统",
    status: "启用",
    stock: 35,
    barcode: "690012345001",
    foreignName: "Front Brake Pad",
    manufacturerName: "Robert Bosch GmbH",
    salesRank: "爆款",
    partClass: "制动系统",
    productManager: "张三",
    createdAt: "2024-03-01 09:00:00",
  },
  {
    id: "2",
    code: "P002-2024",
    name: "机油滤清器",
    spec: "φ72×H80",
    vehicleType: "大众速腾",
    drawingNo: "VW-OIL-F02",
    feature: "高过滤精度",
    brand: "曼牌",
    supplierName: "曼牌汽配",
    origin: "德国",
    unit: "个",
    defaultWarehouse: "主仓",
    referencePrice: 45,
    retailPrice: 65,
    wholesalePrice: 38,
    costPrice: 28,
    category: "滤清系统",
    status: "启用",
    stock: 120,
    barcode: "690012345002",
    foreignName: "Oil Filter",
    manufacturerName: "MANN-FILTER",
    salesRank: "平销款",
    partClass: "过滤系统",
    productManager: "李四",
    createdAt: "2024-03-05 10:30:00",
  },
  {
    id: "3",
    code: "P003-2024",
    name: "空气滤芯",
    spec: "350×195×50",
    vehicleType: "丰田凯美瑞",
    drawingNo: "TY-AIR-003",
    feature: "三层过滤",
    brand: "马勒",
    supplierName: "马勒亚太",
    origin: "日本",
    unit: "个",
    defaultWarehouse: "B仓",
    referencePrice: 85,
    retailPrice: 120,
    wholesalePrice: 72,
    costPrice: 58,
    category: "滤清系统",
    status: "启用",
    stock: 88,
    barcode: "690012345003",
    foreignName: "Air Filter",
    manufacturerName: "MAHLE GmbH",
    salesRank: "平销款",
    partClass: "过滤系统",
    productManager: "李四",
    createdAt: "2024-03-08 14:00:00",
  },
  {
    id: "4",
    code: "P004-2024",
    name: "火花塞",
    spec: "BKR6E/4支装",
    vehicleType: "本田雅阁",
    drawingNo: "HD-SPK-004",
    feature: "铂金电极",
    brand: "NGK",
    supplierName: "NGK中国",
    origin: "日本",
    unit: "套",
    defaultWarehouse: "主仓",
    referencePrice: 180,
    retailPrice: 240,
    wholesalePrice: 155,
    costPrice: 120,
    category: "点火系统",
    status: "启用",
    stock: 62,
    barcode: "690012345004",
    foreignName: "Spark Plug",
    manufacturerName: "NGK Spark Plug Co.",
    salesRank: "爆款",
    partClass: "点火系统",
    productManager: "王五",
    createdAt: "2024-03-10 09:20:00",
  },
  {
    id: "5",
    code: "P005-2024",
    name: "轮胎气门嘴",
    spec: "TR413",
    vehicleType: "通用",
    drawingNo: "VALVE-005",
    feature: "标准型",
    brand: "太平洋",
    supplierName: "太平洋橡胶",
    origin: "中国",
    unit: "个",
    defaultWarehouse: "C仓",
    referencePrice: 8,
    retailPrice: 15,
    wholesalePrice: 6,
    costPrice: 4,
    category: "轮胎配件",
    status: "停用",
    stock: 0,
    barcode: "690012345005",
    foreignName: "Tire Valve",
    manufacturerName: "太平洋橡胶制品",
    salesRank: "滞销款",
    partClass: "轮胎附件",
    productManager: "张三",
    createdAt: "2024-02-15 11:00:00",
  },
  {
    id: "6",
    code: "P006-2024",
    name: "雨刷片",
    spec: "600mm/A型",
    vehicleType: "宝马3系",
    drawingNo: "BMW-WP-006",
    feature: "无骨软胶",
    brand: "PIAA",
    supplierName: "日产汽配",
    origin: "日本",
    unit: "根",
    defaultWarehouse: "主仓",
    referencePrice: 95,
    retailPrice: 138,
    wholesalePrice: 82,
    costPrice: 65,
    category: "车身外饰",
    status: "启用",
    stock: 44,
    barcode: "690012345006",
    foreignName: "Wiper Blade",
    manufacturerName: "PIAA Corporation",
    salesRank: "平销款",
    partClass: "车身附件",
    productManager: "赵六",
    createdAt: "2024-03-12 16:30:00",
  },
  {
    id: "7",
    code: "P007-2024",
    name: "机油 5W-30",
    spec: "4L/桶",
    vehicleType: "通用",
    drawingNo: "OIL-5W30-007",
    feature: "全合成",
    brand: "美孚",
    supplierName: "埃克森美孚",
    origin: "美国",
    unit: "桶",
    defaultWarehouse: "主仓",
    referencePrice: 220,
    retailPrice: 298,
    wholesalePrice: 195,
    costPrice: 162,
    category: "润滑油",
    status: "启用",
    stock: 210,
    barcode: "690012345007",
    foreignName: "Motor Oil 5W-30",
    manufacturerName: "ExxonMobil",
    salesRank: "爆款",
    partClass: "润滑保养",
    productManager: "王五",
    createdAt: "2024-03-15 08:00:00",
  },
  {
    id: "8",
    code: "P008-2024",
    name: "变速箱油",
    spec: "ATF Dexron VI/1L",
    vehicleType: "通用",
    drawingNo: "GEAR-OIL-008",
    feature: "自动变速箱专用",
    brand: "嘉实多",
    supplierName: "嘉实多中国",
    origin: "英国",
    unit: "瓶",
    defaultWarehouse: "B仓",
    referencePrice: 68,
    retailPrice: 95,
    wholesalePrice: 58,
    costPrice: 45,
    category: "润滑油",
    status: "启用",
    stock: 78,
    barcode: "690012345008",
    foreignName: "Transmission Fluid",
    manufacturerName: "Castrol Limited",
    salesRank: "平销款",
    partClass: "润滑保养",
    productManager: "赵六",
    createdAt: "2024-03-18 13:45:00",
  },
];

const mockImportRecords = [
  {
    id: "1",
    importer: "张三",
    importTime: "2024-03-20 10:30:00",
    file: "配件导入模板_20240320.xlsx",
    reviewer: "李经理",
    reviewTime: "2024-03-20 14:00:00",
    uploadCount: 50,
    importCount: 48,
    status: "已审核",
    importRemark: "第一批导入",
    reviewRemark: "审核通过，2条数据格式有误已跳过",
  },
  {
    id: "2",
    importer: "李四",
    importTime: "2024-03-18 09:15:00",
    file: "配件批量导入_0318.xlsx",
    reviewer: "",
    reviewTime: "",
    uploadCount: 30,
    importCount: 0,
    status: "待审核",
    importRemark: "",
    reviewRemark: "",
  },
  {
    id: "3",
    importer: "王五",
    importTime: "2024-03-10 16:00:00",
    file: "配件资料更新_0310.xlsx",
    reviewer: "李经理",
    reviewTime: "2024-03-11 09:30:00",
    uploadCount: 100,
    importCount: 100,
    status: "已审核",
    importRemark: "月度更新",
    reviewRemark: "全部通过",
  },
];

// More Query Dialog
function MoreQueryDialog({
  open,
  onClose,
  onSearch,
}: {
  open: boolean;
  onClose: () => void;
  onSearch: (filters: any) => void;
}) {
  const [filters, setFilters] = useState({
    supplier: "",
    category: "",
    origin: "",
    warehouse: "",
    vehicleType: "",
    manufacturerName: "",
    hasVehicleMatch: "",
    hasImage: "",
    partCode: "",
    creator: "",
    createTimeStart: "",
    createTimeEnd: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
          <h3 className="text-base font-bold text-gray-800">更多查询</h3>
          <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          {[
            { label: "供应商", key: "supplier", type: "select", options: ["博世汽配", "曼牌汽配", "马勒亚太", "NGK中国"] },
            { label: "分类", key: "category", type: "select", options: ["刹车系统", "滤清系统", "点火系统", "润滑油"] },
            { label: "产地", key: "origin", type: "select", options: ["德国", "日本", "中国", "美国", "英国"] },
            { label: "默认仓库", key: "warehouse", type: "select", options: ["主仓", "B仓", "C仓"] },
            { label: "适用车型", key: "vehicleType", type: "select", options: ["奥迪A6", "大众速腾", "丰田凯美瑞", "本田雅阁", "宝马3系"] },
            { label: "厂家名称", key: "manufacturerName", type: "text" },
            { label: "是否匹配车型", key: "hasVehicleMatch", type: "select", options: ["是", "否"] },
            { label: "是否无图", key: "hasImage", type: "select", options: ["是", "否"] },
            { label: "配件编号", key: "partCode", type: "text" },
            { label: "创建人", key: "creator", type: "select", options: ["张三", "李四", "王五", "赵六"] },
          ].map((field) => (
            <div key={field.key} className="flex items-center gap-2">
              <label className="text-sm text-gray-700 w-24 shrink-0 whitespace-nowrap">{field.label}:</label>
              {field.type === "select" ? (
                <FauxSelect
                  value={(filters as any)[field.key]}
                  onChange={(e) => setFilters({ ...filters, [field.key]: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="">全部</option>
                  {field.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                </FauxSelect>
              ) : (
                <input
                  type="text"
                  value={(filters as any)[field.key]}
                  onChange={(e) => setFilters({ ...filters, [field.key]: e.target.value })}
                  placeholder="请输入"
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          ))}
          <div className="col-span-2 flex items-center gap-2">
            <label className="text-sm text-gray-700 w-24 shrink-0 whitespace-nowrap">创建时间:</label>
            <input type="date" value={filters.createTimeStart} onChange={(e) => setFilters({ ...filters, createTimeStart: e.target.value })} className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
            <span className="text-sm text-gray-500">~</span>
            <input type="date" value={filters.createTimeEnd} onChange={(e) => setFilters({ ...filters, createTimeEnd: e.target.value })} className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
          <button onClick={() => setFilters({ supplier: "", category: "", origin: "", warehouse: "", vehicleType: "", manufacturerName: "", hasVehicleMatch: "", hasImage: "", partCode: "", creator: "", createTimeStart: "", createTimeEnd: "" })} className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            重置
          </button>
          <button onClick={() => { onSearch(filters); onClose(); }} className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all">
            查询
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirm Dialog
function DeleteConfirmDialog({
  open,
  onClose,
  onConfirm,
  itemName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-80">
        <div className="p-6 flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <WarningIcon sx={{ fontSize: 28 }} className="text-red-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-800 mb-1">此操作将永久删除该数据, 是否继续?</p>
            <p className="text-xs text-gray-500">{itemName}</p>
          </div>
        </div>
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
            取消
          </button>
          <button onClick={onConfirm} className="flex-1 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors">
            确定
          </button>
        </div>
      </div>
    </div>
  );
}

export function PartsData() {
  const [searchQuery, setSearchQuery] = useState("");
  const [codeSearch, setCodeSearch] = useState("");
  const [specSearch, setSpecSearch] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [pageTab, setPageTab] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PartItem | undefined>(undefined);
  const [deleteItem, setDeleteItem] = useState<PartItem | null>(null);
  const [moreQueryOpen, setMoreQueryOpen] = useState(false);
  const [data, setData] = useState<PartItem[]>(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        item.name.includes(q) ||
        item.brand.includes(q) ||
        item.vehicleType.includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.spec.includes(q);
      const matchCode = !codeSearch || item.code.toLowerCase().includes(codeSearch.toLowerCase());
      const matchSpec = !specSearch || item.spec.includes(specSearch);
      return matchQuery && matchCode && matchSpec;
    });
  }, [data, searchQuery, codeSearch, specSearch]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const pagedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSelectAll = () => {
    if (selectedItems.length === pagedData.length && pagedData.length > 0) {
      setSelectedItems([]);
    } else {
      setSelectedItems(pagedData.map((item) => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = (item: PartItem) => {
    setDeleteItem(item);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      setData((prev) => prev.filter((x) => x.id !== deleteItem.id));
      setSelectedItems((prev) => prev.filter((x) => x !== deleteItem.id));
      setDeleteItem(null);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setCodeSearch("");
    setSpecSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">配件资料</h2>
          <button className="px-3 py-1.5 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
            快捷键
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-16">配件查询:</label>
            <input
              type="text"
              placeholder="请输入名称/品牌/车型/编码/规格/拼音"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-56 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-16">配件编码:</label>
            <input
              type="text"
              placeholder="请输入配件编码"
              value={codeSearch}
              onChange={(e) => { setCodeSearch(e.target.value); setCurrentPage(1); }}
              className="w-40 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-2 min-w-0">
            <label className="text-sm text-gray-700 whitespace-nowrap shrink-0 w-8">规格:</label>
            <input
              type="text"
              placeholder="请输入规格"
              value={specSearch}
              onChange={(e) => { setSpecSearch(e.target.value); setCurrentPage(1); }}
              className="w-36 px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition-all placeholder:text-gray-400"
            />
          </div>
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1.5 shrink-0"
          >
            <SearchIcon sx={{ fontSize: 15 }} />
            搜索
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 shrink-0"
          >
            重置
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2.5 border-b border-gray-200 bg-white shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setEditingItem(undefined); setDialogOpen(true); }}
            className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm flex items-center gap-1.5"
          >
            <AddIcon sx={{ fontSize: 16 }} />
            新增
          </button>
          <button
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CarIcon sx={{ fontSize: 16 }} />
            批量匹配车型
          </button>
          <button
            disabled={selectedItems.length === 0}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BatchEditIcon sx={{ fontSize: 16 }} />
            批量编辑
          </button>
          <button
            disabled={selectedItems.length === 0}
            title={selectedItems.length === 0 ? "请先选择要删除的数据" : `删除选中的 ${selectedItems.length} 条数据`}
            className="px-3 py-1.5 bg-white text-sm rounded-lg transition-colors border flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:text-gray-400 disabled:border-gray-200 text-red-600 border-gray-200 hover:bg-red-50"
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
            {selectedItems.length === 0 ? "批量删除" : `批量删除(${selectedItems.length})`}
          </button>
          <div className="w-px h-5 bg-gray-200 mx-1" />
          <button
            onClick={() => setMoreQueryOpen(true)}
            className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5"
          >
            <FilterIcon sx={{ fontSize: 16 }} />
            更多查询
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ExportIcon sx={{ fontSize: 16 }} />
            模版下载
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ImportIcon sx={{ fontSize: 16 }} />
            导入
          </button>
          <button className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 flex items-center gap-1.5">
            <ExportIcon sx={{ fontSize: 16 }} />
            导出
          </button>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="border-b border-gray-200 bg-gray-50 px-4 shrink-0">
        <div className="flex gap-1">
          {["配件资料", "导入记录"].map((tab, index) => (
            <button
              key={index}
              onClick={() => setPageTab(index)}
              className={`px-5 py-2.5 text-sm font-medium transition-all relative ${
                pageTab === index
                  ? "text-blue-600 bg-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              {tab}
              {pageTab === index && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table area */}
      <div className="flex-1 overflow-auto">
        {pageTab === 0 ? (
          <table className="w-full" style={{ minWidth: "2200px" }}>
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                <th className="px-3 py-3 text-left w-10 sticky left-0 bg-gray-50 z-20" style={{ boxShadow: '2px 0 6px -2px rgba(0,0,0,0.12)' }}>
                  <div
                    onClick={handleSelectAll}
                    className={`w-4 h-4 rounded cursor-pointer flex items-center justify-center border transition-colors ${
                      selectedItems.length === pagedData.length && pagedData.length > 0
                        ? "bg-blue-500 border-blue-500"
                        : selectedItems.length > 0
                        ? "bg-blue-200 border-blue-400"
                        : "bg-white border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {selectedItems.length === pagedData.length && pagedData.length > 0 && (
                      <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="1,4 3.5,6.5 9,1" />
                      </svg>
                    )}
                    {selectedItems.length > 0 && selectedItems.length < pagedData.length && (
                      <div className="w-2 h-0.5 bg-blue-600 rounded" />
                    )}
                  </div>
                </th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap w-12">序号</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">编码</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">配件名称</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">规格</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">适用车型</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">图号</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">特征</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品牌</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">供应商名称</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">产地</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">单位</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">默认仓库</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">参考价</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">零售价</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">批发价</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">成本价</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">品类</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap">状态</th>
                <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 whitespace-nowrap">库存</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">条形码</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">外文名</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">厂家名称</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">畅销等级</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">类别</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">产品经理</th>
                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">创建时间</th>
                <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 whitespace-nowrap sticky right-0 bg-gray-50 z-20" style={{ boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.12)' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedData.length === 0 ? (
                <tr>
                  <td colSpan={28} className="px-4 py-16 text-center text-sm text-gray-400">
                    暂无数据
                  </td>
                </tr>
              ) : (
                pagedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`border-b border-gray-100 hover:bg-blue-50/40 transition-colors ${
                      selectedItems.includes(item.id) ? "bg-blue-50/20" : ""
                    }`}
                  >
                    <td className={`px-3 py-2.5 sticky left-0 z-10 ${selectedItems.includes(item.id) ? "bg-blue-50" : "bg-white"}`} style={{ boxShadow: '2px 0 6px -2px rgba(0,0,0,0.10)' }}>
                      <div
                        onClick={() => handleSelectItem(item.id)}
                        className={`w-4 h-4 rounded cursor-pointer flex items-center justify-center border transition-colors ${
                          selectedItems.includes(item.id)
                            ? "bg-blue-500 border-blue-500"
                            : "bg-white border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {selectedItems.includes(item.id) && (
                          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="1,4 3.5,6.5 9,1" />
                          </svg>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-xs text-gray-500">{(currentPage - 1) * pageSize + idx + 1}</td>
                    <td className="px-3 py-2.5 text-sm text-blue-600 font-medium whitespace-nowrap">{item.code}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-900 font-medium whitespace-nowrap">
                      <span className="hover:text-blue-600 cursor-pointer transition-colors">{item.name}</span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.spec}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.vehicleType}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.drawingNo}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.feature}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.brand}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.supplierName}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.origin}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.unit}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.defaultWarehouse}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 font-medium text-right whitespace-nowrap">¥{item.referencePrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 font-medium text-right whitespace-nowrap">¥{item.retailPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 font-medium text-right whitespace-nowrap">¥{item.wholesalePrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 font-medium text-right whitespace-nowrap">¥{item.costPrice.toFixed(2)}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.category}</td>
                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "启用"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-700 font-medium text-right whitespace-nowrap">{item.stock}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.barcode}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.foreignName}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.manufacturerName}</td>
                    <td className="px-3 py-2.5 whitespace-nowrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        item.salesRank === "爆款" ? "bg-orange-100 text-orange-600" :
                        item.salesRank === "滞销款" ? "bg-red-100 text-red-500" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {item.salesRank}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.partClass}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-600 whitespace-nowrap">{item.productManager}</td>
                    <td className="px-3 py-2.5 text-sm text-gray-500 whitespace-nowrap">{item.createdAt}</td>
                    <td className={`px-3 py-2.5 sticky right-0 z-10 ${selectedItems.includes(item.id) ? "bg-blue-50" : "bg-white"}`} style={{ boxShadow: '-2px 0 6px -2px rgba(0,0,0,0.10)' }}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => { setEditingItem(item); setDialogOpen(true); }}
                          className="text-blue-600 hover:text-blue-700 transition-colors p-0.5"
                        >
                          <EditIcon sx={{ fontSize: 15 }} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-500 hover:text-red-600 transition-colors p-0.5"
                        >
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          /* 导入记录 Tab */
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200">
                {["导入人员", "导入时间", "文件", "审核人员", "审核时间", "上传数量", "导入数量", "状态", "导入备注", "审核备注", "操作"].map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockImportRecords.map((rec) => (
                <tr key={rec.id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{rec.importer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{rec.importTime}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 cursor-pointer hover:underline whitespace-nowrap">{rec.file}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{rec.reviewer || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{rec.reviewTime || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{rec.uploadCount}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">{rec.importCount || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      rec.status === "已审核"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {rec.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rec.importRemark || "—"}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rec.reviewRemark || "—"}</td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-blue-600 hover:text-blue-700 transition-colors whitespace-nowrap font-normal">
                      {rec.status === "待审核" ? "处理" : "查看"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 shrink-0">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            共 <span className="font-semibold text-gray-800">{filteredData.length}</span> 条数据
            {selectedItems.length > 0 && (
              <span className="ml-3 text-blue-600">
                已选 <span className="font-semibold">{selectedItems.length}</span> 条
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{pageSize}条/页</span>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              上一页
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              下一页
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              前往
              <input
                type="number"
                min={1}
                max={totalPages}
                defaultValue={currentPage}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const val = parseInt((e.target as HTMLInputElement).value);
                    if (val >= 1 && val <= totalPages) setCurrentPage(val);
                  }
                }}
                className="w-12 px-2 py-1 text-center border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-400"
              />
              页
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <PartsDataDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={(data) => console.log("保存配件:", data)}
        editData={editingItem}
      />

      <DeleteConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        onConfirm={confirmDelete}
        itemName={deleteItem ? `${deleteItem.code} - ${deleteItem.name}` : ""}
      />

      <MoreQueryDialog
        open={moreQueryOpen}
        onClose={() => setMoreQueryOpen(false)}
        onSearch={(filters) => console.log("高级筛选:", filters)}
      />
    </div>
  );
}
