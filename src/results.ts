import {
  MarsClient
} from 'radx-mars-lib'

import { NistHubProvider } from 'nist-mars-lib'

// Instantiate the required arguments
import { AimsHubProvider } from 'aims-mars-lib'
// import { ReportStreamHubProvider } from 'reportstream-mars-lib'

import AbbottLabInfo from './AbbottLabInfo'
import DebugHubProvider from './DebugHubProvider'
// import DebugHubProvider from './DebugHubProvider'

// ###############
// ONE TIME SETUP.
// ###############

// Instantiate an AimsHubProvider.  The values passed to AimsHubProvider may
// include all of the information provided to you by AIMS or it may include
// simply the bucket path if the AWS information required for AIMS submission
// is available in the default AWS environment variables.  For more information
// on this configuration, see the AimsHubProvider documentation.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const aimsHubProvider = new AimsHubProvider(
  'RADx',
  {
    bucketPath: '{bucket-path-without-receivefrom}',
    accessKey: '',
    region: '',
    secretAccessKey: ''
  },
  false)

// NOTE: ReportStream is no longer supported by the RADx MARS Library or
// program.  ReportStream code is left here for reference purposes.  The
// ReportStream provider will only be updated for high vulnerability
// security patches.

// Instantiate the reportstream provider using the credentials
// provided by ReportStream.  In a real application, you should not embed
// credentials in the code but should, instead, pull them from some secure
// service, from environment variables, etc.  We've left in some values to
// provide you an example of what your configuration MAY look like.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const reportStreamHubProvider = new ReportStreamHubProvider(
//   {
//     privatePemString: `-----BEGIN EC PRIVATE KEY-----
// -----END EC PRIVATE KEY-----`,
//     algorithm: 'ES384',
//     clientId: '',
//     kid: '',
//     scope: ''
//   },
//   false)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const debugHubProvider = new DebugHubProvider(aimsHubProvider)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const nistHubProvider = new NistHubProvider(aimsHubProvider)

// Create a new MARSClient. This is the entryway into the library.
// A mars client handles HL7 generation and submission of the HL7
// message to the configured Hub on behalf of the configured lab.
// The below currently uses the debug provider to display output
// but we could easily swap it to the NistHubProvider to run validation
// or the AimsHubProvider to send messages.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const aimsClient = new MarsClient(aimsHubProvider, new AbbottLabInfo())

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resultChecker = aimsClient.createHubSubmissionResultRetriever()

resultChecker.retrieveSubmissionResult('hKdA2SWXdOl4cuJziV8sq-20241025153251337').then(
  (b) => {
    if (b.successful) {
      console.log('Successful submission')
    } else {
      console.log('Submission failed.')
    }

    console.log(`Submission Id: ${b.submissionId}`)
    console.log(`Status: ${b.status}`)
    console.log('Warnings')
    b.warnings.forEach(w => { console.log(`\t- ${w}`) })
    console.log('Errors')
    b.errors.forEach(w => { console.log(`\t- ${w}`) })
    // console.log(JSON.stringify(b))
  }
).catch(
  (e) => { console.log(e) }
)
