import { useEffect, useState } from 'react'

// "hello, I'm" on the home hero, cycling through languages once a second.
const WORDS = [
  ['hello', 'en'], ['नमस्ते', 'hi'], ['hola', 'es'], ['bonjour', 'fr'], ['こんにちは', 'ja'], ['ciao', 'it'],
  ['नमस्कार', 'mr'], ['hallo', 'de'], ['olá', 'pt'], ['你好', 'zh'], ['안녕하세요', 'ko'], ['merhaba', 'tr']
]

export default function Hello({ style }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let id = 0
    const start = setTimeout(() => { setI(1); id = setInterval(() => setI((n) => (n + 1) % WORDS.length), 1100) }, 1000)
    return () => { clearTimeout(start); clearInterval(id) }
  }, [])
  const [word, lang] = WORDS[i]
  return (
    <p className="serif fade hello" style={style}>
      <span className="sr-only">hello, I'm</span>
      <span className="hello-w" aria-hidden="true"><span key={i} lang={lang} className="hello-in">{word}</span></span>
      <span aria-hidden="true">, I'm</span>
    </p>
  )
}
