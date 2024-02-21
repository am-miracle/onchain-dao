export type Proposal = {
    proposalId: number
    nftTokenId: number
    deadline: Date
    yayVotes: number
    nayVotes: number
    executed: boolean
}