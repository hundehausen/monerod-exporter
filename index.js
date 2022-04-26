const monerojs = require("monero-javascript");
const express = require("express");
const prometheus = require("prom-client");

const DAEMON_HOST = process.env.DAEMON_HOST || "http://127.0.0.1:18081";
const PORT = process.env.PORT || 18083;
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
const peerBansMetric = new Gauge({
  name: "monerod_peer_bans",
  help: "Number of banned peers",
});
const isMiningActive = new Gauge({
  name: "monerod_is_mining_active",
  help: "Status of mining active",
});
const miningThreads = new Gauge({
  name: "monerod_mining_threads",
  help: "Number of active mining threads",
});
const miningSpeed = new Gauge({
  name: "monerod_mining_speed",
  help: "Number of mining speed in hashes per second",
});
const syncPercentageMetric = new Gauge({
  name: "monerod_sync_percentage",
  help: "Percentage of synced blocks",
});

async function getSyncStatus(daemon) {
  const { height, targetHeight } = (await daemon.getSyncInfo()).state;
  if (targetHeight > height) {
    return (height / targetHeight) * 100;
  }
  return 100;
}

async function getMetrics(daemon) {
  const lastBlockHeader = (await daemon.getLastBlockHeader()).state;
  const info = (await daemon.getInfo()).state;
  const peerBans = await daemon.getPeerBans();
  const miningStatus = (await daemon.getMiningStatus()).state;
  const syncPercentage = await getSyncStatus(daemon);
  return { lastBlockHeader, info, peerBans, miningStatus, syncPercentage };
}

async function main() {
  const daemon = await monerojs.connectToDaemonRpc(DAEMON_HOST);

  app.get("/metrics", (req, res) => {
    getMetrics(daemon)
      .then(
        async ({
          lastBlockHeader,
          info,
          peerBans,
          miningStatus,
          syncPercentage,
        }) => {
          difficulty.set(Number(info.difficulty));
          incomingConnections.set(Number(info.numIncomingConnections));
          outgoingConnections.set(Number(info.numOutgoingConnections));
          mempoolSize.set(Number(info.numTxsPool));
          txCount.set(Number(info.numTxs));
          databaseSize.set(Number(info.databaseSize));
          blockHeight.set(Number(info.height));
          updateAvailable.set(Number(info.updateAvailable));
          reward.set(Number(lastBlockHeader.reward / 1e12));
          peerBansMetric.set(Number(peerBans?.length || 0));
          isMiningActive.set(Number(miningStatus.isActive));
          miningThreads.set(Number(miningStatus.numThreads));
          miningSpeed.set(Number(miningStatus.speed));
          syncPercentageMetric.set(Number(syncPercentage));

          const registredMetrics = await prometheus.register.metrics();
          res.end(registredMetrics);
        }
      )
      .catch((e) => {
        console.log(e);
      });
  });
}
main();

module.exports = app;
app.listen(PORT, () =>
  console.log(`hundehausen/monerod-exporter serving on :${PORT}`)
);
