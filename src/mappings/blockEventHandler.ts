import { SubstrateEvent } from "@subql/types";
import { HrmpChannel, SubstrateEventEntity } from "../types";
import { JSONStringifyExt } from "../support/utils";

export async function handleSubstrateEvent(
  event: SubstrateEvent
): Promise<SubstrateEventEntity> {
  let blockNumber = event.block.block.header.number.toBigInt();
  if (!event) {
    return null;
  }
  let evt_method = event.event.method;
  let evt_section = event.event.section;

  let event_id = `${blockNumber}-${event.idx}`;

  let eventEntity = new SubstrateEventEntity(event_id);

  eventEntity.block_number = blockNumber;

  if (event.extrinsic) {
    eventEntity.extrinsic = `${blockNumber}-${event.extrinsic.idx}`;
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
  await eventEntity.save();

  return eventEntity;
}

export async function hrmpEvents(
  event: SubstrateEvent
) {
  if (!event) {
    return null;
  }
  
  let blockNumber = event.block.block.header.number.toBigInt();
  let evtMethod = event.event.method;
  let evtId = `${blockNumber}-${event.idx}`;
  if (event.event.data) {
    // https://polkadot.subscan.io/runtime/Hrmp?version=9281
    let dataJson = event.event.data.toJSON();
    switch (evtMethod) {
      case 'OpenChannelRequested':
        const newHrmp = new HrmpChannel(`${dataJson[0]}-${dataJson[1]}`);
        newHrmp.sender = dataJson[0];
        newHrmp.recipient = dataJson[1];
        newHrmp.proposedMaxCapacity = BigInt(dataJson[2]);
        newHrmp.proposedMaxMessageSize = BigInt(dataJson[3]);
        newHrmp.requestedEventId = evtId;
        newHrmp.status = 'OpenChannelRequested'
        await newHrmp.save();
        break;

      case 'OpenChannelAccepted':
        const requestedHrmp = await HrmpChannel.get(`${dataJson[0]}-${dataJson[1]}`);
        if (!requestedHrmp) {
          logger.error(`missing OpenChannelRequested ${JSONStringifyExt(dataJson)}`);
          break;
        }
        requestedHrmp.acceptedEventId = evtId;
        requestedHrmp.status = 'OpenChannelAccepted'
        await requestedHrmp.save();
        break;
    
      case 'OpenChannelCanceled':
        const requestedHrmp2 = await HrmpChannel.get(`${dataJson[1]?.['sender']}-${dataJson[1]?.['recipient']}`);
        if (!requestedHrmp2) {
          logger.error(`missing OpenChannelRequested ${JSONStringifyExt(dataJson)}`)
          break;
        }
        requestedHrmp2.canceledEventId = evtId;
        requestedHrmp2.status = 'OpenChannelCanceled'
        await requestedHrmp.save();

      case 'ChannelClosed':
        const requestedHrmp3 = await HrmpChannel.get(`${dataJson[1]?.['sender']}-${dataJson[1]?.['recipient']}`);
        if (!requestedHrmp3) {
          logger.error(`missing OpenChannelRequested ${JSONStringifyExt(dataJson)}`)
          break;
        }
        requestedHrmp3.closedEventId = evtId;
        requestedHrmp3.status = 'ChannelClosed'
        await requestedHrmp.save();

      default:
        break;
    }
  }
}