import React from 'react';

export default function AuditLedger({ logs }) {
  return (
    <div className="max-w-2xl mx-auto bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
      <h2 className="text-lg font-black text-white">Database Audit Ledger</h2>
      <div className="space-y-2">
        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No transactions recorded yet.</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
              <div>
                {log.type === 'PACKAGE_PURCHASE' ? (
                  <>
                    <span className="font-bold text-[#FFC800]">Package Top-Up ({log.packageName})</span>
                    <p className="text-[10px] text-slate-400">{log.customerName} via {log.gateway} | +{log.distanceKm} Km</p>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-white">Ride Deduction ({log.carType})</span>
                    <p className="text-[10px] text-slate-400">{log.customerName} → {log.driverName} | {log.distanceKm} Km ({log.durationMin}m)</p>
                  </>
                )}
              </div>
              <div className="text-right">
                <span className={log.type === 'PACKAGE_PURCHASE' ? 'text-emerald-400 font-bold' : 'text-[#FFC800] font-bold'}>
                  {log.type === 'PACKAGE_PURCHASE' ? `+${log.amountETB} ETB` : `-${log.distanceKm} Km`}
                </span>
                <p className="text-[10px] text-slate-500">{log.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}