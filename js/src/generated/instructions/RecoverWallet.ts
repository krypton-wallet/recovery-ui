/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category RecoverWallet
 * @category generated
 */
export const RecoverWalletStruct = new beet.BeetArgsStruct<{
  instructionDiscriminator: number
}>([['instructionDiscriminator', beet.u8]], 'RecoverWalletInstructionArgs')
/**
 * Accounts required by the _RecoverWallet_ instruction
 *
 * @property [] profileInfo PDA of Krypton Program to be recovered
 * @property [] authorityInfo Pubkey of keypair of PDA to be recovered
 * @property [_writable_] newProfileInfo PDA to be recovered into
 * @property [**signer**] newAuthorityInfo Pubkey of the keypair to be recovered into
 * @category Instructions
 * @category RecoverWallet
 * @category generated
 */
export type RecoverWalletInstructionAccounts = {
  profileInfo: web3.PublicKey
  authorityInfo: web3.PublicKey
  newProfileInfo: web3.PublicKey
  newAuthorityInfo: web3.PublicKey
}

export const recoverWalletInstructionDiscriminator = 9

/**
 * Creates a _RecoverWallet_ instruction.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @category Instructions
 * @category RecoverWallet
 * @category generated
 */
export function createRecoverWalletInstruction(
  accounts: RecoverWalletInstructionAccounts,
  programId = new web3.PublicKey('2aJqX3GKRPAsfByeMkL7y9SqAGmCQEnakbuHJBdxGaDL')
) {
  const [data] = RecoverWalletStruct.serialize({
    instructionDiscriminator: recoverWalletInstructionDiscriminator,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.profileInfo,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.authorityInfo,
      isWritable: false,
      isSigner: false,
    },
    {
      pubkey: accounts.newProfileInfo,
      isWritable: true,
      isSigner: false,
    },
    {
      pubkey: accounts.newAuthorityInfo,
      isWritable: false,
      isSigner: true,
    },
  ]

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
