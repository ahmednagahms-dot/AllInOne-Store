import { useEffect, useState } from "react"
import { getMe } from "../api/auth.api"
import { LogOut } from "lucide-react"
export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    country: "",
    city: "",
    street: "",
    building: "",
    postal: "",
  })

  useEffect(() => {
    getMe()
     .then(res => {
        setUser(res.data.data || res.data.user  || res.data)
      })
     .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="p-10 text-center text-slate-500">Loading...</p>
  if (!user) return <p className="p-10 text-center">Please login first</p>

  return (
    <div className="min-h-screen bg-[#f8f9fc] py-10">
      <div className="max-w-[720px] mx-auto px-4">
        <h1 className="text-[22px] font-bold text-slate-800 mb-6">My Profile</h1>

        
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-[64px] h-[64px] rounded-full bg-[#4a5a7a] flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 24 24" className="w-14 h-14 text-white/90 fill-white/90 mt-2">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-slate-900">{user.username || user.name || "team6"}</p>
              <p className="text-[13px] text-slate-500">{user.email}</p>
              <p className="text-[12px] text-[#6c5ce7]">{user.role || "Customer"}</p>
            </div>
          </div>

          <div className="mt-6 space-y-3 text-[13px] text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {user.email}
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {user.phone || "Not set"}
            </div>
          </div>

          <button className="mt-6 px-4 py-[6px] rounded-md border border-[#6c5ce7] text-[#6c5ce7] text-[13px] font-medium hover:bg-[#f5f3ff] transition">
            Edit Profile
          </button>
        </div>

        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-1.5 mb-4">
            <svg className="w-5 h-5 text-[#6c5ce7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h2 className="font-semibold text-slate-800 text-[15px]">Addresses</h2>
          </div>

          <p className="text-[13px] text-slate-500 mb-4">No addresses yet.</p>

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Country"
              value={form.country}
              onChange={e => setForm({...form, country: e.target.value})}
              className="col-span-1 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#6c5ce7] placeholder:text-slate-400"
            />
            <input
              placeholder="City"
              value={form.city}
              onChange={e => setForm({...form, city: e.target.value})}
              className="col-span-1 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#6c5ce7] placeholder:text-slate-400"
            />
            <input
              placeholder="Street"
              value={form.street}
              onChange={e => setForm({...form, street: e.target.value})}
              className="col-span-1 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#6c5ce7] placeholder:text-slate-400"
            />
            <input
              placeholder="Building"
              value={form.building}
              onChange={e => setForm({...form, building: e.target.value})}
              className="col-span-1 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#6c5ce7] placeholder:text-slate-400"
            />
            <input
              placeholder="Postal code"
              value={form.postal}
              onChange={e => setForm({...form, postal: e.target.value})}
              className="col-span-2 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#6c5ce7] placeholder:text-slate-400"
            />
          </div>

          <button className="mt-4 px-4 py-2 rounded-md bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[13px] font-medium transition flex items-center gap-1">
            <span className="text-[16px] leading-none">+</span> Add Address
          </button>
        </div>
      </div>
            <div className="max-w-[720px] mx-auto px-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 mt-6">
<h2 className="font-bold text-xl text-black">change password</h2>
<p className="text-gray-400">we'll send an otp to your amail to verify your identity</p>
            <input
              placeholder="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="col-span-1 border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] w-full mt-2 outline-none focus:border-[#6c5ce7] placeholder:text-slate-400"
    />
    < div className="flex gap-3">
          <button className="mt-4 px-4 py-2 rounded-md bg-[#4f46e5] text-white text-[13px] font-medium transition flex items-center gap-1">Send OTP</button>
          <button className="mt-4 px-4 py-2 rounded-md bg-gray-200  text-black text-[13px] font-medium  flex items-center gap-1">Cancel</button>
          </div>
      </div>
      </div>
             <button className="w-[600px] m-auto flex items-center justify-center gap-2 bg-[#E30613] text-white py-3 rounded-lg">
  <LogOut size={18} />
  Logout
</button>     


    </div>
  )
}
        