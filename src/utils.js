import path from 'path'
import { fileURLToPath } from 'url'

const __filname = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filname)

export default __dirname