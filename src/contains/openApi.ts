export const SWAGGER_OPTIONS = {
  info: {
    version: "1.0.0",
    title: "Social",
    // license: {
    //   name: 'MIT',
    // },
  },
  security: {
    JWT: {
      type: "apiKey",
      name: "x-auth-token",
      in: "header",
      description: "JWT token",
      scheme: "apiKey",
    },
  },
  // Base directory which we use to locate your JSDOC files
  baseDir: __dirname,
  // Glob pattern to find your jsdoc files (multiple patterns can be added in an array)
  filesPattern: "../**/*route.ts",
  // URL where SwaggerUI will be rendered
  swaggerUIPath: "/swagger",
  // Expose OpenAPI UI
  exposeSwaggerUI: true,
  // Expose Open API JSON Docs documentation in `apiDocsPath` path.
  exposeApiDocs: false,
  // Set non-required fields as nullable by default
  notRequiredAsNullable: false,
  // You can customize your UI options.
  // you can extend swagger-ui-express config. You can checkout an example of this
  // in the `example/configuration/swaggerOptions.js`
  swaggerUiOptions: {},
  // multiple option in case you want more that one instance
  multiple: true,
};
