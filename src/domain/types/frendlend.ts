import type { EthAddress, ChainId } from './eth.js';
import type { ClaimMetadata } from './invoice.js';

// InterestConfig from CompoundInterestLib.sol
export interface InterestConfig {
    interestRateBps: number; // basis points (1% = 100 bps)
    periodsPerYear: number; // 0 for simple interest, 1-365 for compound
}

// LoanRequestParams from IBullaFrendLendV2.sol
export interface LoanRequestParams {
    chainId: ChainId;
    termLength: bigint; // loan duration in seconds
    interestRateBps: number; // from InterestConfig
    periodsPerYear: number; // from InterestConfig
    loanAmount: bigint;
    creditor: EthAddress;
    debtor: EthAddress;
    description: string;
    token: EthAddress;
    impairmentGracePeriod: bigint;
    expiresAt: bigint; // timestamp when offer expires, 0 = no expiry
    callbackContract: EthAddress; // 0 address = no callback
    callbackSelector: string; // bytes4 as hex string like "0x12345678"
}

// PayLoanParams for payLoan operation
export interface PayLoanParams {
    chainId: ChainId;
    claimId: bigint;
    paymentAmount: bigint;
}

// LoanOperationParams for impair and markAsPaid operations
export interface LoanOperationParams {
    chainId: ChainId;
    claimId: bigint;
}

// SetLoanCallbackParams for setLoanCallback operation
export interface SetLoanCallbackParams {
    chainId: ChainId;
    loanId: bigint;
    callbackContract: EthAddress;
    callbackSelector: string; // bytes4 as hex string
}

// RejectLoanOfferParams for rejectLoanOffer operation
export interface RejectLoanOfferParams {
    chainId: ChainId;
    offerId: bigint;
}

// AcceptLoanParams for acceptLoan operation
export interface AcceptLoanParams {
    chainId: ChainId;
    offerId: bigint;
    receiver?: EthAddress; // optional, defaults to msg.sender
}

// Re-export ClaimMetadata for convenience
export type { ClaimMetadata };
