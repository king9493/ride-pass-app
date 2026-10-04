import React, { useState } from 'react';
import DriverConsole from './components/DriverConsole';
import CustomerPortal from './components/CustomerPortal';
import AuditLedger from './components/AuditLedger';

const BASE_FARE = 100;
const PER_KM_RATE = 30;
const PER_MINUTE_RATE = 2;

const CAR_OPTIONS = [
  { id: 'standard', name: 'Standard (Sedan)', multiplier: 1.0, icon: '🚗' },
  { id: 'comfort', name: 'Comfort (SUV/AC)', multiplier: 1.25, icon: '🚘' },
  { id: 'xl', name: 'Minibus / XL', multiplier: 1.5, icon: '🚐' }
];

export default function App() {
  const [role, setRole] = useState('customer');
  const [customerTab, setCustomerTab] = useState('ride');

  const [customer, setCustomer] = useState({ id: 'CUST-9021', name: 'Abebe Bikila', phone: '0911223344', remainingKm: 45.0 });
  const [driver, setDriver] = useState({ id: 'DRV-401', name: 'Kebede Tassew', payoutBalance: 12500 });

  const [completedKm, setCompletedKm] = useState(7.5);
  const [tripMinutes, setTripMinutes] = useState(18);
  const [selectedCarType, setSelectedCarType] = useState('standard');

  const [pendingTrip, setPendingTrip] = useState(null);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [paymentGateway, setPaymentGateway] = useState('telebirr');
  const [phoneNumber, setPhoneNumber] = useState('0911223344');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const [logs, setLogs] = useState([]);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 4000);
  };

  const carConfig = CAR_OPTIONS.find((c) => c.id === selectedCarType) || CAR_OPTIONS[0];
  const calculatedFare = Math.round(
    (BASE_FARE + Number(completedKm) * PER_KM_RATE + Number(tripMinutes) * PER_MINUTE_RATE) * carConfig.multiplier
  );

  const handleSendPaymentRequest = () => {
    setPendingTrip({
      tripId: `TRIP-${Date.now()}`,
      driverId: driver.id,
      driverName: driver.name,
      distanceKm: Number(completedKm),
      durationMin: Number(tripMinutes),
      carType: carConfig.name,
      carIcon: carConfig.icon,
      fareETB: calculatedFare,
      status: 'PENDING_APPROVAL'
    });
    showToast('Payment request sent to passenger!');
  };

  const handleApprovePayment = () => {
    if (!pendingTrip) return;
    if (customer.remainingKm < pendingTrip.distanceKm) {
      showToast('Insufficient Km balance! Please buy a package.');
      setCustomerTab('packages');
      return;
    }

    setCustomer((prev) => ({ ...prev, remainingKm: prev.remainingKm - pendingTrip.distanceKm }));
    setDriver((prev) => ({ ...prev, payoutBalance: prev.payoutBalance + pendingTrip.fareETB }));

    setLogs((prev) => [
      {
        id: `TX-RIDE-${Date.now()}`,
        type: 'RIDE_DEDUCTION',
        customerName: customer.name,
        driverName: pendingTrip.driverName,
        distanceKm: pendingTrip.distanceKm,
        durationMin: pendingTrip.durationMin,
        carType: pendingTrip.carType,
        amountETB: pendingTrip.fareETB,
        timestamp: new Date().toLocaleTimeString()
      },
      ...prev
    ]);

    setPendingTrip(null);
    showToast(`Approved! ${pendingTrip.distanceKm} Km deducted.`);
  };

  const handleConfirmPackagePurchase = () => {
    if (!selectedPkg) return;
    setIsProcessingPayment(true);

    setTimeout(() => {
      setCustomer((prev) => ({ ...prev, remainingKm: prev.remainingKm + selectedPkg.km }));

      setLogs((prev) => [
        {
          id: `TX-TOPUP-${Date.now()}`,
          type: 'PACKAGE_PURCHASE',
          customerName: customer.name,
          packageName: selectedPkg.name,
          distanceKm: selectedPkg.km,
          amountETB: selectedPkg.price,
          gateway: paymentGateway.toUpperCase(),
          timestamp: new Date().toLocaleTimeString()
        },
        ...prev
      ]);

      setIsProcessingPayment(false);
      showToast(`Success! Added +${selectedPkg.km} Km via ${paymentGateway.toUpperCase()}`);
      setSelectedPkg(null);
      setCustomerTab('ride');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4">
      <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-2 mb-6 flex justify-between items-center text-xs">
        <span className="font-bold text-slate-500 px-2 uppercase">Switch View:</span>
        <div className="flex gap-1">
          <button
            onClick={() => setRole('driver')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${role === 'driver' ? 'bg-[#FFC800] text-slate-950' : 'text-slate-400'}`}
          >
            Driver App
          </button>
          <button
            onClick={() => setRole('customer')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${role === 'customer' ? 'bg-[#FFC800] text-slate-950' : 'text-slate-400'}`}
          >
            Customer App
          </button>
          <button
            onClick={() => setRole('admin')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${role === 'admin' ? 'bg-[#FFC800] text-slate-950' : 'text-slate-400'}`}
          >
            Database Log
          </button>
        </div>
      </div>

      {toast && (
        <div className="max-w-md mx-auto bg-[#FFC800]/10 border border-[#FFC800] text-[#FFC800] p-3 rounded-xl text-xs font-bold mb-6 text-center animate-bounce">
          {toast}
        </div>
      )}

      {role === 'driver' && (
        <DriverConsole
          driver={driver}
          completedKm={completedKm}
          setCompletedKm={setCompletedKm}
          tripMinutes={tripMinutes}
          setTripMinutes={setTripMinutes}
          selectedCarType={selectedCarType}
          setSelectedCarType={setSelectedCarType}
          calculatedFare={calculatedFare}
          BASE_FARE={BASE_FARE}
          PER_KM_RATE={PER_KM_RATE}
          PER_MINUTE_RATE={PER_MINUTE_RATE}
          onSendRequest={handleSendPaymentRequest}
        />
      )}

      {role === 'customer' && (
        <CustomerPortal
          customer={customer}
          customerTab={customerTab}
          setCustomerTab={setCustomerTab}
          pendingTrip={pendingTrip}
          onApprovePayment={handleApprovePayment}
          selectedPkg={selectedPkg}
          setSelectedPkg={setSelectedPkg}
          paymentGateway={paymentGateway}
          setPaymentGateway={setPaymentGateway}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          isProcessingPayment={isProcessingPayment}
          onConfirmPurchase={handleConfirmPackagePurchase}
        />
      )}

      {role === 'admin' && <AuditLedger logs={logs} />}
    </div>
  );
}