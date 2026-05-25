import { useMemo, useState, type ReactNode } from "react";
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
  FilterList as FilterIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Image as ImageIcon,
  InfoOutlined as InfoOutlinedIcon,
  Refresh as RefreshIcon,
  RotateRight as RotateRightIcon,
  Search as SearchIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";

type MainTab = "parts" | "imports";
type DialogMode =
  | "create"
  | "edit"
  | "batch-match"
  | "batch-edit"
  | "more-query"
  | "import"
  | "export"
  | "delete"
  | "batch-delete-empty";
type DialogTab = 0 | 1 | 2 | 3;

type PartRow = {
  id: string;
  code: string;
  name: string;
  spec: string;
  vehicle: string;
  drawing: string;
  feature: string;
  brand: string;
  supplier: string;
  origin: string;
  unit: string;
  warehouse: string;
  refPrice: string;
  retailPrice: string;
  wholesalePrice: string;
  costPrice: string;
  category: string;
  status: "启用" | "停用";
  stock: string;
  barcode: string;
  foreignName: string;
  manufacturer: string;
  hotLevel: string;
  type: string;
  manager: string;
  createdAt: string;
};

const partRows: PartRow[] = [
  {
    id: "1",
    code: "SP000004",
    name: "转向头",
    spec: "",
    vehicle: "",
    drawing: "",
    feature: "",
    brand: "",
    supplier: "",
    origin: "",
    unit: "",
    warehouse: "默认仓库A",
    refPrice: "268.00",
    retailPrice: "328.00",
    wholesalePrice: "295.00",
    costPrice: "250.00",
    category: "底盘系统",
    status: "启用",
    stock: "128",
    barcode: "",
    foreignName: "",
    manufacturer: "长城汽配",
    hotLevel: "平销款",
    type: "转向系统",
    manager: "黄伟霆",
    createdAt: "2026-05-25 09:30:18",
  },
  {
    id: "2",
    code: "SP000003",
    name: "壳牌机油",
    spec: "5W-30",
    vehicle: "通用",
    drawing: "",
    feature: "全合成",
    brand: "壳牌",
    supplier: "华东供应商",
    origin: "江苏",
    unit: "瓶",
    warehouse: "默认仓库A",
    refPrice: "98.00",
    retailPrice: "118.00",
    wholesalePrice: "105.00",
    costPrice: "86.00",
    category: "保养用品",
    status: "启用",
    stock: "56",
    barcode: "6901234567890",
    foreignName: "Shell Oil",
    manufacturer: "壳牌",
    hotLevel: "爆款",
    type: "润滑油",
    manager: "李倩",
    createdAt: "2026-05-24 15:12:41",
  },
  {
    id: "3",
    code: "352+656",
    name: "5646356",
    spec: "",
    vehicle: "单独的",
    drawing: "",
    feature: "",
    brand: "乐学",
    supplier: "",
    origin: "",
    unit: "个",
    warehouse: "默认仓库B",
    refPrice: "0.00",
    retailPrice: "0.00",
    wholesalePrice: "0.00",
    costPrice: "0.00",
    category: "通用件",
    status: "停用",
    stock: "0",
    barcode: "",
    foreignName: "",
    manufacturer: "",
    hotLevel: "长尾款",
    type: "其他",
    manager: "王凯",
    createdAt: "2026-05-23 10:05:03",
  },
  {
    id: "4",
    code: "L034200000297",
    name: "下轴",
    spec: "",
    vehicle: "伽途T3/祥菱V1",
    drawing: "L034200000297",
    feature: "原厂",
    brand: "原厂",
    supplier: "",
    origin: "原厂",
    unit: "根",
    warehouse: "默认仓库A",
    refPrice: "120.00",
    retailPrice: "138.00",
    wholesalePrice: "128.00",
    costPrice: "112.00",
    category: "底盘系统",
    status: "启用",
    stock: "8",
    barcode: "",
    foreignName: "",
    manufacturer: "原厂",
    hotLevel: "平销款",
    type: "传动件",
    manager: "刘洋",
    createdAt: "2026-05-22 08:21:45",
  },
  {
    id: "5",
    code: "MHJKKF",
    name: "卡扣【盟虎净】F",
    spec: "F",
    vehicle: "通用",
    drawing: "F",
    feature: "自营品牌",
    brand: "盟虎净",
    supplier: "",
    origin: "",
    unit: "个",
    warehouse: "默认仓库C",
    refPrice: "8.00",
    retailPrice: "10.00",
    wholesalePrice: "9.00",
    costPrice: "7.20",
    category: "内饰件",
    status: "启用",
    stock: "231",
    barcode: "",
    foreignName: "",
    manufacturer: "盟虎净",
    hotLevel: "爆款",
    type: "卡扣",
    manager: "赵蕾",
    createdAt: "2026-05-21 11:19:56",
  },
  {
    id: "6",
    code: "MHJKKE",
    name: "卡扣【盟虎净】E",
    spec: "E",
    vehicle: "通用",
    drawing: "E",
    feature: "自营品牌",
    brand: "盟虎净",
    supplier: "",
    origin: "",
    unit: "个",
    warehouse: "默认仓库C",
    refPrice: "8.00",
    retailPrice: "10.00",
    wholesalePrice: "9.00",
    costPrice: "7.20",
    category: "内饰件",
    status: "启用",
    stock: "220",
    barcode: "",
    foreignName: "",
    manufacturer: "盟虎净",
    hotLevel: "爆款",
    type: "卡扣",
    manager: "赵蕾",
    createdAt: "2026-05-21 11:19:56",
  },
  {
    id: "7",
    code: "MHJKKD",
    name: "卡扣【盟虎净】D",
    spec: "D",
    vehicle: "通用",
    drawing: "D",
    feature: "自营品牌",
    brand: "盟虎净",
    supplier: "",
    origin: "",
    unit: "个",
    warehouse: "默认仓库C",
    refPrice: "8.00",
    retailPrice: "10.00",
    wholesalePrice: "9.00",
    costPrice: "7.20",
    category: "内饰件",
    status: "启用",
    stock: "218",
    barcode: "",
    foreignName: "",
    manufacturer: "盟虎净",
    hotLevel: "爆款",
    type: "卡扣",
    manager: "赵蕾",
    createdAt: "2026-05-21 11:19:56",
  },
  {
    id: "8",
    code: "MHJKKC",
    name: "卡扣【盟虎净】C",
    spec: "C",
    vehicle: "通用",
    drawing: "C",
    feature: "自营品牌",
    brand: "盟虎净",
    supplier: "",
    origin: "",
    unit: "个",
    warehouse: "默认仓库C",
    refPrice: "8.00",
    retailPrice: "10.00",
    wholesalePrice: "9.00",
    costPrice: "7.20",
    category: "内饰件",
    status: "启用",
    stock: "216",
    barcode: "",
    foreignName: "",
    manufacturer: "盟虎净",
    hotLevel: "爆款",
    type: "卡扣",
    manager: "赵蕾",
    createdAt: "2026-05-21 11:19:56",
  },
];

const importRows: string[][] = [];

const exportColumns = [
  ["默认仓库", "默认仓库(格式：仓库名称/库位)", "12", "常规", "常规"],
  ["品类", "品类(格式：一级品类/二级品类)", "12", "常规", "常规"],
  ["单位", "单位", "12", "常规", "常规"],
  ["品牌", "品牌", "12", "常规", "常规"],
  ["产品名称", "产品名称", "12", "常规", "常规"],
  ["编码", "编码", "12", "常规", "常规"],
  ["适用车型", "适用车型", "12", "常规", "常规"],
  ["销售价", "销售价", "12", "常规", "常规"],
] as const;

const fieldControlClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";
const compactControlClass =
  "rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 placeholder:text-gray-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100";
const filterActionButtonClass =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm shadow-sm transition-colors";

function Modal({
  open,
  title,
  description,
  onClose,
  children,
  footer,
  maxWidth = "max-w-5xl",
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`flex max-h-[90vh] w-full flex-col overflow-hidden rounded-xl bg-white shadow-2xl ${maxWidth}`}>
        <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-gray-50 px-5 py-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700">
            <CloseIcon sx={{ fontSize: 18 }} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">{children}</div>
        {footer ? <div className="border-t border-gray-200 bg-gray-50 px-5 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <div className="text-center text-sm font-semibold text-gray-700">{children}</div>;
}

function Field({
  label,
  placeholder,
  kind = "input",
  required,
  options = ["全部", "示例"],
}: {
  label: string;
  placeholder: string;
  kind?: "input" | "select" | "textarea";
  required?: boolean;
  options?: string[];
}) {
  const [value, setValue] = useState("");

  return (
    <div>
      <label className="mb-1 block text-sm text-gray-700">
        {required ? <span className="mr-1 text-red-500">*</span> : null}
        {label}
      </label>
      {kind === "textarea" ? (
        <textarea placeholder={placeholder} className={`${fieldControlClass} min-h-20 resize-none`} />
      ) : kind === "select" ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={`${fieldControlClass} appearance-none pr-10 ${value ? "text-gray-700" : "text-gray-400"}`}
          >
            <option value="" disabled hidden>
              {placeholder}
            </option>
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <ArrowDropDownIcon sx={{ fontSize: 20 }} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      ) : (
        <input placeholder={placeholder} className={fieldControlClass} />
      )}
    </div>
  );
}

function Badge({ tone, children }: { tone: "green" | "yellow" | "red" | "gray" | "blue"; children: ReactNode }) {
  const classes = {
    green: "bg-green-100 text-green-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
    blue: "bg-blue-100 text-blue-700",
  }[tone];
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${classes}`}>{children}</span>;
}

function ValueBox({ placeholder, className = "" }: { placeholder: string; className?: string }) {
  return <input placeholder={placeholder} className={`${fieldControlClass} ${className}`} />;
}

export function PartsData() {
  const [mainTab, setMainTab] = useState<MainTab>("parts");
  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null);
  const [dialogTab, setDialogTab] = useState<DialogTab>(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [batchDeleteMode, setBatchDeleteMode] = useState(false);
  const [searchDraft, setSearchDraft] = useState({
    keyword: "",
    code: "",
    spec: "",
  });
  const [searchQuery, setSearchQuery] = useState({
    keyword: "",
    code: "",
    spec: "",
  });
  const [importRemark, setImportRemark] = useState("");
  const [exportRowsState, setExportRowsState] = useState(
    exportColumns.map((item, index) => ({
      checked: true,
      position: String(index + 1),
      systemName: item[0],
      customName: item[1],
      width: item[2],
      align: item[3],
      format: item[4],
    })),
  );

  const filteredRows = useMemo(() => {
    const keywords = [searchQuery.keyword, searchQuery.code, searchQuery.spec]
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    if (keywords.length === 0) return partRows;

    return partRows.filter((row) => {
      const text = [
        row.code,
        row.name,
        row.spec,
        row.vehicle,
        row.drawing,
        row.feature,
        row.brand,
        row.supplier,
        row.origin,
        row.unit,
        row.warehouse,
        row.category,
        row.barcode,
        row.foreignName,
        row.manufacturer,
        row.hotLevel,
        row.type,
        row.manager,
      ]
        .join(" ")
        .toLowerCase();

      return keywords.every((item) => text.includes(item));
    });
  }, [searchQuery]);

  const allSelected = batchDeleteMode && filteredRows.length > 0 && filteredRows.every((row) => selectedIds.includes(row.id));
  const someSelected = selectedIds.length > 0;

  const resetSearch = () => {
    const empty = { keyword: "", code: "", spec: "" };
    setSearchDraft(empty);
    setSearchQuery(empty);
  };

  const runSearch = () => {
    setSearchQuery(searchDraft);
  };

  const toggleRow = (id: string, checked: boolean) => {
    setSelectedIds((current) => (checked ? Array.from(new Set([...current, id])) : current.filter((item) => item !== id)));
  };

  const toggleAllRows = (checked: boolean) => {
    setSelectedIds(checked ? filteredRows.map((row) => row.id) : []);
  };

  const openCreate = () => {
    setDialogTab(0);
    setDialogMode("create");
  };

  const openEdit = () => {
    setDialogTab(0);
    setDialogMode("edit");
  };

  const batchDeleteButton = () => {
    if (batchDeleteMode) {
      setBatchDeleteMode(false);
      return;
    }
    if (!someSelected) {
      setDialogMode("batch-delete-empty");
      return;
    }
    setBatchDeleteMode(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#3b82f6]" />
            <h2 className="text-lg font-bold text-gray-800">配件资料</h2>
          </div>
          <button className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm text-blue-600 transition-colors hover:bg-blue-100">快捷操作</button>
        </div>

        <div className="border-b border-gray-200 bg-gray-50 px-4">
          <div className="flex gap-1">
            <button
              onClick={() => setMainTab("parts")}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                mainTab === "parts" ? "bg-white text-[#3b82f6]" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              配件资料
              {mainTab === "parts" ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#3b82f6]" /> : null}
            </button>
            <button
              onClick={() => setMainTab("imports")}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                mainTab === "imports" ? "bg-white text-[#3b82f6]" : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              导入记录
              {mainTab === "imports" ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#3b82f6]" /> : null}
            </button>
          </div>
        </div>

        {mainTab === "parts" ? (
          <>
            <div className="border-b border-gray-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2563eb]">
                  <AddIcon sx={{ fontSize: 16 }} />
                  新增
                </button>
                <button onClick={() => setDialogMode("batch-match")} className="inline-flex items-center gap-1.5 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2563eb]">
                  批量匹配车型
                </button>
                <button onClick={() => setDialogMode("batch-edit")} className="inline-flex items-center gap-1.5 rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white shadow-sm transition-colors hover:bg-[#2563eb]">
                  批量编辑
                </button>
                <button
                  onClick={batchDeleteButton}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm shadow-sm transition-colors ${
                    batchDeleteMode
                      ? "bg-red-500 text-white hover:bg-red-600"
                      : someSelected
                        ? "bg-red-500 text-white hover:bg-red-600"
                        : "border border-gray-200 bg-white text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  {batchDeleteMode ? `退出批量删除（已选 ${selectedIds.length} 项）` : someSelected ? `批量删除（${selectedIds.length}）` : "请先选择要删除的数据"}
                </button>

                <div className="ml-auto flex flex-wrap items-center gap-2">
                  <button onClick={() => setDialogMode("more-query")} className="inline-flex items-center gap-1.5 rounded-lg border border-[#3b82f6] bg-white px-3 py-1.5 text-sm text-[#3b82f6] transition-colors hover:bg-blue-50">
                    <FilterIcon sx={{ fontSize: 16 }} />
                    更多查询
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#3b82f6] bg-white px-3 py-1.5 text-sm text-[#3b82f6] transition-colors hover:bg-blue-50">
                    <FileDownloadIcon sx={{ fontSize: 16 }} />
                    模板下载
                  </button>
                  <button onClick={() => setDialogMode("import")} className="inline-flex items-center gap-1.5 rounded-lg border border-[#3b82f6] bg-white px-3 py-1.5 text-sm text-[#3b82f6] transition-colors hover:bg-blue-50">
                    <FileUploadIcon sx={{ fontSize: 16 }} />
                    导入
                  </button>
                  <button onClick={() => setDialogMode("export")} className="inline-flex items-center gap-1.5 rounded-lg border border-[#3b82f6] bg-white px-3 py-1.5 text-sm text-[#3b82f6] transition-colors hover:bg-blue-50">
                    <FileDownloadIcon sx={{ fontSize: 16 }} />
                    导出
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="grid w-full grid-cols-1 items-end gap-3 xl:grid-cols-[1.6fr_1fr_1fr_auto_auto]">
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">配件查询</label>
                    <div className="relative">
                      <SearchIcon sx={{ fontSize: 18 }} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        value={searchDraft.keyword}
                        onChange={(e) => setSearchDraft((current) => ({ ...current, keyword: e.target.value }))}
                        placeholder="请输入名称/品牌/车型/编码/规格/拼音"
                        className={`${fieldControlClass} bg-gray-50 py-2 pl-10 pr-4 focus:border-[#3b82f6] focus:bg-white focus:ring-[#3b82f6]/15`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">配件编码</label>
                    <input
                      value={searchDraft.code}
                      onChange={(e) => setSearchDraft((current) => ({ ...current, code: e.target.value }))}
                      placeholder="请输入配件编码"
                      className={`${fieldControlClass} bg-gray-50 px-3 py-2 focus:border-[#3b82f6] focus:bg-white focus:ring-[#3b82f6]/15`}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">规格</label>
                    <input
                      value={searchDraft.spec}
                      onChange={(e) => setSearchDraft((current) => ({ ...current, spec: e.target.value }))}
                      placeholder="请输入规格"
                      className={`${fieldControlClass} bg-gray-50 px-3 py-2 focus:border-[#3b82f6] focus:bg-white focus:ring-[#3b82f6]/15`}
                    />
                  </div>
                  <button
                    onClick={runSearch}
                    className={`${filterActionButtonClass} bg-[#3b82f6] text-white hover:bg-[#2563eb]`}
                  >
                    <SearchIcon sx={{ fontSize: 16 }} />
                    搜索
                  </button>
                  <button
                    onClick={resetSearch}
                    className={`${filterActionButtonClass} border border-gray-200 bg-white text-gray-700 hover:bg-gray-100`}
                  >
                    <RefreshIcon sx={{ fontSize: 16 }} />
                    重置
                  </button>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                <table className="w-full min-w-max table-auto">
                  <thead className="sticky top-0 z-10 bg-[#eff6ff]">
                    <tr className="border-b border-[#dbeafe]">
                      {batchDeleteMode ? (
                        <th className="w-11 px-3 py-3 text-left text-xs font-semibold text-gray-700">
                          <input type="checkbox" checked={allSelected} onChange={(e) => toggleAllRows(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#3b82f6]" />
                        </th>
                      ) : null}
                      {[
                        "序号",
                        "编码",
                        "配件名称",
                        "规格",
                        "适用车型",
                        "图号",
                        "特征",
                        "品牌",
                        "供应商名称",
                        "产地",
                        "单位",
                        "默认仓库",
                        "参考价",
                        "零售价",
                        "批发价",
                        "成本价",
                        "品类",
                        "状态",
                        "库存",
                        "条形码",
                        "外文名",
                        "厂家名称",
                        "畅销等级",
                        "类别",
                        "产品经理",
                        "创建时间",
                        "操作",
                      ].map((col) =>
                        col === "操作" ? (
                          <th
                            key={col}
                            className="sticky right-0 z-30 w-[140px] min-w-[140px] bg-[#eff6ff] px-3 py-3 text-center text-xs font-semibold text-gray-700 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]"
                          >
                            {col}
                          </th>
                        ) : (
                          <th key={col} className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row, index) => (
                      <tr key={row.id} className="group border-b border-gray-100 hover:bg-blue-50/40">
                        {batchDeleteMode ? (
                          <td className="px-3 py-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(row.id)}
                              onChange={(e) => toggleRow(row.id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-[#3b82f6]"
                            />
                          </td>
                        ) : null}
                        <td className="px-3 py-2 text-sm text-gray-700">{index + 1}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.code}</td>
                        <td className="px-3 py-2 text-sm text-[#2563eb]">{row.name}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.spec || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.vehicle || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.drawing || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.feature || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.brand || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.supplier || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.origin || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.unit || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.warehouse}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">¥{row.refPrice}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">¥{row.retailPrice}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">¥{row.wholesalePrice}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">¥{row.costPrice}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.category}</td>
                        <td className="px-3 py-2 text-sm">
                          <Badge tone={row.status === "启用" ? "green" : "gray"}>{row.status}</Badge>
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.stock}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.barcode || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.foreignName || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.manufacturer || "-"}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.hotLevel}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.type}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.manager}</td>
                        <td className="px-3 py-2 text-sm text-gray-700">{row.createdAt}</td>
                        <td className="sticky right-0 z-20 w-[140px] min-w-[140px] bg-white px-3 py-2 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.25)] group-hover:bg-blue-50/40">
                          <div className="flex items-center justify-center gap-3 text-sm">
                            <button onClick={openEdit} className="inline-flex items-center gap-1 text-[#3b82f6] transition-colors hover:text-[#2563eb]">
                              <EditIcon sx={{ fontSize: 15 }} />
                              编辑
                            </button>
                            <button onClick={() => setDialogMode("delete")} className="inline-flex items-center gap-1 text-red-500 transition-colors hover:text-red-600">
                              <DeleteIcon sx={{ fontSize: 15 }} />
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-gray-600">
                  已选择 <span className="font-semibold text-gray-800">{selectedIds.length}</span> 项 / 共 <span className="font-semibold text-gray-800">{filteredRows.length}</span> 项
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select className={`${compactControlClass} pr-6`}>
                    <option>20条/页</option>
                    <option>10条/页</option>
                  </select>
                  <button className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-500">‹</button>
                  <button className="rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white">1</button>
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">2</button>
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">3</button>
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">4</button>
                  <button className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700">5</button>
                  <button className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-500">›</button>
                  <span className="ml-2 text-sm text-gray-600">前往</span>
                  <input placeholder="1" className={`${compactControlClass} w-12`} />
                  <span className="text-sm text-gray-600">页</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-gray-200 bg-white px-4 py-3">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-4">
                <Field label="导入人员" placeholder="请选择导入人员" kind="select" />
                <Field label="导入时间" placeholder="开始  至  结束" />
                <Field label="审核人员" placeholder="请选择审核人员" kind="select" />
                <Field label="审核时间" placeholder="开始  至  结束" />
                <Field label="配件关键字" placeholder="名称/编码" />
                <Field label="状态" placeholder="请选择状态" kind="select" />
                <div className="xl:col-span-2 flex self-end items-end justify-end gap-2">
                  <button className={`${filterActionButtonClass} bg-[#3b82f6] text-white`}>
                    <SearchIcon sx={{ fontSize: 16 }} />
                    搜索
                  </button>
                  <button className={`${filterActionButtonClass} border border-gray-200 bg-white text-gray-700 hover:bg-gray-100`}>
                    <RefreshIcon sx={{ fontSize: 16 }} />
                    重置
                  </button>
                </div>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden">
              <div className="h-full overflow-auto">
                <table className="w-full min-w-max table-auto">
                  <thead className="sticky top-0 z-10 bg-[#eff6ff]">
                    <tr className="border-b border-[#dbeafe]">
                      {["导入人员", "导入时间", "文件", "审核人员", "审核时间", "上传数量", "导入数量", "状态", "导入备注", "审核备注", "操作"].map((col) =>
                        col === "操作" ? (
                          <th
                            key={col}
                            className="sticky right-0 z-30 w-[120px] min-w-[120px] bg-[#eff6ff] px-3 py-3 text-center text-xs font-semibold text-gray-700 shadow-[-8px_0_12px_-12px_rgba(0,0,0,0.35)]"
                          >
                            {col}
                          </th>
                        ) : (
                          <th key={col} className="px-3 py-3 text-left text-xs font-semibold text-gray-700">
                            {col}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="h-[420px] text-center align-middle text-sm text-gray-400">
                          暂无数据
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  共 <span className="font-semibold text-gray-800">0</span> 条数据
                </div>
                <div className="flex items-center gap-2">
                  <select className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700">
                    <option>10条/页</option>
                  </select>
                  <button className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-500">‹</button>
                  <button className="rounded-lg bg-[#3b82f6] px-3 py-1.5 text-sm text-white">1</button>
                  <button className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-500">›</button>
                  <span className="ml-2 text-sm text-gray-600">前往</span>
                  <input placeholder="1" className="w-12 rounded border border-gray-200 px-2 py-1 text-sm" />
                  <span className="text-sm text-gray-600">页</span>
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <Modal
        open={dialogMode === "more-query"}
        title="更多查询"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-xl"
        footer={
          <div className="flex justify-end gap-2">
            <button className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">重置</button>
            <button onClick={() => setDialogMode(null)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">
              查询
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3">
          {[
            ["供应商", "请选择供应商", "select", ["供应商A", "供应商B"]],
            ["分类", "请选择分类", "select", ["底盘系统", "保养用品", "内饰件"]],
            ["产地", "请选择产地", "select", ["江苏", "广东", "浙江"]],
            ["默认仓库", "请选择默认仓库", "select", ["默认仓库A", "默认仓库B", "默认仓库C"]],
            ["适用车型", "请选择适用车型", "select", ["通用", "伽途T3/祥菱V1"]],
            ["厂家名称", "请输入厂家名称（模糊匹配）", "input", []],
            ["是否匹配车型", "请选择", "select", ["是", "否"]],
            ["是否无图", "请选择", "select", ["是", "否"]],
            ["配件编号", "请输入配件编号", "input", []],
            ["创建人", "请选择创建人", "select", ["黄伟霆", "李倩", "王凯"]],
            ["创建时间", "开始  至  结束", "input", []],
          ].map(([label, placeholder, kind, options]) => (
            <Field
              key={label as string}
              label={label as string}
              placeholder={placeholder as string}
              kind={kind as "input" | "select" | "textarea"}
              options={options as string[]}
            />
          ))}
        </div>
      </Modal>

      <Modal
        open={dialogMode === "create" || dialogMode === "edit"}
        title="设置配件"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-6xl"
        footer={
          <div className="flex items-center justify-between gap-3">
            <button className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">匹配车型</button>
            <div className="flex gap-2">
              <button onClick={() => setDialogMode(null)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                取消
              </button>
              <button onClick={() => setDialogMode(null)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">
                确定
              </button>
            </div>
          </div>
        }
      >
        <div className="mb-4 border-b border-gray-200 bg-gray-50 px-1">
          <div className="flex justify-center gap-1">
            {["配件资料", "配件图片", "配件详情", "标签归类"].map((label, index) => (
              <button
                key={label}
                onClick={() => setDialogTab(index as DialogTab)}
                className={`rounded-none border border-gray-200 px-5 py-2 text-sm font-medium transition-colors ${
                  dialogTab === index ? "bg-[#3b82f6] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                } ${index === 0 ? "rounded-l-md" : ""} ${index === 3 ? "rounded-r-md" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {dialogTab === 0 ? (
          <div className="space-y-4">
            <SectionTitle>基础档案</SectionTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Field label="编码" placeholder="请输入编码" />
              <Field label="零件名称" placeholder="请输入零件名称" required />
              <Field label="规格" placeholder="请输入规格" />
              <Field label="适用车型" placeholder="请选择适用车型" kind="select" options={["通用", "伽途T3/祥菱V1"]} />
              <Field label="图号" placeholder="请输入图号" />
              <Field label="单位" placeholder="请选择单位" kind="select" options={["个", "根", "套", "瓶"]} />
              <Field label="默认仓库" placeholder="请选择默认仓库" kind="select" options={["默认仓库A", "默认仓库B", "默认仓库C"]} />
              <Field label="品类" placeholder="请输入品类" />
              <Field label="产地" placeholder="请选择产地" kind="select" options={["江苏", "广东", "浙江"]} />
              <Field label="供应商" placeholder="请选择供应商" kind="select" options={["供应商A", "供应商B"]} />
              <Field label="品牌" placeholder="请选择品牌" kind="select" options={["原厂", "壳牌", "盟虎净"]} />
              <Field label="特征" placeholder="请输入特征" />
              <Field label="条形码" placeholder="请输入条形码" />
              <Field label="英文单位" placeholder="请输入英文单位" />
              <Field label="畅销等级" placeholder="请选择畅销等级" kind="select" options={["平销款", "爆款", "长尾款"]} />
              <Field label="产品经理" placeholder="请选择产品经理" kind="select" options={["黄伟霆", "李倩", "王凯"]} />
              <Field label="类别" placeholder="请选择类别" kind="select" options={["转向系统", "润滑油", "卡扣", "其他"]} />
              <Field label="外文名" placeholder="请输入外文名" />
              <Field label="厂家编码" placeholder="请输入厂家编码" />
              <Field label="厂家名称" placeholder="请输入厂家名称" />
              <Field label="型号/图号" placeholder="请输入型号/图号" />
              <Field label="通用码" placeholder="请选择通用码" kind="select" options={["通用码A", "通用码B"]} />
              <Field label="重量" placeholder="请输入重量" />
              <Field label="体积" placeholder="请输入体积" />
              <Field label="OE码" placeholder="请输入OE码" />
              <Field label="备注" placeholder="请输入备注" kind="textarea" />
            </div>

            <SectionTitle>价格列表</SectionTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["零售价", "请输入零售价"],
                ["批发价", "请输入批发价"],
                ["参考价", "请输入参考价"],
                ["调拨价", "请输入调拨价"],
                ["批量价", "请输入批量价"],
                ["最后采购价", "请输入最后采购价"],
                ["毛利率管控", "请输入毛利率管控"],
              ].map(([label, placeholder]) => (
                <Field key={label} label={label as string} placeholder={placeholder as string} />
              ))}
            </div>

            <SectionTitle>价格列表配置</SectionTitle>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-[#eff6ff] px-3 py-2 text-sm">
                <button className="rounded bg-[#3b82f6] px-3 py-1 text-white">恢复默认</button>
                <button className="rounded bg-[#3b82f6] px-3 py-1 text-white">配置</button>
              </div>
              <table className="w-full">
                <thead className="bg-[#eff6ff]">
                  <tr className="border-b border-[#dbeafe]">
                    {["级别", "价格", "模板", "备注"].map((item) => (
                      <th key={item} className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["备用价1", "参考价 * 1.2", "自动计算"],
                    ["备用价2", "手工定价", "手动输入"],
                    ["备用价3", "手工定价", "手动输入"],
                    ["划线价", "手工定价", "商城展示系统价格级别"],
                    ["会员价", "手工定价", "商城展示系统价格级别"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-b border-gray-100">
                      <td className="px-3 py-2 text-sm text-gray-700">{row[0]}</td>
                      <td className="px-3 py-2 text-sm">
                        <ValueBox placeholder="请输入价格" />
                      </td>
                      <td className="px-3 py-2 text-sm text-gray-700">{row[1]}</td>
                      <td className="px-3 py-2 text-sm text-gray-700">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : dialogTab === 1 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button className="rounded bg-[#3b82f6] px-4 py-2 text-sm text-white">+ 新增图片</button>
              <button className="rounded border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">删除图片</button>
            </div>
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-600">
                <button className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-white">
                  <RotateRightIcon sx={{ fontSize: 16 }} />
                  旋转
                </button>
                <button className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-white">
                  <ZoomInIcon sx={{ fontSize: 16 }} />
                  放大
                </button>
                <button className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-white">
                  <ZoomOutIcon sx={{ fontSize: 16 }} />
                  缩小
                </button>
                <button className="inline-flex items-center gap-1 rounded px-2 py-1 hover:bg-white">
                  <RefreshIcon sx={{ fontSize: 16 }} />
                  恢复
                </button>
              </div>
            </div>
            <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50">
              <div className="text-center text-gray-400">
                <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-2xl bg-white shadow-inner">
                  <ImageIcon sx={{ fontSize: 42 }} />
                </div>
                <div>暂无图片</div>
              </div>
            </div>
          </div>
        ) : dialogTab === 2 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 pb-2 text-sm text-gray-500">
              {[FormatBoldIcon, FormatItalicIcon, FormatUnderlinedIcon].map((Icon, index) => (
                <button key={index} className="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-100">
                  <Icon sx={{ fontSize: 16 }} />
                </button>
              ))}
              {["H", "B", "T", "I", "U", "S", "•", "≡", "☑", "□", "“ ”", "☺", "⌂", "▣", "↻", "↺", "◱", "✎"].map((item) => (
                <button key={item} className="rounded border border-gray-200 bg-white px-2 py-1 hover:bg-gray-100">
                  {item}
                </button>
              ))}
            </div>
            <textarea
              placeholder="请输入正文"
              className="min-h-[260px] w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3b82f6] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/15"
            />
          </div>
        ) : (
          <div className="space-y-3">
            <button className="rounded bg-[#3b82f6] px-4 py-2 text-sm text-white">+ 新增</button>
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-[#eff6ff]">
                  <tr>
                    {["序号", "标签名称", "操作"].map((item) => (
                      <th key={item} className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={3} className="h-[320px] text-center text-sm text-gray-400">
                      暂无数据
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={dialogMode === "batch-match"}
        title="批量匹配车型"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setDialogMode(null)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              取消
            </button>
            <button onClick={() => setDialogMode(null)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">
              确定
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          <Field label="适用车型" placeholder="请选择适用车型" kind="select" options={["通用", "伽途T3/祥菱V1"]} />
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">当前选中 {selectedIds.length} 条，可直接批量匹配车型。</div>
        </div>
      </Modal>

      <Modal
        open={dialogMode === "batch-edit"}
        title="批量编辑"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-4xl"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setDialogMode(null)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              取消
            </button>
            <button onClick={() => setDialogMode(null)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">
              确定
            </button>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["品牌", "请选择品牌", "select", ["原厂", "壳牌", "盟虎净"]],
            ["产地", "请选择产地", "select", ["江苏", "广东", "浙江"]],
            ["单位", "请选择单位", "select", ["个", "根", "套", "瓶"]],
            ["类别", "请选择类别", "select", ["转向系统", "润滑油", "卡扣", "其他"]],
            ["供应商", "请选择供应商", "select", ["供应商A", "供应商B"]],
            ["畅销等级", "请选择畅销等级", "select", ["平销款", "爆款", "长尾款"]],
          ].map(([label, placeholder, kind, options]) => (
            <Field
              key={label as string}
              label={label as string}
              placeholder={placeholder as string}
              kind={kind as "input" | "select" | "textarea"}
              options={options as string[]}
            />
          ))}
        </div>
      </Modal>

      <Modal
        open={dialogMode === "import"}
        title="配件导入"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setDialogMode(null)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              取消
            </button>
            <button onClick={() => setDialogMode(null)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">
              确定导入
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-500">
            <InfoOutlinedIcon sx={{ fontSize: 16 }} className="mr-1 align-[-3px] text-gray-400" />
            模板支持 图片1-图片5 内嵌图片列；导入已有配件时，有图片则覆盖，无图片则保留原图片。
          </div>
          <div className="grid grid-cols-[90px_1fr] items-start gap-3">
            <label className="pt-3 text-sm text-gray-700">导入备注</label>
            <div className="relative">
              <textarea
                value={importRemark}
                onChange={(e) => setImportRemark(e.target.value)}
                placeholder="选填"
                className="min-h-[96px] w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#3b82f6] focus:outline-none"
              />
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">{importRemark.length} / 500</div>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        open={dialogMode === "export"}
        title="导出栏目设置"
        description="导出的字段默认与原先保持一致，可调整勾选、顺序和表头名称后再导出。"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-5xl"
        footer={
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setExportRowsState((current) => current.map((item, index) => ({ ...item, checked: true, position: String(index + 1) })))}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              恢复默认
            </button>
            <button onClick={() => setDialogMode(null)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              取消
            </button>
            <button onClick={() => setDialogMode(null)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">
              导出
            </button>
          </div>
        }
      >
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-[#eff6ff]">
              <tr>
                {["", "位置", "系统名称", "自定义名称", "宽度", "对齐", "单元格格式"].map((item) => (
                  <th key={item} className="px-3 py-2 text-left text-xs font-semibold text-gray-700">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {exportRowsState.map((row, index) => (
                <tr key={row.systemName} className="border-b border-gray-100">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={row.checked}
                      onChange={(e) =>
                        setExportRowsState((current) => current.map((item, i) => (i === index ? { ...item, checked: e.target.checked } : item)))
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#3b82f6]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input placeholder={row.position} className={`${compactControlClass} w-16`} />
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-700">{row.systemName}</td>
                  <td className="px-3 py-2">
                    <input placeholder={row.customName} className={`${compactControlClass} w-full`} />
                  </td>
                  <td className="px-3 py-2">
                    <input placeholder={row.width} className={`${compactControlClass} w-16`} />
                  </td>
                  <td className="px-3 py-2">
                    <select className={`${compactControlClass} pr-6`}>
                      <option>{row.align}</option>
                      <option>左对齐</option>
                      <option>居中</option>
                      <option>右对齐</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input placeholder={row.format} className={`${compactControlClass} w-full`} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>

      <Modal
        open={dialogMode === "delete"}
        title="提示"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setDialogMode(null)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              取消
            </button>
            <button onClick={() => setDialogMode(null)} className="rounded-lg bg-[#3b82f6] px-4 py-2 text-sm text-white">
              确定
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#fff3d6] p-2 text-[#ffb020]">
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
          </div>
          <div className="pt-1 text-sm text-gray-700">此操作将永久删除该数据, 是否继续?</div>
        </div>
      </Modal>

      <Modal
        open={dialogMode === "batch-delete-empty"}
        title="批量删除"
        onClose={() => setDialogMode(null)}
        maxWidth="max-w-md"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={() => setDialogMode(null)} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
              关闭
            </button>
          </div>
        }
      >
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-[#eff6ff] p-2 text-[#3b82f6]">
            <InfoOutlinedIcon sx={{ fontSize: 18 }} />
          </div>
          <div className="pt-1 text-sm text-gray-700">请先选择要删除的数据</div>
        </div>
      </Modal>
    </div>
  );
}
