import { useState } from "react";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface PartsDataDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  editData?: any;
}

// Custom checkbox component
function CustomCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label
      className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none"
      onClick={() => onChange(!checked)}
    >
      <div
        className={`w-4 h-4 rounded flex items-center justify-center border transition-colors shrink-0 ${
          checked ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300 hover:border-blue-400"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1,4 3.5,6.5 9,1" />
          </svg>
        )}
      </div>
      {label}
    </label>
  );
}

const priceConfigRows = [
  { level: "备用价1", template: "参考价 × 1.2", remark: "自动计算" },
  { level: "备用价2", template: "手工定价", remark: "" },
  { level: "备用价3", template: "手工定价", remark: "" },
  { level: "划线价", template: "手工定价", remark: "商城展示系统价格级别" },
  { level: "会员价", template: "手工定价", remark: "商城展示系统价格级别" },
];

const mockTags = [
  { id: "1", name: "高频配件" },
  { id: "2", name: "进口件" },
  { id: "3", name: "保养类" },
  { id: "4", name: "刹车系统" },
  { id: "5", name: "滤清系统" },
  { id: "6", name: "爆款推荐" },
  { id: "7", name: "新品上架" },
  { id: "8", name: "优先卖" },
];

export function PartsDataDialog({ open, onClose, onSave, editData }: PartsDataDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [autoGenerateCode, setAutoGenerateCode] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [priceConfigValues, setPriceConfigValues] = useState(
    priceConfigRows.map(() => ({ price: "0.00", template: "手工定价", remark: "" }))
  );

  const [formData, setFormData] = useState({
    code: editData?.code || "",
    name: editData?.name || "",
    spec: editData?.spec || "",
    vehicleType: editData?.vehicleType || "",
    drawingNo: editData?.drawingNo || "",
    unit: editData?.unit || "",
    defaultWarehouse: editData?.defaultWarehouse || "",
    category: editData?.category || "",
    origin: editData?.origin || "",
    supplier: editData?.supplierName || "",
    brand: editData?.brand || "",
    feature: editData?.feature || "",
    barcode: editData?.barcode || "",
    englishUnit: "",
    salesRank: editData?.salesRank || "",
    productManager: editData?.productManager || "",
    partClass: editData?.partClass || "",
    foreignName: editData?.foreignName || "",
    manufacturerCode: "",
    manufacturerName: editData?.manufacturerName || "",
    modelNo: "",
    universalCode: "",
    weight: "",
    volume: "",
    oeCode: "",
    note: "",
    // prices
    retailPrice: editData?.retailPrice?.toFixed(2) || "0.00",
    wholesalePrice: editData?.wholesalePrice?.toFixed(2) || "0.00",
    referencePrice: editData?.referencePrice?.toFixed(2) || "0.00",
    transferPrice: "0.00",
    bulkPrice: "0.00",
    lastPurchasePrice: "0.00",
    profitRate: "0",
  });

  const set = (key: string, value: string) => setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = () => {
    if (onSave) onSave(formData);
    onClose();
  };

  if (!open) return null;

  const tabs = ["配件资料", "配件图片", "配件详情", "标签归类"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: "#F9FAFB" }}>
          <h2 className="text-lg font-bold text-gray-800">设置配件</h2>
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
              <SettingsIcon sx={{ fontSize: 18 }} />
            </button>
            <button onClick={onClose} className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
              <CloseIcon sx={{ fontSize: 18 }} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-6">
          <div className="flex gap-1">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 text-sm font-medium transition-all relative ${
                  activeTab === index
                    ? "text-blue-600 bg-white"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {tab}
                {activeTab === index && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* ===== Tab 0: 配件资料 ===== */}
          {activeTab === 0 && (
            <div className="space-y-6">
              {/* 基础档案 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">基础档案</h3>
                <div className="grid grid-cols-3 gap-x-6 gap-y-3">
                  {/* 编码 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0"><span className="text-red-500">*</span>编码:</label>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => set("code", e.target.value)}
                        disabled={autoGenerateCode}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                      />
                      <CustomCheckbox
                        checked={autoGenerateCode}
                        onChange={setAutoGenerateCode}
                        label="自动生成"
                      />
                    </div>
                  </div>
                  {/* 零件名称 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0"><span className="text-red-500">*</span>零件名称:</label>
                    <input type="text" value={formData.name} onChange={(e) => set("name", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 规格 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">规格:</label>
                    <input type="text" value={formData.spec} onChange={(e) => set("spec", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 适用车型 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">适用车型:</label>
                    <input type="text" value={formData.vehicleType} onChange={(e) => set("vehicleType", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 图号 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">图号:</label>
                    <div className="flex-1 flex items-center gap-1">
                      <input type="text" value={formData.drawingNo} onChange={(e) => set("drawingNo", e.target.value)} placeholder='如有多个点击"+添加"' className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-xs" />
                      <button className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors shrink-0">+</button>
                    </div>
                  </div>
                  {/* 单位 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0"><span className="text-red-500">*</span>单位:</label>
                    <FauxSelect value={formData.unit} onChange={(e) => set("unit", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                      {["个", "套", "根", "片", "桶", "瓶", "支", "条", "对"].map((u) => <option key={u} value={u}>{u}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 默认仓库 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">默认仓库:</label>
                    <FauxSelect value={formData.defaultWarehouse} onChange={(e) => set("defaultWarehouse", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                      {["主仓", "B仓", "C仓"].map((w) => <option key={w} value={w}>{w}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 品类 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">品类:</label>
                    <input type="text" value={formData.category} onChange={(e) => set("category", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 产地 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">产地:</label>
                    <FauxSelect value={formData.origin} onChange={(e) => set("origin", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                      {["中国", "德国", "日本", "美国", "英国", "韩国"].map((o) => <option key={o} value={o}>{o}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 供应商 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">供应商:</label>
                    <FauxSelect value={formData.supplier} onChange={(e) => set("supplier", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                      {["博世汽配", "曼牌汽配", "马勒亚太", "NGK中国", "太平洋橡胶"].map((s) => <option key={s} value={s}>{s}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 品牌 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">品牌:</label>
                    <FauxSelect value={formData.brand} onChange={(e) => set("brand", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择/搜索</option>
                      {["博世", "曼牌", "马勒", "NGK", "PIAA", "美孚", "嘉实多"].map((b) => <option key={b} value={b}>{b}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 特征 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">特征:</label>
                    <input type="text" value={formData.feature} onChange={(e) => set("feature", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 条形码 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">条形码:</label>
                    <input type="text" value={formData.barcode} onChange={(e) => set("barcode", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 英文单位 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">英文单位:</label>
                    <input type="text" value={formData.englishUnit} onChange={(e) => set("englishUnit", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 畅销等级 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">畅销等级:</label>
                    <FauxSelect value={formData.salesRank} onChange={(e) => set("salesRank", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                      {["爆款", "平销款", "滞销款"].map((r) => <option key={r} value={r}>{r}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 产品经理 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">产品经理:</label>
                    <FauxSelect value={formData.productManager} onChange={(e) => set("productManager", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                      {["张三", "李四", "王五", "赵六"].map((p) => <option key={p} value={p}>{p}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 类别 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">类别:</label>
                    <FauxSelect value={formData.partClass} onChange={(e) => set("partClass", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                      {["制动系统", "过滤系统", "点火系统", "润滑保养", "车身附件", "轮胎附件"].map((c) => <option key={c} value={c}>{c}</option>)}
                    </FauxSelect>
                  </div>
                  {/* 外文名 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">外文名:</label>
                    <input type="text" value={formData.foreignName} onChange={(e) => set("foreignName", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 厂家编码 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">厂家编码:</label>
                    <input type="text" value={formData.manufacturerCode} onChange={(e) => set("manufacturerCode", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 厂家名称 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">厂家名称:</label>
                    <input type="text" value={formData.manufacturerName} onChange={(e) => set("manufacturerName", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 型号/图号 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">型号/图号:</label>
                    <input type="text" value={formData.modelNo} onChange={(e) => set("modelNo", e.target.value)} placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 通用码 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">通用码:</label>
                    <FauxSelect value={formData.universalCode} onChange={(e) => set("universalCode", e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option value="">请选择</option>
                    </FauxSelect>
                  </div>
                  {/* 重量 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">重量:</label>
                    <div className="flex-1 flex items-center gap-1">
                      <input type="number" value={formData.weight} onChange={(e) => set("weight", e.target.value)} placeholder="0" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                      <span className="text-sm text-gray-500 shrink-0">kg</span>
                    </div>
                  </div>
                  {/* 体积 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">体积:</label>
                    <div className="flex-1 flex items-center gap-1">
                      <input type="number" value={formData.volume} onChange={(e) => set("volume", e.target.value)} placeholder="0" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                      <span className="text-sm text-gray-500 shrink-0">m³</span>
                    </div>
                  </div>
                  {/* OE码 */}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0">OE码:</label>
                    <input type="text" value={formData.oeCode} onChange={(e) => set("oeCode", e.target.value)} placeholder="请输入原厂OE号码" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  {/* 备注 */}
                  <div className="col-span-3 flex items-start gap-2">
                    <label className="text-sm font-medium text-gray-700 w-20 shrink-0 pt-1.5">备注:</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => set("note", e.target.value)}
                      rows={2}
                      placeholder="请输入"
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 价格列表 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">价格列表</h3>
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-5">
                  {[
                    { label: "零售价", key: "retailPrice" },
                    { label: "批发价", key: "wholesalePrice" },
                    { label: "参考价", key: "referencePrice" },
                    { label: "调拨价", key: "transferPrice" },
                    { label: "批量价", key: "bulkPrice" },
                    { label: "最后采购价", key: "lastPurchasePrice" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700 w-24 shrink-0">{label}:</label>
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-sm text-gray-500">¥</span>
                        <input
                          type="text"
                          value={(formData as any)[key]}
                          onChange={(e) => set(key, e.target.value)}
                          className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">毛利率管控:</label>
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={formData.profitRate}
                        onChange={(e) => set("profitRate", e.target.value)}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-sm text-gray-500 shrink-0">%</span>
                    </div>
                  </div>
                </div>

                {/* Price config table */}
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">级别</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">价格</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">模板</th>
                      <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-700">备注</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceConfigRows.map((row, i) => (
                      <tr key={row.level} className="border-b border-gray-100 last:border-0">
                        <td className="px-4 py-2 text-sm text-gray-700 whitespace-nowrap">{row.level}</td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-500">¥</span>
                            <input
                              type="text"
                              value={priceConfigValues[i].price}
                              onChange={(e) => {
                                const updated = [...priceConfigValues];
                                updated[i] = { ...updated[i], price: e.target.value };
                                setPriceConfigValues(updated);
                              }}
                              className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <FauxSelect
                            value={priceConfigValues[i].template}
                            onChange={(e) => {
                              const updated = [...priceConfigValues];
                              updated[i] = { ...updated[i], template: e.target.value };
                              setPriceConfigValues(updated);
                            }}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          >
                            <option value="手工定价">手工定价</option>
                            <option value="参考价 × 1.2">参考价 × 1.2</option>
                            <option value="零售价 × 0.9">零售价 × 0.9</option>
                            <option value="批发价 × 1.1">批发价 × 1.1</option>
                          </FauxSelect>
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-500">{row.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 匹配车型 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-blue-600">匹配车型</h3>
                  <button className="px-3 py-1 text-xs bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all flex items-center gap-1">
                    <AddIcon sx={{ fontSize: 13 }} />
                    添加车型
                  </button>
                </div>
                <div className="text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  暂无匹配车型，点击"添加车型"关联适用车型
                </div>
              </div>
            </div>
          )}

          {/* ===== Tab 1: 配件图片 ===== */}
          {activeTab === 1 && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">配件图片</h3>
                {/* Upload area */}
                <label className="block mb-4 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                    <UploadIcon sx={{ fontSize: 40 }} className="text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-600">点击或拖拽上传图片</p>
                    <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG、GIF，单张不超过 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const urls = files.map((f) => URL.createObjectURL(f));
                      setUploadedImages((prev) => [...prev, ...urls]);
                    }}
                  />
                </label>
                {/* Image grid */}
                {uploadedImages.length > 0 ? (
                  <div className="grid grid-cols-5 gap-3">
                    {uploadedImages.map((url, i) => (
                      <div key={i} className="relative group aspect-square border border-gray-200 rounded-lg overflow-hidden">
                        <img src={url} alt={`配件图片${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => setUploadedImages((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <CloseIcon sx={{ fontSize: 12 }} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-gray-400 flex items-center justify-center gap-2">
                    <ImageIcon sx={{ fontSize: 18 }} />
                    暂无图片
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ===== Tab 2: 配件详情 ===== */}
          {activeTab === 2 && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-600 mb-3 pb-2 border-b border-gray-200">配件详情</h3>
                {/* Simulated rich text toolbar */}
                <div className="flex items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-lg flex-wrap">
                  {["加粗", "斜体", "下划线", "标题1", "标题2", "有序列表", "无序列表", "插入图片", "插入链接"].map((tool) => (
                    <button key={tool} className="px-2 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
                      {tool}
                    </button>
                  ))}
                </div>
                <textarea
                  rows={16}
                  placeholder="请输入配件详情描述，支持富文本格式..."
                  className="w-full px-3 py-3 text-sm border border-gray-200 border-t-0 rounded-b-lg focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* ===== Tab 3: 标签归类 ===== */}
          {activeTab === 3 && (
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">标签归类</h3>
                <p className="text-xs text-gray-500 mb-4">选择适合该配件的标签，便于分类和检索</p>
                <div className="flex flex-wrap gap-2">
                  {mockTags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() =>
                          setSelectedTags((prev) =>
                            isSelected ? prev.filter((x) => x !== tag.id) : [...prev, tag.id]
                          )
                        }
                        className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                          isSelected
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600"
                        }`}
                      >
                        {tag.name}
                      </button>
                    );
                  })}
                </div>
                {selectedTags.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2">已选标签 ({selectedTags.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((id) => {
                        const tag = mockTags.find((t) => t.id === id);
                        return tag ? (
                          <span key={id} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200">
                            {tag.name}
                            <button onClick={() => setSelectedTags((prev) => prev.filter((x) => x !== id))} className="hover:text-blue-900 transition-colors">
                              <CloseIcon sx={{ fontSize: 11 }} />
                            </button>
                          </span>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
              价格参数维护
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
              进价历史
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
              查看编号日志
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
            >
              保存(S)
            </button>
            <button className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300">
              停用(D)
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
            >
              关闭(Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
