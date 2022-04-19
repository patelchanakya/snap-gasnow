async function getFees() {
  let response = await fetch('https://etherchain.org/api/gasnow');
  return response.text();
}

wallet.registerRpcMessageHandler(async (originString, requestObject) => {
  switch (requestObject.method) {
    case 'hello':
      const metadata = JSON.parse(await getFees());
      const fees = metadata.data;
      const standardprice = (fees.standard / 1000000000).toString();
      const slowprice = (fees.slow / 1000000000).toString();
      const fastprice = (fees.fast / 1000000000).toString();
      const rapidprice = (fees.rapid / 1000000000).toString();
      const ethprice = fees.priceUSD.toString();
      const timestamp = new Date(fees.timestamp * 1000);

      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, gas fees`,
            description:
              'This custom confirmation is just for display purposes.',
            textAreaContent:
              `At this current time of  ${timestamp} gas fees are as folows:` +
              '\n' +
              '\n' +
              `Standard Gas Price is` +
              `\n` +
              `${standardprice} GWei` +
              '\n' +
              `For fast transactions:` +
              `\n` +
              `${fastprice} GWei` +
              '\n' +
              `For faster transactions:` +
              `\n` +
              `${rapidprice} GWei` +
              '\n' +
              `For slow transactions:` +
              `\n` +
              `${slowprice} GWei` +
              '\n' +
              '\n' +
              `Current price of Ethereum:` +
              `\t` +
              `\t` +
              `${ethprice} USD`,
          },
        ],
      });
    default:
      throw new Error('Method not found.');
  }
});
