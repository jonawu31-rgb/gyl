import { Campaign, CheckCircle, Info, Warning, ChevronRight } from '@mui/icons-material';

interface Announcement {
  title: string;
  content: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

const announcements: Announcement[] = [
  { title: '系统通知', content: '平台上线通知', time: '2小时前', type: 'success' },
  { title: '库存通知', content: '车辆销售库存变更通知', time: '5小时前', type: 'info' },
  { title: '业务公告', content: '其他业务系统公告', time: '1天前', type: 'info' },
];

export function Announcements() {
  const getIcon = (type: string) => {
    const props = { sx: { fontSize: 15 } };
    if (type === 'success') return <CheckCircle {...props} className="text-emerald-500" />;
    if (type === 'warning') return <Warning {...props} className="text-orange-400" />;
    return <Info {...props} className="text-blue-400" />;
  };

  const getTypeStyles = (type: string) => {
    if (type === 'success') return 'bg-emerald-50/60 border-emerald-100';
    if (type === 'warning') return 'bg-orange-50/60 border-orange-100';
    return 'bg-blue-50/60 border-blue-100';
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shrink-0">
      <div className="flex items-center justify-between mb-3">
        {/* 去掉矩形容器，直接用图标 */}
        <div className="flex items-center gap-2">
          <Campaign sx={{ fontSize: 17 }} className="text-blue-500" />
          <h3 className="text-sm font-bold text-gray-800">通知公告</h3>
        </div>
        <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-0.5">
          查看全部
          <ChevronRight sx={{ fontSize: 13 }} />
        </button>
      </div>

      <div className="space-y-2">
        {announcements.map((item, index) => (
          <div
            key={index}
            className={`group flex items-start gap-2.5 p-3 rounded-lg border ${getTypeStyles(item.type)} transition-all duration-200 cursor-pointer`}
          >
            <div className="mt-0.5 shrink-0">{getIcon(item.type)}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-gray-800 truncate">{item.title}</span>
                <span className="text-[11px] text-gray-400 shrink-0">{item.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
