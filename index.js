const monerojs = require("monero-javascript");
const express = require("express");
const prometheus = require("prom-client");

const DAEMON_HOST = process.env.DAEMON_HOST || "http://192.168.1.6:18081";
const PORT = process.env.PORT || 9396;
const Gauge = prometheus.Gauge;

const app = express();

const difficulty = new Gauge({
  name: "monerod_block_difficulty",
  help: "Last block difficulty",
});
const incomingConnections = new Gauge({
  name: "monerod_connections_incoming",
  help: "Number of incoming connections",
});
const mempoolSize = new Gauge({
  name: "monerod_tx_mempool",
  help: "Number of transactions in the mempool",
});
const outgoingConnections = new Gauge({
  name: "monerod_connections_outgoing",
  help: "Number of outgoing connections",
});
const reward = new Gauge({
  name: "monerod_block_reward",
  help: "Last block reward",
});
const txCount = new Gauge({
  name: "monerod_tx_chain",
  help: "Number of transactions in total",
});
const databaseSize = new Gauge({
  name: "monerod_database_size",
  help: "Number of blockchain size in bytes",
});
const blockHeight = new Gauge({
  name: "monerod_height",
  help: "Number of blockheight",
});
const updateAvailable = new Gauge({
  name: "monerod_update_available",
  help: "Boolean of update available",
});
const peerBans = new Gauge({
  name: "monerod_peer_bans",
  help: "Number of banned peers",
});

async function getMetrics(daemon) {
  const lastBlockHeader = await daemon.getLastBlockHeader();
  const info = await daemon.getInfo();
  const peerBans = await daemon.getPeerBans();
  return { lastBlockHeader: lastBlockHeader, info: info, peerBans: peerBans };
}

async function main() {
  const daemon = await monerojs.connectToDaemonRpc(DAEMON_HOST);

  app.get("/metrics", (req, res) => {
    getMetrics(daemon)
      .then(async (metrics) => {
        const lastBlockHeader = metrics.lastBlockHeader.state;
        const info = metrics.info.state;
        const bans = metrics.peerBans;
        debugger;

        difficulty.set(Number(info.difficulty));
        incomingConnections.set(Number(info.numIncomingConnections));
        outgoingConnections.set(Number(info.numOutgoingConnections));
        mempoolSize.set(Number(info.numTxsPool));
        txCount.set(Number(info.numTxs));
        databaseSize.set(Number(info.databaseSize));
        blockHeight.set(Number(info.height));
        updateAvailable.set(Number(info.updateAvailable));
        reward.set(Number(lastBlockHeader.reward / 1e12));
        peerBans.set(Number(bans.length));
        const registredMetrics = await prometheus.register.metrics();
        res.end(registredMetrics);
      })
      .catch((e) => {
        console.log(e);
      });
  });
}
main();

module.exports = app;
app.listen(PORT, () => console.log(`Listening on :${PORT}`));
