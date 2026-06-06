#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KMC (KOOK Market Canvas) Syncer Client
사내 기지국(Company Server)에서 연산 완료된 스코어 및 마켓 데이터를
외부 퍼블릭 Supabase PostgreSQL로 비동기 동기화하는 데몬 스크립트.
"""

import os
import sys
import json
import time
import hmac
import hashlib
from datetime import datetime, timezone
import requests
from dotenv import load_dotenv

# 환경 변수 로드
load_dotenv()

KMC_BFF_URL = os.environ.get("KMC_BFF_URL", "https://kook-market-canvas.vercel.app/api/v1")
KMC_SECRET_KEY = os.environ.get("KMC_SECRET_KEY", "default-kmc-shared-secret")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

def get_utc_now_iso():
    return datetime.now(timezone.utc).isoformat()

def generate_signature(payload_str, timestamp, secret):
    """HMAC-SHA256 디지털 서명 생성 (보안 검증용)"""
    message = f"{payload_str}{timestamp}".encode("utf-8")
    signature = hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()
    return signature

def post_to_kmc_api(endpoint, payload):
    """퍼블릭 API 게이트웨이 또는 Supabase REST API로 데이터 전송"""
    url = f"{KMC_BFF_URL.rstrip('/')}/{endpoint.lstrip('/')}"
    timestamp = str(int(time.time()))
    payload_str = json.dumps(payload, ensure_ascii=False)
    
    # 보안 서명 헤더 설정
    signature = generate_signature(payload_str, timestamp, KMC_SECRET_KEY)
    headers = {
        "Content-Type": "application/json",
        "X-KMC-Signature": signature,
        "X-KMC-Timestamp": timestamp
    }
    
    try:
        print(f"[{datetime.now().isoformat()}] Sending sync request to {url}...")
        response = requests.post(url, data=payload_str, headers=headers, timeout=15)
        if response.status_code in (200, 201):
            print(f"✔ Sync Success ({response.status_code})")
            return True, response.json()
        else:
            print(f"❌ Sync Failed ({response.status_code}): {response.text}")
            return False, response.text
    except Exception as e:
        print(f"❌ Connection Error: {e}", file=sys.stderr)
        return False, str(e)

def load_local_mock_scores():
    """사내 DB 및 로컬 파일로부터 최신 가공 스코어를 가져오는 모크 함수"""
    # 실제 환경에서는 sqlite3 커넥션 또는 KIS API에서 수집된 로컬 연산 데이터가 들어갑니다.
    return [
        {
            "symbol": "267260",
            "fit_score": 82,
            "overheat_score": 71,
            "one_liner": "펀더멘털 대비 가격 부담은 존재하나 높은 수주 가시성으로 눌림 분할 진입이 유리",
            "as_of": get_utc_now_iso()
        },
        {
            "symbol": "ETN",
            "fit_score": 78,
            "overheat_score": 62,
            "one_liner": "북미 전력 배전 수요 지속에 따른 안정적 실적 구간 진입",
            "as_of": get_utc_now_iso()
        }
    ]

def load_local_mock_metrics():
    """사내 Hermes 수집기에서 처리한 최신 가격 및 RSI 수급 모크 함수"""
    return [
        {
            "symbol": "267260",
            "price": 445000,
            "rsi_14": 68.2,
            "foreign_5d_net": 12800000000,
            "inst_5d_net": 7600000000,
            "as_of": get_utc_now_iso()
        },
        {
            "symbol": "ETN",
            "price": 312.5,
            "rsi_14": 52.8,
            "foreign_5d_net": 42000000,
            "inst_5d_net": -15000000,
            "as_of": get_utc_now_iso()
        }
    ]

def run_synchronization():
    print("=== KMC Syncer Batch Job Started ===")
    
    # 1. 시세 및 보조지표 동기화
    metrics_payload = {
        "sync_time": get_utc_now_iso(),
        "metrics": load_local_mock_metrics()
    }
    post_to_kmc_api("/sync/metrics", metrics_payload)
    
    # 2. 투자 판단 적합도 스코어 동기화
    scores_payload = {
        "sync_time": get_utc_now_iso(),
        "scores": load_local_mock_scores()
    }
    post_to_kmc_api("/sync/scores", scores_payload)
    
    print("=== KMC Syncer Batch Job Completed ===")

if __name__ == "__main__":
    run_synchronization()
