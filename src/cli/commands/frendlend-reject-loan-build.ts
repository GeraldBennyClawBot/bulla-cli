import { Command } from '@effect/cli';
import { Console, Effect } from 'effect';
import { buildRejectLoanOffer } from '../../application/services/frendlend-service.js';
import { isChainId } from '../../domain/types/eth.js';
import { formatTransaction, type OutputFormat } from '../formatters/index.js';
import { chainOption, formatOption } from '../options/common.js';
import { offerIdOption } from '../options/frendlend-options.js';

export const frendlendRejectLoanBuildCommand = Command.make(
    'build',
    {
        chain: chainOption,
        offerId: offerIdOption,
        format: formatOption,
    },
    ({ chain, offerId, format }) =>
        Effect.gen(function* () {
            if (!isChainId(chain)) {
                yield* Console.error(`Unsupported chain ID: ${chain}`);
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

            const tx = yield* buildRejectLoanOffer(params);
            const output = formatTransaction(tx, params.chainId, format as OutputFormat);
            yield* Console.log(output);
        }),
).pipe(Command.withDescription('Build an unsigned rejectLoanOffer transaction (no private key required)'));
