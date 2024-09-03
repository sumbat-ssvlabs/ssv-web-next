// import { useOperators } from "@/hooks/operator/use-operators";
// import { useSSVAccount } from "@/hooks/use-ssv-account";
// import { sortNumbers } from "@/lib/utils/number";
// import { useQuery } from "@tanstack/react-query";
// import { getParser } from "bowser";

// const isWindows = getParser(window.navigator.userAgent)
//   .getOSName(true)
//   .includes("windows");

// const cmd = isWindows ? "./ssv-keys-mac" : "ssv-keys.exe";
// const dynamicFullPath  =

// export const useGenerateCMD = (operatorIds: number[]) => {
//   const sortedOperatorIds = sortNumbers(operatorIds);
//   const ssvAccount = useSSVAccount({
//     staleTime: 0,
//     gcTime: 0,
//   });

//     const operators = useOperators(sortedOperatorIds);

//   const cmdQuery = useQuery({
//     queryKey: ["generate-cmd", operators.data, ssvAccount.data],
//     queryFn: async () => {
//       const operatorsKeys = operators.data!.map((operator) => operator.public_key);
//       return {
//         cli: `${cmd} --operator-keys=${operators.data.join(",")} --operator-ids=${operatorsIds.join(",")} --owner-address=${accountAddress} --owner-nonce=${ownerNonce}`,

//   dkg: `docker pull bloxstaking/ssv-dkg:v2.1.0 && docker run --rm -v ${dynamicFullPath}:/data -it "bloxstaking/ssv-dkg:v2.1.0" init --owner ${accountAddress} --nonce ${ownerNonce} --withdrawAddress ${withdrawalAddress} --operatorIDs ${operatorsIds.join(',')} --operatorsInfo ${getOperatorsData()} --network ${apiNetwork} --validators ${validatorsCount} --logFilePath /data/debug.log --outputPath /data`
//       }
//     },
//     enabled: !!ssvAccount && !!operators,
//   });

//   return cmdQuery;

//   return
// };
