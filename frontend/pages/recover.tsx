import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Form, Input, Button } from "antd";
import { useGlobalState } from "../context";
import { LoadingOutlined } from "@ant-design/icons";
import styled from "styled-components";

import { Keypair } from "@solana/web3.js";
import { SignTransaction } from "../components/signTransaction";
import { ContextProvider } from "../components/ContextProvider";
import { WalletMultiButton } from "@solana/wallet-adapter-ant-design";
import WalletContextProvider from "../components/WalletContextProvider";

// Import the Keypair class from Solana's web3.js library:

const Recover: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const { account, setAccount, setMnemonic } = useGlobalState();

  const onRecover = () => {};

  useEffect(() => {
    if (account) {
      router.push("/wallet");
    }
  }, [account, router]);

  return (
    <>
      <h1 className={"title"}>Recover wallet with your guardians</h1>

      <p>
        Generate a recovery link and send it to your guardians for them to sign
      </p>

      <WalletContextProvider>
        <WalletMultiButton />
        <SignTransaction />
      </WalletContextProvider>

      {/* {!loading && (
        <Button type="primary" onClick={onRecover}>
          Recover
        </Button>
      )} */}

      {loading && <LoadingOutlined style={{ fontSize: 24 }} spin />}
    </>
  );
};

export default Recover;
