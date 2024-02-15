import React, { useContext, createContext } from "react";
import { useState, useEffect } from "react";

import { useAddress, useContract, useContractWrite } from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const address = useAddress();
  const [totalDonation, setTotalDonation] = useState(0);

  const { contract, isLoading } = useContract(
    "0x8b7951228651c11feb11b32a7af0caeca2a70451"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const { mutateAsync: donateToCampaign } = useContractWrite(
    contract,
    "donateToCampaign"
  );

  
  const call = async (_id, _donationAmount) => {
    try {
      const amountInWei = ethers.utils.parseEther(_donationAmount.toString());

      const data = await donateToCampaign({ args: [_id, amountInWei] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  };

  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({
        args: [
          address, // owner
          form.title, // title
          form.description, // description
          form.target,
          new Date(form.deadline).getTime(),
          form.image, // deadline,
        ],
      });

      console.log("contract call success", data);
    } catch (error) {
      console.log("contract call failure", error);
    }
  };
  //calling the campaign

  const getCampaigns = async () => {
    const campaigns = await contract.call("getCampaigns");

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: parseFloat(
        ethers.utils.formatEther(campaign.amountCollected.toNumber())
      ),
      image: campaign.image,
      pId: i,
    }));
    console.log(parsedCampaings);

    return parsedCampaings;
  };
  //TotalDonations function


  //filter al campaigns to a specify function
  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();
    const filterCampaigns = allCampaigns.filter(
      (specifyCampaign) => specifyCampaign.owner === address
    );
    return filterCampaigns;
  };

  const getDonations = async (pId) => {
    const donations = await contract.call("getDonators", [pId]);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }

    return parsedDonations;
  };

  return (
    <StateContext.Provider
      value={{
        address,
        contract,
        getCampaigns,
        getUserCampaigns,
        donate: call,
        createCampaign: publishCampaign,
        getDonations,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
