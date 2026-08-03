import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-500 selection:text-white flex flex-col">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C7D2FE,transparent)]"></div>
      </div>

      {/* Sticky Glass Navbar */}
      <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="text-2xl font-extrabold text-slate-900 tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            Thread<span className="text-indigo-600">Market</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
              Log in
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition shadow-sm hover:shadow-md">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Marketplace v1.0 is now live
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Source premium textiles with <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">zero friction.</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            The modern B2B platform connecting ambitious apparel brands directly with the world&apos;s most reliable fabric mills and suppliers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/register" className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group">
              Join as a Buyer
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href="/register" className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-lg font-semibold hover:border-slate-300 hover:bg-slate-50 transition shadow-sm flex items-center justify-center gap-2">
              Become a Supplier
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Mockup (CSS only) */}
        <div className="relative mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-200/50 bg-white/50 backdrop-blur-xl p-2 shadow-2xl shadow-indigo-100">
            <div className="rounded-xl border border-slate-100 bg-white overflow-hidden shadow-sm">
              <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 pointer-events-none">
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-48 bg-slate-200 rounded-lg"></div>
                  <div className="h-64 bg-slate-100 rounded-xl border border-slate-100"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-24 bg-slate-100 rounded-xl border border-slate-100"></div>
                  <div className="h-24 bg-slate-100 rounded-xl border border-slate-100"></div>
                  <div className="h-24 bg-slate-100 rounded-xl border border-slate-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Bento Grid Features */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Everything you need to scale production.</h2>
            <p className="text-slate-500 mt-2 text-lg">Built specifically for the modern textile supply chain.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="col-span-1 md:col-span-2 bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-indigo-100 transition duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 transition-all group-hover:bg-indigo-500/20"></div>
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Global Sourcing Network</h3>
              <p className="text-slate-600 text-lg max-w-md">Bypass middlemen. Connect directly with verified manufacturers across 40+ countries and negotiate the best rates.</p>
            </div>

            {/* Feature 2 */}
            <div className="col-span-1 bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-blue-100 transition duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Escrow</h3>
              <p className="text-slate-600">Your funds are protected until the textiles arrive exactly as promised.</p>
            </div>

            {/* Feature 3 */}
            <div className="col-span-1 bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:border-purple-100 transition duration-300">
              <div className="w-12 h-12 bg-white rounded-2xl border border-slate-200 flex items-center justify-center mb-6 shadow-sm">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Real-time Inventory</h3>
              <p className="text-slate-600">See live stock levels and clear Minimum Order Quantities (MOQs) instantly.</p>
            </div>

            {/* Feature 4 */}
            <div className="col-span-1 md:col-span-2 bg-slate-900 p-8 rounded-3xl border border-slate-800 text-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <div className="relative z-10">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-3">Automated POs & Invoices</h3>
                <p className="text-slate-400 text-lg max-w-md">Say goodbye to messy email threads. Generate purchase orders, track shipping statuses, and manage invoices all in one dashboard.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <span className="font-bold text-slate-900">ThreadMarket</span>
          </div>
          <p className="text-slate-500 text-sm">© {new Date().getFullYear()} ThreadMarket. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-slate-400 hover:text-slate-900 transition">Terms</Link>
            <Link href="#" className="text-slate-400 hover:text-slate-900 transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}