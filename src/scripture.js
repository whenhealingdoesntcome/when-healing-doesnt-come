// WEBU is served from this deployment's own /bible/*.json assets.
// No request to eBible.org or a third-party Scripture API is made.
const BOOKS = [
['GEN','Genesis','Gen'],['EXO','Exodus','Exod','Ex'],['LEV','Leviticus','Lev'],['NUM','Numbers','Num'],['DEU','Deuteronomy','Deut'],['JOS','Joshua','Josh'],['JDG','Judges','Judg'],['RUT','Ruth'],['1SA','1 Samuel','1 Sam'],['2SA','2 Samuel','2 Sam'],['1KI','1 Kings','1 Kgs'],['2KI','2 Kings','2 Kgs'],['1CH','1 Chronicles','1 Chr'],['2CH','2 Chronicles','2 Chr'],['EZR','Ezra'],['NEH','Nehemiah','Neh'],['EST','Esther','Esth'],['JOB','Job'],['PSA','Psalms','Psalm','Ps'],['PRO','Proverbs','Prov'],['ECC','Ecclesiastes','Eccl'],['SNG','Song of Solomon','Song of Songs','Song'],['ISA','Isaiah','Isa'],['JER','Jeremiah','Jer'],['LAM','Lamentations','Lam'],['EZK','Ezekiel','Ezek'],['DAN','Daniel','Dan'],['HOS','Hosea','Hos'],['JOL','Joel'],['AMO','Amos'],['OBA','Obadiah','Obad'],['JON','Jonah'],['MIC','Micah'],['NAM','Nahum'],['HAB','Habakkuk','Hab'],['ZEP','Zephaniah','Zeph'],['HAG','Haggai'],['ZEC','Zechariah','Zech'],['MAL','Malachi','Mal'],['MAT','Matthew','Matt'],['MRK','Mark'],['LUK','Luke'],['JHN','John'],['ACT','Acts'],['ROM','Romans','Rom'],['1CO','1 Corinthians','1 Cor'],['2CO','2 Corinthians','2 Cor'],['GAL','Galatians','Gal'],['EPH','Ephesians','Eph'],['PHP','Philippians','Phil'],['COL','Colossians','Col'],['1TH','1 Thessalonians','1 Thess'],['2TH','2 Thessalonians','2 Thess'],['1TI','1 Timothy','1 Tim'],['2TI','2 Timothy','2 Tim'],['TIT','Titus'],['PHM','Philemon'],['HEB','Hebrews','Heb'],['JAS','James'],['1PE','1 Peter','1 Pet'],['2PE','2 Peter','2 Pet'],['1JN','1 John'],['2JN','2 John'],['3JN','3 John'],['JUD','Jude'],['REV','Revelation','Rev']];
const ALIASES = new Map();
for(const [code,...names] of BOOKS)for(const name of [code,...names])ALIASES.set(name.toLowerCase().replace(/[^a-z0-9]/g,''),code);
function parseSingle(input){
 const cleaned=String(input||'').trim().replace(/[–—]/g,'-').replace(/\s+/g,' ');
 const m=cleaned.match(/^((?:[1-3]\s*)?[a-z][a-z .]*?)\s+(\d+)(?::(\d+)(?:\s*-\s*(?:(\d+):)?(\d+))?)?$/i);
 if(!m)throw Error('Use a passage such as Psalm 23:1-6 or Romans 8:18-25.');
 const code=ALIASES.get(m[1].toLowerCase().replace(/[^a-z0-9]/g,''));
 if(!code)throw Error('Bible book not recognized: '+m[1]);
 const ch=Number(m[2]),start=m[3]?Number(m[3]):1,endCh=m[4]?Number(m[4]):ch,end=m[5]?Number(m[5]):(m[3]?start:null);
 if(ch<1||endCh<ch||endCh-ch>4||start<1||start>176||end!==null&&(end<1||end>176)||endCh===ch&&end!==null&&end<start)throw Error('Invalid or overly long Scripture range.');
 return {code,ch,start,endCh,end,reference:cleaned};
}
export async function scriptureLookup(reference,assets,request){
 const references=String(reference||'').split(/[;\n]+/).map(s=>s.trim()).filter(Boolean);
 if(!references.length||references.length>12||String(reference).length>1000)throw Error('Enter 1 to 12 Scripture passages, separated by new lines or semicolons.');
 const passages=[];
 for(const text of references){
  const p=parseSingle(text);
  const response=await assets.fetch(new Request(new URL('/bible/'+p.code+'.json',request.url)));
  if(!response.ok)throw Error('Local WEBU Bible file unavailable.');
  const book=await response.json();const verses=[];
  if(!book[String(p.ch)]||!book[String(p.endCh)])throw Error('Chapter not found: '+text);
  for(let chapter=p.ch;chapter<=p.endCh;chapter++){
   const entries=Object.entries(book[String(chapter)]||{});
   for(const [number,body] of entries){
    const n=Number(number);
    if(chapter===p.ch&&n<p.start)continue;
    if(chapter===p.endCh&&p.end!==null&&n>p.end)continue;
    verses.push({book:p.code,chapter,verse:n,text:body});
    if(verses.length>200)throw Error('Limit each passage to 200 verses.');
   }
  }
  if(!verses.length||p.end!==null&&!verses.some(v=>v.chapter===p.endCh&&v.verse===p.end))throw Error('Verses not found: '+text);
  passages.push({reference:p.reference,verses});
 }
 return {translation:'World English Bible Updated (WEBU)',passages,verses:passages.flatMap(p=>p.verses)};
}
