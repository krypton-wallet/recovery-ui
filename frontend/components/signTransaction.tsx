import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  Connection,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Button, Result } from "antd";
import bs58 from "bs58";
import { FC, useEffect, useState } from "react";
import React, { useCallback } from "react";
import { useGlobalState } from "../context";
import * as krypton from "../js/src/generated/index";
import { Typography } from "antd";

const { Text } = Typography;

export const SignTransaction: FC<{ pk: string | string[] | undefined }> = (
  pk_obj
) => {
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { finished, setFinished } = useGlobalState();
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signTransaction)
        throw new Error("Wallet does not support transaction signing!");

      const connection = new Connection("http://localhost:8899");

      const recoverPDA = new PublicKey(pk_obj.pk!);
      console.log("PK to recover: ", recoverPDA.toBase58());
      const profileAccount = await connection.getAccountInfo(recoverPDA);
      if (!profileAccount) {
        console.log("no profile account found");
        return;
      }
      const [profileHeader] =
        krypton.ProfileHeader.fromAccountInfo(profileAccount);
      console.log(profileHeader.recovery.toBase58());

      const newProfileAccount = await connection.getAccountInfo(
        profileHeader.recovery
      );
      if (!newProfileAccount) {
        console.log("no new profile account found");
        return;
      }
      const [newProfileHeader] =
        krypton.ProfileHeader.fromAccountInfo(newProfileAccount);
      console.log(newProfileHeader);
      const addRecoverySignIx = krypton.createAddRecoverySignInstruction({
        profileInfo: recoverPDA,
        authorityInfo: profileHeader.authority,
        newProfileInfo: profileHeader.recovery,
        newAuthorityInfo: newProfileHeader.authority,
        guardianInfo: publicKey,
      });

      let recentBlockhash = await connection.getLatestBlockhash();
      const addRecoverySignTx = new Transaction({
        feePayer: publicKey,
        ...recentBlockhash,
      });
      addRecoverySignTx.add(addRecoverySignIx);
      const signedTx = await signTransaction(addRecoverySignTx);
      const txid = await connection.sendRawTransaction(signedTx.serialize());
      await connection.confirmTransaction(
        {
          blockhash: recentBlockhash.blockhash,
          lastValidBlockHeight: recentBlockhash.lastValidBlockHeight,
          signature: txid,
        },
        "confirmed"
      );
      setSucceeded(true);
    } catch (err: any) {
      setSucceeded(false);
      setMsg(err.toString());
      console.error(err);
    }
    setFinished(true);
    setLoading(false);
  }, [setFinished, publicKey, signTransaction, pk_obj.pk]);

  return (
    <>
      {!loading && !finished && (
        <Button onClick={onClick}>Sign Transaction</Button>
      )}
      {loading && !finished && (
        <LoadingOutlined style={{ fontSize: 24 }} spin />
      )}
      {finished && succeeded && (
        <Result
          status="success"
          title="Successfully Signed!"
          subTitle="Notify your guardians that you have signed"
        />
      )}
      {finished && !succeeded && (
        <Result
          status="error"
          title="Signing Failed"
          subTitle="Please check if you are recovering the correct wallet"
          extra={<Button onClick={onClick}>Sign Again</Button>}
        >
          <div className="desc" style={{ textAlign: "center" }}>
            <Text type="danger">{msg}</Text>
          </div>
        </Result>
      )}
    </>
  );
};
