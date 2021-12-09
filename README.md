# monerod-exporter
Prometheus Exporter for monerod

## Metrics
* monerod_block_difficulty
* monerod_block_reward
* monerod_connections_incoming
* monerod_connections_outgoing
* monerod_database_size
* monerod_height
* monerod_is_mining_active
* monerod_mining_speed
* monerod_mining_threads
* monerod_peer_bans
* monerod_sync_percentage
* monerod_tx_chain
* monerod_tx_mempool
* monerod_update_available
## Environement Variables
* PORT (default 18083)
* DAEMON_HOST (default http://127.0.0.1:18081)

## Docker
```
docker pull hundehausen/monerod-exporter
docker run -p 18083:18083 -e DAEMON_HOST=http://127.0.0.1:18081 --name monerod-exporter hundehausen/monerod-exporter 
```

## Donations
If you love your new Monero Metrics Dashboard, you can tip me:
89HEKdUFM2dJGDFLpV7CoLUW1Swux7iBMMCXMC5y3U2DihmrbYh6AEoanoHb8VPJrCDLTa9FJfooHdz1rGZH9L342TXwZh7