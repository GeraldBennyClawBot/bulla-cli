import { Effect, Layer } from 'effect';
import { encodeFunctionData } from 'viem';
import type { Hex } from '../../domain/types/eth.js';
import { FrendLendEncoderService } from '../../application/ports/frendlend-encoder-port.js';
import type {
    LoanRequestParams,
    ClaimMetadata,
    RejectLoanOfferParams,
    AcceptLoanParams,
    PayLoanParams,
    LoanOperationParams,
    SetLoanCallbackParams,
} from '../../domain/types/frendlend.js';
import { bullaFrendLendAbi } from '../abi/bulla-frendlend.js';

const encodeOfferLoan = (params: Omit<LoanRequestParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'offerLoan',
            args: [
                {
                    termLength: params.termLength,
                    interestConfig: {
                        interestRateBps: params.interestRateBps,
                        numberOfPeriodsPerYear: params.periodsPerYear,
                    },
                    loanAmount: params.loanAmount,
                    creditor: params.creditor as `0x${string}`,
                    debtor: params.debtor as `0x${string}`,
                    description: params.description,
                    token: params.token as `0x${string}`,
                    impairmentGracePeriod: params.impairmentGracePeriod,
                    expiresAt: params.expiresAt,
                    callbackContract: params.callbackContract as `0x${string}`,
                    callbackSelector: params.callbackSelector as Hex,
                },
            ],
        }),
    );

const encodeOfferLoanWithMetadata = (
    params: Omit<LoanRequestParams, 'chainId'>,
    metadata: ClaimMetadata,
): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'offerLoanWithMetadata',
            args: [
                {
                    termLength: params.termLength,
                    interestConfig: {
                        interestRateBps: params.interestRateBps,
                        numberOfPeriodsPerYear: params.periodsPerYear,
                    },
                    loanAmount: params.loanAmount,
                    creditor: params.creditor as `0x${string}`,
                    debtor: params.debtor as `0x${string}`,
                    description: params.description,
                    token: params.token as `0x${string}`,
                    impairmentGracePeriod: params.impairmentGracePeriod,
                    expiresAt: params.expiresAt,
                    callbackContract: params.callbackContract as `0x${string}`,
                    callbackSelector: params.callbackSelector as Hex,
                },
                {
                    tokenURI: metadata.tokenURI,
                    attachmentURI: metadata.attachmentURI,
                },
            ],
        }),
    );

const encodeRejectLoanOffer = (params: Omit<RejectLoanOfferParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'rejectLoanOffer',
            args: [params.offerId],
        }),
    );

const encodeAcceptLoan = (params: Omit<AcceptLoanParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'acceptLoan',
            args: [params.offerId],
        }),
    );

const encodeAcceptLoanWithReceiver = (params: Omit<AcceptLoanParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'acceptLoanWithReceiver',
            args: [params.offerId, params.receiver as `0x${string}`],
        }),
    );

const encodePayLoan = (params: Omit<PayLoanParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'payLoan',
            args: [params.claimId, params.paymentAmount],
        }),
    );

const encodeImpairLoan = (params: Omit<LoanOperationParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'impairLoan',
            args: [params.claimId],
        }),
    );

const encodeMarkLoanAsPaid = (params: Omit<LoanOperationParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'markLoanAsPaid',
            args: [params.claimId],
        }),
    );

const encodeSetPaidLoanCallback = (params: Omit<SetLoanCallbackParams, 'chainId'>): Effect.Effect<Hex, never, never> =>
    Effect.sync(() =>
        encodeFunctionData({
            abi: bullaFrendLendAbi,
            functionName: 'setPaidLoanCallback',
            args: [params.loanId, params.callbackContract as `0x${string}`, params.callbackSelector as Hex],
        }),
    );

export const ViemFrendLendEncoderLive = Layer.succeed(FrendLendEncoderService, {
    encodeOfferLoan,
    encodeOfferLoanWithMetadata,
    encodeRejectLoanOffer,
    encodeAcceptLoan,
    encodeAcceptLoanWithReceiver,
    encodePayLoan,
    encodeImpairLoan,
    encodeMarkLoanAsPaid,
    encodeSetPaidLoanCallback,
});
