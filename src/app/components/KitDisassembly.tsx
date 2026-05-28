import React, { useState } from 'react';
import { X, Search, Plus, Eye, Ban } from 'lucide-react';
import { FauxSelect } from './ui/FauxSelect';

interface DisassembledPart {
  partId: string;
  partName: string;
  partCode: string;
  spec: string;
  quantity: number;
  warehouse: string;
}

interface DisassemblyRecord {
  disassemblyId: string;
  kitId: string;
  kitName: string;
  quantity: number;
  disassemblyDate: string;
  operator: string;
  status: '已拆装' | '已作废';
  remark: string;
  parts: DisassembledPart[];
}

interface Kit {
  kitId: string;
  kitName: string;
  stock: number;
  parts: Omit<DisassembledPart, 'warehouse'>[];
}

const mockKits: Kit[] = [
  {
    kitId: 'KIT001',
    kitName: '标准套件A',
    stock: 25,
    parts: [
      { partId: 'P001', partName: '前刹车片', partCode: 'BRK001', spec: '通用型', quantity: 4 },
      { partId: 'P002', partName: '机油滤清器', partCode: 'OIL001', spec: '标准型', quantity: 1 },
    ]
  },
  {
    kitId: 'KIT002',
    kitName: '高级套件B',
    stock: 15,
    parts: [
      { partId: 'P003', partName: '空气滤清器', partCode: 'AIR001', spec: '高效型', quantity: 1 },
      { partId: 'P004', partName: '火花塞', partCode: 'SPK001', spec: '铂金', quantity: 4 },
    ]
  },
  {
    kitId: 'KIT003',
    kitName: '经济套件C',
    stock: 30,
    parts: [
      { partId: 'P005', partName: '后刹车片', partCode: 'BRK002', spec: '通用型', quantity: 4 },
    ]
  }
];

const mockRecords: DisassemblyRecord[] = [
  {
    disassemblyId: 'DIS20260528001',
    kitId: 'KIT001',
    kitName: '标准套件A',
    quantity: 5,
    disassemblyDate: '2026-05-28',
    operator: '张三',
    status: '已拆装',
    remark: '客户退货拆解',
    parts: [
      { partId: 'P001', partName: '前刹车片', partCode: 'BRK001', spec: '通用型', quantity: 20, warehouse: '主仓库' },
      { partId: 'P002', partName: '机油滤清器', partCode: 'OIL001', spec: '标准型', quantity: 5, warehouse: '主仓库' },
    ]
  },
  {
    disassemblyId: 'DIS20260527001',
    kitId: 'KIT002',
    kitName: '高级套件B',
    quantity: 3,
    disassemblyDate: '2026-05-27',
    operator: '李四',
    status: '已拆装',
    remark: '',
    parts: [
      { partId: 'P003', partName: '空气滤清器', partCode: 'AIR001', spec: '高效型', quantity: 3, warehouse: '主仓库' },
      { partId: 'P004', partName: '火花塞', partCode: 'SPK001', spec: '铂金', quantity: 12, warehouse: '主仓库' },
    ]
  },
];

const KitDisassembly: React.FC = () => {
  const [records, setRecords] = useState<DisassemblyRecord[]>(mockRecords);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [statusFilter, setStatusFilter] = useState('全部');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DisassemblyRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchText || 
      record.kitName.includes(searchText) || 
      record.disassemblyId.includes(searchText);
    const matchesStatus = statusFilter === '全部' || record.status === statusFilter;
    const matchesDate = (!dateRange[0] || record.disassemblyDate >= dateRange[0]) &&
                       (!dateRange[1] || record.disassemblyDate <= dateRange[1]);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVoid = (record: DisassemblyRecord) => {
    if (window.confirm(`确定要作废拆装单 ${record.disassemblyId} 吗？`)) {
      setRecords(records.map(r => 
        r.disassemblyId === record.disassemblyId ? { ...r, status: '已作废' } : r
      ));
    }
  };

  const handleViewDetail = (record: DisassemblyRecord) => {
    setSelectedRecord(record);
    setShowDetailDialog(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">套件拆装</h1>
        <p className="text-gray-500 text-sm">管理套件拆装单，将成品拆解为配件</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm mb-1.5 text-gray-700">搜索</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="套件名称/拆装单号"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="w-64">
            <label className="block text-sm mb-1.5 text-gray-700">拆装日期</label>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={dateRange[0]}
                onChange={(e) => setDateRange([e.target.value, dateRange[1]])}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="date"
                value={dateRange[1]}
                onChange={(e) => setDateRange([dateRange[0], e.target.value])}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="w-40">
            <label className="block text-sm mb-1.5 text-gray-700">状态</label>
            <FauxSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={['全部', '已拆装', '已作废']}
            />
          </div>

          <button
            onClick={() => setShowAddDialog(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增拆装
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">拆装单号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">套件名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">拆装数量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">拆装日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.map((record) => (
                <tr key={record.disassemblyId} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{record.disassemblyId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.kitName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.disassemblyDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.operator}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      record.status === '已拆装' 
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetail(record)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        查看
                      </button>
                      {record.status === '已拆装' && (
                        <button
                          onClick={() => handleVoid(record)}
                          className="text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <Ban className="w-4 h-4" />
                          作废
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              共 {filteredRecords.length} 条记录
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                上一页
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Disassembly Dialog */}
      {showAddDialog && (
        <AddDisassemblyDialog
          onClose={() => setShowAddDialog(false)}
          onSave={(newRecord) => {
            setRecords([newRecord, ...records]);
            setShowAddDialog(false);
          }}
        />
      )}

      {/* Detail Dialog */}
      {showDetailDialog && selectedRecord && (
        <DetailDialog
          record={selectedRecord}
          onClose={() => {
            setShowDetailDialog(false);
            setSelectedRecord(null);
          }}
        />
      )}
    </div>
  );
};

// Add Disassembly Dialog Component
const AddDisassemblyDialog: React.FC<{
  onClose: () => void;
  onSave: (record: DisassemblyRecord) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    kitId: '',
    quantity: 1,
    warehouse: '主仓库',
    remark: '',
  });
  const [selectedKit, setSelectedKit] = useState<Kit | null>(null);

  const handleKitSelect = (kitId: string) => {
    const kit = mockKits.find(k => k.kitId === kitId);
    if (kit) {
      setSelectedKit(kit);
      setFormData({ ...formData, kitId, quantity: 1 });
    }
  };

  const calculateParts = (): DisassembledPart[] => {
    if (!selectedKit) return [];
    return selectedKit.parts.map(p => ({
      ...p,
      quantity: p.quantity * formData.quantity,
      warehouse: formData.warehouse
    }));
  };

  const handleSubmit = () => {
    if (!formData.kitId || !selectedKit) {
      alert('请选择套件');
      return;
    }

    if (formData.quantity > selectedKit.stock) {
      alert(`拆装数量不能超过库存量（当前库存：${selectedKit.stock}）`);
      return;
    }

    const newRecord: DisassemblyRecord = {
      disassemblyId: `DIS${new Date().toISOString().slice(0,10).replace(/-/g, '')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      kitId: formData.kitId,
      kitName: selectedKit.kitName,
      quantity: formData.quantity,
      disassemblyDate: new Date().toISOString().slice(0, 10),
      operator: '当前用户',
      status: '已拆装',
      remark: formData.remark,
      parts: calculateParts()
    };

    onSave(newRecord);
  };

  const parts = calculateParts();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F9FAFB] rounded-t-xl">
          <h2 className="text-lg font-semibold">新增拆装</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700">套件选择</label>
              <FauxSelect
                value={formData.kitId}
                onChange={handleKitSelect}
                options={['', ...mockKits.map(k => k.kitId)]}
                displayFn={(val) => {
                  if (val === '') return '请选择套件...';
                  const kit = mockKits.find(k => k.kitId === val);
                  return kit ? `${kit.kitName}（库存：${kit.stock}）` : val;
                }}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700">拆装数量</label>
              <input
                type="number"
                min="1"
                max={selectedKit?.stock || 999}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                disabled={!selectedKit}
              />
              {selectedKit && (
                <span className="text-sm text-gray-500">
                  最大可拆：{selectedKit.stock}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700">入仓仓库</label>
              <FauxSelect
                value={formData.warehouse}
                onChange={(val) => setFormData({ ...formData, warehouse: val })}
                options={['主仓库', '副仓库', 'A仓', 'B仓']}
                className="flex-1"
              />
            </div>

            {parts.length > 0 && (
              <div className="flex items-start gap-3">
                <label className="w-24 shrink-0 text-sm text-gray-700 pt-2">还原配件</label>
                <div className="flex-1">
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件编码</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件名称</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">规格</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">获得数量</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">入仓仓库</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {parts.map((part) => (
                          <tr key={part.partId}>
                            <td className="px-3 py-2 text-gray-600">{part.partCode}</td>
                            <td className="px-3 py-2">{part.partName}</td>
                            <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                            <td className="px-3 py-2 font-medium text-green-600">+{part.quantity}</td>
                            <td className="px-3 py-2 text-gray-600">{part.warehouse}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    拆解后将获得 <span className="font-semibold text-blue-600">{parts.length}</span> 种配件
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700 pt-2">备注</label>
              <textarea
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                rows={3}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                placeholder="选填"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail Dialog
const DetailDialog: React.FC<{
  record: DisassemblyRecord;
  onClose: () => void;
}> = ({ record, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F9FAFB] rounded-t-xl">
          <h2 className="text-lg font-semibold">拆装单详情</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">拆装单号：</span>
                <span className="font-medium">{record.disassemblyId}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">套件名称：</span>
                <span className="font-medium">{record.kitName}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">拆装数量：</span>
                <span className="font-medium">{record.quantity}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">拆装日期：</span>
                <span>{record.disassemblyDate}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">操作人：</span>
                <span>{record.operator}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">状态：</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  record.status === '已拆装' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
              {record.remark && (
                <div className="flex gap-3 col-span-2">
                  <span className="text-gray-600 w-24 shrink-0">备注：</span>
                  <span>{record.remark}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">拆解获得配件</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件编码</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件名称</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">规格</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">获得数量</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">入仓仓库</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {record.parts.map((part) => (
                    <tr key={part.partId}>
                      <td className="px-3 py-2 text-gray-600">{part.partCode}</td>
                      <td className="px-3 py-2">{part.partName}</td>
                      <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                      <td className="px-3 py-2 font-medium text-green-600">+{part.quantity}</td>
                      <td className="px-3 py-2 text-gray-600">{part.warehouse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default KitDisassembly;
