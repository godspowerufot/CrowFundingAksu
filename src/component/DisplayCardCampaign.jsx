import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loader, withdraw } from "../assets";
import { CustomButton } from "./CustomButton";
import { FundCard } from "./FundCard";
import { ethers } from "ethers";
import { useStateContext } from "../context";

export const DisplayCampaigns = ({ title, isLoading, campaigns }) => {
  const navigate = useNavigate();
  const { withdrawDelete, address } = useStateContext(); // Add withdraw function from context

  const handleNavigate = (campaign) => {
    navigate(`/profiles/${campaign.title}`, { state: campaign });
  };

  const handleWithdraw = async (id) => {
    try {
      // Access owner information from context (assuming it's available)

      // Get the withdrawal amount as a number
      const amountString = prompt("Enter withdrawal amount (must be a number)");
      const amountNumber = parseFloat(amountString);

      // Validate the amount
      if (isNaN(amountNumber) || amountNumber <= 0) {
        console.error("Invalid withdrawal amount entered.");
        return;
      }

      // Convert amount to BigNumber
      const amountInWei = ethers.utils.parseEther(amountNumber.toString());

      // Check if the current user is the owner

      // Access campaign.owner from props or context
      await withdrawDelete(id, amountInWei); // Use the context function
    } catch (err) {
      console.error("Contract call failure:", err);
    }
  };
  return (
    <div>
      <h1 className="font-epilogue font-semibold text-[18px] dark:text-black text-white  text-left">
        {title} ({campaigns.length})
      </h1>

      <div className="flex flex-wrap mt-[20px] gap-[26px]">
        {isLoading && (
          <img
            src={loader}
            alt="loader"
            className="w-[100px] h-[100px] object-contain"
          />
        )}

        {!isLoading && campaigns.length === 0 && (
          <p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
            You have not created any campaigns yet
          </p>
        )}

        {!isLoading &&
          campaigns.length > 0 &&
          campaigns.map((campaign, index) => (
            <div
              className="sm:w-[288px] w-full rounded-[15px] dark:bg-slate-300 bg-[#1c1c24] cursor-pointer"
              key={index}
            >
              <FundCard
                {...campaign}
                handleClick={() => handleNavigate(campaign)}
              />

              {campaign.owner === address && ( // Check if the current user is the owner
                <CustomButton
                  btnType="button"
                  title="Withdraw"
                  styles="w-[200px] bg-[#8c6dfd] ml-[30px] mb-[30px]"
                  handleClick={() => {
                    console.log(index);
                    return handleWithdraw(index);
                  }}
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
