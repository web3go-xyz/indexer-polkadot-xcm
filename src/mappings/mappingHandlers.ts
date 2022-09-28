import {
  SubstrateBlock,
  SubstrateExtrinsic,
  SubstrateEvent,
} from "@subql/types";

import { handleBlockStorage } from "./blockStorageHandler";
import { handleSubstrateExtrinsic } from "./blockExtrinsicHandler";

import { ParachainConstants } from "../constants";
import { handleSubstrateEvent } from "./blockEventHandler";

// export async function handleBlock(block: SubstrateBlock): Promise<void> {
//   let blockNumber = block.block.header.number.toBigInt();
//   logger.debug(`handleBlock blockNumber: ${blockNumber}`);
//   await handleBlockStorage(block);
// }

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {

  let blockNumber = extrinsic.block.block.header.number.toBigInt();

  let section = extrinsic.extrinsic.method.section.toString().toLowerCase();
  let method = extrinsic.extrinsic.method.method.toString().toLowerCase();

  
  if (section == 'dmp' || section == 'hrmp' || section == 'ump' || section == 'parainherent' || section == 'xcmpallet') {
    // logger.info(
    //   `[automationTime] handleCall blockNumber: ${blockNumber} section.method: ${section}.${method}`
    // );
    await handleSubstrateExtrinsic(extrinsic);
    for (const e of extrinsic.events as any) {
      await handleSubstrateEvent(e);
    }
  }
}

// export async function handleEvent(event: SubstrateEvent): Promise<void> {

//   let blockNumber = event.block.block.header.number.toBigInt();

//   let evt_method = event.event.method.toLowerCase();
//   let evt_section = event.event.section.toLowerCase();

//   if (evt_section == 'dmp' || evt_section == 'hrmp' || evt_section == 'ump' || evt_section == 'parainherent' || evt_section == 'xcmpallet') {
//     logger.info(
//       `[automationTime] handleEvent blockNumber: ${blockNumber} section.method: ${evt_section}.${evt_method}`
//     );
//     await handleSubstrateEvent(event);
//   }

// }
