import React, { ReactElement, useEffect } from "react";
import { Button, Typography } from "antd";
import { Box } from "../../styles/StyledComponents.styles";
import { Keypair, PublicKey } from "@solana/web3.js";
import { useGlobalState } from "../../context";

const { Paragraph } = Typography;

const GuardianBox = ({ guardian }: { guardian: PublicKey }): ReactElement => {
  const { setGuardians, guardians } = useGlobalState();

  const onDelete = () => {
    var newGuard = guardians.filter(g => {
        return g.toBase58() !== guardian.toBase58()
    })
    console.log(newGuard)
    setGuardians(newGuard)
  };
  
//   useEffect(() => {
//     console.log("rerendered cuz guardians changed: ", guardians)
//   }, [guardians])

  return (
    <Box>
      <Paragraph>{guardian.toBase58()}</Paragraph>
      <Button onClick={onDelete} danger>
        Delete
      </Button>
    </Box>
  );
};

export default GuardianBox;
