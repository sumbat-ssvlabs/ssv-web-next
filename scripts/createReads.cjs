(async () => {
  /* eslint-disable @typescript-eslint/no-var-requires */
  /* eslint-disable no-undef */
  const fs = require("fs");
  const path = require("path");
  const prettier = require("prettier");
  const typescriptParser = require("prettier/parser-typescript");
  const babelParser = require("prettier/parser-babel");
  const { isEqual, kebabCase } = await import("lodash-es");

  const mainnetAbi = require("../src/lib/abi/mainnet/v4/getter.json");

  const holeskyAbi = require("../src/lib/abi/holesky/v4/getter.json").filter(
    (item) => {
      const mainnetItem = mainnetAbi.find((f) => f?.name === item?.name);
      return !isEqual(mainnetItem, item);
    },
  );

  const folder = path.join(
    path.dirname(__dirname),
    "src/lib/contract-interactions/read",
  );

  if (!fs.existsSync(folder)) {
    console.log("Creating folder: ", folder);
    fs.mkdirSync(folder, { recursive: true });
  }

  fs.readdirSync(folder).forEach((file) => {
    fs.unlinkSync(path.join(folder, file));
  });

  const readFns = holeskyAbi.filter(
    (item) =>
      item.type === "function" &&
      (item.stateMutability == "view" || item.stateMutability == "pure"),
  );

  const readFnsMainnet = mainnetAbi.filter(
    (item) =>
      item.type === "function" &&
      (item.stateMutability == "view" || item.stateMutability == "pure"),
  );

  const createWriteFn = (isTestnet, item) => {
    const functionName = item.name;
    const hookName = `use${capitalizeFirstLetter(functionName)}${isTestnet ? "_Testnet" : ""}`;
    const fileName = `${kebabCase(hookName)}.ts`;
    const filePath = path.join(folder, `${fileName}`);
    const hasInputs = Boolean(item.inputs?.length);

    const networkName = isTestnet ? "holesky" : "mainnet";

    const abiName = isTestnet ? "HoleskyV4GetterABI" : "MainnetV4GetterABI";

    const content = `
// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------

import type { UseReadContractParameters } from "wagmi";
import { useReadContract, useBlockNumber } from "wagmi";


import { isUndefined } from "lodash-es";

import { getSSVNetworkDetails, useSSVNetworkDetails } from "@/hooks/use-ssv-network-details";
import { ${abiName} } from "@/lib/abi/${networkName}/v4/getter";${
      hasInputs
        ? `
import type {
  AbiInputsToParams} from "@/lib/contract-interactions/utils";
import {
  paramsToArray,
  extractAbiFunction,
} from "@/lib/contract-interactions/utils";`
        : ""
    }
${hasInputs ? 'import type { ExtractAbiFunction } from "abitype";' : ""}
import { readContractQueryOptions, } from "wagmi/query";
import { getChainId } from "@wagmi/core";
import { config } from "@/wagmi/config";
import { queryClient } from "@/lib/react-query";

${hasInputs ? `type Fn = ExtractAbiFunction<typeof ${abiName}, "${functionName}">;` : ""}
${hasInputs ? `const abiFunction = extractAbiFunction(${abiName},"${functionName}");` : ""}



export const get${capitalizeFirstLetter(functionName)}QueryOptions = (${hasInputs ? 'params: AbiInputsToParams<Fn["inputs"]>' : ""}) =>
  readContractQueryOptions(config, {
    abi: ${abiName},
    chainId: getChainId(config),
    address: getSSVNetworkDetails().getterContractAddress,
    functionName: "${functionName}",
    ${hasInputs ? "args: paramsToArray({ params, abiFunction })," : ""}
  });

type QueryOptions = UseReadContractParameters<
  typeof MainnetV4GetterABI,
  "${functionName}"
>["query"];

export const fetch${capitalizeFirstLetter(functionName)} =  (${hasInputs ? 'params: AbiInputsToParams<Fn["inputs"]>' : ""}) =>
queryClient.fetchQuery(get${capitalizeFirstLetter(functionName)}QueryOptions(${hasInputs ? "params" : ""}));


export const ${hookName} = (${hasInputs ? 'params: AbiInputsToParams<Fn["inputs"]>,' : ""}options: QueryOptions & {watch?: boolean} = {enabled: true}) => {
  const { getterContractAddress } = useSSVNetworkDetails()
  ${hasInputs ? "const args = paramsToArray({ params, abiFunction })" : ""}
  const blockNumber = useBlockNumber({ watch: options.watch })

  return useReadContract({
      abi: ${abiName},
      address: getterContractAddress,
      functionName: "${functionName}",
      ${hasInputs ? "args," : ""}
    blockNumber: options.watch ? blockNumber.data : undefined,
       ${
         hasInputs
           ? `query: {
           ...options,
        enabled:options?.enabled && args.every((arg) => !isUndefined(arg)),
      },`
           : "query:options"
       }
    });
};

// ------------------------------------------------
// This file is auto-generated by scripts/createRead.js
// ------------------------------------------------
`;
    fs.mkdirSync(folder, { recursive: true });
    prettier
      .format(content.trim(), {
        parser: "typescript",
        plugins: [typescriptParser, babelParser],
      })
      .then((prettifiedCode) => {
        fs.writeFileSync(filePath, prettifiedCode);
        // fs.chmodSync(filePath, 0o444);
        console.log(`File created: ${filePath}`);
      });
  };
  readFnsMainnet.forEach(createWriteFn.bind(null, false));
  readFns.forEach(createWriteFn.bind(null, true));

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
})();
