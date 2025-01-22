import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ShoppingCart, Home, Package, Users, Settings, Receipt, Plus, Minus, Trash2, Printer } from 'lucide-react';
import { usePDF } from 'react-to-pdf';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

// Layout component that includes the sidebar and top navbar
function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <Home size={24} />, text: "หน้าแรก", path: "/" },
    { icon: <ShoppingCart size={24} />, text: "การขาย", path: "/sales" },
    { icon: <Package size={24} />, text: "สินค้า", path: "/products" },
    { icon: <Users size={24} />, text: "ลูกค้า", path: "/customers" },
    { icon: <Settings size={24} />, text: "ตั้งค่า", path: "/settings" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-gray-800 text-white transition-all duration-300`}>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className={`${isSidebarOpen ? 'block' : 'hidden'} font-bold text-xl`}>GAPPA POS System</h2>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-gray-700 rounded">
              <Menu size={24} />
            </button>
          </div>
        </div>
        <nav className="mt-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center p-4 hover:bg-gray-700 transition-colors ${
                location.pathname === item.path ? 'bg-gray-700' : ''
              }`}
            >
              {item.icon}
              <span className={`${isSidebarOpen ? 'ml-4' : 'hidden'}`}>{item.text}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <div className="bg-white shadow-md p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">ระบบขายหน้าร้าน</h1>
            <div className="flex items-center space-x-4">
              <span>พนักงาน: GAPPA GUITARROCK</span>
              <span>วันที่: {new Date().toLocaleDateString('th-TH')}</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// Sales Page Component
function SalesPage() {
  const [cart, setCart] = useState<Product[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { toPDF, targetRef } = usePDF({filename: 'receipt.pdf'});

  const sampleProducts = [
    // เครื่องดื่ม
    { id: 1, name: "เบียร์ช้าง", price: 50, category: "เครื่องดื่ม", image: "https://newyorkpizza.online/live/wp-content/uploads/2020/06/Chang-Beer.jpg" },
    { id: 2, name: "เบียร์สิงห์", price: 70, category: "เครื่องดื่ม", image: "https://newyorkpizza.online/live/wp-content/uploads/2020/06/Singha-Beer.jpg" },
    { id: 3, name: "เบียร์ลีโอ", price: 50, category: "เครื่องดื่ม", image: "https://newyorkpizza.online/live/wp-content/uploads/2020/06/Leo-Beer.jpg" },
    { id: 4, name: "เบียร์ไฮเนเก้น", price: 40, category: "เครื่องดื่ม", image: "https://newyorkpizza.online/live/wp-content/uploads/2020/06/Heineken-Beer.jpg" },
    { id: 5, name: "โค้ก", price: 35, category: "เครื่องดื่ม", image: "https://newyorkpizza.online/live/wp-content/uploads/2020/06/Coke-1.jpg" },
    
    // อาหาร
    { id: 6, name: "เฟรนช์ฟราย", price: 50, category: "อาหาร", image: "https://image.posttoday.com/media/content/2018/11/28/809833FC1C0A47E58125BB86B868D0B7.png?x-image-process=style/lg-webp" },
    { id: 7, name: "ผัดกะเพรา", price: 50, category: "อาหาร", image: "https://image.bangkokbiznews.com/uploads/images/contents/w1024/2023/12/aPKMrAYVSnY91hQfZpF9.webp?x-image-process=style/lg-webp" },
    { id: 8, name: "แหนมซี่โครงหมู", price: 50, category: "อาหาร", image: "https://kamphaeng-phet.com/uploads/timthumb.php?src=https://kamphaeng-phet.com/uploads/product/rGVyuIDpBFh_20210819154526_0.jpg&w=600&h=600" },
    { id: 9, name: "เอ็นข้อไก่ทอด", price: 45, category: "อาหาร", image: "https://img.wongnai.com/p/1968x0/2020/04/11/43caa819f92c4adb80c5a8519afe26cc.jpg" },
    
   
  ];

  const categories = ['all', ...new Set(sampleProducts.map(product => product.category))];
  
  const filteredProducts = selectedCategory === 'all' 
    ? sampleProducts 
    : sampleProducts.filter(product => product.category === selectedCategory);

  const addToCart = (product: typeof sampleProducts[0]) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 flex gap-6">
      {/* Products Section */}
      <div className="flex-1 flex flex-col">
        {/* Categories */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-800 hover:bg-gray-100'
              } transition-colors whitespace-nowrap`}
            >
              {category === 'all' ? 'ทั้งหมด' : category}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => addToCart(product)}
            >
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-green-600 mt-1">฿{product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart */}
      <div className="w-96 bg-white rounded-lg shadow-md p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4">รายการสินค้า</h2>
        
        {/* Cart Items */}
        <div className="flex-1 overflow-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b">
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-gray-600">฿{item.price.toFixed(2)} × {item.quantity}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-1 hover:bg-red-100 text-red-500 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-lg">รวมทั้งหมด</span>
            <span className="font-bold text-lg text-green-600">฿{calculateTotal().toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowReceipt(true)}
              className="flex-1 bg-green-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Receipt size={20} />
              <span>ใบเสร็จ</span>
            </button>
            <button
              onClick={() => toPDF()}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors"
            >
              <Receipt size={20} />
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-700 transition-colors"
            >
              <Printer size={20} />
              <span>พิมพ์</span>
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div ref={targetRef} className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-center">ใบเสร็จรับเงิน</h2>
            <div className="text-center mb-4">
              <p>ร้าน GAPPA </p>
              <p>เลขที่: INV-{new Date().getTime().toString().slice(-6)}</p>
              <p>วันที่: {new Date().toLocaleDateString('th-TH')}</p>
              <p>เวลา: {new Date().toLocaleTimeString('th-TH')}</p>
              <p>พนักงาน: GAPPA GUITARROCK</p>
            </div>
            <div className="border-t border-b py-4 my-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between py-1">
                  <span>{item.name} × {item.quantity}</span>
                  <span>฿{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold">
              <span>รวมทั้งหมด</span>
              <span>฿{calculateTotal().toFixed(2)}</span>
            </div>
            <div className="mt-6 text-center text-gray-600 text-sm">
              <p>ขอบคุณที่ใช้บริการ</p>
              <p>โปรดเก็บใบเสร็จไว้เป็นหลักฐาน</p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowReceipt(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Other Page Components
function HomePage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">หน้าแรก</h1></div>;
}

function ProductsPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">จัดการสินค้า</h1></div>;
}

function CustomersPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">จัดการลูกค้า</h1></div>;
}

function SettingsPage() {
  return <div className="p-6"><h1 className="text-2xl font-bold">ตั้งค่า</h1></div>;
}

// Main App Component
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;