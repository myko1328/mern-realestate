import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import openapiDoc from "../docs/openapi.json";

const router = Router();

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(openapiDoc));

export default router;

// // (optional) serve the OpenAPI specification
// router.use(
//   '/openapi.json',
//   express.static(path.join(__dirname, '../schemas/openapi.json'))
// );

// npx swagger-jsdoc -d api/src/docs/definition.yaml "api/src/routes/*.ts" "api/src/docs/!(definition).yaml" -o api/src/docs/openapi.json
