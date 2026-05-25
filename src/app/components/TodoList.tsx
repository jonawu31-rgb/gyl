import {
  Warning,
  LocalShipping,
  Receipt,
  People,
  Payment,
} from '@mui/icons-material';

interface TodoItem {
  title: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
  countColor: string;
}

const todos: TodoItem[] = [
  { title: '库存预警',    count: 57,    icon: <Warning sx={{ fontSize: 15 }} />,       gradient: 'from-red-500 to-pink-600',     countColor: 'text-red-500' },
  { title: '待发货订单',  count: 19234, icon: <LocalShipping sx={{ fontSize: 15 }} />, gradient: 'from-orange-500 to-amber-600', countColor: 'text-orange-500' },
  { title: '报销单审批',  count: 162,   icon: <Receipt sx={{ fontSize: 15 }} />,       gradient: 'from-blue-500 to-cyan-600',    countColor: 'text-blue-500' },
  { title: '客户拜访审批', count: 12,   icon: <People sx={{ fontSize: 15 }} />,        gradient: 'from-emerald-500 to-teal-600', countColor: 'text-emerald-500' },
  { title: '付款审批',    count: 34,    icon: <Payment sx={{ fontSize: 15 }} />,       gradient: 'from-purple-500 to-indigo-600', countColor: 'text-purple-500' },
];

export function TodoList() {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
          待办事项
        </h3>
        <div className="px-2 py-0.5 bg-blue-50 rounded-full border border-blue-100">
          <span className="text-xs text-gray-500">共</span>
          <span className="text-xs font-bold text-blue-600 mx-1">
            {todos.reduce((sum, item) => sum + item.count, 0).toLocaleString()}
          </span>
          <span className="text-xs text-gray-500">项</span>
        </div>
      </div>

      <div className="space-y-1.5">
        {todos.map((item, index) => (
          <div
            key={index}
            className="group flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center text-white shadow-sm shrink-0`}>
                {item.icon}
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                {item.title}
              </span>
            </div>

            <span className={`text-sm font-bold ${item.countColor} tabular-nums`}>
              {item.count.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
