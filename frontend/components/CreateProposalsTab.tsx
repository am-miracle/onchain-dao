import React, { ChangeEvent } from 'react';
import styles from "./page.module.css";

type CreateProposalTabProps = {
  loading: boolean;
  nftBalanceOfUser: { data: any };
  setFakeNftTokenId: React.Dispatch<React.SetStateAction<string>>;
  createProposal: () => void;
}

const CreateProposalTab: React.FC<CreateProposalTabProps> = ({
  loading,
  nftBalanceOfUser,
  setFakeNftTokenId,
  createProposal,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFakeNftTokenId(e.target.value);
  };

  return (
    <div>
      {loading ? (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      ) : nftBalanceOfUser.data === 0 ? (
        <div className={styles.description}>
          You do not own any CryptoDevs NFTs. <br />
          <b>You cannot create or vote on proposals</b>
        </div>
      ) : (
        <div className={styles.container}>
          <label>Fake NFT Token ID to Purchase: </label>
          <input
            placeholder="0"
            type="number"
            onChange={handleChange}
          />
          <button className={styles.button2} onClick={createProposal}>
            Create
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateProposalTab;
