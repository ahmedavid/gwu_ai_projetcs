import React from 'react'
import { FullDuplexChannel, Node } from './FullDuplexChannel'

const master = new Node("A")
const slave = new Node("B")
const channel = new FullDuplexChannel()
channel.attachNode(master)
channel.attachNode(slave)

channel.sendMasterToSlave(101)
channel.sendMasterToSlave(102)
channel.sendSlaveToMaster(20)


const NetSim = () => {
    return (
        <div>
            <h1>NETSIM</h1>

        </div>
    )
}

export default NetSim