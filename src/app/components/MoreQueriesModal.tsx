import { useState } from "react";
import { Close as CloseIcon } from "@mui/icons-material";
import { FauxSelect } from "./ui/FauxSelect";

interface MoreQueriesModalProps {
  open: boolean;
  onClose: () => void;
  onQuery: (filters: QueryFilters) => void;
}

export interface QueryFilters {
  hasStock: string;
  specialCode: string;
  supplier: string;
  drawingNumber: string;
  manufacturerCode: string;
  origin: string;
}

export function MoreQueriesModal({ open, onClose, onQuery }: MoreQueriesModalProps) {
  const [filters, setFilters] = useState<QueryFilters>({
    hasStock: "全部",
    specialCode: "",
    supplier: "",
    drawingNumber: "",
    manufacturerCode: "",
    origin: "",
  });

  if (!open) return null;

  const handleReset = () => {
    setFilters({
      hasStock: "全部",
      specialCode: "",
      supplier: "",
      drawingNumber: "",
      manufacturerCode: "",
      origin: "",
    });
  };

  const handleQuery = () => {
    onQuery(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-lg font-bold text-gray-800">更多查询</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-4">
            {/* 是否有库存 */}
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700 w-24 text-right shrink-0">
                是否有库存
              </label>
              <FauxSelect
                value={filters.hasStock}
                onChange={(e) => setFilters({ ...filters, hasStock: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm"
              >
                <option value="全部">全部</option>
                <option value="有库存">有库存</option>
                <option value="无库存">无库存</option>
              </FauxSelect>
            </div>

            {/* 特证码 */}
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700 w-24 text-right shrink-0">
                特证码
              </label>
              <input
                type="text"
                placeholder="特证码（模糊）"
                value={filters.specialCode}
                onChange={(e) => setFilters({ ...filters, specialCode: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm placeholder:text-gray-400"
              />
            </div>

            {/* 供应商 */}
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700 w-24 text-right shrink-0">
                供应商
              </label>
              <FauxSelect
                value={filters.supplier}
                onChange={(e) => setFilters({ ...filters, supplier: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm text-gray-400"
              >
                <option value="">请选择供应商</option>
                <option value="博世">博世</option>
                <option value="曼牌">曼牌</option>
                <option value="马勒">马勒</option>
              </FauxSelect>
            </div>

            {/* 图号 */}
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700 w-24 text-right shrink-0">
                图号
              </label>
              <input
                type="text"
                placeholder="图号（模糊）"
                value={filters.drawingNumber}
                onChange={(e) => setFilters({ ...filters, drawingNumber: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm placeholder:text-gray-400"
              />
            </div>

            {/* 厂家编码 */}
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700 w-24 text-right shrink-0">
                厂家编码
              </label>
              <input
                type="text"
                placeholder="厂家编码（模糊）"
                value={filters.manufacturerCode}
                onChange={(e) => setFilters({ ...filters, manufacturerCode: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm placeholder:text-gray-400"
              />
            </div>

            {/* 产地 */}
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-700 w-24 text-right shrink-0">
                产地
              </label>
              <FauxSelect
                value={filters.origin}
                onChange={(e) => setFilters({ ...filters, origin: e.target.value })}
                className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all text-sm text-gray-400"
              >
                <option value="">请选择产地</option>
                <option value="德国">德国</option>
                <option value="日本">日本</option>
                <option value="中国">中国</option>
                <option value="美国">美国</option>
              </FauxSelect>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-white text-gray-700 text-sm rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
          >
            重置
          </button>
          <button
            onClick={handleQuery}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow"
          >
            查询
          </button>
        </div>
      </div>
    </div>
  );
}
