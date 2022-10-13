import { ApiPromise } from "@polkadot/api";
import { hexToU8a } from "@polkadot/util";

// https://github.com/polkadot-js/api/blob/v9.3.3/packages/types-augment/src/lookup/types-polkadot.ts#L1560
export function decodeXCMGeneric(provider: ApiPromise, message: any, type: number) {
    let instructions;
    switch (type) {
        case 0:
            // XCM going to the Relay Chain (UMP)
            // this.logger.log(`Blake2 hash of message is: ${u8aToHex(blake2AsU8a(message))}\n`);
            instructions = provider.createType("XcmVersionedXcm", message) as any;
            this.logger.debug(instructions);
            return instructions;
        case 1:
            // XCM going from the Relay Chain to a Parachain (DMP)
            // this.logger.log(`Blake2 hash of message is: ${u8aToHex(blake2AsU8a(message.msg))}\n`);
            instructions = provider.createType("XcmVersionedXcm", message.msg) as any;
            this.logger.debug(instructions);
            return instructions;
        case 2:
            // XCM going from a Parachain to another Parachain (HRMP/XCMP)
            // First byte is a format version that creates problme when decoding it as XcmVersionedXcm
            // We remove it
            const data = hexToU8a(message.data); // Must convert to bytes
            // this.logger.log(`Blake2 hash of message is: ${u8aToHex(blake2AsU8a(data.slice(1)))}\n`);
            instructions = provider.createType("XcmVersionedXcm", data.slice(1)) as any;
            this.logger.debug(instructions);
            return instructions;
        default:
            throw new Error(`Not supporting this particular scenario! ${message}`)
    }
}