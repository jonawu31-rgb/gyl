import { useState } from "react";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { AddDrawingNumberDialog } from "./AddDrawingNumberDialog";

interface PartsDataDialogProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: any) => void;
  editData?: any;
}

export function PartsDataDialog({ open, onClose, onSave, editData }: PartsDataDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [autoGenerateCode, setAutoGenerateCode] = useState(true);
  const [addDrawingDialogOpen, setAddDrawingDialogOpen] = useState(false);
  const [drawingNumbers, setDrawingNumbers] = useState<Array<{ id: string; inputNumber: string; epcNumber: string }>>([]);

  const [formData, setFormData] = useState({
    code: editData?.code || "",
    name: editData?.name || "",
    vehicleType: editData?.vehicleType || "",
    drawingNo: editData?.drawingNo || "",
    brand: editData?.brand || "",
    unit: editData?.unit || "",
    englishUnit: editData?.englishUnit || "",
    note: editData?.note || "",
    foreignName: editData?.foreignName || "",
    manufacturerCode: editData?.manufacturerCode || "",
    manufacturerName: editData?.manufacturerName || "",
    platformName: editData?.platformName || "",
    oldCode: editData?.oldCode || "",
    singleUnit: editData?.singleUnit || "",
    certification: "",
    specifications: editData?.specifications || "",
    category: editData?.category || "",
    barcode: editData?.barcode || "",
    stock: editData?.stock || "",
    origin: editData?.origin || "",
    supplier: editData?.supplier || "",
    modelNo: editData?.modelNo || "",
    universalCode: editData?.universalCode || "",
    abcClass: "",
    // 价格
    costPrice1: "0.00",
    referencePrice1: "0.00",
    retailPrice1: "0.00",
    wholesalePrice1: "0.00",
    lastPurchasePrice: "0.00",
    profitRate: "0",
  });

  const handleSubmit = () => {
    if (onSave) {
      onSave(formData);
    }
    onClose();
  };

  if (!open) return null;

  const tabs = ["配件资料", "扩展", "多图号", "标签归类"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
          <h2 className="text-lg font-bold text-gray-800">配件资料</h2>
          <div className="flex items-center gap-1">
            <button className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors">
              <SettingsIcon sx={{ fontSize: 18 }} />
            </button>
            <button
              onClick={onClose}
              className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded transition-colors"
            >
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
          {activeTab === 0 && (
            <div className="space-y-6">
              {/* 基础档案 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">
                  基础档案
                </h3>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                      <span className="text-red-500">*</span>编码:
                    </label>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        disabled={autoGenerateCode}
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                      />
                      <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={autoGenerateCode}
                          onChange={(e) => setAutoGenerateCode(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600"
                        />
                        自动生成
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">旧编码:</label>
                    <input
                      type="text"
                      value={formData.oldCode}
                      onChange={(e) => setFormData({ ...formData, oldCode: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                      <span className="text-red-500">*</span>单位:
                    </label>
                    <input
                      type="text"
                      value={formData.singleUnit}
                      onChange={(e) => setFormData({ ...formData, singleUnit: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                      <span className="text-red-500">*</span>配件名称:
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">特征:</label>
                    <input
                      type="text"
                      value={formData.specifications}
                      onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                      <span className="text-red-500">*</span>车认合需:
                    </label>
                    <select
                      value={formData.certification}
                      onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="认证">认证</option>
                      <option value="合格">合格</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
                      <span className="text-red-500">*</span>适用车型:
                    </label>
                    <input
                      type="text"
                      value={formData.vehicleType}
                      onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">规格:</label>
                    <input
                      type="text"
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">类别:</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">图号:</label>
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={formData.drawingNo}
                        onChange={(e) => setFormData({ ...formData, drawingNo: e.target.value })}
                        placeholder='如有多个客服点击"+添加"'
                        className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 placeholder:text-xs"
                      />
                      <button className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors">
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">供应商:</label>
                    <input
                      type="text"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">产地:</label>
                    <input
                      type="text"
                      value={formData.origin}
                      onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">品牌:</label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">条形码:</label>
                    <input
                      type="text"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">库存:</label>
                    <input
                      type="text"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">英文单位:</label>
                    <input
                      type="text"
                      value={formData.englishUnit}
                      onChange={(e) => setFormData({ ...formData, englishUnit: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">ABC类:</label>
                    <select
                      value={formData.abcClass}
                      onChange={(e) => setFormData({ ...formData, abcClass: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="A">A类</option>
                      <option value="B">B类</option>
                      <option value="C">C类</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">产品总图:</label>
                    <input
                      type="text"
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">备注:</label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      rows={2}
                      placeholder="请输入"
                      className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">品类:</label>
                    <input
                      type="text"
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-3 flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">外文名:</label>
                    <input
                      type="text"
                      value={formData.foreignName}
                      onChange={(e) => setFormData({ ...formData, foreignName: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">供货方:</label>
                    <input
                      type="text"
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">厂家编码:</label>
                    <input
                      type="text"
                      value={formData.manufacturerCode}
                      onChange={(e) => setFormData({ ...formData, manufacturerCode: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">厂家名称:</label>
                    <input
                      type="text"
                      value={formData.manufacturerName}
                      onChange={(e) => setFormData({ ...formData, manufacturerName: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">型号周号:</label>
                    <input
                      type="text"
                      value={formData.modelNo}
                      onChange={(e) => setFormData({ ...formData, modelNo: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">平台名称:</label>
                    <input
                      type="text"
                      value={formData.platformName}
                      onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-24 shrink-0">通用码:</label>
                    <input
                      type="text"
                      value={formData.universalCode}
                      onChange={(e) => setFormData({ ...formData, universalCode: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 价格列表 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">
                  价格列表
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-32 shrink-0">售用价1:</label>
                    <input
                      type="text"
                      value={formData.costPrice1}
                      onChange={(e) => setFormData({ ...formData, costPrice1: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-32 shrink-0">参考价1:</label>
                    <input
                      type="text"
                      value={formData.referencePrice1}
                      onChange={(e) => setFormData({ ...formData, referencePrice1: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-32 shrink-0">零售价1:</label>
                    <input
                      type="text"
                      value={formData.retailPrice1}
                      onChange={(e) => setFormData({ ...formData, retailPrice1: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-32 shrink-0">批发价1:</label>
                    <input
                      type="text"
                      value={formData.wholesalePrice1}
                      onChange={(e) => setFormData({ ...formData, wholesalePrice1: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-32 shrink-0">最后一次采购入库价格:</label>
                    <input
                      type="text"
                      value={formData.lastPurchasePrice}
                      onChange={(e) => setFormData({ ...formData, lastPurchasePrice: e.target.value })}
                      placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700 w-32 shrink-0">毛利率百分比:</label>
                    <div className="flex-1 flex items-center gap-1">
                      <input
                        type="text"
                        value={formData.profitRate}
                        onChange={(e) => setFormData({ ...formData, profitRate: e.target.value })}
                        placeholder="请输入" className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-4">
              {/* 自动计算上下限 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">
                  自动计算上下限
                </h3>
                <div className="grid grid-cols-4 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">库存上限天数:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">标准库存天数:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">库存下限天数:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">到货周期:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">采购提前期:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">日均销售周期:</label>
                    <select className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400">
                      <option>按天数算</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">日均销售趋势:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                    <span className="text-sm text-gray-600">天</span>
                  </div>
                </div>
              </div>

              {/* 对应厂家产品 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">
                  对应厂家产品
                </h3>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">厂家编号:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">出厂品牌:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">出厂型号:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">出厂箱位:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">出厂装箱数:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">出厂单位:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">出厂重量:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                </div>
              </div>

              {/* 其他 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-bold text-blue-600 mb-4 pb-2 border-b border-gray-200">
                  其他
                </h3>
                <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">是否备查:</label>
                    <select className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400">
                      <option>否</option>
                      <option>是</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">所属部组:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">流动浏览到时间:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">流动浏览:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">包装说明:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">库存上限:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">库存下限:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">标准库存:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">三色标示:</label>
                    <select className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400">
                      <option></option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">包装数:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">平台码:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">保质期:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                    <span className="text-sm text-gray-600">天</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">积分系数:</label>
                    <input type="text" placeholder="100" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">体积:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">拼音码:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">工分:</label>
                    <input type="text" placeholder="0.00" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">重量:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                    <select className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400">
                      <option>kg</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">批量数:</label>
                    <input type="text" placeholder="0" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">发动机:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">长条:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">英度:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">高度:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">税收分类编码:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">税收产品名称:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">税收税务编码:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">适用汽车品牌:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">税收单位:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">适用汽车车系:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">品质:</label>
                    <select className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400">
                      <option></option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">产品码:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                </div>

                {/* 复选框组 */}
                <div className="grid grid-cols-4 gap-x-4 gap-y-2 mt-4">
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    海淘
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    优先卖
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    可互换
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    组装件
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    活塞件
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    是否名牌认证
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    电商标识
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    是否赠品
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked className="rounded border-gray-300" />
                    是否名牌管控
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    是否倾销
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    是否新品
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    活塞次管控
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    不计算上下限
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    商品推荐
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="rounded border-gray-300" />
                    不参与盘货
                  </label>
                </div>

                {/* 模版 */}
                <div className="flex items-center gap-2 mt-4">
                  <label className="text-sm text-gray-700 shrink-0">模版:</label>
                  <select className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400">
                    <option></option>
                  </select>
                </div>
              </div>

              {/* 字段名别名 */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-5 gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">字段名称:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-1 text-sm text-gray-700">
                      <input type="checkbox" className="rounded border-gray-300" />
                      是否必填
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">绑定字段编号:</label>
                    <input type="text" placeholder="" className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 shrink-0">字段类型:</label>
                    <select className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400">
                      <option>文本框</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm text-gray-700 mb-1 block">字段类型编码:</label>
                  <textarea
                    rows={3}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-400 resize-none"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    (注：若选择下拉菜单或添加项，值与值之间采用文本框下方号","隔开，值为=Key&Value还有默认1选定部分，用1隔开，如：长度=L|0,高度=H|0,宽度=W|0,厚度=D|0,直长=L|0,速度|0,中高|A|0)
                  </div>
                </div>
                <div className="flex justify-center mb-4">
                  <button className="px-6 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors">
                    添加
                  </button>
                </div>
                <div className="flex justify-end">
                  <button className="px-4 py-1 bg-white text-gray-700 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                    合并列拆列
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-4">
              {/* 按钮 */}
              <div>
                <button
                  onClick={() => setAddDrawingDialogOpen(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow flex items-center gap-1.5"
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                  我要加图号
                </button>
              </div>

              {/* 表格 */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">录入图号</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">EPC图号</th>
                      <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {drawingNumbers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-12 text-center text-sm text-gray-400">
                          暂无数据
                        </td>
                      </tr>
                    ) : (
                      drawingNumbers.map((item) => (
                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm text-gray-900">{item.inputNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.epcNumber}</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setDrawingNumbers(drawingNumbers.filter(d => d.id !== item.id))}
                              className="text-red-600 hover:text-red-700 transition-colors"
                            >
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 分页和统计 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    &lt;
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                  <button className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                    &gt;
                  </button>
                </div>
                <div className="text-gray-600">
                  图号数量: <span className="font-semibold text-gray-800">{drawingNumbers.length}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="text-center py-12 text-gray-500">
              标签归类选项卡内容...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors border border-gray-300">
              价格参数维护
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors border border-gray-300">
              进价历史
            </button>
            <button className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors border border-gray-300">
              查看编号日志
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
            >
              保存(S)
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors border border-gray-300">
              停用(D)
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors border border-gray-300"
            >
              关闭(Esc)
            </button>
          </div>
        </div>
      </div>

      {/* 添加图号弹框 */}
      <AddDrawingNumberDialog
        open={addDrawingDialogOpen}
        onClose={() => setAddDrawingDialogOpen(false)}
        onSave={(data) => {
          // 处理保存的数据
          const newDrawing = {
            id: Date.now().toString(),
            inputNumber: data.oeNumbers.split('\n')[0] || '',
            epcNumber: '',
          };
          setDrawingNumbers([...drawingNumbers, newDrawing]);
        }}
      />
    </div>
  );
}
