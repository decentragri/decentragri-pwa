//**SERVICE IMPORTS */
import FarmerService from "../farmer.services/farmer.service";

//** SCHEMA & INTERFACE IMPORTS */
import type Elysia from "elysia";
import type { SuccessMessage } from "../onchain.services/onchain.interface";
import { farmerCreateFarmSchema, farmerUpdateFarmSchema } from "../farmer.services/farmer.schema";
import type { CreatedFarm, FarmList } from "../farmer.services/farmer.interface";

//** MEMGRAPH IMPORTS */
import { getDriver } from "../db/memgraph";
import { authBearerSchema } from "../auth.services/auth.schema";


const Farmer = (app: Elysia) =>
  app
    .post('/farm/create', async ({ headers, body }) => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);
        const driver = getDriver();
        const farmerService = new FarmerService(driver);

        const output: SuccessMessage = await farmerService.createFarm(jwtToken, body);
        return output;
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    }, farmerCreateFarmSchema)
    .get('/farm/list', async ({ headers }): Promise<FarmList[]> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new Error('Bearer token not found in Authorization header');
        }
        const jwtToken: string = authorizationHeader.substring(7);

        console.log("JWT Token:", jwtToken);
        const driver = getDriver();
        const farmerService = new FarmerService(driver);

        const output: FarmList[] = await farmerService.getFarmList(jwtToken);
        return output;
      } catch (error: any) {
        console.error(error);
        throw error;
      }
    }, authBearerSchema)
    .get('/farm/data/:id', async ({ headers, params }) => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const driver = getDriver();
            const farmerService = new FarmerService(driver);

            const output: CreatedFarm = await farmerService.getFarmData(jwtToken, params.id);
            return output;
        }
        catch (error: any) {
            console.error(error);
            throw error;
        }
    }, authBearerSchema)
    .post('/farm/update', async ({ headers, body }) => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const driver = getDriver();
            const farmerService = new FarmerService(driver);

            const output: SuccessMessage = await farmerService.updateFarm(jwtToken, body);
            return output;

        } catch (error: any) {
            console.error(error);
            throw error;
        }
    }, farmerUpdateFarmSchema)
    .post('/farm/delete/:id', async ({ headers, params }) => {
        try {
            const authorizationHeader: string = headers.authorization;
            if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
                throw new Error('Bearer token not found in Authorization header');
            }
            const jwtToken: string = authorizationHeader.substring(7);
            const driver = getDriver();
            const farmerService = new FarmerService(driver);

            const output: SuccessMessage = await farmerService.deleteFarm(jwtToken, params.id);
            return output;

        } catch (error: any) {
            console.error(error);
            throw error;
        }
    }, authBearerSchema);

export default Farmer;
