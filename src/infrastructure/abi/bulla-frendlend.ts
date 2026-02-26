/** BullaFrendLend ABI — declared `as const` for viem type inference. */
export const bullaFrendLendAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'termLength', type: 'uint256' },
                    {
                        components: [
                            { internalType: 'uint16', name: 'interestRateBps', type: 'uint16' },
                            { internalType: 'uint16', name: 'numberOfPeriodsPerYear', type: 'uint16' },
                        ],
                        internalType: 'struct InterestConfig',
                        name: 'interestConfig',
                        type: 'tuple',
                    },
                    { internalType: 'uint256', name: 'loanAmount', type: 'uint256' },
                    { internalType: 'address', name: 'creditor', type: 'address' },
                    { internalType: 'address', name: 'debtor', type: 'address' },
                    { internalType: 'string', name: 'description', type: 'string' },
                    { internalType: 'address', name: 'token', type: 'address' },
                    { internalType: 'uint256', name: 'impairmentGracePeriod', type: 'uint256' },
                    { internalType: 'uint256', name: 'expiresAt', type: 'uint256' },
                    { internalType: 'address', name: 'callbackContract', type: 'address' },
                    { internalType: 'bytes4', name: 'callbackSelector', type: 'bytes4' },
                ],
                internalType: 'struct LoanRequestParams',
                name: 'offer',
                type: 'tuple',
            },
        ],
        name: 'offerLoan',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                components: [
                    { internalType: 'uint256', name: 'termLength', type: 'uint256' },
                    {
                        components: [
                            { internalType: 'uint16', name: 'interestRateBps', type: 'uint16' },
                            { internalType: 'uint16', name: 'numberOfPeriodsPerYear', type: 'uint16' },
                        ],
                        internalType: 'struct InterestConfig',
                        name: 'interestConfig',
                        type: 'tuple',
                    },
                    { internalType: 'uint256', name: 'loanAmount', type: 'uint256' },
                    { internalType: 'address', name: 'creditor', type: 'address' },
                    { internalType: 'address', name: 'debtor', type: 'address' },
                    { internalType: 'string', name: 'description', type: 'string' },
                    { internalType: 'address', name: 'token', type: 'address' },
                    { internalType: 'uint256', name: 'impairmentGracePeriod', type: 'uint256' },
                    { internalType: 'uint256', name: 'expiresAt', type: 'uint256' },
                    { internalType: 'address', name: 'callbackContract', type: 'address' },
                    { internalType: 'bytes4', name: 'callbackSelector', type: 'bytes4' },
                ],
                internalType: 'struct LoanRequestParams',
                name: 'offer',
                type: 'tuple',
            },
            {
                components: [
                    { internalType: 'string', name: 'tokenURI', type: 'string' },
                    { internalType: 'string', name: 'attachmentURI', type: 'string' },
                ],
                internalType: 'struct ClaimMetadata',
                name: 'metadata',
                type: 'tuple',
            },
        ],
        name: 'offerLoanWithMetadata',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }],
        name: 'rejectLoanOffer',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'offerId', type: 'uint256' }],
        name: 'acceptLoan',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'offerId', type: 'uint256' },
            { internalType: 'address', name: 'receiver', type: 'address' },
        ],
        name: 'acceptLoanWithReceiver',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        stateMutability: 'payable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'claimId', type: 'uint256' },
            { internalType: 'uint256', name: 'paymentAmount', type: 'uint256' },
        ],
        name: 'payLoan',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'claimId', type: 'uint256' }],
        name: 'impairLoan',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [{ internalType: 'uint256', name: 'claimId', type: 'uint256' }],
        name: 'markLoanAsPaid',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            { internalType: 'uint256', name: 'loanId', type: 'uint256' },
            { internalType: 'address', name: 'callbackContract', type: 'address' },
            { internalType: 'bytes4', name: 'callbackSelector', type: 'bytes4' },
        ],
        name: 'setPaidLoanCallback',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
] as const;
