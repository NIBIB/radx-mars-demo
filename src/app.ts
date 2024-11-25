import express from 'express'
import { MarsClient } from 'radx-mars-lib'
import { AimsHubProvider } from 'aims-mars-lib'
import { ReportStreamHubProvider } from 'reportstream-mars-lib'
import AbbottLabInfo from './AbbottLabInfo'

const app = express()
const PORT = 3000

// Set EJS as the templating engine
app.set('view engine', 'ejs')
app.set('views', './views')

// Middleware to parse JSON bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public')) // Serve static files

// Instantiate Providers and Clients
const aimsHubProvider = new AimsHubProvider('RADx', {
  bucketPath: '{bucket-path-without-receive-from}',
  accessKey: '',
  region: '',
  secretAccessKey: ''
}, false)

const reportStreamHubProvider = new ReportStreamHubProvider({
  privatePemString: `-----BEGIN EC PRIVATE KEY-----
-----END EC PRIVATE KEY-----`,
  algorithm: 'ES384',
  clientId: '',
  kid: '',
  scope: ''
}, false)

const reportStreamClient = new MarsClient(reportStreamHubProvider, new AbbottLabInfo())
const aimsClient = new MarsClient(aimsHubProvider, new AbbottLabInfo())

const aimsResultChecker = aimsClient.createHubSubmissionResultRetriever()
const reportStreamResultChecker = reportStreamClient.createHubSubmissionResultRetriever()

// Route to render the form
app.get('/', (req, res) => {
  res.render('index')
})

// Endpoint to handle submission retrieval
app.post('/retrieve-result', async (req, res) => {
  const { type, submissionId } = req.body

  try {
    let result
    if (type === 'AIMS') {
      result = await aimsResultChecker.retrieveSubmissionResult(submissionId)
    } else {
      result = await reportStreamResultChecker.retrieveSubmissionResult(submissionId)
    }

    // Format the result to be displayed as requested
    const formattedResult = `
      Successful: ${result.successful}
      Submission Id: ${result.submissionId}
      Status: ${result.status}
      Warnings:
      ${result.warnings.map(w => `\t- ${w}`).join('\n')}
      Errors:
      ${result.errors.map(e => `\t- ${e}`).join('\n')}
    `

    res.json({ result: formattedResult })
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) })
  }
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
