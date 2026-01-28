beforeEach(() => {
  jest.clearAllMocks();
  jest.resetModules();
  
  delete process.env.REVENIUM_ENVIRONMENT;
  delete process.env.NODE_ENV;
  delete process.env.DEPLOYMENT_ENV;
  delete process.env.AWS_REGION;
  delete process.env.AZURE_REGION;
  delete process.env.GCP_REGION;
  delete process.env.REVENIUM_REGION;
  delete process.env.REVENIUM_CREDENTIAL_ALIAS;
  delete process.env.REVENIUM_TRACE_TYPE;
  delete process.env.REVENIUM_TRACE_NAME;
  delete process.env.REVENIUM_PARENT_TRANSACTION_ID;
  delete process.env.REVENIUM_TRANSACTION_NAME;
  delete process.env.REVENIUM_RETRY_NUMBER;
});

