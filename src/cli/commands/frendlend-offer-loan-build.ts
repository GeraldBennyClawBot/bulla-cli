import { Command } from '@effect/cli';
import { Console, Effect, Either } from 'effect';
import { buildOfferLoan } from '../../application/services/frendlend-service.js';
import { isChainId } from '../../domain/types/eth.js';
import { validateAddress, validateAmount } from '../../domain/validation/eth.js';
import { ZERO_ADDRESS } from '../../domain/types/token.js';
import { formatTransaction, type OutputFormat } from '../formatters/index.js';
import { chainOption, formatOption } from '../options/common.js';
import {
    loanAmountOption,
    termLengthOption,
    creditorOption,
    debtorOption,
    descriptionOption,
    tokenOption,
    interestRateBpsOption,
    periodsPerYearOption,
    impairmentGracePeriodOption,
    expiresAtOption,
    callbackContractOption,
    callbackSelectorOption,
} from '../options/frendlend-options.js';

export const frendlendOfferLoanBuildCommand = Command.make(
    'build',
    {
        chain: chainOption,
        loanAmount: loanAmountOption,
        termLength: termLengthOption,
        creditor: creditorOption,
        debtor: debtorOption,
        description: descriptionOption,
        token: tokenOption,
        interestRateBps: interestRateBpsOption,
        periodsPerYear: periodsPerYearOption,
        impairmentGracePeriod: impairmentGracePeriodOption,
        expiresAt: expiresAtOption,
        callbackContract: callbackContractOption,
        callbackSelector: callbackSelectorOption,
        format: formatOption,
    },
    ({
        chain,
        loanAmount,
        termLength,
        creditor,
        debtor,
        description,
        token,
        interestRateBps,
        periodsPerYear,
        impairmentGracePeriod,
        expiresAt,
        callbackContract,
        callbackSelector,
        format,
    }) =>
        Effect.gen(function* () {
            if (!isChainId(chain)) {
                yield* Console.error(`Unsupported chain ID: ${chain}`);
                return;
            }

            // Validate addresses
            const creditorResult = validateAddress(creditor);
            if (Either.isLeft(creditorResult)) {
                yield* Console.error(`Invalid creditor address: ${creditorResult.left.message}`);
                return;
            }

            const debtorResult = validateAddress(debtor);
            if (Either.isLeft(debtorResult)) {
                yield* Console.error(`Invalid debtor address: ${debtorResult.left.message}`);
                return;
            }

            const tokenResult = validateAddress(token);
            if (Either.isLeft(tokenResult)) {
                yield* Console.error(`Invalid token address: ${tokenResult.left.message}`);
                return;
            }

            const callbackContractResult = validateAddress(callbackContract);
            if (Either.isLeft(callbackContractResult)) {
                yield* Console.error(`Invalid callback contract address: ${callbackContractResult.left.message}`);
                return;
            }

            // Validate amounts
            const loanAmountResult = validateAmount(loanAmount);
            if (Either.isLeft(loanAmountResult)) {
                yield* Console.error(`Invalid loan amount: ${loanAmountResult.left.message}`);
                return;
            }

            // Validate callback selector format (should be bytes4 hex string)
            if (!/^0x[0-9a-fA-F]{8}$/.test(callbackSelector)) {
                yield* Console.error(`Invalid callback selector: ${callbackSelector}. Must be bytes4 hex string (e.g., 0x12345678)`);
                return;
            }

            const params = {
                chainId: chain,
                termLength: BigInt(termLength),
                interestRateBps,
                periodsPerYear,
                loanAmount: loanAmountResult.right,
                creditor: creditorResult.right,
                debtor: debtorResult.right,
                description,
                token: tokenResult.right,
                impairmentGracePeriod: BigInt(impairmentGracePeriod),
                expiresAt: BigInt(expiresAt),
                callbackContract: callbackContractResult.right,
                callbackSelector,
            };

            const tx = yield* buildOfferLoan(params);
            const output = formatTransaction(tx, params.chainId, format as OutputFormat);
            yield* Console.log(output);
        }),
).pipe(Command.withDescription('Build an unsigned offerLoan transaction (no private key required)'));
