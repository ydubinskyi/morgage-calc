import { useEffect, useRef } from "react";
import { Remote, wrap } from "comlink";

import { WorkerApi } from "@/workers/calc.worker";

export const useCalcWorker = () => {
  const workerRef = useRef<Worker>(undefined);
  const workerApiRef = useRef<Remote<WorkerApi>>(undefined);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/calc.worker", import.meta.url),
    );

    workerApiRef.current = wrap<WorkerApi>(workerRef.current);

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  return workerApiRef;
};
