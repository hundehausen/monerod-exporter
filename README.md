# monerod-exporter
Prometheus Exporter for monerod

## Metrics
* monerod_connections_incoming
* monerod_block_difficulty
* monerod_tx_mempool
* monerod_connections_outgoing
* monerod_block_reward
* monerod_tx_chain
* monerod_database_size
* monerod_height
* monerod_update_available
* monerod_peer_bans

## Environement Variables
* PORT (default 18083)
* DAEMON_HOST (default http://127.0.0.1:18081)

## Docker
```
docker pull hundehausen/monerod-exporter
docker run -p 18083:18083 -e DAEMON_HOST=http://127.0.0.1:18081 --name monerod-exporter hundehausen/monerod-exporter 
```