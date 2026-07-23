# Binance Normalized Bars Schema Draft

## Dataset Contract

```text
provider: binance
market_type: spot
data_type: klines
symbols: BTCUSDT, ETHUSDT, BNBUSDT
interval: 1h
period_type: monthly
period: 2021-01-01 ~ 2024-12-31
bar_type: time_bars
timezone: UTC
```

## Raw File Location

```text
server/data/raw/binance/data/spot/monthly/klines/{symbol}/1h/{symbol}-1h-{year}-{month}.zip
```

Example:

```text
server/data/raw/binance/data/spot/monthly/klines/BTCUSDT/1h/BTCUSDT-1h-2021-01.zip
```

## Raw Kline CSV Columns

Binance kline CSV files have no header row.

| Index | Raw column | Meaning | Keep |
| ---: | --- | --- | :---: |
| 0 | `open_time_ms` | Candle open timestamp in milliseconds | Yes |
| 1 | `open` | Open price | Yes |
| 2 | `high` | High price | Yes |
| 3 | `low` | Low price | Yes |
| 4 | `close` | Close price | Yes |
| 5 | `volume` | Base asset volume | Yes |
| 6 | `close_time_ms` | Candle close timestamp in milliseconds | Yes |
| 7 | `quote_volume` | Quote asset notional volume | Yes |
| 8 | `number_of_trades` | Number of trades in the candle | Yes |
| 9 | `taker_buy_base_volume` | Base asset volume from taker buy trades | Yes |
| 10 | `taker_buy_quote_volume` | Quote asset notional from taker buy trades | Yes |
| 11 | `ignore` | Unused Binance field | No |

## Normalized `bars` Table

This table is the first stable AlphaTrust engine input.

| Column | Type | Required | Description |
| --- | --- | :---: | --- |
| `id` | bigint | Yes | Internal primary key |
| `dataset_source_id` | varchar | Yes | Source dataset identifier |
| `source_file_id` | bigint | Yes | Raw zip file record |
| `provider` | varchar | Yes | `binance` |
| `market_type` | varchar | Yes | `spot`, later `um` or `cm` |
| `symbol` | varchar | Yes | Example: `BTCUSDT` |
| `base_asset` | varchar | Yes | Example: `BTC` |
| `quote_asset` | varchar | Yes | Example: `USDT` |
| `bar_type` | varchar | Yes | `time_bars` for MVP |
| `interval` | varchar | Yes | `1h` for MVP |
| `open_time` | datetime | Yes | UTC candle open time |
| `open_time_ms` | bigint | Yes | Raw Binance open timestamp |
| `close_time` | datetime | Yes | UTC candle close time |
| `close_time_ms` | bigint | Yes | Raw Binance close timestamp |
| `open` | decimal | Yes | Open price |
| `high` | decimal | Yes | High price |
| `low` | decimal | Yes | Low price |
| `close` | decimal | Yes | Close price |
| `volume` | decimal | Yes | Base asset volume |
| `quote_volume` | decimal | Yes | Quote asset notional volume |
| `number_of_trades` | integer | Yes | Number of trades |
| `taker_buy_base_volume` | decimal | Yes | Base volume from taker buys |
| `taker_buy_quote_volume` | decimal | Yes | Quote volume from taker buys |
| `created_at` | datetime | Yes | Ingestion timestamp |

## Suggested Unique Constraint

```text
unique(provider, market_type, symbol, bar_type, interval, open_time)
```

This prevents duplicate bars when raw files are re-ingested.

## AlphaTrust Engine Mapping

```text
bars.close
→ returns
→ events
→ triple-barrier labels
→ concurrency
→ average uniqueness
→ purged CV / embargo
→ diagnostic result
```

## MVP Notes

- Use `open_time` as the canonical bar timestamp.
- Use UTC consistently.
- Keep raw millisecond timestamps for traceability.
- Drop `ignore`.
- Do not use futures-specific fields in MVP.
- Do not build dollar bars from klines; use `aggTrades` later for that.
