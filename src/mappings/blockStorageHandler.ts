import { SubstrateBlock } from "@subql/types";
import { SubstrateBlockEntity } from "../types";

export async function handleBlockStorage(
  block: SubstrateBlock
): Promise<SubstrateBlockEntity> {
  let blockNumber = block.block.header.number.toBigInt();

  //SubstrateBlockEntity
  let blockEntity = new SubstrateBlockEntity(`${blockNumber}`);
  blockEntity.block_number = blockNumber;

  blockEntity.timestamp = BigInt(block.timestamp.getTime());
  blockEntity.hash = block.block.hash.toString();
  blockEntity.runtime_version = block.specVersion;
  blockEntity.created_at = BigInt(new Date().getTime());
  await blockEntity.save();
  return blockEntity;
}
