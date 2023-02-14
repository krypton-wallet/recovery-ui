import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { Button, Alert, Popconfirm, Form, Input, Radio } from "antd";
import PhraseBox from "../components/PhraseBox";
import { useGlobalState } from "../context";
import { LoadingOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

// Import Bip39 to generate a phrase and convert it to a seed:
import * as Bip39 from "bip39";
import {
  Connection,
  Keypair,
  NONCE_ACCOUNT_LENGTH,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import Paragraph from "antd/lib/skeleton/Paragraph";
import { Box } from "../styles/StyledComponents.styles";
import form from "antd/lib/form";

const BN = require("bn.js");

const guard1_sk = new Uint8Array([
  219, 192, 245, 18, 33, 148, 209, 236, 79, 88, 130, 250, 118, 164, 109, 172,
  44, 165, 195, 136, 163, 187, 142, 184, 86, 208, 221, 3, 162, 127, 89, 82, 164,
  161, 91, 84, 42, 199, 40, 204, 137, 172, 179, 152, 212, 17, 58, 31, 149, 133,
  67, 96, 23, 111, 83, 3, 119, 19, 37, 234, 163, 216, 53, 177,
]);

const guard2_sk = new Uint8Array([
  16, 5, 214, 175, 105, 238, 18, 14, 125, 4, 242, 215, 158, 179, 200, 230, 230,
  16, 36, 227, 200, 142, 130, 53, 235, 159, 100, 69, 177, 36, 239, 113, 42, 210,
  117, 85, 113, 159, 206, 119, 128, 70, 103, 49, 182, 66, 56, 157, 83, 23, 35,
  230, 206, 33, 216, 246, 225, 4, 210, 157, 161, 122, 142, 66,
]);

const guard3_sk = new Uint8Array([
  94, 98, 75, 17, 140, 107, 60, 66, 202, 114, 237, 8, 118, 129, 7, 68, 173, 6,
  106, 131, 118, 72, 208, 174, 113, 231, 127, 154, 50, 191, 223, 209, 194, 4,
  95, 55, 179, 216, 90, 90, 229, 27, 131, 112, 116, 110, 129, 176, 218, 139,
  146, 221, 75, 148, 197, 54, 113, 159, 226, 239, 52, 43, 19, 81,
]);

const feePayer_sk = new Uint8Array([
  224, 131, 102, 17, 253, 180, 120, 225, 108, 185, 213, 41, 80, 21, 207, 1, 78,
  99, 180, 118, 25, 132, 107, 110, 26, 127, 14, 233, 17, 223, 177, 54, 101, 47,
  4, 56, 92, 104, 178, 192, 225, 215, 164, 204, 220, 140, 10, 105, 204, 170, 96,
  130, 117, 57, 231, 233, 104, 23, 140, 129, 15, 25, 53, 178,
]);

const Signup: NextPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const {
    setAccount,
    account,
    mnemonic,
    setMnemonic,
    setGuardians,
    guardians,
    setPDA,
    pda,
    programId,
    setProgramId
  } = useGlobalState();

  const router = useRouter();
  const [form] = Form.useForm();
  

  useEffect(() => {
    // const guard1 = Keypair.fromSecretKey(guard1_sk);
    // const guard2 = Keypair.fromSecretKey(guard2_sk);
    // const guard3 = Keypair.fromSecretKey(guard3_sk);
    // const feePayer = Keypair.fromSecretKey(feePayer_sk);
    const program_id = new PublicKey(
      "2aJqX3GKRPAsfByeMkL7y9SqAGmCQEnakbuHJBdxGaDL"
    );
    const feePayer = new Keypair();
    const profile_pda = PublicKey.findProgramAddressSync(
      [Buffer.from("profile", "utf-8"), feePayer.publicKey.toBuffer()],
      program_id ?? new Keypair().publicKey
    );

    setProgramId(program_id);
    setAccount(feePayer);
    setPDA(profile_pda[0]);
  }, []);

  const showPopconfirm = () => {
    setVisible(true);
  };

  // const handleOk = () => {
  //   //form.submit();
  //   setLoading(true);
  //   router.push("/wallet");
  // };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleOk = async () => {
    setLoading(true);
    const nonceAccount = new Keypair();
    // setGuardians([
    //   new PublicKey(values.guardian1),
    //   new PublicKey(values.guardian2),
    //   new PublicKey(values.guardian3),
    // ]);
    const connection = new Connection("https://api.devnet.solana.com/");

    console.log("pk: ", account?.publicKey.toBase58())
    console.log("program id: ", programId?.toBase58())

    console.log("Requesting Airdrop of 1 SOL...");
    const signature = await connection.requestAirdrop(account?.publicKey ?? new Keypair().publicKey, 1e9);
    await connection.confirmTransaction(signature, "finalized");
    console.log("Airdrop received");

    // instr 1: initialize social recovery wallet
    const idx = Buffer.from(new Uint8Array([0]));
    const acct_len = Buffer.from(new Uint8Array(new BN(0).toArray("le", 1)));
    const recovery_threshold = Buffer.from(
      new Uint8Array(new BN(0).toArray("le", 1))
    );

    const initializeSocialWalletIx = new TransactionInstruction({
      keys: [
        {
          pubkey: pda ?? new Keypair().publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: account?.publicKey ?? new Keypair().publicKey,
          isSigner: true,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      programId: programId ?? new Keypair().publicKey,
      data: Buffer.concat([idx, acct_len, recovery_threshold]),
    });

    // Transaction 1: setup nonce
    let tx = new Transaction();
    tx.add(
      // create nonce account
      SystemProgram.createAccount({
        fromPubkey: account?.publicKey ?? new Keypair().publicKey,
        newAccountPubkey: nonceAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
          NONCE_ACCOUNT_LENGTH
        ),
        space: NONCE_ACCOUNT_LENGTH,
        programId: SystemProgram.programId,
      }),
      // init nonce account
      SystemProgram.nonceInitialize({
        noncePubkey: nonceAccount.publicKey, // nonce account pubkey
        authorizedPubkey: account?.publicKey ?? new Keypair().publicKey, // nonce account auth
      })
    );
    (tx.feePayer = account?.publicKey ?? new Keypair().publicKey),
      console.log("Sending nonce transaction...");
    let txid = await sendAndConfirmTransaction(
      connection,
      tx,
      [account ?? new Keypair(), nonceAccount],
      {
        skipPreflight: true,
        preflightCommitment: "confirmed",
        commitment: "confirmed",
      }
    );
    console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet\n`);

    let nonceAccountData = await connection.getNonce(
      nonceAccount.publicKey,
      "confirmed"
    );

    // Transaction 3: Initialize wallet
    console.log("Initializing social wallet...");
    tx = new Transaction();
    // tx.add(
    //   SystemProgram.nonceAdvance({
    //     noncePubkey: nonceAccount.publicKey,
    //     authorizedPubkey: account?.publicKey ?? new Keypair().publicKey,
    //   })
    tx.add(initializeSocialWalletIx);
    tx.recentBlockhash = nonceAccountData?.nonce;

    txid = await sendAndConfirmTransaction(
      connection,
      tx,
      [account ?? new Keypair()],
      {
        skipPreflight: true,
        preflightCommitment: "confirmed",
        commitment: "confirmed",
      }
    );
    console.log(`https://explorer.solana.com/tx/${txid}?cluster=devnet\n`);

    router.push("/wallet");
  };

  return (
    <>
      <h1 className={"title"}>Account Signup</h1>

      <p>Confirming your signup...</p>

      {/* <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: "ff" }}
        onFinish={onFinish}
      >
        <Form.Item
          name="guardian1"
          label="Guardian 1 Public Key"
          rules={[
            {
              required: true,
              message: "Please input the public key of guardian",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="guardian2"
          label="Guardian 2 Public Key"
          rules={[
            {
              required: true,
              message: "Please input the public key of guardian",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="guardian3"
          label="Guardian 3 Public Key"
          rules={[
            {
              required: true,
              message: "Please input the public key of guardian",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
            name="modifier"
            className="collection-create-form_last-form-item"
          >
            <Radio.Group>
              <Radio value="ff">Friend / Family</Radio>
              <Radio value="hardware">Hardware</Radio>
            </Radio.Group>
          </Form.Item>
      </Form> */}

      {!loading && (
        <Popconfirm
          title="Do you confirm your signup"
          visible={visible}
          onConfirm={handleOk}
          okButtonProps={{ loading: loading }}
          onCancel={handleCancel}
          cancelText={"No"}
          okText={"Yes"}
        >
          <Button type="primary" onClick={showPopconfirm}>
            Finish
          </Button>
        </Popconfirm>
      )}

      {loading && <LoadingOutlined style={{ fontSize: 24 }} spin />}
    </>
  );
};

export default Signup;
