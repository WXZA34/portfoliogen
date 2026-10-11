const apiKey = 'AIzaSyA_PK1O5XfUsyMGFJVDcHYztB6_vAys22g';
const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;
const base64Data = Buffer.from('%PDF-1.4 dummy pdf').toString('base64');
fetch(geminiUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{
      parts: [
        { text: 'Hello' },
        { inline_data: { mime_type: 'application/pdf', data: base64Data } }
      ]
    }]
  })
}).then(r => r.json()).then(d => console.log(JSON.stringify(d, null, 2))).catch(e => console.error(e));
