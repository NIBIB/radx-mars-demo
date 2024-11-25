import {
  type HubSubmissionResult,
  type HierarchicDesignator,
  type MarsHubProvider
} from 'radx-mars-lib'
import type TestSubmissionResult from 'radx-mars-lib/dist/interfaces/TestSubmissionResult'

/**
 * This is a sample hub provider illustrating how you can extend the base class
 * to do simple debugging.
 */
export default class DebugHubProvider implements MarsHubProvider {
  private readonly provider: MarsHubProvider

  constructor (provider: MarsHubProvider) {
    this.provider = provider
  }

  public async retrieveSubmissionResult (submissionId: string): Promise<HubSubmissionResult> {
    throw Error('Not implemented.  Not doing it.')
  }

  get receivingApplicationIdentifier (): HierarchicDesignator {
    return this.provider.receivingApplicationIdentifier
  }

  get receivingFacilityIdentifier (): HierarchicDesignator {
    return this.provider.receivingFacilityIdentifier
  }

  readonly isUsingProduction = false

  public async submitTest (hl7Message: any): Promise<TestSubmissionResult> {
    console.log(hl7Message)
    return { successful: true, retryable: false, id: '', warnings: [], errors: [] }
  }
}
