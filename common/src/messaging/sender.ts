
export type MessageTarget = string;

export interface Message<MD, MT extends string, K extends keyof MD> {
    targets: MT[];
    dataType: K;
    data: MD[K];
}

export interface DataSender<MD, T, R, K extends keyof MD> {
    dataType: K;
    send(targets: T[], data: MD[K]): Promise<R>;
}

export interface GlobalDataSender<MD, T, R> {
    send<K extends keyof MD>(type: K, targets: T[], data: MD[K]): Promise<R>;
}

export interface MessageSender<MT extends MessageTarget, MD, R> {
    /* merge should take a list of results from senders and produce a merged result
       an empty list should represent the result for a message which had no senders */
    merge(results: R[]): R;
    send(message: Message<MD, MT, keyof MD>): Promise<R>;
}

export abstract class BasicMessageSender<MT extends MessageTarget, MD, T, R> implements MessageSender<MT, MD, R> {
    private targets: {[key: number]: T} = {}
    private targetKeys: {[key: string]: number[]} = {};
    private globalTargets: number[] = [];
    private senders: {[dataType in keyof MD]?: DataSender<MD, T, any, keyof MD>[]} = {};
    private globalSenders: GlobalDataSender<MD, T, R>[] = [];

    addGlobalSender(receiver: GlobalDataSender<MD, T, R>): MessageSender<MT, MD, R> {
        this.globalSenders.push(receiver);
        return this;
    }

    addSender<K extends keyof MD>(receiver: DataSender<MD, T, R, K>): MessageSender<MT, MD, R> {
        if (this.senders[receiver.dataType] === undefined) {
            this.senders[receiver.dataType] = [];
        }
        this.senders[receiver.dataType]?.push(receiver);
        return this;
    }

    addGlobalTarget(id: number, target: T): MessageSender<MT, MD, R> {
        this.targets[id] = target;
        this.globalTargets.push(id);
        return this;
    }

    addTarget(id: number, keys: MT[], target: T): MessageSender<MT, MD, R> {
        this.targets[id] = target;
        keys.forEach(key => {
            if (this.targetKeys[key] === undefined) {
                this.targetKeys[key] = [];
            }
            this.targetKeys[key].push(id);
        })
        return this;
    }

    async send<K extends keyof MD>(message: Message<MD, MT, K>): Promise<R> {
        const senders = this.senders[message.dataType] ?? [];
        if (senders.length > 0 || this.globalSenders.length > 0) {
            const targetIds = new Set<number>();
            message.targets.forEach(key => {
                const keyIds = this.targetKeys[key];
                if (keyIds !== undefined) {
                    keyIds.forEach(id => targetIds.add(id));
                }
            });
            this.globalTargets.forEach(id => targetIds.add(id));

            let targets = Array.from(targetIds.values())
                .map(id => this.targets[id])
                .filter(x => x !== undefined);
        
            const results: R[] = [];
            for (let sender of senders) {
                const result = await sender.send(targets, message.data);
                results.push(result);
            }
            for (let sender of this.globalSenders) {
                const result = await sender.send(message.dataType, targets, message.data);
                results.push(result);
            }
            return this.merge(results);
        } else {
            console.warn(`No senders registed for data type ${message.dataType}`);
        }
        return this.merge([]);
    }

    abstract merge(results: R[]): R;
}
