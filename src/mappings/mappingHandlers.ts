import {
  SubstrateBlock,
  SubstrateExtrinsic,
  SubstrateEvent,
} from "@subql/types";

import { handleBlockStorage } from "./blockStorageHandler";
import { handleSubstrateExtrinsic, xcmPalletExtrinsics } from "./blockExtrinsicHandler";
import { handleSubstrateEvent, hrmpEvents } from "./blockEventHandler";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  await handleBlockStorage(block);
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  await handleSubstrateExtrinsic(extrinsic);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  await handleSubstrateEvent(event);
}

export const handleHrmpEvents = hrmpEvents;

export const handleXcmPalletExtrinsics = xcmPalletExtrinsics;