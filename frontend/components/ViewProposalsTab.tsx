import { Proposal } from '../lib/types';
import styles from "./page.module.css";

type ViewProposalsTabProps = {
  proposals: Proposal[];
  loading: boolean;
  voteForProposal: (proposalId: any, vote: string) => void;
  executeProposal: (proposalId: any) => void;
}

export default function ViewProposalsTab({
  proposals,
  loading,
  voteForProposal,
  executeProposal,
}: ViewProposalsTabProps) {
  function renderProposalStatus(p: Proposal) {
    if (p.deadline.getTime() > Date.now() && !p.executed) {
      return (
        <div className={styles.flex}>
          <button
            className={styles.button2}
            onClick={() => voteForProposal(p.proposalId, 'YAY')}
          >
            Vote YAY
          </button>
          <button
            className={styles.button2}
            onClick={() => voteForProposal(p.proposalId, 'NAY')}
          >
            Vote NAY
          </button>
        </div>
      );
    } else if (p.deadline.getTime() < Date.now() && !p.executed) {
      return (
        <div className={styles.flex}>
          <button
            className={styles.button2}
            onClick={() => executeProposal(p.proposalId)}
          >
            Execute Proposal {p.yayVotes > p.nayVotes ? '(YAY)' : '(NAY)'}
          </button>
        </div>
      );
    } else {
      return <div className={styles.description}>Proposal Executed</div>;
    }
  }

  return (
    <div>
      {loading ? (
        <div className={styles.description}>
          Loading... Waiting for transaction...
        </div>
      ) : proposals.length === 0 ? (
        <div className={styles.description}>No proposals have been created</div>
      ) : (
        <div>
          {proposals.map((p, index) => (
            <div key={index} className={styles.card}>
              <p>Proposal ID: {p.proposalId}</p>
              <p>Fake NFT to Purchase: {p.nftTokenId}</p>
              <p>Deadline: {p.deadline.toLocaleString()}</p>
              <p>Yay Votes: {p.yayVotes}</p>
              <p>Nay Votes: {p.nayVotes}</p>
              <p>Executed?: {p.executed.toString()}</p>
              {renderProposalStatus(p)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
