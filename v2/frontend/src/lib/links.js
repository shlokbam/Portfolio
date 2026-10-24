export const RESUME = '/static/Resume/Shlok_Bam_Resume.pdf'
export const EMAIL = 'shlokbam19103@gmail.com'
export const PHONE = '+917974670370'
export const file = (path) => encodeURI(path)
// Display copy of an image: /static/a/b.png -> /static/opt/a/b.webp (originals stay for downloads).
export const opt = (path) => '/static/opt' + path.slice('/static'.length).replace(/\.(png|jpe?g)$/i, '.webp')
// Small (480 px) copy for thumbnails, from an opt() path: /static/opt/a/b.webp -> /static/opt/thumbs/a/b.webp
export const thumb = (optPath) => optPath.replace('/static/opt/', '/static/opt/thumbs/')
