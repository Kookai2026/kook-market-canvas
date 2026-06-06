# Telegram Ops

KMC 사이트 링크나 운영 알림을 텔레그램으로 보낼 때는 기존 봇 설정을 사용한다.

## Credentials

- Token/Chat ID file: `/mnt/c/Active/APP_KM/backend/.env`
- Required variables:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`

Do not copy token values into project docs, source code, commits, or chat logs.

## Send KMC Link

```bash
set -a
source /mnt/c/Active/APP_KM/backend/.env
set +a

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_CHAT_ID}" \
  --data-urlencode text="KMC 사이트 링크: https://kook-market-canvas.vercel.app/"
```

## Send Custom Message

```bash
set -a
source /mnt/c/Active/APP_KM/backend/.env
set +a

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage" \
  -d chat_id="${TELEGRAM_CHAT_ID}" \
  --data-urlencode text="보낼 메시지"
```

## Last Verified

- `2026-06-04`: KMC site link sent successfully through Telegram Bot API.
