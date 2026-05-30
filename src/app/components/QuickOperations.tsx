import { ImageWithFallback } from "./figma/ImageWithFallback";
import icon1 from "../../imports/ImageWithFallback/1.png";
import icon2 from "../../imports/ImageWithFallback/2.png";
import icon3 from "../../imports/ImageWithFallback/3.png";
import icon4 from "../../imports/ImageWithFallback/4.png";
import icon5 from "../../imports/ImageWithFallback/5.png";
import icon6 from "../../imports/ImageWithFallback/6.png";
import icon7 from "../../imports/ImageWithFallback/7.png";
import icon8 from "../../imports/ImageWithFallback/8.png";
import icon9 from "../../imports/ImageWithFallback/9.png";
import icon10 from "../../imports/ImageWithFallback/10.png";
import icon11 from "../../imports/ImageWithFallback/11.png";
import icon12 from "../../imports/ImageWithFallback/12.png";

interface QuickOpItem {
  icon: string;
  label: string;
  page?: string;
}

const operations: QuickOpItem[] = [
  { icon: icon1, label: '库存查询' },
  { icon: icon2, label: '客户资料' },
  { icon: icon3, label: '销售/报价开单', page: '销售/报价开单' },
  { icon: icon4, label: '销售历史订单', page: '销售历史订单' },
  { icon: icon5, label: '客户退货' },
  { icon: icon6, label: '供应商管理' },
  { icon: icon7, label: '仓库管理' },
  { icon: icon8, label: '采购管理' },
  { icon: icon9, label: '供应商退货' },
  { icon: icon10, label: '统计报表' },
  { icon: icon11, label: '自定义' },
  { icon: icon12, label: '更多' },
];

interface QuickOperationsProps {
  onPageChange?: (page: string) => void;
}

export function QuickOperations({ onPageChange }: QuickOperationsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full" />
          快捷操作
        </h3>
        <button className="text-xs text-gray-400 hover:text-blue-600 transition-colors">
          自定义
        </button>
      </div>

      <div className="grid grid-cols-4 xl:grid-cols-6 px-3 xl:px-4 pb-5 xl:pb-6">
        {operations.map((op, index) => (
          <button
            key={index}
            onClick={() => op.page && onPageChange?.(op.page)}
            className="group flex flex-col items-center gap-2 xl:gap-2.5 py-3 xl:py-4 px-1 rounded-2xl transition-all duration-200 hover:bg-gray-50 cursor-pointer"
          >
            <ImageWithFallback
              src={op.icon}
              alt={op.label}
              className="block w-auto h-auto transition-transform duration-200 group-hover:scale-110"
            />

            {/* Label */}
            <span className="text-[11px] xl:text-xs text-gray-600 group-hover:text-gray-900 font-medium text-center leading-tight transition-colors duration-200 w-full">
              {op.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
