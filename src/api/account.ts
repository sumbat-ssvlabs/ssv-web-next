import { endpoint } from "@/api";
import { api } from "@/lib/api-client";
import type { Address } from "abitype";
import { getAddress } from "viem";

interface GetAccountResponse {
  type: string;
  data: {
    id: number;
    ownerAddress: string;
    recipientAddress: string;
    network: string;
    version: string;
    nonce: number;
  };
}

export const getAccount = (account: Address) =>
  api.get<GetAccountResponse>(endpoint("accounts", getAddress(account)));

export const getOwnerNonce = (account: Address) =>
  getAccount(account).then((res) => res.data.nonce);
