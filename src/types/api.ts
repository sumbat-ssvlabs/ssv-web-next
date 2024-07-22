// let's imagine this file is autogenerated from the backend
// ideally, we want to keep these api related types in sync
// with the backend instead of manually writing them out

export type WithPagination<T extends Record<string, unknown>> = T & {
  pagination: {
    total: number;
    pages: number;
    per_page: number;
    page: number;
    current_first: number;
    current_last: number;
  };
};

export type Operator = {
  id: number;
  id_str: string;
  declared_fee: string;
  previous_fee: string;
  fee: string;
  public_key: string;
  owner_address: string;
  address_whitelist: string;
  verified_operator?: boolean;
  balance: number;
  whitelist_addresses?: string[];
  whitelisting_contract?: string;
  is_private?: boolean;
  location: string;
  setup_provider: string;
  eth1_node_client: string;
  eth2_node_client: string;
  mev_relays: string;
  description: string;
  website_url: string;
  twitter_url: string;
  linkedin_url: string;
  dkg_address: string;
  logo: string;
  type: string;
  name: string;
  performance: {
    "24h": number;
    "30d": number;
  };
  is_valid: boolean;
  is_deleted: boolean;
  is_active: number;
  status: string;
  validators_count: number;
  version: string;
  network: string;
  updated_at: number;
};

export type OperatorsSearchResponse = WithPagination<{ operators: Operator[] }>;

export type ClusterData = {
  // use this snapshot data for contract interactions
  active: boolean;
  balance: string; // the balance of the cluster after last contract interaction (deposit, withdraw)
  index: string;
  networkFeeIndex: string;
  validatorCount: number;
};

export interface Cluster {
  id: number;
  clusterId: string;
  ownerAddress: string;
  validatorCount: number;
  networkFeeIndex: number;
  index: number;
  balance: string; // actual balance of the cluster, not snapshot
  active: boolean;
  isLiquidated: boolean;
  runWay: number;
  burnRate: BigInteger;
  operators: Operator[];
  clusterData: ClusterData;
  updatedAt?: string;
}

export interface GetClusterResponse {
  type: string;
  cluster: {
    id: number;
    clusterId: string;
    network: string;
    version: string;
    ownerAddress: string;
    validatorCount: number;
    networkFeeIndex: string;
    index: string;
    balance: string;
    active: boolean;
    isLiquidated: boolean;
    operators: number[];
    blockNumber: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}
