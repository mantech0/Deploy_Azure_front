const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.WEBSITE_HOSTNAME || 'localhost'
const port = process.env.PORT || 8080
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// APIの状態をチェックする関数
async function checkApiStatus() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    console.log('Checking API status at:', apiUrl)
    const response = await fetch(`${apiUrl}/health`)
    if (response.ok) {
      console.log('API is accessible')
    } else {
      console.log('API returned status:', response.status)
    }
  } catch (error) {
    console.error('Error checking API:', error.message)
  }
}

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      
      if (req.method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
      }

      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      checkApiStatus() // 起動時にAPIの状態をチェック
    })
})
