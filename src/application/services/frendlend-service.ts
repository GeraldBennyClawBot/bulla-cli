import { Effect } from 'effect';
import type { ContractNotFoundError, UnsupportedChainError } from '../../domain/errors.js';
import type {
    LoanRequestParams,
    ClaimMetadata,
    RejectLoanOfferParams,
    AcceptLoanParams,
    PayLoanParams,
    LoanOperationParams,
    SetLoanCallbackParams,
} from '../../domain/types/frendlend.js';
import type { UnsignedTransaction } from '../../domain/types/transaction.js';
import { isNativeToken } from '../../domain/types/token.js';
import { FrendLendEncoderService } from '../ports/frendlend-encoder-port.js';
import { RegistryService } from '../ports/registry-port.js';

/**
 * Build mode: produces unsigned transaction for offerLoan
 */
export const buildOfferLoan = (
    params: LoanRequestParams,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);

        const data = yield* encoder.encodeOfferLoan(params);

        return {
            to: contractAddress,
            value: '0',
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for offerLoanWithMetadata
 */
export const buildOfferLoanWithMetadata = (
    params: LoanRequestParams,
    metadata: ClaimMetadata,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);

        const data = yield* encoder.encodeOfferLoanWithMetadata(params, metadata);

        return {
            to: contractAddress,
            value: '0',
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for rejectLoanOffer
 */
export const buildRejectLoanOffer = (
    params: RejectLoanOfferParams,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);
        const data = yield* encoder.encodeRejectLoanOffer(params);

        return {
            to: contractAddress,
            value: '0',
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for acceptLoan
 */
export const buildAcceptLoan = (
    params: AcceptLoanParams,
    tokenAddress: string,
    loanAmount: bigint,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);

        const data = yield* encoder.encodeAcceptLoan(params);

        // IMPORTANT: This is a payable function - debtor receives the loan amount
        const value = isNativeToken(tokenAddress) ? loanAmount.toString() : '0';

        return {
            to: contractAddress,
            value,
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for acceptLoanWithReceiver
 */
export const buildAcceptLoanWithReceiver = (
    params: AcceptLoanParams,
    tokenAddress: string,
    loanAmount: bigint,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);

        const data = yield* encoder.encodeAcceptLoanWithReceiver(params);

        // IMPORTANT: This is a payable function - debtor receives the loan amount
        const value = isNativeToken(tokenAddress) ? loanAmount.toString() : '0';

        return {
            to: contractAddress,
            value,
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for payLoan
 */
export const buildPayLoan = (
    params: PayLoanParams,
    tokenAddress: string,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);

        const data = yield* encoder.encodePayLoan(params);

        const value = isNativeToken(tokenAddress) ? params.paymentAmount.toString() : '0';

        return {
            to: contractAddress,
            value,
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for impairLoan
 */
export const buildImpairLoan = (
    params: LoanOperationParams,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);
        const data = yield* encoder.encodeImpairLoan(params);

        return {
            to: contractAddress,
            value: '0',
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for markLoanAsPaid
 */
export const buildMarkLoanAsPaid = (
    params: LoanOperationParams,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);
        const data = yield* encoder.encodeMarkLoanAsPaid(params);

        return {
            to: contractAddress,
            value: '0',
            data,
            operation: 0 as const,
        };
    });

/**
 * Build mode: produces unsigned transaction for setPaidLoanCallback
 */
export const buildSetPaidLoanCallback = (
    params: SetLoanCallbackParams,
): Effect.Effect<UnsignedTransaction, ContractNotFoundError | UnsupportedChainError, RegistryService | FrendLendEncoderService> =>
    Effect.gen(function* () {
        const registry = yield* RegistryService;
        const encoder = yield* FrendLendEncoderService;

        const contractAddress = yield* registry.getFrendLendAddress(params.chainId);
        const data = yield* encoder.encodeSetPaidLoanCallback(params);

        return {
            to: contractAddress,
            value: '0',
            data,
            operation: 0 as const,
        };
    });
