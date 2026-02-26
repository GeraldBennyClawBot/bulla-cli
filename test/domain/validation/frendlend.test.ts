import { Either } from 'effect';
import { describe, expect, it } from 'vitest';
import {
    validateLoanRequestParams,
    validatePayLoanParams,
    validateSetLoanCallbackParams,
    validateLoanOperationParams,
    validateRejectLoanOfferParams,
    validateAcceptLoanParams,
} from '../../../src/domain/validation/frendlend.js';
import type {
    LoanRequestParams,
    PayLoanParams,
    SetLoanCallbackParams,
    LoanOperationParams,
    RejectLoanOfferParams,
    AcceptLoanParams,
} from '../../../src/domain/types/frendlend.js';
import type { EthAddress, ChainId } from '../../../src/domain/types/eth.js';
import { ZERO_ADDRESS } from '../../../src/domain/types/token.js';

const makeLoanRequestParams = (overrides: Partial<LoanRequestParams> = {}): LoanRequestParams => ({
    chainId: 11155111 as ChainId,
    termLength: 86400n, // 1 day
    interestRateBps: 500, // 5%
    periodsPerYear: 12,
    loanAmount: 1000000000000000000n,
    creditor: '0x1234567890abcdef1234567890abcdef12345678' as EthAddress,
    debtor: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd' as EthAddress,
    description: 'Test loan',
    token: ZERO_ADDRESS,
    impairmentGracePeriod: 0n,
    expiresAt: 0n,
    callbackContract: ZERO_ADDRESS,
    callbackSelector: '0x00000000',
    ...overrides,
});

const makePayLoanParams = (overrides: Partial<PayLoanParams> = {}): PayLoanParams => ({
    chainId: 11155111 as ChainId,
    claimId: 1n,
    paymentAmount: 1000000000000000000n,
    ...overrides,
});

const makeSetLoanCallbackParams = (overrides: Partial<SetLoanCallbackParams> = {}): SetLoanCallbackParams => ({
    chainId: 11155111 as ChainId,
    loanId: 1n,
    callbackContract: '0x1234567890abcdef1234567890abcdef12345678' as EthAddress,
    callbackSelector: '0x12345678',
    ...overrides,
});

const makeLoanOperationParams = (overrides: Partial<LoanOperationParams> = {}): LoanOperationParams => ({
    chainId: 11155111 as ChainId,
    claimId: 1n,
    ...overrides,
});

const makeRejectLoanOfferParams = (overrides: Partial<RejectLoanOfferParams> = {}): RejectLoanOfferParams => ({
    chainId: 11155111 as ChainId,
    offerId: 1n,
    ...overrides,
});

const makeAcceptLoanParams = (overrides: Partial<AcceptLoanParams> = {}): AcceptLoanParams => ({
    chainId: 11155111 as ChainId,
    offerId: 1n,
    ...overrides,
});

describe('validateLoanRequestParams', () => {
    it('accepts valid params', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams());
        expect(Either.isRight(result)).toBe(true);
    });

    it('rejects zero loan amount', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ loanAmount: 0n }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Loan amount must be greater than zero');
        }
    });

    it('rejects negative loan amount', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ loanAmount: -1n }));
        expect(Either.isLeft(result)).toBe(true);
    });

    it('rejects zero term length', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ termLength: 0n }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Term length must be greater than zero');
        }
    });

    it('rejects negative term length', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ termLength: -1n }));
        expect(Either.isLeft(result)).toBe(true);
    });

    it('rejects negative interest rate', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ interestRateBps: -1 }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Interest rate must be non-negative');
        }
    });

    it('rejects negative periods per year', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ periodsPerYear: -1 }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Periods per year must be non-negative (0 means simple interest)');
        }
    });

    it('accepts zero interest rate (no interest)', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ interestRateBps: 0 }));
        expect(Either.isRight(result)).toBe(true);
    });

    it('accepts simple interest (periods = 0)', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ interestRateBps: 500, periodsPerYear: 0 }));
        expect(Either.isRight(result)).toBe(true);
    });

    it('rejects negative impairment grace period', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ impairmentGracePeriod: -1n }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Impairment grace period must be non-negative');
        }
    });

    it('rejects negative expiresAt', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ expiresAt: -1n }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Expires at must be non-negative (0 means no expiry)');
        }
    });

    it('accepts zero expiresAt (no expiry)', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ expiresAt: 0n }));
        expect(Either.isRight(result)).toBe(true);
    });

    it('rejects invalid callback selector format', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ callbackSelector: 'invalid' }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Callback selector must be a 4-byte hex string (e.g., 0x12345678)');
        }
    });

    it('accepts valid callback selector', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ callbackSelector: '0xabcdef12' }));
        expect(Either.isRight(result)).toBe(true);
    });

    it('accepts zero callback selector', () => {
        const result = validateLoanRequestParams(makeLoanRequestParams({ callbackSelector: '0x00000000' }));
        expect(Either.isRight(result)).toBe(true);
    });
});

describe('validatePayLoanParams', () => {
    it('accepts valid params', () => {
        const result = validatePayLoanParams(makePayLoanParams());
        expect(Either.isRight(result)).toBe(true);
    });

    it('rejects zero payment amount', () => {
        const result = validatePayLoanParams(makePayLoanParams({ paymentAmount: 0n }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Payment amount must be greater than zero');
        }
    });

    it('rejects negative payment amount', () => {
        const result = validatePayLoanParams(makePayLoanParams({ paymentAmount: -1n }));
        expect(Either.isLeft(result)).toBe(true);
    });
});

describe('validateSetLoanCallbackParams', () => {
    it('accepts valid params', () => {
        const result = validateSetLoanCallbackParams(makeSetLoanCallbackParams());
        expect(Either.isRight(result)).toBe(true);
    });

    it('rejects selector without 0x prefix', () => {
        const result = validateSetLoanCallbackParams(makeSetLoanCallbackParams({ callbackSelector: '12345678' }));
        expect(Either.isLeft(result)).toBe(true);
        if (Either.isLeft(result)) {
            expect(result.left).toBe('Callback selector must be a 4-byte hex string (e.g., 0x12345678)');
        }
    });

    it('rejects selector with wrong length', () => {
        const result = validateSetLoanCallbackParams(makeSetLoanCallbackParams({ callbackSelector: '0x1234' }));
        expect(Either.isLeft(result)).toBe(true);
    });

    it('rejects selector with non-hex characters', () => {
        const result = validateSetLoanCallbackParams(makeSetLoanCallbackParams({ callbackSelector: '0xghijklmn' }));
        expect(Either.isLeft(result)).toBe(true);
    });
});

describe('validateLoanOperationParams', () => {
    it('accepts valid params', () => {
        const result = validateLoanOperationParams(makeLoanOperationParams());
        expect(Either.isRight(result)).toBe(true);
    });
});

describe('validateRejectLoanOfferParams', () => {
    it('accepts valid params', () => {
        const result = validateRejectLoanOfferParams(makeRejectLoanOfferParams());
        expect(Either.isRight(result)).toBe(true);
    });
});

describe('validateAcceptLoanParams', () => {
    it('accepts valid params', () => {
        const result = validateAcceptLoanParams(makeAcceptLoanParams());
        expect(Either.isRight(result)).toBe(true);
    });
});
