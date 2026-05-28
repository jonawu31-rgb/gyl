import React, { useState } from 'react';
import { X, Search, Calendar, Plus, Eye, Ban } from 'lucide-react';
import { FauxSelect } from './ui/FauxSelect';

interface KitPart {
  partId: string;
  partName: string;
  partCode: string;
  spec: string;
  quantity: number;
  unitCost: number;
  subtotal: number;
  stock: number;
}

interface AssemblyRecord {
  assemblyId: string;
  kitName: string;
  quantity: number;
  assemblyDate: string;
  totalCost: number;
  operator: string;
  status: '已组装' | '已作废';
  remark: string;
  parts: KitPart[];
}

interface KitTemplate {
  templateId: string;
  name: string;
  parts: KitPart[];
}

const mockTemplates: KitTemplate[] = [
  {
    templateId: 'TPL001',
    name: '标准套件A',
    parts: [
      { partId: 'P001', partName: '前刹车片', partCode: 'BRK001', spec: '通用型', quantity: 4, unitCost: 45, subtotal: 180, stock: 100 },
      { partId: 'P002', partName: '机油滤清器', partCode: 'OIL001', spec: '标准型', quantity: 1, unitCost: 25, subtotal: 25, stock: 50 },
    ]
  },
  {
    templateId: 'TPL002',
    name: '高级套件B',
    parts: [
      { partId: 'P003', partName: '空气滤清器', partCode: 'AIR001', spec: '高效型', quantity: 1, unitCost: 35, subtotal: 35, stock: 80 },
      { partId: 'P004', partName: '火花塞', partCode: 'SPK001', spec: '铂金', quantity: 4, unitCost: 28, subtotal: 112, stock: 200 },
    ]
  }
];

const mockAvailableParts: KitPart[] = [
  { partId: 'P001', partName: '前刹车片', partCode: 'BRK001', spec: '通用型', quantity: 0, unitCost: 45, subtotal: 0, stock: 100 },
  { partId: 'P002', partName: '机油滤清器', partCode: 'OIL001', spec: '标准型', quantity: 0, unitCost: 25, subtotal: 0, stock: 50 },
  { partId: 'P003', partName: '空气滤清器', partCode: 'AIR001', spec: '高效型', quantity: 0, unitCost: 35, subtotal: 0, stock: 80 },
  { partId: 'P004', partName: '火花塞', partCode: 'SPK001', spec: '铂金', quantity: 0, unitCost: 28, subtotal: 0, stock: 200 },
  { partId: 'P005', partName: '后刹车片', partCode: 'BRK002', spec: '通用型', quantity: 0, unitCost: 50, subtotal: 0, stock: 75 },
];

const mockRecords: AssemblyRecord[] = [
  {
    assemblyId: 'ASM20260528001',
    kitName: '标准套件A',
    quantity: 10,
    assemblyDate: '2026-05-28',
    totalCost: 2050,
    operator: '张三',
    status: '已组装',
    remark: '常规组装',
    parts: [
      { partId: 'P001', partName: '前刹车片', partCode: 'BRK001', spec: '通用型', quantity: 40, unitCost: 45, subtotal: 1800, stock: 100 },
      { partId: 'P002', partName: '机油滤清器', partCode: 'OIL001', spec: '标准型', quantity: 10, unitCost: 25, subtotal: 250, stock: 50 },
    ]
  },
  {
    assemblyId: 'ASM20260527001',
    kitName: '高级套件B',
    quantity: 5,
    assemblyDate: '2026-05-27',
    totalCost: 735,
    operator: '李四',
    status: '已组装',
    remark: '',
    parts: [
      { partId: 'P003', partName: '空气滤清器', partCode: 'AIR001', spec: '高效型', quantity: 5, unitCost: 35, subtotal: 175, stock: 80 },
      { partId: 'P004', partName: '火花塞', partCode: 'SPK001', spec: '铂金', quantity: 20, unitCost: 28, subtotal: 560, stock: 200 },
    ]
  },
];

const KitAssembly: React.FC = () => {
  const [records, setRecords] = useState<AssemblyRecord[]>(mockRecords);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [statusFilter, setStatusFilter] = useState('全部');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPartsDialog, setShowPartsDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AssemblyRecord | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchText || 
      record.kitName.includes(searchText) || 
      record.assemblyId.includes(searchText);
    const matchesStatus = statusFilter === '全部' || record.status === statusFilter;
    const matchesDate = (!dateRange[0] || record.assemblyDate >= dateRange[0]) &&
                       (!dateRange[1] || record.assemblyDate <= dateRange[1]);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVoid = (record: AssemblyRecord) => {
    if (window.confirm(`确定要作废组装单 ${record.assemblyId} 吗？`)) {
      setRecords(records.map(r => 
        r.assemblyId === record.assemblyId ? { ...r, status: '已作废' } : r
      ));
    }
  };

  const handleViewDetail = (record: AssemblyRecord) => {
    setSelectedRecord(record);
    setShowDetailDialog(true);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">套件组装</h1>
        <p className="text-gray-500 text-sm">管理套件组装单，将配件组装为成品</p>
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
                placeholder="套件名称/组装单号"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="w-64">
            <label className="block text-sm mb-1.5 text-gray-700">组装日期</label>
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
              options={['全部', '已组装', '已作废']}
            />
          </div>

          <button
            onClick={() => setShowAddDialog(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            新增组装
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">组装单号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">套件名称</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">组装数量</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">组装日期</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">成本合计</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">操作人</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRecords.map((record) => (
                <tr key={record.assemblyId} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{record.assemblyId}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.kitName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{record.quantity}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.assemblyDate}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">¥{record.totalCost.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{record.operator}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      record.status === '已组装' 
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
                      {record.status === '已组装' && (
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

      {/* Add Assembly Dialog */}
      {showAddDialog && (
        <AddAssemblyDialog
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

// Add Assembly Dialog Component
const AddAssemblyDialog: React.FC<{
  onClose: () => void;
  onSave: (record: AssemblyRecord) => void;
}> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    kitName: '',
    templateId: '',
    quantity: 1,
    remark: '',
  });
  const [selectedParts, setSelectedParts] = useState<KitPart[]>([]);
  const [showPartsDialog, setShowPartsDialog] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = mockTemplates.find(t => t.templateId === templateId);
    if (template) {
      setFormData({ ...formData, templateId, kitName: template.name });
      setSelectedParts(template.parts.map(p => ({ ...p })));
    }
  };

  const handleSubmit = () => {
    if (!formData.kitName || selectedParts.length === 0) {
      alert('请填写套件名称并选择配件');
      return;
    }

    // Check stock
    const insufficientParts = selectedParts.filter(p => p.quantity * formData.quantity > p.stock);
    if (insufficientParts.length > 0) {
      alert(`以下配件库存不足：\n${insufficientParts.map(p => `${p.partName}（需要${p.quantity * formData.quantity}，库存${p.stock}）`).join('\n')}`);
      return;
    }

    const totalCost = selectedParts.reduce((sum, p) => sum + p.subtotal, 0) * formData.quantity;
    const newRecord: AssemblyRecord = {
      assemblyId: `ASM${new Date().toISOString().slice(0,10).replace(/-/g, '')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      kitName: formData.kitName,
      quantity: formData.quantity,
      assemblyDate: new Date().toISOString().slice(0, 10),
      totalCost,
      operator: '当前用户',
      status: '已组装',
      remark: formData.remark,
      parts: selectedParts.map(p => ({
        ...p,
        quantity: p.quantity * formData.quantity,
        subtotal: p.subtotal * formData.quantity
      }))
    };

    onSave(newRecord);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F9FAFB] rounded-t-xl">
          <h2 className="text-lg font-semibold">新增组装</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700">从模版选择</label>
              <FauxSelect
                value={formData.templateId}
                onChange={handleTemplateSelect}
                options={['', ...mockTemplates.map(t => t.templateId)]}
                displayFn={(val) => val === '' ? '选择模版...' : mockTemplates.find(t => t.templateId === val)?.name || val}
                className="flex-1"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700">套件名称</label>
              <input
                type="text"
                value={formData.kitName}
                onChange={(e) => setFormData({ ...formData, kitName: e.target.value })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                placeholder="输入套件名称"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700">组装数量</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-start gap-3">
              <label className="w-24 shrink-0 text-sm text-gray-700 pt-2">配件列表</label>
              <div className="flex-1">
                <button
                  onClick={() => setShowPartsDialog(true)}
                  className="mb-3 px-4 py-2 border border-blue-500 text-blue-600 rounded-lg text-sm hover:bg-blue-50 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  添加配件
                </button>
                
                {selectedParts.length > 0 && (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件名称</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">规格</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">单位用量</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">单价</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">小计</th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedParts.map((part) => (
                          <tr key={part.partId}>
                            <td className="px-3 py-2">{part.partName}</td>
                            <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                            <td className="px-3 py-2">{part.quantity}</td>
                            <td className="px-3 py-2">¥{part.unitCost.toFixed(2)}</td>
                            <td className="px-3 py-2">¥{part.subtotal.toFixed(2)}</td>
                            <td className="px-3 py-2">
                              <button
                                onClick={() => setSelectedParts(selectedParts.filter(p => p.partId !== part.partId))}
                                className="text-red-600 hover:text-red-700 text-xs"
                              >
                                移除
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 text-sm font-medium flex justify-between">
                      <span>单套成本合计</span>
                      <span>¥{selectedParts.reduce((sum, p) => sum + p.subtotal, 0).toFixed(2)}</span>
                    </div>
                    <div className="px-3 py-2 bg-blue-50 border-t border-gray-200 text-sm font-semibold flex justify-between">
                      <span>总成本（× {formData.quantity}）</span>
                      <span className="text-blue-700">¥{(selectedParts.reduce((sum, p) => sum + p.subtotal, 0) * formData.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

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

      {/* Parts Selection Dialog */}
      {showPartsDialog && (
        <PartsSelectionDialog
          selectedParts={selectedParts}
          onClose={() => setShowPartsDialog(false)}
          onConfirm={(parts) => {
            setSelectedParts(parts);
            setShowPartsDialog(false);
          }}
        />
      )}
    </div>
  );
};

// Parts Selection Dialog
const PartsSelectionDialog: React.FC<{
  selectedParts: KitPart[];
  onClose: () => void;
  onConfirm: (parts: KitPart[]) => void;
}> = ({ selectedParts, onClose, onConfirm }) => {
  const [parts, setParts] = useState<KitPart[]>(
    mockAvailableParts.map(p => {
      const existing = selectedParts.find(sp => sp.partId === p.partId);
      return existing ? { ...existing } : { ...p };
    })
  );
  const [searchText, setSearchText] = useState('');

  const filteredParts = parts.filter(p => 
    p.partName.includes(searchText) || p.partCode.includes(searchText)
  );

  const handleQuantityChange = (partId: string, quantity: number) => {
    setParts(parts.map(p => {
      if (p.partId === partId) {
        const newQty = Math.max(0, quantity);
        return {
          ...p,
          quantity: newQty,
          subtotal: newQty * p.unitCost
        };
      }
      return p;
    }));
  };

  const handleConfirm = () => {
    const selected = parts.filter(p => p.quantity > 0);
    onConfirm(selected);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F9FAFB] rounded-t-xl">
          <h2 className="text-lg font-semibold">选择配件</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索配件名称或编码"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件编码</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件名称</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">规格</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">库存</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">单价</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">使用数量</th>
                <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">小计</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredParts.map((part) => (
                <tr key={part.partId} className="hover:bg-blue-50/40">
                  <td className="px-3 py-2 text-gray-600">{part.partCode}</td>
                  <td className="px-3 py-2">{part.partName}</td>
                  <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                  <td className="px-3 py-2 text-gray-600">{part.stock}</td>
                  <td className="px-3 py-2">¥{part.unitCost.toFixed(2)}</td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      max={part.stock}
                      value={part.quantity}
                      onChange={(e) => handleQuantityChange(part.partId, parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:border-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2 font-medium">¥{part.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm">
            已选 <span className="font-semibold text-blue-600">{parts.filter(p => p.quantity > 0).length}</span> 种配件
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg text-sm font-medium"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail Dialog
const DetailDialog: React.FC<{
  record: AssemblyRecord;
  onClose: () => void;
}> = ({ record, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-[#F9FAFB] rounded-t-xl">
          <h2 className="text-lg font-semibold">组装单详情</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">组装单号：</span>
                <span className="font-medium">{record.assemblyId}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">套件名称：</span>
                <span className="font-medium">{record.kitName}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">组装数量：</span>
                <span className="font-medium">{record.quantity}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">组装日期：</span>
                <span>{record.assemblyDate}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">成本合计：</span>
                <span className="font-medium text-blue-600">¥{record.totalCost.toFixed(2)}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">操作人：</span>
                <span>{record.operator}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-gray-600 w-24 shrink-0">状态：</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                  record.status === '已组装' 
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
            <h3 className="text-sm font-semibold mb-3">配件明细</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件编码</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">配件名称</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">规格</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">使用数量</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">单价</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-600">小计</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {record.parts.map((part) => (
                    <tr key={part.partId}>
                      <td className="px-3 py-2 text-gray-600">{part.partCode}</td>
                      <td className="px-3 py-2">{part.partName}</td>
                      <td className="px-3 py-2 text-gray-600">{part.spec}</td>
                      <td className="px-3 py-2">{part.quantity}</td>
                      <td className="px-3 py-2">¥{part.unitCost.toFixed(2)}</td>
                      <td className="px-3 py-2 font-medium">¥{part.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t border-gray-200">
                  <tr>
                    <td colSpan={5} className="px-3 py-2 text-right font-semibold">合计</td>
                    <td className="px-3 py-2 font-semibold text-blue-600">¥{record.totalCost.toFixed(2)}</td>
                  </tr>
                </tfoot>
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

export default KitAssembly;
