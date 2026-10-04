import React from 'react';

const KM_PACKAGES = [
  { id: 'starter', name: 'Starter Pass', km: 20, price: 600, badge: 'Popular', popular: false },
  { id: 'city_pro', name: 'City Pro Pass', km: 50, price: 1400, badge: 'Best Value', popular: true },
  { id: 'commuter', name: 'Commuter Heavy Pass', km: 120, price: 3200, badge: 'Max Savings', popular: false },
];

const PAYMENT_METHODS = [
  { id: 'telebirr', name: 'Telebirr' },
  { id: 'cbe', name: 'CBE Birr' },
  { id: 'card', name: 'Debit/Credit Card' },
];

export default function CustomerPortal({
  customer,
  customerTab,
  setCustomerTab,
  pendingTrip,
  onApprovePayment,
  selectedPkg,
  setSelectedPkg,
  paymentGateway,
  setPaymentGateway,
  phoneNumber,
  setPhoneNumber,
  isProcessingPayment,
  onConfirmPurchase
}) {
  return (
    <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-5">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-white">{customer.name}</h2>
          <p className="text-[11px] text-slate-400">{customer.phone}</p>
        </div>
        <div className="bg-slate-950 border border-[#FFC800]/40 px-3 py-1.5 rounded-full text-xs font-bold text-[#FFC800]">
          ⚡ {customer.remainingKm.toFixed(1)} Km Left
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setCustomerTab('ride')}
          className={`py-2 rounded-lg font-bold transition-all ${customerTab === 'ride' ? 'bg-[#FFC800] text-slate-950' : 'text-slate-400'}`}
        >
          Active Ride
        </button>
        <button
          onClick={() => setCustomerTab('packages')}
          className={`py-2 rounded-lg font-bold transition-all ${customerTab === 'packages' ? 'bg-[#FFC800] text-slate-950' : 'text-slate-400'}`}
        >
          Buy Km Package
        </button>
      </div>

      {customerTab === 'ride' ? (
        <div>
          {pendingTrip ? (
            <div className="bg-slate-950 p-5 rounded-2xl border-2 border-[#FFC800] space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Ride Payment Request</h3>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">Driver Waiting</span>
              </div>

              <div className="space-y-1.5 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                <p className="text-slate-400">Driver: <strong className="text-white">{pendingTrip.driverName}</strong></p>
                <p className="text-slate-400">Car Class: <strong className="text-white">{pendingTrip.carIcon} {pendingTrip.carType}</strong></p>
                <p className="text-slate-400">Distance & Time: <strong className="text-white">{pendingTrip.distanceKm} Km ({pendingTrip.durationMin} mins)</strong></p>
                <p className="text-slate-400">Total Price: <strong className="text-[#FFC800]">{pendingTrip.fareETB} ETB</strong></p>
                <hr className="border-slate-800 my-1" />
                <p className="text-slate-400">Balance After Ride: <strong className="text-emerald-400">{(customer.remainingKm - pendingTrip.distanceKm).toFixed(1)} Km</strong></p>
              </div>

              <button
                onClick={onApprovePayment}
                className="w-full bg-emerald-400 text-slate-950 font-black py-3 rounded-xl text-xs uppercase hover:bg-emerald-300 transition-all active:scale-95"
              >
                Approve & Deduct {pendingTrip.distanceKm} Km
              </button>
            </div>
          ) : (
            <div className="text-center py-8 space-y-2 bg-slate-950/50 rounded-2xl border border-slate-800">
              <p className="text-2xl">🚗</p>
              <p className="text-xs font-bold text-white">No Payment Requests Pending</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">When your driver completes a trip, a 1-tap confirmation request will appear here.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">Select a prepaid distance package to refill your ride balance:</p>
          <div className="space-y-3">
            {KM_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                  selectedPkg?.id === pkg.id
                    ? 'bg-slate-950 border-[#FFC800] ring-1 ring-[#FFC800]'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-white">{pkg.name}</h4>
                    {pkg.popular && (
                      <span className="text-[9px] bg-[#FFC800]/20 text-[#FFC800] px-2 py-0.5 rounded font-bold">
                        {pkg.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Refills <strong className="text-white">+{pkg.km} Km</strong> distance</p>
                </div>
                <div className="text-right">
                  <p className="text-base font-black text-[#FFC800]">{pkg.price} ETB</p>
                  <p className="text-[10px] text-slate-500">{(pkg.price / pkg.km).toFixed(0)} ETB/Km</p>
                </div>
              </div>
            ))}
          </div>

          {selectedPkg && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-[#FFC800]/40 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-white">Checkout — {selectedPkg.name}</h3>
                <button onClick={() => setSelectedPkg(null)} className="text-xs text-slate-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 block">Select Payment Method:</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentGateway(method.id)}
                      className={`p-2 rounded-xl text-[11px] font-bold border transition-all ${
                        paymentGateway === method.id
                          ? 'border-[#FFC800] bg-[#FFC800]/10 text-[#FFC800]'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {method.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 block">Mobile Wallet Number:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-white font-mono font-bold"
                />
              </div>

              <button
                onClick={onConfirmPurchase}
                disabled={isProcessingPayment}
                className="w-full bg-[#FFC800] text-slate-950 font-black py-3 rounded-xl text-xs uppercase hover:bg-amber-400 transition-all"
              >
                {isProcessingPayment ? "Processing Payment..." : `Pay ${selectedPkg.price} ETB & Add +${selectedPkg.km} Km`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}