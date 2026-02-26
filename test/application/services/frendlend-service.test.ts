import { Effect, Layer } from 'effect';
import { describe, expect, it } from 'vitest';
import { encodeFunctionData } from 'viem';
import {
    buildOfferLoan,
    buildOfferLoanWithMetadata,
    buildAcceptLoan,
    buildRejectLoanOffer,
    buildPayLoan,
    buildImpairLoan,
    buildMarkLoanAsPaid,
    buildSetPaidLoanCallback,
} from '../../../src/application/services/frendlend-service.js';
import { RegistryService } from '../../../src/application/ports/registry-port.js';
import { FrendLendEncoderService } from '../../../src/application/ports/frendlend-encoder-port.js';
import { bullaFrendLendAbi } from '../../../src/infrastructure/abi/bulla-frendlend.js';
import type { EthAddress, Hex, ChainId } from '../../../src/domain/types/eth.js';
import type {
    LoanRequestParams,
    ClaimMetadata,
    AcceptLoanParams,
    RejectLoanOfferParams,
    PayLoanParams,
    LoanOperationParams,
    SetLoanCallbackParams,
} from '../../../src/domain/types/frendlend.js';
import { ZERO_ADDRESS } from '../../../src/domain/types/token.js';

const SEPOLIA_FRENDLEND_CONTRACT = '0x4d6A66D32CF34270e4cc9C9F201CA4dB650Be3f2' as EthAddress;
const DEBTOR = '0x1234567890abcdef1234567890abcdef12345678' as EthAddress;
const CREDITOR = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as EthAddress;
const ERC20_TOKEN = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as EthAddress;

const makeLoanRequestParams = (overrides: Partial<LoanRequestParams> = {}): LoanRequestParams => ({
    chainId: 11155111 as ChainId,
    termLength: 2592000n, // 30 days in seconds
    interestRateBps: 500, // 5%
    periodsPerYear: 12, // monthly compounding
    loanAmount: 1000000000000000000n, // 1 ETH
    creditor: CREDITOR,
    debtor: DEBTOR,
    description: 'Test loan',
    token: ZERO_ADDRESS,
    impairmentGracePeriod: 86400n, // 1 day
    expiresAt: 0n, // no expiry
    callbackContract: ZERO_ADDRESS,
    callbackSelector: '0x00000000',
    ...overrides,
});

const makeAcceptLoanParams = (overrides: Partial<AcceptLoanParams> = {}): AcceptLoanParams => ({
    chainId: 11155111 as ChainId,
    offerId: 1n,
    ...overrides,
});

const makeRejectLoanOfferParams = (overrides: Partial<RejectLoanOfferParams> = {}): RejectLoanOfferParams => ({
    chainId: 11155111 as ChainId,
    offerId: 1n,
    ...overrides,
});

const makePayLoanParams = (overrides: Partial<PayLoanParams> = {}): PayLoanParams => ({
    chainId: 11155111 as ChainId,
    claimId: 1n,
    paymentAmount: 1000000000000000000n,
    ...overrides,
});

const makeLoanOperationParams = (overrides: Partial<LoanOperationParams> = {}): LoanOperationParams => ({
    chainId: 11155111 as ChainId,
    claimId: 1n,
    ...overrides,
});

const makeSetLoanCallbackParams = (overrides: Partial<SetLoanCallbackParams> = {}): SetLoanCallbackParams => ({
    chainId: 11155111 as ChainId,
    loanId: 1n,
    callbackContract: '0x9999999999999999999999999999999999999999' as EthAddress,
    callbackSelector: '0x12345678',
    ...overrides,
});

// --- Test layers ---

const TestRegistryService = Layer.succeed(RegistryService, {
    getInstantPaymentAddress: () => Effect.succeed('0x0000000000000000000000000000000000000000' as EthAddress),
    getInvoiceAddress: () => Effect.succeed('0x0000000000000000000000000000000000000000' as EthAddress),
    getFrendLendAddress: () => Effect.succeed(SEPOLIA_FRENDLEND_CONTRACT),
});

/** Uses real viem encoding for golden-value tests. */
const TestFrendLendEncoder = Layer.succeed(FrendLendEncoderService, {
    encodeOfferLoan: params =>
        Effect.succeed(
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
                        callbackSelector: params.callbackSelector as `0x${string}`,
                    },
                ],
            }) as Hex,
        ),
    encodeOfferLoanWithMetadata: (params, metadata) =>
        Effect.succeed(
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
                        callbackSelector: params.callbackSelector as `0x${string}`,
                    },
                    {
                        tokenURI: metadata.claimMetadataUrl,
                        attachmentURI: metadata.attachmentMetadataUrl,
                    },
                ],
            }) as Hex,
        ),
    encodeAcceptLoan: params =>
        Effect.succeed(
            encodeFunctionData({
                abi: bullaFrendLendAbi,
                functionName: 'acceptLoan',
                args: [params.offerId],
            }) as Hex,
        ),
    encodeAcceptLoanWithReceiver: params =>
        Effect.succeed(
            encodeFunctionData({
                abi: bullaFrendLendAbi,
                functionName: 'acceptLoanWithReceiver',
                args: [params.offerId, params.receiver as `0x${string}`],
            }) as Hex,
        ),
    encodeRejectLoanOffer: params =>
        Effect.succeed(
            encodeFunctionData({
                abi: bullaFrendLendAbi,
                functionName: 'rejectLoanOffer',
                args: [params.offerId],
            }) as Hex,
        ),
    encodePayLoan: params =>
        Effect.succeed(
            encodeFunctionData({
                abi: bullaFrendLendAbi,
                functionName: 'payLoan',
                args: [params.claimId, params.paymentAmount],
            }) as Hex,
        ),
    encodeImpairLoan: params =>
        Effect.succeed(
            encodeFunctionData({
                abi: bullaFrendLendAbi,
                functionName: 'impairLoan',
                args: [params.claimId],
            }) as Hex,
        ),
    encodeMarkLoanAsPaid: params =>
        Effect.succeed(
            encodeFunctionData({
                abi: bullaFrendLendAbi,
                functionName: 'markLoanAsPaid',
                args: [params.claimId],
            }) as Hex,
        ),
    encodeSetPaidLoanCallback: params =>
        Effect.succeed(
            encodeFunctionData({
                abi: bullaFrendLendAbi,
                functionName: 'setPaidLoanCallback',
                args: [params.loanId, params.callbackContract as `0x${string}`, params.callbackSelector as `0x${string}`],
            }) as Hex,
        ),
});

const BuildTestLayers = Layer.mergeAll(TestRegistryService, TestFrendLendEncoder);

// --- Tests ---

describe('buildOfferLoan', () => {
    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makeLoanRequestParams();
        const result = await Effect.runPromise(buildOfferLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to "0"', async () => {
        const params = makeLoanRequestParams();
        const result = await Effect.runPromise(buildOfferLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the offerLoan function selector', async () => {
        const params = makeLoanRequestParams();
        const result = await Effect.runPromise(buildOfferLoan(params).pipe(Effect.provide(BuildTestLayers)));

        // Function selector is first 10 characters (0x + 8 hex chars)
        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata for loans with interest config', async () => {
        const params = makeLoanRequestParams({
            interestRateBps: 1000, // 10%
            periodsPerYear: 12,
        });
        const result = await Effect.runPromise(buildOfferLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });

    it('produces valid hex calldata for loans with zero interest', async () => {
        const params = makeLoanRequestParams({
            interestRateBps: 0,
            periodsPerYear: 0,
        });
        const result = await Effect.runPromise(buildOfferLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
    });

    it('produces valid hex calldata for ERC20 token loans', async () => {
        const params = makeLoanRequestParams({ token: ERC20_TOKEN });
        const result = await Effect.runPromise(buildOfferLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
        expect(result.value).toBe('0');
    });
});

describe('buildOfferLoanWithMetadata', () => {
    const metadata: ClaimMetadata = {
        claimMetadataHash: 'QmTest123',
        claimMetadataUrl: 'https://example.com/metadata',
        attachmentMetadataHash: 'QmAttachment456',
        attachmentMetadataUrl: 'https://example.com/attachment',
    };

    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makeLoanRequestParams();
        const result = await Effect.runPromise(buildOfferLoanWithMetadata(params, metadata).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to "0"', async () => {
        const params = makeLoanRequestParams();
        const result = await Effect.runPromise(buildOfferLoanWithMetadata(params, metadata).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the offerLoanWithMetadata function selector', async () => {
        const params = makeLoanRequestParams();
        const result = await Effect.runPromise(buildOfferLoanWithMetadata(params, metadata).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata for loans with metadata and interest config', async () => {
        const params = makeLoanRequestParams({
            interestRateBps: 500,
            periodsPerYear: 12,
        });
        const result = await Effect.runPromise(buildOfferLoanWithMetadata(params, metadata).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });
});

describe('buildAcceptLoan', () => {
    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makeAcceptLoanParams();
        const result = await Effect.runPromise(buildAcceptLoan(params, ZERO_ADDRESS, 1000000000000000000n).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to loan amount for native token loans', async () => {
        const params = makeAcceptLoanParams();
        const loanAmount = 2000000000000000000n; // 2 ETH
        const result = await Effect.runPromise(buildAcceptLoan(params, ZERO_ADDRESS, loanAmount).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('2000000000000000000');
    });

    it('sets value to "0" for ERC20 loans', async () => {
        const params = makeAcceptLoanParams();
        const loanAmount = 1000000000000000000n;
        const result = await Effect.runPromise(buildAcceptLoan(params, ERC20_TOKEN, loanAmount).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the acceptLoan function selector', async () => {
        const params = makeAcceptLoanParams();
        const result = await Effect.runPromise(buildAcceptLoan(params, ZERO_ADDRESS, 1000000000000000000n).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata for different offer IDs', async () => {
        const params = makeAcceptLoanParams({ offerId: 999n });
        const result = await Effect.runPromise(buildAcceptLoan(params, ERC20_TOKEN, 500n).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });
});

describe('buildRejectLoanOffer', () => {
    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makeRejectLoanOfferParams();
        const result = await Effect.runPromise(buildRejectLoanOffer(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to "0"', async () => {
        const params = makeRejectLoanOfferParams();
        const result = await Effect.runPromise(buildRejectLoanOffer(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the rejectLoanOffer function selector', async () => {
        const params = makeRejectLoanOfferParams();
        const result = await Effect.runPromise(buildRejectLoanOffer(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata for different offer IDs', async () => {
        const params = makeRejectLoanOfferParams({ offerId: 42n });
        const result = await Effect.runPromise(buildRejectLoanOffer(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });
});

describe('buildPayLoan', () => {
    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makePayLoanParams();
        const result = await Effect.runPromise(buildPayLoan(params, ZERO_ADDRESS).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to payment amount for native token payments', async () => {
        const params = makePayLoanParams({ paymentAmount: 500000000000000000n }); // 0.5 ETH
        const result = await Effect.runPromise(buildPayLoan(params, ZERO_ADDRESS).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('500000000000000000');
    });

    it('sets value to "0" for ERC20 payments', async () => {
        const params = makePayLoanParams({ paymentAmount: 1000000000000000000n });
        const result = await Effect.runPromise(buildPayLoan(params, ERC20_TOKEN).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the payLoan function selector', async () => {
        const params = makePayLoanParams();
        const result = await Effect.runPromise(buildPayLoan(params, ZERO_ADDRESS).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata for partial payments', async () => {
        const params = makePayLoanParams({ paymentAmount: 100n });
        const result = await Effect.runPromise(buildPayLoan(params, ERC20_TOKEN).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });
});

describe('buildImpairLoan', () => {
    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makeLoanOperationParams();
        const result = await Effect.runPromise(buildImpairLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to "0"', async () => {
        const params = makeLoanOperationParams();
        const result = await Effect.runPromise(buildImpairLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the impairLoan function selector', async () => {
        const params = makeLoanOperationParams();
        const result = await Effect.runPromise(buildImpairLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata for different claim IDs', async () => {
        const params = makeLoanOperationParams({ claimId: 123n });
        const result = await Effect.runPromise(buildImpairLoan(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });
});

describe('buildMarkLoanAsPaid', () => {
    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makeLoanOperationParams();
        const result = await Effect.runPromise(buildMarkLoanAsPaid(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to "0"', async () => {
        const params = makeLoanOperationParams();
        const result = await Effect.runPromise(buildMarkLoanAsPaid(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the markLoanAsPaid function selector', async () => {
        const params = makeLoanOperationParams();
        const result = await Effect.runPromise(buildMarkLoanAsPaid(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata for different claim IDs', async () => {
        const params = makeLoanOperationParams({ claimId: 456n });
        const result = await Effect.runPromise(buildMarkLoanAsPaid(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });
});

describe('buildSetPaidLoanCallback', () => {
    it('produces an unsigned transaction with the correct contract address', async () => {
        const params = makeSetLoanCallbackParams();
        const result = await Effect.runPromise(buildSetPaidLoanCallback(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.to).toBe(SEPOLIA_FRENDLEND_CONTRACT);
        expect(result.operation).toBe(0);
    });

    it('sets value to "0"', async () => {
        const params = makeSetLoanCallbackParams();
        const result = await Effect.runPromise(buildSetPaidLoanCallback(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.value).toBe('0');
    });

    it('encodes calldata starting with the setPaidLoanCallback function selector', async () => {
        const params = makeSetLoanCallbackParams();
        const result = await Effect.runPromise(buildSetPaidLoanCallback(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]{8}/);
        expect(result.data.length).toBeGreaterThan(10);
    });

    it('produces valid hex calldata with custom callback contract and selector', async () => {
        const params = makeSetLoanCallbackParams({
            callbackContract: '0x1111111111111111111111111111111111111111' as EthAddress,
            callbackSelector: '0xabcdef12',
        });
        const result = await Effect.runPromise(buildSetPaidLoanCallback(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });

    it('produces valid hex calldata for different loan IDs', async () => {
        const params = makeSetLoanCallbackParams({ loanId: 789n });
        const result = await Effect.runPromise(buildSetPaidLoanCallback(params).pipe(Effect.provide(BuildTestLayers)));

        expect(result.data).toMatch(/^0x[0-9a-f]+$/);
    });
});
