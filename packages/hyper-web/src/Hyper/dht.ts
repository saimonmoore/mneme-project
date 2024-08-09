import React, { useEffect, useState, useContext, createContext } from 'react'
//@ts-expect-error
import DHTRelay from '@hyperswarm/dht-relay'
//@ts-expect-error
import Stream from '@hyperswarm/dht-relay/ws'
//@ts-expect-error
import safetyCatch from 'safety-catch'
import { primaryKey } from './key.js'
import { DHT_RELAY_ADDRESS } from '../config/constants';

// + add more relays
// + should detect WebSocket errors, etc to retry a different relay

interface DHTContext {
  dht?: DHTRelay;
}
const DHTContext = createContext<DHTContext>({});

interface DHTProps {
  url?: string;
  keyPair?: any;
  children: React.ReactNode;
}

export const DHT = ({ children, url, keyPair, ...options }: DHTProps) => {
  const [dht, setDHT] = useState(null)
  console.log('[DHT] ====> ', { dht });

  useEffect(() => {
    console.log('[DHT#useEffect] => ')
    const ws = new window.WebSocket(url || DHT_RELAY_ADDRESS)
    const stream = new Stream(true, ws)

    keyPair = keyPair || DHTRelay.keyPair(primaryKey)

    const relay = new DHTRelay(stream, { keyPair, ...options })
    console.log('[DHT#useEffect] ====> ', { ws, stream, primaryKey, keyPair, relay });
    setDHT(relay)

    return () => {
      relay.destroy().catch(safetyCatch)
    }
  }, [keyPair])

  return React.createElement(
    DHTContext.Provider,
    {
      value: { dht }
    },
    children
  )
}

export const useDHT = () => {
  const context = useContext(DHTContext)

  if (context === undefined) {
    throw new Error('useDHT must be used within a DHT component')
  }

  return context
}