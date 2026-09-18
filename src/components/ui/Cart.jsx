import { useState } from "react"
import iphoneImg from "../../assets/images/photo_2026-09-17_13-44-34.jpg"
import nikeImg from "../../assets/images/photo_2026-09-17_13-44-35.jpg"
import sonyImg from "../../assets/images/photo_2026-09-17_14-10-51.jpg"

const initialCart = [
  { id: 1, name: "iPhone 15 Pro", brand: "Smartphone", desc: "Color: Natural Titanium · Size: 256GB", price: 999, oldPrice: 1249, qty: 1, img: iphoneImg, stock: "In stock", discount: "-20%", checked: true },
  { id: 2, name: "Nike Air Force 1", brand: "Mens Shoes", desc: "Size: 42 · Color: White", price: 89.99, oldPrice: 120, qty: 1, img: nikeImg, stock: "Low stock", discount: "-25%", checked: true },
  { id: 3, name: "Sony WH-1000XM5", brand: "Headphone", desc: "Color: Black", price: 299, oldPrice: 399, qty: 1, img: sonyImg, stock: "In stock", discount: "-14%", checked: true },
]

export default function ShoppingCart() {
  const [cart, setCart] = useState(initialCart)
  const updateQty = (id, d) => setCart(c => c.map(i => i.id===id? {...i, qty: Math.max(1, i.qty+d)} : i))
  const toggleCheck = (id) => setCart(c => c.map(i => i.id===id? {...i, checked:!i.checked} : i))
  const removeItem = (id) => setCart(c => c.filter(i => i.id!==id))

  return (
    <div className="min-h-screen bg-[#f6f7fb] p-4 md:p-6">
      <div className="max-w-[1280px] mx-auto">
        {/* Breadcrumb & Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[11px] text-gray-400">Home › Cart</p>
            <h1 className="text-[22px] font-extrabold mt-1">Shopping Cart</h1>
            <p className="text-[11px] text-gray-500 mt-1">Review your items and proceed to checkout when you're ready.</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[11px]">
            <div className="flex flex-col items-center gap-1"><span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">1</span><span className="font-bold text-blue-600">Cart</span></div>
            <div className="w-10 h-[1px] bg-gray-200"></div>
            <div className="flex flex-col items-center gap-1 opacity-50"><span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">2</span><span>Shipping</span></div>
            <div className="w-10 h-[1px] bg-gray-200"></div>
            <div className="flex flex-col items-center gap-1 opacity-50"><span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">3</span><span>Payment</span></div>
          </div>
        </div>

        {/* Main Cart */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="w-full lg:w-[68%] bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-[13px]">{cart.length} items in your cart</h2>
              <button onClick={()=>setCart([])} className="text-[11px] text-blue-600">🗑 Clear Cart</button>
            </div>

            {cart.map(item => (
              <div key={item.id} className="flex gap-3 py-4 border-b last:border-0">
                <input type="checkbox" checked={item.checked} onChange={()=>toggleCheck(item.id)} className="mt-6 w-4 h-4 accent-blue-600" />
                <img src={item.img} className="w-[64px] h-[64px] rounded-lg object-cover bg-gray-50 border" alt={item.name} />
                <div className="flex-1">
                  <h3 className="text-[12px] font-bold">{item.name}</h3>
                  <p className="text-[10px] text-gray-400">{item.brand}</p>
                  <p className="text-[10px] text-gray-400">{item.desc}</p>
                  <span className={`text-[10px] ${item.stock==='Low stock'? 'text-amber-500' : 'text-green-600'}`}>● {item.stock}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-bold">${item.price.toFixed(2)}</span>
                    <span className="text-[10px] line-through text-gray-400">${item.oldPrice}</span>
                    <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{item.discount}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1 border rounded-full px-2 py-1">
                      <button onClick={()=>updateQty(item.id,-1)} className="w-5 h-5">-</button>
                      <span className="text-[11px] w-4 text-center font-bold">{item.qty}</span>
                      <button onClick={()=>updateQty(item.id,1)} className="w-5 h-5">+</button>
                    </div>
                    <span className="text-[12px] font-bold">${(item.price*item.qty).toFixed(2)}</span>
                  </div>
                  <div className="flex gap-3 text-[10px] text-gray-400 mt-2">
                    <button className="hover:text-blue-600">♡ Move to Wishlist</button>
                    <button onClick={()=>removeItem(item.id)} className="hover:text-red-500">🗑 Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[32%] bg-white rounded-xl border border-gray-100 p-4 h-fit">
            <h2 className="font-bold text-[13px] mb-4">Order Summary</h2>
            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal (3 items)</span><span className="font-medium">$1,387.99</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Discount</span><span className="text-red-500">-$69.40</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Shipping <br/><span className="text-[9px]">Free shipping on orders over $50</span></span><span>$0.00</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Estimated Tax ⓘ</span><span>$138.80</span></div>
              <div className="flex justify-between font-extrabold text-[13px] border-t pt-3 mt-3"><span>Total</span><span>$1,457.39</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <input placeholder="Enter coupon code" className="w-full px-3 py-2 border rounded-lg text-[11px] outline-none" />
              <button className="border text-blue-600 px-4 rounded-lg text-[11px] font-bold">Apply</button>
            </div>
            <div className="mt-3 bg-green-50 border border-green-100 text-green-700 px-3 py-2 rounded-lg text-[10px]">✔️ Coupon SAVE20 applied! You saved $69.40</div>
            <button className="w-full mt-4 bg-blue-600 text-white py-2.5 rounded-lg font-bold text-[11px]">Proceed to Checkout →</button>
            <button className="w-full mt-2 border py-2.5 rounded-lg text-[11px]">Continue Shopping</button>
            <div className="grid grid-cols-3 gap-2 mt-5 text-center border-t pt-4">
              <div><div className="w-7 h-7 mx-auto bg-gray-50 rounded-full flex items-center justify-center">🔒</div><p className="text-[9px] font-bold mt-1">Secure</p></div>
              <div><div className="w-7 h-7 mx-auto bg-gray-50 rounded-full flex items-center justify-center">↩️</div><p className="text-[9px] font-bold mt-1">Easy Returns</p></div>
              <div><div className="w-7 h-7 mx-auto bg-gray-50 rounded-full flex items-center justify-center">💬</div><p className="text-[9px] font-bold mt-1">Support</p></div>
            </div>
          </div>
        </div>
        {/* Bottom States - Empty / Loading / Error */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-white rounded-xl border p-6 text-center">
            <p className="text-[11px] font-bold text-left">Empty Cart</p>
            <div className="text-5xl mt-6">🛒</div>
            <h3 className="font-extrabold text-[13px] mt-4">Your cart is empty</h3>
            <p className="text-[10px] text-gray-400 mt-1">Looks like you haven't added anything to your cart yet.</p>
            <button className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-bold">Continue Shopping →</button>
          </div>
          <div className="bg-white rounded-xl border p-6 text-center">
            <p className="text-[11px] font-bold text-left mb-10">Loading State</p>
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="font-bold text-[12px] mt-4">Loading your cart...</h3>
            <p className="text-[10px] text-gray-400">Please wait a moment</p>
          </div>
          <div className="bg-white rounded-xl border p-6 text-center">
            <p className="text-[11px] font-bold text-left mb-6">Error State</p>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">⚠️</div>
            <h3 className="font-extrabold text-[12px] mt-4">Oops! Something went wrong</h3>
            <p className="text-[10px] text-gray-400 mt-1">We couldn't load your cart.</p>
            <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg text-[10px] font-bold">Try Again</button>
            <button className="w-full mt-2 border py-2 rounded-lg text-[10px]">Continue Shopping</button>
          </div>
        </div>
      </div>
      
<div className="space-y-2 mt-3">

  
  <div className="flex items-start justify-between gap-2 bg-[#f0fdf4] border border-green-100 text-green-700 px-3 py-2.5 rounded-lg">
    <div className="flex gap-2">
      <div className="w-4 h-4 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px] mt-[1px]">✓</div>
      <div>
        <p className="text-[10px] font-bold leading-none">Coupon applied successfully!</p>
        <p className="text-[9px] mt-1 text-green-600">You saved $10.40 on your order.</p>
      </div>
    </div>
    <button className="text-[10px] text-green-400">×</button>
  </div>

  
  <div className="flex items-start justify-between gap-2 bg-[#fef2f2] border border-red-100 text-red-600 px-3 py-2.5 rounded-lg">
    <div className="flex gap-2">
      <div className="w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] mt-[1px]">×</div>
      <div>
        <p className="text-[10px] font-bold leading-none">Invalid coupon code!</p>
        <p className="text-[9px] mt-1 text-red-400">Please check the code and try again.</p>
      </div>
    </div>
    <button className="text-[10px] text-red-300">×</button>
  </div>

</div>

<div className="w-full bg-white mt-4 border border-[#eceeff] rounded-xl px-4 py-3 flex items-center justify-between mb-6">

  
  <div className="flex items-center gap-3">
    <div className="w-9 h-9 bg-white border border-[#e6e8ff] rounded-lg flex items-center justify-center text-blue-600">
      🛒
    </div>
    <div>
      <h3 className="text-[12px] font-extrabold leading-none">Checkout Progress</h3>
      <p className="text-[9px] text-gray-400 mt-1">Complete your order in just a few steps.</p>
    </div>
  </div>


  <div className="flex items-center gap-3">
    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold">1</div>
      <span className="text-[11px] font-bold text-blue-600">Cart</span>
    </div>

    <div className="w-10 h-[1px] bg-gray-200"></div>

    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-[#e8eaf8] text-gray-500 rounded-full flex items-center justify-center text-[10px] font-bold">2</div>
      <span className="text-[11px] text-gray-400">Shipping</span>
    </div>

    <div className="w-10 h-[1px] bg-gray-200 border-dashed"></div>

    <div className="flex items-center gap-2">
      <div className="w-5 h-5 bg-[#e8eaf8] text-gray-500 rounded-full flex items-center justify-center text-[10px] font-bold">3</div>
      <span className="text-[11px] text-gray-400">Payment</span>
    </div>
  </div>

</div>
 </div>    
  )
}