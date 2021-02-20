import { Queue } from "./helpers/Queue";
import { delay } from "./helpers/Utils";

export class Node {
    constructor(private _id: string) {}
    
    get id() {
        return this._id
    }

    receiveBytes(bytes: number) {
        console.log(this._id," : This node received data:", bytes)
    } 
}
export class FullDuplexChannel {
    txQueue: Queue<number>  = new Queue<number>()
    rxQueue: Queue<number>  = new Queue<number>()
    nodes: Node[] = []


    attachNode(node: Node) {
        if(this.nodes.length >= 2) {
            throw new Error("P2P Channel No more that 2 nodes")
            return
        }

        this.nodes.push(node)
    }

    async sendMasterToSlave(bytes: number) {
        this.txQueue.push(bytes)
        await delay(100)
        const data = this.txQueue.pop()
        if(data) {
            this.nodes[1].receiveBytes(data)
        }
    }
    async sendSlaveToMaster(bytes: number) {
        this.rxQueue.push(bytes)
        await delay(100)
        const data = this.rxQueue.pop()
        if(data) {
            this.nodes[0].receiveBytes(data)
        }
    }
}