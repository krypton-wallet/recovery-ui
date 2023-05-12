import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { Button, Result } from "antd";
import bs58 from "bs58";
import { FC, useEffect, useState } from "react";
import React, { useCallback } from "react";
import { useGlobalState } from "../context";
import * as krypton from "../../js/src/generated/index";
import { Typography } from 'antd';

const { Text } = Typography;

export const SignTransaction: FC<{ pk: string | string[] | undefined }> = (
  pk_obj
) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, sendTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const { finished, setFinished } = useGlobalState()
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [msg, setMsg] = useState<any>("");

  useEffect(() => {
    console.log("changed msg: ", msg)
  }, [msg])

  const onClick = useCallback(async () => {
    try {
      setLoading(true);
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signTransaction)
        throw new Error("Wallet does not support transaction signing!");

      const recoverPDA = new PublicKey(pk_obj.pk!);
      console.log("PK to recover: ", recoverPDA);
      const profileAccount = await connection.getAccountInfo(recoverPDA);
      if (!profileAccount) {
        console.log("no profile account found");
        return;
      }
      const [profileHeader] = krypton.ProfileHeader.fromAccountInfo(profileAccount);

      const newProfileAccount = await connection.getAccountInfo(profileHeader.recovery);
      if (!newProfileAccount) {
        console.log("no new profile account found");
        return;
      }
      const [newProfileHeader] = krypton.ProfileHeader.fromAccountInfo(newProfileAccount);

      const addRecoverySignIx = krypton.createAddRecoverySignInstruction({
        profileInfo: recoverPDA,
        authorityInfo: profileHeader.authority,
        newProfileInfo: profileHeader.recovery,
        newAuthorityInfo: newProfileHeader.authority,
        guardianInfo: publicKey
      });

      let tx = new Transaction().add(addRecoverySignIx);
      tx = await signTransaction(tx);
      const signature = await sendTransaction(tx, connection);
      const res = await connection.confirmTransaction(signature, 'confirmed');
      console.log("res: ", res);
      setSucceeded(true);
    } catch (err: any) {
      setSucceeded(false);
      setMsg(err.toString());
      console.error(err);
    }
    setFinished(true);
    setLoading(false);
  }, [publicKey, signTransaction, connection]);

  return (
    <>
      {!loading && !finished && (
        <Button onClick={onClick}>Sign Transaction</Button>
      )}
      {loading && !finished && <LoadingOutlined style={{ fontSize: 24 }} spin />}
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
          extra={[<Button onClick={onClick}>Sign Again</Button>]}
        >
          <div className="desc" style={{textAlign: "center"}}>
            <Text type="danger">{msg}</Text>
          </div>
        </Result>
      )}
    </>
  );
};
