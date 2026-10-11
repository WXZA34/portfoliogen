const apiKey = 'AIzaSyA_PK1O5XfUsyMGFJVDcHYztB6_vAys22g';
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
fetch(geminiUrl).then(r => r.json()).then(d => {
  const models = d.models.map(m => m.name);
  console.log(JSON.stringify(models, null, 2));
}).catch(e => console.error(e));
