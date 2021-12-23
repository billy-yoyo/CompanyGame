import { BasicMessageSender } from "./sender";
import * as msg from "../models/message";
import T, { Template, ModelType } from "tsplate";

export type GameTargetKey = 
      `user:${number}` 
    | 'user:public'
    | `company:${number}`
    | 'company:public'
    | `corp:${number}`
    | 'corp:public'
    | `country:${number}`
    | 'country:public'
    | `node:${number}`
    | 'node:public'
    | `building:${number}`
    | 'building:public'
    | 'game';

export const GameDataTypeTemplates = {
    'update-building': msg.TUpdateBuilding,
    'update-item': msg.TUpdateItem,
    'update-vertex': msg.TUpdateVertex,
    'update-zone': msg.TUpdateZone,
    'update-owner': msg.TUpdateOwner,
    'update-stake': msg.TUpdateStake,
    'update-company': msg.TUpdateCompany,
    'update-corporation': msg.TUpdateCorporation,
    'update-user': msg.TUpdateUser,
    'update-connection': msg.TUpdateConnection,
    'update-node': msg.TUpdateNode,
    'update-country': msg.TUpdateCountry,
    'update-person': msg.TUpdatePerson,
    'update-graph': msg.TUpdateGraph,
    'update-game': msg.TUpdateGame
} as const;
export type GameDataTemplateKey = keyof typeof GameDataTypeTemplates;

export interface Packet<K extends GameDataTemplateKey> {
    dataType: K;
    data: GameDataTypeMap[K];
}

export const TPacket: Template<Packet<GameDataTemplateKey>, any> = {
    valid: (o): o is Packet<GameDataTemplateKey> => Object.keys(GameDataTypeTemplates).includes(o.dataType) 
        && GameDataTypeTemplates[o.dataType as GameDataTemplateKey].valid(o.data),
    toModel: (o) => ({ dataType: o.dataType, data: GameDataTypeTemplates[o.dataType as GameDataTemplateKey].toModel(o.data) }),
    toTransit: (packet) => ({ dataType: packet.dataType, data: GameDataTypeTemplates[packet.dataType].toTransit(packet.data as any) })
};

export type GameDataTypeMap = {[key in GameDataTemplateKey]: ModelType<(typeof GameDataTypeTemplates)[key]>};

export type GameDataType = keyof GameDataTypeMap;
export type GameData<dataType extends GameDataType> = (GameDataTypeMap)[dataType];

export interface GameSendResult {
    success: boolean;
}

export const mergeResults = (results: GameSendResult[]): GameSendResult => {
    if (results.length === 0) {
        return { success: true };
    } else if (results.length === 1) {
        return results[0];
    } else {
        return {
            success: results.every(r => r.success)
        };
    }
}

export class GameMessageSender<T> extends BasicMessageSender<GameTargetKey, GameDataTypeMap, T, GameSendResult> {
    merge(results: GameSendResult[]): GameSendResult {
        return mergeResults(results);
    }
}
