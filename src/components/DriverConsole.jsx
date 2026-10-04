import React from 'react';

const CAR_OPTIONS = [
  { id: 'standard', name: 'Standard (Sedan)', multiplier: 1.0, icon: '🚗' },
  { id: 'comfort', name: 'Comfort (SUV/AC)', multiplier: 1.25, icon: '🚘' },
  { id: 'xl', name: 'Minibus / XL', multiplier: 1.5, icon: '🚐' }
];

export default function DriverConsole({
  driver,
  completedKm,
  setCompletedKm,
  tripMinutes,
  setTripMinutes,
  selectedCarType,
  setSelectedCarType,
  calculatedFare,
  BASE_FARE,
  PER_KM_RATE,
  PER_MINUTE_RATE,
  onSendRequest
}) {
  return (
    <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
      <h2 className="text-lg font-black text-white">Driver Console</h2>
      <p className="text-xs text-slate-400">
        Earnings Balance: <strong className="text-emerald-400">{driver.payoutBalance.toLocaleString()} ETB</strong>
      </p>

      <div className="space-y-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <label className="text-xs text-slate-400 font-bold block mb-1">Trip Distance (Km)</label>
          <input
            type="number"
            step="0.1"
            value={completedKm}
            onChange={(e) => setCompletedKm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 p-2 text-sm text-white rounded-lg font-mono font-bold"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-bold block mb-1">Trip Duration (Minutes)</label>
          <input
            type="number"
            value={tripMinutes}
            onChange={(e) => setTripMinutes(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 p-2 text-sm text-white rounded-lg font-mono font-bold"
          />
        </div>

        <div>
          <label className="text-xs text-slate-400 font-bold block mb-1">Car Class Preference</label>
          <div className="grid grid-cols-3 gap-2">
            {CAR_OPTIONS.map((car) => (
              <button
                key={car.id}
                onClick={() => setSelectedCarType(car.id)}
                className={`p-2 rounded-xl text-[10px] font-bold border text-center transition-all ${
                  selectedCarType === car.id
                    ? 'border-[#FFC800] bg-[#FFC800]/10 text-[#FFC800]'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                <div className="text-base">{car.icon}</div>
                <div>{car.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs space-y-1 pt-2">
          <div className="flex justify-between text-slate-400">
            <span>Base + Km + Time:</span>
            <span>{BASE_FARE} + {completedKm * PER_KM_RATE} + {tripMinutes * PER_MINUTE_RATE} ETB</span>
          </div>
          <div className="flex justify-between font-bold text-[#FFC800] text-sm pt-1 border-t border-slate-800">
            <span>Calculated Fare:</span>
            <span>{calculatedFare} ETB</span>
          </div>
        </div>
      </div>

      <button
        onClick={onSendRequest}
        className="w-full bg-[#FFC800] text-slate-950 font-black py-3 rounded-xl text-xs uppercase hover:bg-amber-400 transition-all active:scale-95"
      >
        Send Payment Request to Customer
      </button>
    </div>
  );
}