import { useState } from "react";
import {
  Close as CloseIcon,
  Settings as SettingsIcon,
  Print as PrintIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

interface SalesOrderDetailProps {
  open: boolean;
  onClose: () => void;
  orderData: any;
}

interface OrderLineItem {
  id: number;
  code: string;
  name: string;
  vehicleType: string;
  specification: string;
  feature: string;
  brand: string;
  unit: string;
  quantity: number;
  price: number;
  amount: number;
  warehouse: string;
  location: string;
  singleUnit: number;
  totalUnit: number;
  unitPrice: number;
  totalPrice: number;
  costPrice: number;
  profit: number;
  supplier: string;
  stockQty: number;
  note: string;
}

const mockLineItems: OrderLineItem[] = [
  {
    id: 1,
    code: "10 2 16 XFLSOO-02ZCP 0310",
    name: "ZCP0310-LD",
    vehicleType: "福睿斯款1U661",
    specification: "铜管",
    feature: "A01",
    brand: "套",
    unit: "套",
    quantity: 1.00,
    price: 34,
    amount: 34.00,
    warehouse: "ZCP 0310",
    location: "山东济南仓库",
    singleUnit: 0.00,
    totalUnit: 0.00,
    unitPrice: 34.000,
    totalPrice: 34.00,
    costPrice: 34.00,
    profit: 0,
    supplier: "套大众成",
    stockQty: 0,
    note: "",
  },
  {
    id: 2,
    code: "10 2 16 2YKF10S (VJ46) H-02ZCP 1287",
    name: "ZCP-1287-01-MS",
    vehicleType: "216高音仿全金属（VJ46）后（陶瓷）",
    specification: "",
    feature: "",
    brand: "套",
    unit: "套",
    quantity: 1.00,
    price: 42,
    amount: 42.00,
    warehouse: "",
    location: "山东济南仓库",
    singleUnit: 0.00,
    totalUnit: 0.00,
    unitPrice: 42.000,
    totalPrice: 42.00,
    costPrice: 42.00,
    profit: 0,
    supplier: "立装",
    stockQty: 0,
    note: "",
  },
  {
    id: 3,
    code: "10 2 16 02PCX-02ZCP 0847",
    name: "ZCP0847-LD",
    vehicleType: "普普自由光前",
    specification: "陶瓷",
    feature: "A01",
    brand: "套",
    unit: "套",
    quantity: 1.00,
    price: 48,
    amount: 48.00,
    warehouse: "ZCP 0847",
    location: "山东济南仓库",
    singleUnit: 0.00,
    totalUnit: 0.00,
    unitPrice: 48.000,
    totalPrice: 48.00,
    costPrice: 48.00,
    profit: 0,
    supplier: "套大众成",
    stockQty: 0,
    note: "",
  },
  {
    id: 4,
    code: "10 2 16 CAZXQ-02ZCP 0039",
    name: "ZCP0039-LD",
    vehicleType: "长安之星彩（双品）",
    specification: "",
    feature: "",
    brand: "套",
    unit: "套",
    quantity: 1.00,
    price: 22,
    amount: 22.00,
    warehouse: "",
    location: "山东济南仓库",
    singleUnit: 0.00,
    totalUnit: 0.00,
    unitPrice: 22.000,
    totalPrice: 22.00,
    costPrice: 22.00,
    profit: 0,
    supplier: "立装",
    stockQty: 0,
    note: "",
  },
];

export function SalesOrderDetail({ open, onClose, orderData }: SalesOrderDetailProps) {
  const [activeTab, setActiveTab] = useState(0);

  if (!open) return null;

  const tabs = ["详细信息", "财务进度", "仓库进度", "短信", "国外费用", "线上支付"];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-2.5 border-b border-gray-200 rounded-t-xl flex items-center justify-between" style={{ backgroundColor: '#F9FAFB' }}>
          <h2 className="text-lg font-bold text-gray-800">销售单信息</h2>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
              发送短信
            </button>
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
                className={`px-4 py-2 text-sm font-medium transition-all relative ${
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

        {/* Action Buttons */}
        <div className="px-6 py-2 border-b border-gray-200 bg-white">
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              销售退单(D)
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              赠送单(A)
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              <PrintIcon sx={{ fontSize: 14 }} className="inline mr-1" />
              销收安收
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              打印(I)
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              修改编码方式
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              修改客户
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              修改送货方式
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              销售配货
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              盘中配货
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              经营配货
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              销售配货
            </button>
            <button className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded hover:bg-gray-200 transition-colors border border-gray-300">
              更多
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 0 && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h3 className="text-xl font-bold text-gray-800">销售单</h3>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-600">日期：</span>
                    <span className="font-medium">{orderData.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">单号：</span>
                    <span className="font-medium text-blue-600">{orderData.orderNo}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">状态：</span>
                    <span className="font-medium text-green-600">{orderData.status}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-3 gap-x-8 gap-y-2 text-sm">
                <div className="flex">
                  <span className="text-gray-600 w-24">客户全称:</span>
                  <span className="font-medium">{orderData.customer}(18660059929)</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">开单金额:</span>
                  <span className="font-medium">{orderData.amount}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">结算方式:</span>
                  <span>挂账</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">客户编码:</span>
                  <span>2025070510342</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">销售金额:</span>
                  <span>{orderData.amount}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">收货人:</span>
                  <span>{orderData.customer}</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">制单日期:</span>
                  <span>0</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">运费类型:</span>
                  <span></span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">收货地址:</span>
                  <span>18660059929/18660059929</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">收欠金额:</span>
                  <span>-0</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">运输类型:</span>
                  <span></span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">收货电话:</span>
                  <span></span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">型号类型:</span>
                  <span>收货和不开票</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">业务类型:</span>
                  <span>普通销售</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">库房:</span>
                  <span>济南</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">开票方式:</span>
                  <span>正常单</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">货运单号:</span>
                  <span></span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">电话:</span>
                  <span>18660059929/18660059929</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">收款状态:</span>
                  <span>0</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">是否发单:</span>
                  <span>正常单</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">车牌号:</span>
                  <span></span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">订单类型:</span>
                  <span></span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">打印次数:</span>
                  <span></span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">开票状态:</span>
                  <span>未开票</span>
                </div>
                <div className="flex col-span-2">
                  <span className="text-gray-600 w-24">VIN:</span>
                  <span>诸城</span>
                </div>
                <div className="flex">
                  <span className="text-gray-600 w-24">裁判意见:</span>
                  <span>0</span>
                </div>
              </div>

              {/* Product Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-green-100">
                      <tr className="border-b border-gray-300">
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">序号</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">编码</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">配件名称</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">车型</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">规格</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">特征码</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">品牌</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">单位</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">数量</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">单价</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">金额</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">实际销售金额</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">图号</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">批次</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">仓库</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">仓位</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">单量</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">总量</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">单位价</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">总价格</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">成本价</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">产地</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">供应商</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap border-r border-gray-300">备注</th>
                        <th className="px-2 py-2 text-center font-semibold text-gray-700 whitespace-nowrap">库存价格核查</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockLineItems.map((item, index) => (
                        <tr key={item.id} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                          <td className="px-2 py-2 text-center border-r border-gray-200">{item.id}</td>
                          <td className="px-2 py-2 text-blue-600 border-r border-gray-200">{item.code}</td>
                          <td className="px-2 py-2 border-r border-gray-200">{item.name}</td>
                          <td className="px-2 py-2 border-r border-gray-200">{item.vehicleType}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200">{item.specification}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200">{item.feature}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200">{item.brand}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200">{item.unit}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.quantity.toFixed(2)}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.price}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.amount.toFixed(2)}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.amount.toFixed(2)}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200">{item.warehouse}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200"></td>
                          <td className="px-2 py-2 border-r border-gray-200">{item.location}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200">B25-01-03</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.singleUnit.toFixed(2)}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.totalUnit.toFixed(2)}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.unitPrice.toFixed(3)}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.totalPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 text-right border-r border-gray-200">{item.costPrice.toFixed(2)}</td>
                          <td className="px-2 py-2 text-center border-r border-gray-200">{item.profit}</td>
                          <td className="px-2 py-2 border-r border-gray-200">{item.supplier}</td>
                          <td className="px-2 py-2 border-r border-gray-200">{item.note}</td>
                          <td className="px-2 py-2 text-center"></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm">
                  <span className="font-medium">合计：</span>
                  <span className="ml-4">总销总金额：146.00</span>
                  <span className="ml-4">总数量：4</span>
                  <span className="ml-4">总里里：0</span>
                </div>
              </div>

              {/* Footer Info */}
              <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 pt-4">
                <div>
                  <div className="flex mb-2">
                    <span className="text-gray-600 w-20">业务员:</span>
                    <span>管理员</span>
                  </div>
                  <div className="flex mb-2">
                    <span className="text-gray-600 w-20">审核:</span>
                    <span></span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-20">备注:</span>
                    <textarea
                      rows={2}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex mb-2">
                    <span className="text-gray-600 w-20">制单人:</span>
                    <span>管理员</span>
                  </div>
                  <div className="flex mb-2">
                    <span className="text-gray-600 w-20">财政:</span>
                    <span>全部</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-600 w-20">内部备注:</span>
                    <textarea
                      rows={2}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Status */}
              <div className="flex items-center justify-between text-xs text-gray-600 border-t border-gray-200 pt-3">
                <div className="flex items-center gap-4">
                  <span>S 销售历史</span>
                  <span>P 采购历史</span>
                  <span>G 经销商历</span>
                  <span>O 备价格历</span>
                  <span>U 利润</span>
                  <span>F 查看配件号型</span>
                  <span>拼音(~)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>建立时间：2026-05-22 18:19:59</span>
                  <span>修改时间：2026-05-22 18:19:59</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="text-center py-12 text-gray-500">
              财务进度内容...
            </div>
          )}

          {activeTab === 2 && (
            <div className="text-center py-12 text-gray-500">
              仓库进度内容...
            </div>
          )}

          {activeTab === 3 && (
            <div className="text-center py-12 text-gray-500">
              短信内容...
            </div>
          )}

          {activeTab === 4 && (
            <div className="text-center py-12 text-gray-500">
              国外费用内容...
            </div>
          )}

          {activeTab === 5 && (
            <div className="text-center py-12 text-gray-500">
              线上支付内容...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl flex items-center justify-end gap-2">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow">
            保存(S)
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
  );
}
