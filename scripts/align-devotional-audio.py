#!/usr/bin/env python3
"""Generate WHDC v1 word timing sidecars from real audio and its exact spoken transcript.
Requires optional local dependency: pip install whisperx torch
Review output before uploading. Never synthesizes or guesses timestamps.
"""
import argparse, json, re, sys
from pathlib import Path

def tokens(s):
    return re.findall(r"\b[\w]+(?:[’'-][\w]+)*\b", s, flags=re.UNICODE)

def normalized(s):
    return re.sub(r"[^\w]", "", s, flags=re.UNICODE).casefold()

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--audio',required=True,help='Actual WAV/MP3/M4A narration file')
    p.add_argument('--transcript',required=True,help='UTF-8 file containing exactly the words spoken, without headings not narrated')
    p.add_argument('--output',required=True,help='Output JSON for Stage 3 uploader')
    p.add_argument('--language',default='en')
    p.add_argument('--device',default='cpu',choices=['cpu','cuda'])
    p.add_argument('--review',default=None,help='Optional review report JSON')
    a=p.parse_args()
    transcript=Path(a.transcript).read_text(encoding='utf-8').strip()
    expected=tokens(transcript)
    if not expected: p.error('Transcript is empty')
    if not Path(a.audio).is_file(): p.error('Audio file does not exist')
    try: import whisperx
    except ImportError: p.error('Install optional alignment dependency: pip install whisperx torch')
    audio=whisperx.load_audio(a.audio)
    model,metadata=whisperx.load_align_model(language_code=a.language,device=a.device)
    # Align the supplied exact spoken text; no ASR rewrite or inferred word timings.
    duration=len(audio)/16000
    result=whisperx.align([{'start':0.0,'end':duration,'text':transcript}],model,metadata,audio,a.device,return_char_alignments=False)
    observed=[w for seg in result.get('segments',[]) for w in seg.get('words',[])]
    issues=[]
    if len(observed)!=len(expected): issues.append(f'Word count mismatch: transcript {len(expected)}; aligned {len(observed)}')
    words=[]
    for i,(want,got) in enumerate(zip(expected,observed),1):
        spoken=got.get('word','')
        if normalized(want)!=normalized(spoken): issues.append(f'Word {i}: expected {want!r}, aligned {spoken!r}')
        start,end=got.get('start'),got.get('end')
        if not isinstance(start,(float,int)) or not isinstance(end,(float,int)) or start<0 or end<=start or end>duration+0.1:
            issues.append(f'Word {i}: missing or invalid alignment: {got!r}')
            continue
        words.append({'start':round(start,3),'end':round(end,3)})
    if any(words[i]['start']<words[i-1]['start'] for i in range(1,len(words))): issues.append('Nonmonotonic timestamps')
    report={'audio':a.audio,'transcript':a.transcript,'duration_seconds':duration,'expected_words':len(expected),'aligned_words':len(observed),'valid_words':len(words),'issues':issues,'requires_listening_review':True}
    report_path=Path(a.review or (a.output+'.review.json'))
    report_path.write_text(json.dumps(report,indent=2),encoding='utf-8')
    if issues:
        print('Alignment NOT exported. See review report:',report_path,file=sys.stderr)
        for issue in issues[:15]: print(' -',issue,file=sys.stderr)
        return 1
    Path(a.output).write_text(json.dumps({'version':1,'words':words},indent=2),encoding='utf-8')
    print(f'Created {a.output} with {len(words)} measured word timestamps. LISTEN AND REVIEW before upload.')
    return 0

if __name__=='__main__': sys.exit(main())
