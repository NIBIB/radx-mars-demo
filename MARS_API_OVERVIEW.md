# RADx MARS API Overview
MARS is Mobile At Home Reporting through Standards.  When developing an application/reader under EUA, it is required that the application report results to health departments.  MARS works to facilitate this.  Under funding by the NIH via the RADx program and facilitated by VentureWell, Meadows Design has developed a TypeScript API capable of interfacing with both current RADx MARS hubs – AIMS (developed by APHL) and ReportStream (developed by the CDC) – in ReactNative mobile applications, NodeJS server applications, or any development environment capable of supporting TypeScript.

Mobile applications developed under the auspices of an EUA are required to follow a specific flow.  That flow is defined at https://www.nibib.nih.gov/covid-19/radx-tech-program/mars/mobile-application-guidance.   In addition to the flow, this page also defines the requirements for fields that must be requested as well as fields that must be gathered by the application when submitting results to a MARS hub.

Both current MARS hubs receive test results as HL7 ELR 2.5.1 messages.  The MARS API developed by Meadows Design not only facilitates the delivery of messages but also the construction of HL7 ELR 2.5.1 messages themselves.  This removes the burden of understanding the expansive scope of HL7 from the implementor, allowing them to focus on their detection technology and not the specifications underlying their reporting requirements.

## API Libraries
The API developed by Meadows Design for interfacing with RADx MARS hubs has four distinct libraries: The RADx MARS Library, the AIMS MARS Library, this NIST MARS Validation library, and the ReportStream MARS Library (**Deprecated**).

### RADx MARS Library
The RADx MARS Library is identified as [`radx-mars-lib`](https://github.com/NIBIB/radx-mars-lib) in NPM and is currently hosted on [GitHub](https://github.com/NIBIB/radx-mars-lib/).  It contains base class libraries representing several of the segments defined in HL7 ELR 2.5.1 messages as well as interfaces to implement by hubs in order to facßßilitate message construction and delivery to a RADx MARS hub.

Defined in this library is the `MarsHubProvider` interface – a key component in the RADx MARS library ecosystem. It enables RADx MARS Hubs to integrate with the RADx MARS Library by implementing this interface in their own libraries. This design allows the RADx MARS Library to remain agnostic to the specific communication methods used by individual hubs. The primary role of the `MarsHubProvider` interface is to standardize the message delivery mechanism, allowing the RADx MARS Library to focus on message construction while abstracting away the details of the delivery process.

Both the AIMS and ReportStream libraries depend on the RADx MARS Library and both implement their own versions of the `MarsHubProvider` interface.  The AIMS and ReportStream libraries can be used interchangeably allowing the developer to change the RADx MARS Hub targeted by their application.

### AIMS MARS Library
The AIMS MARS Library is identified as [`aims-mars-lib`](https://github.com/NIBIB/aims-mars-lib) in NPM and is currently hosted at [GitHub](https://github.com/NIBIB/aims-mars-lib/).  It contains a `MarsHubProvider` implementation for communicating with APHL’s AIMS MARS Hub and any supporting classes needed to fulfill the implementation.

**Note**: Inclusion of this library within an application does not grant the implementor access to the AIMS MARS Hub itself. The implementor’s organization must still follow the onboarding certifications and processes mandated by APHL AIMS to enable their application to report results through the APHL AIMS MARS Hub.

### NIST MARS Library
The NIST MARS Library is identified as [`nist-mars-lib`](https://github.com/NIBIB/nist-mars-lib) in NPM and is currently hosted at [GitHub](https://github.com/NIBIB/nist-mars-lib/).  It contains a `MarsHubProvider` implementation for communicating with NIST's MARS HL7 validation provider.  This allows for minimal code change to existing applications needing to validate their generated payloads prior to integrating with their intended MARS Hub.

Note without a properly registered test, you may receive validation errors that are NOT paylaod specific.

For information on getting started, including registering your test, please review the [RADx MARS Getting Started Guide](https://www.nibib.nih.gov/programs/radx-tech-program/mars/hl7v2-getting-started).

For current valid HL7 payload content, please review the NIH's [RADx HL7v2 Implementation Guide](https://www.nibib.nih.gov/programs/radx-tech-program/mars/HL7v2-implementation-guide).

For links to the NIST validator and instructions on its use, please review the NIH's [Message Validation Guide](https://www.nibib.nih.gov/programs/radx-tech-program/mars/validation).

### ReportStream MARS Library
**IMPORTANT:** ReportStream is no longer supported by the RADx MARS Library and the repo is only updated for security patches.

The ReportStream MARS Library is identified as [`reportstream-mars-lib`](https://github.com/NIBIB/reportstream-mars-lib) in NPM and is currently hosted at [GitHub](https://github.com/NIBIB/reportstream-mars-lib/).  It contains a `MarsHubProvider` implementation for communicating with the CDC’s ReportStream MARS Hub as well any necessary supporting classes.

**Note**: As with the APHL AIMS Mars Hub, inclusion of this library within an application does not grant the implementor access to the ReportStream MARS Hub itself. The implementor’s organization must still follow the onboarding certifications and processes mandated by the CDC to enable their application to report results through the CDC ReportStream MARS Hub.

## Sample Applications
There are two sample applications illustrating the usage of these APIs.  The first sample application is this repository: `radx-mars-demo`.  In this repository you will find code capable of submitting a test to AIMS or Report Stream as well as a sample `MarsHubProvider` implementation used to support debugging of messages.

- A CLI application is available in [`src/index.ts`](https://github.com/NIBIB/radx-mars-demo/blob/main/src/index.ts) of the [`radx-mars-demo`](https://github/com/NIBIB/radx-mars-demo).  This application also contains a `DebugProvider` to allow you to test your application without connecting to NIST or to a RADx MARS Hub.
- A website demonstrating how one might be able to retrieve the result of a submission is in [`app.ts`](https://github.com/NIBIB/radx-mars-demo/blob/main/src/app.ts) of the same repository.