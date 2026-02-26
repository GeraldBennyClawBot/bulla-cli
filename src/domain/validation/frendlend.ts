import { Either } from 'effect';
import type {
    LoanRequestParams,
    PayLoanParams,
    SetLoanCallbackParams,
    LoanOperationParams,
    RejectLoanOfferParams,
    AcceptLoanParams,
} from '../types/frendlend.js';

/** Validate that loan request params are well-formed (pure). */
export const validateLoanRequestParams = (params: LoanRequestParams): Either.Either<LoanRequestParams, string> => {
    if (params.loanAmount <= 0n) {
        return Either.left('Loan amount must be greater than zero');
    }
    if (params.termLength <= 0n) {
        return Either.left('Term length must be greater than zero');
    }
    if (params.interestRateBps < 0) {
        return Either.left('Interest rate must be non-negative');
    }
    if (params.periodsPerYear < 0) {
        return Either.left('Periods per year must be non-negative (0 means simple interest)');
    }
    if (params.impairmentGracePeriod < 0n) {
        return Either.left('Impairment grace period must be non-negative');
    }
    if (params.expiresAt < 0n) {
        return Either.left('Expires at must be non-negative (0 means no expiry)');
    }
    // Validate callbackSelector format if not the zero selector
    if (params.callbackSelector !== '0x00000000' && !/^0x[0-9a-fA-F]{8}$/.test(params.callbackSelector)) {
        return Either.left('Callback selector must be a 4-byte hex string (e.g., 0x12345678)');
    }
    return Either.right(params);
};

/** Validate that pay loan params are well-formed (pure). */
export const validatePayLoanParams = (params: PayLoanParams): Either.Either<PayLoanParams, string> => {
    if (params.paymentAmount <= 0n) {
        return Either.left('Payment amount must be greater than zero');
    }
    return Either.right(params);
};

/** Validate that set loan callback params are well-formed (pure). */
export const validateSetLoanCallbackParams = (params: SetLoanCallbackParams): Either.Either<SetLoanCallbackParams, string> => {
    // Callback selector should be 4 bytes (0x + 8 hex chars)
    if (!/^0x[0-9a-fA-F]{8}$/.test(params.callbackSelector)) {
        return Either.left('Callback selector must be a 4-byte hex string (e.g., 0x12345678)');
    }
    return Either.right(params);
};

/** Validate that loan operation params are well-formed (pure). */
export const validateLoanOperationParams = (params: LoanOperationParams): Either.Either<LoanOperationParams, string> => {
    // No specific validation needed for simple operations (impair, mark as paid)
    return Either.right(params);
};

/** Validate that reject loan offer params are well-formed (pure). */
export const validateRejectLoanOfferParams = (params: RejectLoanOfferParams): Either.Either<RejectLoanOfferParams, string> => {
    // No specific validation needed beyond type checking
    return Either.right(params);
};

/** Validate that accept loan params are well-formed (pure). */
export const validateAcceptLoanParams = (params: AcceptLoanParams): Either.Either<AcceptLoanParams, string> => {
    // No specific validation needed beyond type checking
    return Either.right(params);
};
