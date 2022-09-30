import { SubstrateExtrinsic } from "@subql/types";
import { SubstrateExtrinsicEntity } from "../types";
import {  JSONStringifyExt } from "../support/utils";
import { ParachainConstants } from "../constants";

export async function handleSubstrateExtrinsic(
  extrinsic: SubstrateExtrinsic
): Promise<SubstrateExtrinsicEntity> {
  let blockNumber = extrinsic.block.block.header.number.toBigInt();

  let section = extrinsic.extrinsic.method.section.toString();
  let method = extrinsic.extrinsic.method.method.toString();

  //SubstrateExtrinsicEntity
  let extrinsicEntity = new SubstrateExtrinsicEntity(
    `${blockNumber}-${extrinsic.idx}`
  );

  extrinsicEntity.block_number = blockNumber;
  extrinsicEntity.idx = extrinsic.idx;

  extrinsicEntity.section = section;
  extrinsicEntity.method = method;
  extrinsicEntity.name = section + "." + method;
  extrinsicEntity.args = JSONStringifyExt(extrinsic.extrinsic.args);

  extrinsicEntity.signer = extrinsic.extrinsic.signer.toString();
  extrinsicEntity.signature = extrinsic.extrinsic.signature.toString();
  extrinsicEntity.hash = extrinsic.extrinsic.hash.toString();
  extrinsicEntity.created_at = BigInt(new Date().getTime());
  extrinsicEntity.timestamp = BigInt(extrinsic.block.timestamp.getTime());
  // logger.info(
  //   `successCall-${blockNumber}`
  // );
  await extrinsicEntity.save();

  return extrinsicEntity;
}
