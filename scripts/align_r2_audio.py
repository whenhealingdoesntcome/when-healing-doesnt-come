#!/usr/bin/env python3
"""Align WHDC R2 audio to words, writing sidecars accepted by src/audio/api.js."""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

import boto3
from botocore.config import Config

PATTERN = re.compile(r'^devotionals/([a-z0-9][a-z0-9-]{0,120})/(devotional|scripture|deeper)/(sulafat|sadachbia)-([a-f0-9]{8,128})\.(wav|mp3)$', re.I)


def make_client():
    account = os.environ['R2_ACCOUNT_ID']
    return boto3.client('s3', endpoint_url=f'https://{account}.r2.cloudflarestorage.com',
        aws_access_key_id=os.environ['R2_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['R2_SECRET_ACCESS_KEY'],
        region_name='auto', config=Config(retries={'max_attempts': 5, 'mode': 'standard'}))


def collect_words(data):
    items = data.get('word_segments')
    if not isinstance(items, list):
        items = [w for segment in data.get('segments', []) for w in segment.get('words', [])]
    words = []
    last_end = 0.0
    for item in items:
        word = str(item.get('word', '')).strip()
        start, end = item.get('start'), item.get('end')
        if not word or not isinstance(start, (int, float)) or not isinstance(end, (int, float)):
            continue
        start, end = float(start), float(end)
        # Reject invalid timestamps rather than silently producing a broken sidecar.
        if start < 0 or end <= start or start < last_end - 0.001:
            raise ValueError(f'Overlapping or invalid timestamp for {word!r}: {start}-{end}')
        start = max(start, last_end)
        words.append({'word': word, 'start': round(start, 3), 'end': round(end, 3)})
        last_end = end
    if not 1 <= len(words) <= 20000:
        raise ValueError(f'Invalid number of aligned words: {len(words)}')
    return {'version': 1, 'words': words}


def main():
    p = argparse.ArgumentParser()
    p.add_argument('--prefix', default='devotionals/')
    p.add_argument('--limit', type=int, default=6, help='Maximum recordings to align per run')
    p.add_argument('--model', default='small')
    p.add_argument('--dry-run', action='store_true')
    args = p.parse_args()
    bucket = os.environ['R2_BUCKET_NAME']
    s3 = make_client()
    recordings = []
    paginator = s3.get_paginator('list_objects_v2')
    for page in paginator.paginate(Bucket=bucket, Prefix=args.prefix):
        for item in page.get('Contents', []):
            key = item['Key']
            if PATTERN.fullmatch(key):
                recordings.append(key)
    recordings.sort()
    print(f'Found {len(recordings)} audio recordings in R2', flush=True)
    completed = 0
    failures = []
    for key in recordings:
        sidecar = re.sub(r'\.(wav|mp3)$', '.words.json', key, flags=re.I)
        try:
            try:
                s3.head_object(Bucket=bucket, Key=sidecar)
                print(f'SKIP existing: {sidecar}', flush=True)
                continue
            except s3.exceptions.ClientError as exc:
                if exc.response['Error']['Code'] not in ('404', 'NoSuchKey', 'NotFound'):
                    raise
            if completed >= args.limit:
                print('Reached per-run limit', flush=True)
                break
            if args.dry_run:
                print(f'WOULD ALIGN {key}', flush=True)
                completed += 1
                continue
            with tempfile.TemporaryDirectory() as tmp:
                audio = Path(tmp) / Path(key).name
                s3.download_file(bucket, key, str(audio))
                out = Path(tmp) / 'output'
                out.mkdir()
                cmd = [sys.executable, '-m', 'whisperx', str(audio), '--model', args.model,
                    '--device', 'cpu', '--compute_type', 'int8', '--language', 'en',
                    '--output_format', 'json', '--output_dir', str(out)]
                print(f'ALIGN {key}', flush=True)
                subprocess.run(cmd, check=True)
                raw = json.loads((out / (audio.stem + '.json')).read_text())
                converted = collect_words(raw)
                payload = json.dumps(converted, separators=(',', ':'), ensure_ascii=False).encode()
                if len(payload) > 3_000_000:
                    raise ValueError('Sidecar exceeds Worker size limit')
                s3.put_object(Bucket=bucket, Key=sidecar, Body=payload,
                    ContentType='application/json; charset=utf-8', CacheControl='no-store')
                print(f'SAVED {sidecar}: {len(converted["words"])} words', flush=True)
                completed += 1
        except Exception as exc:
            print(f'FAILED {key}: {exc}', file=sys.stderr, flush=True)
            failures.append(key)
    print(f'Processed {completed}; failed {len(failures)}', flush=True)
    if failures:
        sys.exit(1)


if __name__ == '__main__':
    main()
