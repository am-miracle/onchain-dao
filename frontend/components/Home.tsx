"use client"
import { useCallback, useEffect, useState } from "react";

import {
  CryptoDevsDAOABI,
  CryptoDevsDAOAddress,
  CryptoDevsNFTABI,
  CryptoDevsNFTAddress,
} from "../constants";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { formatEther } from "viem/utils";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";
import { waitForTransactionReceipt, writeContract } from '@wagmi/core';

import { config } from "@/lib/config";
import styles from "./page.module.css";

import Image from 'next/image'
import ViewProposalsTab from "../components/ViewProposalsTab";
import CreateProposalTab from "../components/CreateProposalsTab";


export default function Dao() {
  // Check if the user's wallet is connected, and it's address using Wagmi's hooks.
  const { address, isConnected } = useAccount();

  // State variable to know if the component has been mounted yet or not
  const [isMounted, setIsMounted] = useState(false);

  // State variable to show loading state when waiting for a transaction to go through
  const [loading, setLoading] = useState(false);

  // Fake NFT Token ID to purchase. Used when creating a proposal.
  const [fakeNftTokenId, setFakeNftTokenId] = useState("");
  // State variable to store all proposals in the DAO
  const [proposals, setProposals] = useState<any>([]);
  // State variable to switch between the 'Create Proposal' and 'View Proposals' tabs
  const [selectedTab, setSelectedTab] = useState("");

  // Fetch the owner of the DAO
  const daoOwner = useReadContract({
    abi: CryptoDevsDAOABI,
    address: CryptoDevsDAOAddress,
    functionName: "owner",
  });

  // Fetch the balance of the DAO
  const daoBalance = useBalance({
    address: CryptoDevsDAOAddress,
  });

  // Fetch the number of proposals in the DAO
  const numOfProposalsInDAO = useReadContract({
    abi: CryptoDevsDAOABI,
    address: CryptoDevsDAOAddress,
    functionName: "numProposals",
  });

  // Fetch the CryptoDevs NFT balance of the user
  const nftBalanceOfUser = useReadContract({
    abi: CryptoDevsNFTABI,
    address: CryptoDevsNFTAddress,
    functionName: "balanceOf",
    args: [address],
  });

  // Function to make a createProposal transaction in the DAO
  async function createProposal() {
    setLoading(true);

    try {
      const tx = await writeContract(config,{
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "createProposal",
        args: [fakeNftTokenId],
      });
      console.log(tx)
    //   await waitForTransactionReceipt(tx);
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
    setLoading(false);
  }

  // Function to fetch a proposal by it's ID
  async function fetchProposalById(id: any) {
    try {
      const proposal = await readContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "proposals",
        args: [id],
      });

      if (Array.isArray(proposal)) {
        const [nftTokenId, deadline, yayVotes, nayVotes, executed] = proposal;
        // ... use the destructured values
        const parsedProposal = {
          proposalId: id,
          nftTokenId: nftTokenId.toString(),
          deadline: new Date(parseInt(deadline.toString()) * 1000),
          yayVotes: yayVotes.toString(),
          nayVotes: nayVotes.toString(),
          executed: Boolean(executed),
        };
        return parsedProposal;
      }
      // const [nftTokenId, deadline, yayVotes, nayVotes, executed] = proposal;

      // const parsedProposal = {
      //   proposalId: id,
      //   nftTokenId: nftTokenId.toString(),
      //   deadline: new Date(parseInt(deadline.toString()) * 1000),
      //   yayVotes: yayVotes.toString(),
      //   nayVotes: nayVotes.toString(),
      //   executed: Boolean(executed),
      // };

      // return parsedProposal;
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  }

  // Function to fetch all proposals in the DAO
  const fetchAllProposals = useCallback(async () => {
    try {
      const numOfProposalsData = numOfProposalsInDAO.data;
  
      if (typeof numOfProposalsData === 'number') {
        const numOfProposals = numOfProposalsData;
        const proposals = [];
  
        for (let i = 0; i < numOfProposals; i++) {
          const proposal = await fetchProposalById(i);
          proposals.push(proposal);
        }
  
        setProposals(proposals);
        return proposals;
      } else {
        // Handle the case where numOfProposalsData is not a valid number
        console.error("Number of proposals is not a valid number");
        window.alert("Error fetching proposals");
      }
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
  }, [
    numOfProposalsInDAO.data,
  ]);

  // Function to vote YAY or NAY on a proposal
  async function voteForProposal(proposalId: any, vote: any) {
    setLoading(true);
    try {
      const tx = await writeContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "voteOnProposal",
        args: [proposalId, vote === "YAY" ? 0 : 1],
      });
        console.log("voting proposal", tx)

    //   await waitForTransaction(tx);
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
    setLoading(false);
  }

  // Function to execute a proposal after deadline has been exceeded
  async function executeProposal(proposalId: any) {
    setLoading(true);
    try {
      const tx = await writeContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "executeProposal",
        args: [proposalId],
      });
      console.log("executing proposal", tx)

    //   await waitForTransaction(tx);
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
    setLoading(false);
  }

  // Function to withdraw ether from the DAO contract
  async function withdrawDAOEther() {
    setLoading(true);
    try {
      const tx = await writeContract(config, {
        address: CryptoDevsDAOAddress,
        abi: CryptoDevsDAOABI,
        functionName: "withdrawEther",
        args: [],
      });
        console.log("withdrawEther", tx)
    //   await waitForTransaction(tx);
    } catch (error) {
      console.error(error);
      window.alert(error);
    }
    setLoading(false);
  }

  // Render the contents of the appropriate tab based on `selectedTab`
  function renderTabs() {
    if (selectedTab === "Create Proposal") {
      return <CreateProposalTab
        nftBalanceOfUser={nftBalanceOfUser}
        setFakeNftTokenId={setFakeNftTokenId}
        createProposal={createProposal}
        loading={loading}
      />;
    } else if (selectedTab === "View Proposals") {
      return <ViewProposalsTab
        proposals={proposals}
        loading={loading}
        voteForProposal={voteForProposal}
        executeProposal={executeProposal}
      />;
    }
    return null;
  }

  // Piece of code that runs everytime the value of `selectedTab` changes
  // Used to re-fetch all proposals in the DAO when user switches
  // to the 'View Proposals' tab
  useEffect(() => {
    if (selectedTab === "View Proposals") {
      fetchAllProposals();
    }
  }, [selectedTab, fetchAllProposals]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!isConnected) return <ConnectButton />;

  return (
    <div>
       <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <div className={styles.description}>Welcome to the DAO!</div>
          <div className={styles.description}>
            Your CryptoDevs NFT Balance: {typeof nftBalanceOfUser?.data === 'number' ? nftBalanceOfUser?.data.toString() : "0"}
            <br />
            {daoBalance.data && (
              <>
                Treasury Balance:{" "}
                {formatEther(daoBalance.data.value).toString()} ETH
              </>
            )}
            <br />
            Total Number of Proposals: {typeof numOfProposalsInDAO?.data === 'number' ? numOfProposalsInDAO.data.toString() : '0'}
          </div>
          <div className={styles.flex}>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("Create Proposal")}
            >
              Create Proposal
            </button>
            <button
              className={styles.button}
              onClick={() => setSelectedTab("View Proposals")}
            >
              View Proposals
            </button>
          </div>
          {renderTabs()}
          {/* Display additional withdraw button if connected wallet is owner */}
          {address && typeof daoOwner.data === 'string' && address.toLowerCase() === daoOwner.data.toLowerCase() ? (
            <div>
              {loading ? (
                <button className={styles.button}>Loading...</button>
              ) : (
                <button className={styles.button} onClick={withdrawDAOEther}>
                  Withdraw DAO ETH
                </button>
              )}
            </div>
          ) : (
            ""
          )}
        </div>
        <div>
          <Image
            className={styles.image}
            src="https://i.imgur.com/buNhbF7.png"
            alt="alt"
            width={100}
            height={100}
          />
          </div>
      </div>
    </div>
  );
}