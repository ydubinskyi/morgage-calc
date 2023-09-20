import { expose } from "comlink";

import {
  calculateMortgageScheduleDecreasingInstallment,
  calculateMortgageScheduleFixedInstallment,
} from "@/lib/calc-utils";

export interface WorkerApi {
  calculateMortgageScheduleFixedInstallment: typeof calculateMortgageScheduleFixedInstallment;
  calculateMortgageScheduleDecreasingInstallment: typeof calculateMortgageScheduleDecreasingInstallment;
}

const workerApi: WorkerApi = {
  calculateMortgageScheduleFixedInstallment,
  calculateMortgageScheduleDecreasingInstallment,
};

expose(workerApi);
