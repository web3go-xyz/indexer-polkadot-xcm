import { SubstrateEvent, SubstrateExtrinsic } from "@subql/types";
import { SubstrateEventEntity, SubstrateExtrinsicEntity } from "../types";
import { getID, JSONStringifyExt } from "../support/utils";
import { ParachainConstants } from "../constants";

export async function handleSubstrateEvent(
  event: SubstrateEvent
): Promise<SubstrateEventEntity> {
  let blockNumber = event.block.block.header.number.toBigInt();
  if (!event) {
    return null;
  }
  let evt_method = event.event.method;
  let evt_section = event.event.section;
  
  let eventEntity = new SubstrateEventEntity(`${blockNumber}-${getID()}`);

  eventEntity.block_number = blockNumber;

  if (event.extrinsic) {
    eventEntity.extrinsic_hash = event.extrinsic.extrinsic.hash.toString();
  }

  eventEntity.idx = event.idx;
  eventEntity.section = evt_section;
  eventEntity.method = evt_method;
  eventEntity.name = evt_section + "." + evt_method;

  if (event.event.data) {
    let dataJson = event.event.data.toJSON();
    eventEntity.data = JSONStringifyExt(dataJson);
  }
  eventEntity.created_at = BigInt(new Date().getTime());
  eventEntity.timestamp = BigInt(event.block.timestamp.getTime());
  // logger.info(
  //   `successEvent-${blockNumber}`
  // );
  await eventEntity.save();

  return eventEntity;
}
