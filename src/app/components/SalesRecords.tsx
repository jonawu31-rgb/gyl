import { TrendingUp } from '@mui/icons-material';

interface SalesRecord {
  salesperson: string;
  amount: string;
  rank: number;
}

const records: SalesRecord[] = [
  { salesperson: '张伟', amount: '¥52,800', rank: 1 },
  { salesperson: '李娜', amount: '¥48,500', rank: 2 },
  { salesperson: '王明', amount: '¥38,900', rank: 3 },
  { salesperson: '刘强', amount: '¥35,600', rank: 4 },
  { salesperson: '陈静', amount: '¥32,300', rank: 5 },
];

// Soft avatar colors — light bg, muted text, no heavy gradients
const avatarColors = [
  'bg-blue-50   text-blue-500   border border-blue-100',
  'bg-violet-50 text-violet-500 border border-violet-100',
  'bg-emerald-50 text-emerald-500 border border-emerald-100',
  'bg-amber-50  text-amber-500  border border-amber-100',
  'bg-pink-50   text-pink-500   border border-pink-100',
];

export function SalesRecords() {
  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white';
    return 'bg-gray-100 text-gray-400';
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-100 shrink-0">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
          <div className="w-1 h-4 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full" />
          销售记录
        </h3>
        <span className="text-xs text-gray-400">2026.05.22</span>
      </div>

      <div className="space-y-1">
        {records.map((record, index) => (
          <div
            key={index}
            className="group flex items-center justify-between py-2 px-2.5 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${getRankBadge(record.rank)}`}>
                {record.rank}
              </div>
              {/* Soft avatar — light bg + muted color */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                {record.salesperson.charAt(0)}
              </div>
              <span className="text-sm text-gray-700 font-medium">{record.salesperson}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-gray-800">{record.amount}</span>
              <TrendingUp className="text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" sx={{ fontSize: 14 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
