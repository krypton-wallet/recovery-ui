import React, { useState } from "react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import 'antd/dist/antd.css';
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { GlobalContext } from "../context";
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }: AppProps) {
  const [network, setNetwork] = useState<Cluster | undefined>("devnet");
  const [account, setAccount] = useState<Keypair | null>(null);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [guardians, setGuardians] = useState<Array<PublicKey>>([]);

  return (
    <GlobalContext.Provider value={{ network, setNetwork, account, setAccount, mnemonic, setMnemonic, balance, setBalance, guardians, setGuardians }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GlobalContext.Provider>
  )
}
export default MyApp
