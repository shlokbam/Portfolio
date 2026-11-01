export const RESUME = '/static/Resume/Shlok_Bam_Resume.pdf'
export const RESUME_PAGE = '/resume' // the web version; it has the PDF download
export const EMAIL = 'shlokbam19103@gmail.com'
export const file = (path) => encodeURI(path)
// Display copy of an image: /static/a/b.png -> /static/opt/a/b.webp (originals stay for downloads).
export const opt = (path) => '/static/opt' + path.slice('/static'.length).replace(/\.(png|jpe?g)$/i, '.webp')
// Resized display copies (scripts/resize-images.sh): spread into an <img> with a `sizes` hint and the
// browser picks the smallest copy that is sharp enough. Only for images that script covers.
export const sized = (optPath) => ({
  src: optPath.replace('/static/opt/', '/static/opt/w800/'),
  srcSet: [480, 800, 1280].map((w) => optPath.replace('/static/opt/', '/static/opt/w' + w + '/') + ' ' + w + 'w').join(', ')
})
// Thumbnail copy (960 px wide), from an opt() path: /static/opt/a/b.webp -> /static/opt/thumbs/a/b.webp
export const thumb = (optPath) => optPath.replace('/static/opt/', '/static/opt/thumbs/')
