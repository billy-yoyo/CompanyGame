import { GameSendResult, GameTargetKey, GameDataTypeMap, mergeResults } from "@common/messaging/gameSender";
import { Message, MessageSender } from "@common/messaging/sender";
import { DatabaseMessageSender } from "./databaseSender";
import { WebsocketMessageSender } from "./websocketSender";

export class ServerMessageSender implements MessageSender<GameTargetKey, GameDataTypeMap, GameSendResult> {
    private gameId: number;
    private dbSender: DatabaseMessageSender;
    private wsSender: WebsocketMessageSender;

    constructor(gameId: number, dbSender: DatabaseMessageSender, wsSender: WebsocketMessageSender) {
        this.gameId = gameId;
        this.dbSender = dbSender;
        this.wsSender = wsSender;
    }

    merge(results: GameSendResult[]): GameSendResult {
        return mergeResults(results);
    }

    async send<K extends keyof GameDataTypeMap>(message: Message<GameDataTypeMap, GameTargetKey, K>): Promise<GameSendResult> {
        const dbResult = await this.dbSender.send({
            targets: ['all'],
            dataType: message.dataType,
            data: message.data
        });
        
        if (dbResult.success) {
            return await this.wsSender.send(message);
        } else {
            return dbResult;
        }
    }
}
