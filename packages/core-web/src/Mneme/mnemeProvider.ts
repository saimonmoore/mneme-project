import React, { useEffect, useState, useContext, createContext } from 'react'
//@ts-expect-error
import safetyCatch from 'safety-catch'
import { useDHT, RAM } from '@mneme/core-web';
import { Mneme, User } from '@mneme/core';

interface MnemeContext {
  mneme?: Mneme;
}
const MnemeContext = createContext<MnemeContext>({});

const listeners = [
  {
    event: Mneme.EVENTS.USER_LOGIN, callback: (user: User) => {
      console.log("info: You are now logged in...", { user: user.email });
      console.log();
      console.log(
        "info: Use the following key to synchronise Mneme to your other devices: ",
        // @ts-expect-error
        this!.outOfBandSyncKey
      );
    }
  },
  {
    event: Mneme.EVENTS.MNEME_READY, callback: () => {
      console.log("info: Mneme is ready for business!");
    }
  },
];

interface MnemeProps {
  children: React.ReactNode;
}

export const MnemeProvider = ({ children }: MnemeProps) => {
  const [mneme, setMneme] = useState<Mneme>()
  const { dht } = useDHT();

  console.log('[MnemeProvider] ====> ', { mneme });

  useEffect(() => {
    console.log('[MnemeProvider#useEffect] => ')
    let mneme: Mneme;

    if (!dht) return;

    console.log('[MnemeProvider#useEffect] =========> GOT DHT: ', { dht });

    async function startMneme() {
      // Main mneme instance (not bootstrapped)
      mneme = new Mneme(undefined, RAM, undefined, dht, listeners);

      setMneme(mneme);

      await mneme.start();

      console.log('[MnemeProvider#useEffect] =========> Started Mneme: ', { mneme });
    }

    startMneme();

    return () => {
      mneme?.destroy().catch(safetyCatch)
    }

  }, [dht]);

  return React.createElement(
    MnemeContext.Provider,
    {
      value: { mneme }
    },
    children
  )
}

export const useMneme = () => {
  const context = useContext(MnemeContext)

  if (context === undefined) {
    throw new Error('useMneme must be used within a MnemeProvider component')
  }

  return context
}
