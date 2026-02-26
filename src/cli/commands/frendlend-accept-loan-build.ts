import { Command } from '@effect/cli';
import { Console, Effect, Either } from 'effect';
import { buildAcceptLoan } from '../../application/services/frendlend-service.js';
import { isChainId } from '../../domain/types/eth.js';
import { validateAddress, validateAmount } from '../../domain/validation/eth.js';
import { formatTransaction, type OutputFormat } from '../formatters/index.js';
import { chainOption, formatOption } from '../options/common.js';
import { offerIdOption, loanAmountOption, tokenOption } from '../options/frendlend-options.js';

export const frendlendAcceptLoanBuildCommand = Command.make(
    'build',
    {
        chain: chainOption,
        offerId: offerIdOption,
        loanAmount: loanAmountOption,
        token: tokenOption,
        format: formatOption,
    },
    ({ chain, offerId, loanAmount, token, format }) =>
        Effect.gen(function* () {
            if (!isChainId(chain)) {
                yield* Console.error(`Unsupported chain ID: ${chain}`);
                return;
            }

            // Validate token address
            const tokenResult = validateAddress(token);
            if (Either.isLeft(tokenResult)) {
                yield* Console.error(`Invalid token address: ${tokenResult.left.message}`);
                return;
            }

            // Validate loan amount
            const loanAmountResult = validateAmount(loanAmount);
            if (Either.isLeft(loanAmountResult)) {
                yield* Console.error(`Invalid loan amount: ${loanAmountResult.left.message}`);
                return;
            }

            // Validate offerId as BigInt
            let offerIdBigInt: bigint;
            try {
                offerIdBigInt = BigInt(offerId);
            } catch {
                yield* Console.error(`Invalid offer ID: ${offerId}. Must be a valid integer.`);
                return;
            }

            const params = {
                chainId: chain,
                offerId: offerIdBigInt,
            };

            const tx = yield* buildAcceptLoan(params, tokenResult.right, loanAmountResult.right);
            const output = formatTransaction(tx, params.chainId, format as OutputFormat);
            yield* Console.log(output);
        }),
).pipe(Command.withDescription('Build an unsigned acceptLoan transaction (no private key required)'));
