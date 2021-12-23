import { GameDataTypeMap, GameMessageSender, GameSendResult, mergeResults } from "@common/messaging/gameSender";
import { BasicMessageSender, DataSender } from "@common/messaging/sender";
import { PrismaPromise } from "@prisma/client";
import client from "../database/client";

export interface DatabaseTarget {
    gameId: number;
}

const callDatabase = async (targets: DatabaseTarget[], call: PrismaPromise<any>[] | PrismaPromise<any>): Promise<GameSendResult> => {
    const callArray = Array.isArray(call) ? call : [call];
    try {
        await client.$transaction(callArray);
        return { success: true };
    } catch(e) {
        console.error('Database call triggered by message failed');
        console.error(e);
        return { success: false };
    }
};

const databaseSender = <K extends keyof GameDataTypeMap>(dataType: K, call: (data: GameDataTypeMap[K]) => PrismaPromise<any>[] | PrismaPromise<any>): DataSender<GameDataTypeMap, DatabaseTarget, GameSendResult, K> => {
    return {
        dataType,
        send: (targets, data) => callDatabase(targets, call(data))
    };
}

export class DatabaseMessageSender extends BasicMessageSender<'all', GameDataTypeMap, DatabaseTarget, GameSendResult> {
    public gameId: number;
    
    constructor(gameId: number) {
        super();
        this.gameId = gameId;

        this.addSender(
            databaseSender('update-building', data => {
                const transaction = [];

                if (data.nodeId !== undefined || data.type !== undefined) {
                    transaction.push(
                        client.building.update({
                            where: { id: data.buildingId },
                                data: {
                                    nodeId: data.nodeId,
                                    type: data.type
                                }
                        })
                    )
                }

                // TODO: consider a more intelligent inventory update query
                if (data.inventory) {
                    transaction.push(client.inventoryItem.deleteMany({
                        where: { buildingId: data.buildingId }
                    }));

                    transaction.push(client.inventoryItem.createMany({
                        data: Object.entries(data.inventory).map(([itemId, count]) => ({
                            buildingId: data.buildingId,
                            itemId: parseInt(itemId),
                            count: count as number
                        }))
                    }));
                }
                
                return transaction;
            })
        );
    }

    merge(results: GameSendResult[]): GameSendResult {
        return mergeResults(results);
    }
}
