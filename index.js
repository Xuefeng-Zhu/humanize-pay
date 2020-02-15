const { errors: rpcErrors } = require("eth-json-rpc-errors");
const { default: Resolution } = require("@unstoppabledomains/resolution");

const resolution = new Resolution({
  blockchain: {
    ens: {
      url: "https://mainnet.infura.io/v3/b24ba38418084f5c974b3af71bd63117"
    },
    cns: {
      url: "https://mainnet.infura.io/v3/b24ba38418084f5c974b3af71bd63117"
    }
  }
});

wallet.registerRpcMessageHandler(async (_originString, requestObject) => {
  switch (requestObject.method) {
    case "resolve":
      const [domain, currency] = requestObject.params;
      return resolution.address(domain, currency);
    default:
      throw rpcErrors.eth.methodNotFound(requestObject);
  }
});
