import { api } from './api'

// Web3Forms access keys are public by design, but its free tier rejects server-side
// submissions, so the browser posts directly when a key is configured. Without a key
// the FastAPI backend forwards the message instead. Exactly one path runs per message.
const KEY = import.meta.env.VITE_WEB3FORMS_KEY

export async function sendMessage({ name, email, company, message, topic, website }) {
  if (!KEY) {
    return api('/api/contact', { method: 'POST', body: { name, email, company, message, topic, website } })
  }
  if (website) return { success: true } // honeypot filled: silently drop
  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: KEY,
      subject: `Portfolio: ${topic} · ${name}`,
      from_name: 'Shlok Bam Portfolio',
      name,
      email,
      replyto: email,
      company: company || '-',
      topic,
      message,
      botcheck: ''
    })
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || !data.success) {
    const err = new Error(data.message || 'Send failed')
    err.data = { message: 'Something went wrong sending that. Please email me directly at shlokbam19103@gmail.com.' }
    throw err
  }
  return data
}
