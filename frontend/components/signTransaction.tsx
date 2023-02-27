import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  PublicKey,
  sendAndConfirmTransaction,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Button } from "antd";
import bs58 from "bs58";
import { FC, Props, useContext } from "react";
import React, { useCallback } from "react";
import Axios from "axios";
import { useGlobalState } from "../context";
import base58 from "bs58";

export const SignTransaction: FC<{ pk: string | string[] | undefined }> = (
  pk_obj
) => {
  const { connection } = useConnection();
  const { publicKey, signTransaction } = useWallet();
  const programId = new PublicKey(
    "2aJqX3GKRPAsfByeMkL7y9SqAGmCQEnakbuHJBdxGaDL"
  );

  const onClick = useCallback(async () => {
    try {
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signTransaction)
        throw new Error("Wallet does not support transaction signing!");

      const pk = pk_obj.pk;
      console.log("PK to recover: ", pk);

      const res = await Axios.get("http://localhost:5000/api/getFromPk/" + pk);
      const res_data = res.data[0];
      if (res_data == undefined) {
        throw new Error("Invalid signing request!");
      }
      console.log("PK new: ", res_data.new_pk);

      let transactionBased64 = res_data.transaction;
      let transaction = Transaction.from(
        Buffer.from(transactionBased64, "base64")
      );
      console.log("OLD SIGNATURES");
      for (var i = 0; i < transaction.signatures.length; i++) {
        console.log(
          `pk ${i}: ${transaction.signatures[
            i
          ].publicKey.toBase58()} \nsignature ${i}: `,
          transaction.signatures[i].signature?.toString("base64")
        );
      }

      console.log("Signing to recover...");
      transaction = await signTransaction(transaction);

      console.log("NEW SIGNATURES");
      for (var i = 0; i < transaction.signatures.length; i++) {
        console.log(
          `pk ${i}: ${transaction.signatures[
            i
          ].publicKey.toBase58()} \nsignature ${i}: `,
          transaction.signatures[i].signature?.toString("base64")
        );
      }

      // If signature threshold is reached, then we can verify the signatures &
      // transfer+close
      if (res_data.sig_remain == 1) {
        console.log("THRES REACHED");
      }
      const serializedTx = transaction.serialize({
        requireAllSignatures: false,
      });
      const txBased64 = serializedTx.toString("base64");
      await Axios.post("http://localhost:5000/api/update", {
        pk: pk,
        new_transaction: txBased64,
      }).then((res) => {
        console.log(res);
      });
    } catch (err: unknown) {
      console.error(err);
    }
  }, [publicKey, signTransaction, connection]);

  return <Button onClick={onClick}>Sign Transaction</Button>;
};
