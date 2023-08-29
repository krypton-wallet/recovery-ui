import { LoadingOutlined } from "@ant-design/icons";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { Button, Result } from "antd";
import Text from "antd/lib/typography/Text";
import { Dispatch, FC, SetStateAction, useCallback, useState } from "react";
import * as krypton from "../js/src/generated/index";

export const SignTransaction: FC<{
  pk: string | string[] | undefined;
  finished: boolean;
  setFinished: Dispatch<SetStateAction<boolean>>;
}> = ({ pk, finished, setFinished }) => {
  const { publicKey, signTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>("");

  const onClick = useCallback(async () => {
    try {
      setLoading(true);

      if (!publicKey) {
        throw new Error("Wallet not connected!");
      }

      if (!pk) {
        throw new Error("Invalid recovery PublicKey");
      }

      if (!signTransaction) {
        throw new Error("Wallet does not support transaction signing!");
      }

      const connection = new Connection("http://localhost:8899");

      const recoverPDA = new PublicKey(pk);
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
  }, [setFinished, publicKey, signTransaction, pk]);

  return (
    <>
      {!finished &&
        (loading ? (
          <LoadingOutlined style={{ fontSize: 24 }} spin />
        ) : (
          <Button onClick={onClick}>Sign Transaction</Button>
        ))}
      {finished &&
        (succeeded ? (
          <Result
            status="success"
            title="Successfully Signed!"
            subTitle="Notify your guardians that you have signed"
            style={{ padding: 0 }}
          />
        ) : (
          <Result
            status="error"
            title="Signing Failed"
            subTitle="Please check if you are recovering the correct wallet"
            extra={<Button onClick={onClick}>Sign Again</Button>}
            style={{ padding: 0 }}
          >
            <div style={{ textAlign: "center" }}>
              <Text type="danger">{msg}</Text>
            </div>
          </Result>
        ))}
    </>
  );
};
