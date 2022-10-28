import {
  SubstrateBlock,
  SubstrateExtrinsic,
  SubstrateEvent,
} from "@subql/types";

import { handleBlockStorage } from "./blockStorageHandler";
import { handleSubstrateExtrinsic } from "./blockExtrinsicHandler";
import { handleSubstrateEvent } from "./blockEventHandler";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  await handleBlockStorage(block);
}

export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
  await handleSubstrateExtrinsic(extrinsic);
}

export async function handleEvent(event: SubstrateEvent): Promise<void> {
  await handleSubstrateEvent(event);
}