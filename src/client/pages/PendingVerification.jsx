import React from "react";

export default function PendingVerification() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEF3C7] p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-yellow-700">Llogaria juaj është në pritje të verifikimit</h2>
        <p className="text-gray-700">
          Ju do të njoftoheni sapo të aprovohet nga administratori.
        </p>
      </div>
    </div>
  );
}
