import {
  ManageSearch,
  PeopleAlt,
  Favorite,
  ReceiptLong,
  History,
  AssignmentReturn,
  StoreMallDirectory,
  Warehouse,
  AddShoppingCart,
  Inventory,
  BarChart,
  Tune,
} from '@mui/icons-material';

interface QuickOpItem {
  icon: React.ElementType;
  label: string;
  gradient: string;
  page?: string;
}

const operations: QuickOpItem[] = [
  { icon: ManageSearch,       label: '库存查询',     gradient: 'from-blue-500 to-blue-600'       },
  { icon: PeopleAlt,          label: '客户资料',     gradient: 'from-emerald-500 to-teal-600'    },
  { icon: Favorite,           label: '客户偏好',     gradient: 'from-pink-500 to-rose-600'       },
  { icon: ReceiptLong,        label: '销售/报价开单', gradient: 'from-violet-500 to-purple-600',   page: '销售/报价开单' },
  { icon: History,            label: '销售历史订单',  gradient: 'from-amber-500 to-orange-500',    page: '销售历史订单' },
  { icon: AssignmentReturn,   label: '客户退货',     gradient: 'from-red-500 to-rose-500'        },
  { icon: StoreMallDirectory, label: '供应商管理',   gradient: 'from-cyan-500 to-sky-600'        },
  { icon: Warehouse,          label: '仓库管理',     gradient: 'from-teal-500 to-emerald-600'    },
  { icon: AddShoppingCart,    label: '采购管理',     gradient: 'from-orange-500 to-amber-500'    },
  { icon: Inventory,          label: '供应商退货',   gradient: 'from-indigo-500 to-violet-600'   },
  { icon: BarChart,           label: '统计报表',     gradient: 'from-slate-500 to-slate-700'     },
  { icon: Tune,               label: '自定义',       gradient: 'from-gray-400 to-gray-600'       },
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
            {/* Icon tile */}
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${op.gradient} flex items-center justify-center transition-all duration-200 group-hover:scale-110`}
              style={{ boxShadow: '0 6px 16px rgba(0,0,0,0.18)' }}
            >
              <op.icon sx={{ fontSize: 30 }} className="text-white" style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))' }} />
            </div>

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
