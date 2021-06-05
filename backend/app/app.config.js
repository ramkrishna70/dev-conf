module.exports = {
  ROOMS_SOURCE: process.env.ROOMS_SOURCE,
  ENVIRONMENT: process.env.NODE_ENV,
  GOOGLE_CREDENTIAL:
    process.env.GOOGLE_CREDENTIAL
    || "1045337675756-1k17mkmbtlr59jdacjoh94dtqb8p0eru.apps.googleusercontent.com",
  ENFORCE_SSL: process.env.ENFORCE_SSL || "false",
  CUSTOM_STYLE: process.env.CUSTOM_STYLE || "",
  HOST: "0.0.0.0",
  PORT: process.env.PORT || 8080,
};
