export const add0x = (publicKey: string) =>
  publicKey.startsWith("0x") ? publicKey : `0x${publicKey}`;
