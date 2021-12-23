import { Packet, TPacket, GameDataTypeMap, GameMessageSender, GameSendResult } from "@common/messaging/gameSender";
import { GlobalDataSender } from "@common/messaging/sender";

export interface WebsocketTarget {
    userId: number;
    connectionId: number;
    socket: WebSocket;
}

const encodePacket = <K extends keyof GameDataTypeMap>(dataType: K, data: GameDataTypeMap[K]): string | ArrayBufferLike | Blob | ArrayBufferView => {
    const packet: Packet<K> = { dataType, data };
    return JSON.stringify(TPacket.toTransit(packet));
};

const websocketSender: GlobalDataSender<GameDataTypeMap, WebsocketTarget, GameSendResult> = {
    send: async <K extends keyof GameDataTypeMap>(dataType: K, targets: WebsocketTarget[], data: GameDataTypeMap[K]): Promise<GameSendResult> => {
        // TODO: consider what to do if a websocket fails
        targets.forEach(target => {
            try {
                target.socket.send(encodePacket(dataType, data));
            } catch (e) {
                console.warn(`Failed to send data to target ${target.userId} (connection: ${target.connectionId})`);
            }
        });
        return { success: true };
    }
}

export class WebsocketMessageSender extends GameMessageSender<WebsocketTarget> {
    constructor() {
        super();
        this.addGlobalSender(websocketSender);
    }
}
