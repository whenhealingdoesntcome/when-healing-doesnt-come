/** Manna Missions — Gmail delivery. Run installDailyTrigger() once. */
const SITE = 'https://manna-missions-app.whenhealingdoesntcome.workers.dev';
const SUMMARY_TO = 'heatherkeiko@gmail.com';
const REPLY_TO = 'cosmissions@manna.church';
const ZONE = 'America/Denver';

function installDailyTrigger() {
  ScriptApp.getProjectTriggers().filter(t => t.getHandlerFunction()==='sendDailyPrayerEmails').forEach(ScriptApp.deleteTrigger);
  ScriptApp.newTrigger('sendDailyPrayerEmails').timeBased().atHour(1).everyDays(1).inTimezone(ZONE).create();
}
function escapeHtml(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function emailLayout(heading, body, logo) {
  const image = logo ? '<img src="cid:mannaLogo" alt="Manna Church Colorado Springs" width="290" style="display:block;max-width:100%;height:auto;margin:auto">' : '';
  return '<!doctype html><html><body style="margin:0;background:#f0efec;font-family:Arial,sans-serif;color:#393f4a">'+
    '<div style="max-width:600px;margin:20px auto;background:white;border:1px solid #e3e6e0">'+
    '<div style="background:#393f4a;padding:22px 18px;text-align:center">'+
    '<div style="display:inline-block;background:white;padding:12px 16px;border-radius:5px">'+image+'</div>'+
    '<h1 style="font-size:24px;color:white;margin:18px 0 0">'+escapeHtml(heading)+'</h1></div>'+
    '<div style="padding:28px 25px;font-size:15px;line-height:1.65">'+body+
    '<p style="margin-top:28px">With gratitude and prayers,<br><strong>Manna Missions Team</strong></p>'+
    '<div style="border-top:1px solid #e3e6e0;margin-top:24px;padding-top:22px;text-align:center">'+image+'</div></div></div></body></html>';
}
function logoBlob() {
  const res = UrlFetchApp.fetch(SITE+'/manna-missions-email-logo.png',{muteHttpExceptions:true});
  if(res.getResponseCode()!==200)throw new Error('Logo could not be loaded from website');
  return res.getBlob().setName('mannaLogo.png');
}
function sendDailyPrayerEmails() {
  const props=PropertiesService.getScriptProperties();
  const secret=props.getProperty('PRAYER_REPORT_SECRET');
  if(!secret)throw new Error('Add PRAYER_REPORT_SECRET in Project Settings > Script Properties');
  const response=UrlFetchApp.fetch(SITE+'/api/prayer-report',{headers:{Authorization:'Bearer '+secret},muteHttpExceptions:true});
  if(response.getResponseCode()!==200)throw new Error('Prayer report failed: HTTP '+response.getResponseCode());
  const report=JSON.parse(response.getContentText());
  if(!/^\d{4}-\d{2}-\d{2}$/.test(report.date)||!Number.isSafeInteger(report.count)||report.count<0)throw new Error('Invalid report');
  const ministry=report.ministry;
  const name=ministry?(ministry.hide_name?'Name Withheld for Security':ministry.name):'No featured ministry';
  const logo=logoBlob();
  const inlineImages={mannaLogo:logo};
  // Each message has its own completion marker. Reruns will skip already-sent messages.
  let ministryStatus='Skipped (no prayer count or ministry email)';
  if(ministry && report.count>0 && ministry.email) {
    const key='partner-sent-'+report.date;
    if(props.getProperty(key)==='yes')ministryStatus='Already sent';
    else {
      const greeting='Hello '+escapeHtml(ministry.name)+',';
      const body='<p>'+greeting+'</p>'+
        '<p>We just wanted you to know that Manna Church is praying for you! Today, your ministry was featured on our Daily Prayer page, and members of our church family took time to lift you and your work before the Lord.</p>'+
        '<div style="text-align:center;background:#f0efec;padding:18px;margin:22px 0;border-radius:6px"><div style="font-size:38px;font-weight:bold;color:#f37321">'+report.count+'</div><div style="font-weight:bold">People prayed for you today</div></div>'+
        '<p>We hope you are encouraged knowing that people are faithfully bringing your ministry before the Lord. We are grateful for your commitment to sharing the hope of Christ, and we count it a privilege to partner with you in prayer.</p>'+
        '<p>If you have any updated or specific prayer requests that we can share online, please reply to us at <a href="mailto:'+REPLY_TO+'">'+REPLY_TO+'</a>.</p>';
      GmailApp.sendEmail(ministry.email,'Manna Church Is Praying for You!',
        'Hello '+ministry.name+',\n\nManna Church is praying for you!\n\n'+report.count+' people prayed for you today.\n\nIf you have updated or specific prayer requests to share online, please reply to '+REPLY_TO+'.\n\nWith gratitude and prayers,\nManna Missions Team',
        {htmlBody:emailLayout("You're Being Prayed For!",body,true),inlineImages: inlineImages,replyTo:REPLY_TO,name:'Manna Missions Team'});
      props.setProperty(key,'yes');ministryStatus='Sent to ministry';
    }
  }
  const summaryKey='summary-sent-'+report.date;
  if(props.getProperty(summaryKey)==='yes')return;
  const body='<p>Hello Heather,</p><p>Here is the Manna Missions Daily Prayer report for <strong>'+escapeHtml(report.date)+'</strong>.</p>'+
    '<p><strong>Featured ministry:</strong> '+escapeHtml(name)+'</p>'+
    '<div style="text-align:center;background:#f0efec;padding:18px;margin:22px 0;border-radius:6px"><div style="font-size:38px;font-weight:bold;color:#f37321">'+report.count+'</div><div style="font-weight:bold">People prayed for this ministry today</div></div>'+
    '<p><strong>Partner email:</strong> '+escapeHtml(ministryStatus)+'</p>';
  GmailApp.sendEmail(SUMMARY_TO,'Daily Prayer Report | '+report.date,
    'Daily Prayer Report '+report.date+'\nMinistry: '+name+'\nPeople prayed: '+report.count+'\nPartner email: '+ministryStatus,
    {htmlBody:emailLayout('Daily Prayer Report',body,true),inlineImages:inlineImages,replyTo:REPLY_TO,name:'Manna Missions Team'});
  props.setProperty(summaryKey,'yes');
}
