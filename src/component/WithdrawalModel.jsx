import React, { useState } from "react";
import { CustomButton } from "./CustomButton";

export const WithdrawModal = ({ handleClose, handleWithdraw }) => {
  const [withdrawalAmount, setWithdrawalAmount] = useState("");

  const handleChange = (e) => {
    setWithdrawalAmount(e.target.value);
  };

  const handleSubmit = () => {
    handleWithdraw(withdrawalAmount);
    handleClose();
  };

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-4 rounded shadow-lg">
          <h1 className="text-lg font-semibold mb-4">Withdraw Funds</h1>
          <input
            type="number"
            placeholder="Enter amount to withdraw"
            value={withdrawalAmount}
            onChange={handleChange}
            className="border border-gray-300 rounded px-2 py-1 mb-4"
          />
          <div className="flex justify-end">
            <CustomButton
              btnType="button"
              title="Cancel"
              styles="mr-2"
              handleClick={handleClose}
            />
            <CustomButton
              btnType="button"
              title="Withdraw"
              styles="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              handleClick={handleSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
