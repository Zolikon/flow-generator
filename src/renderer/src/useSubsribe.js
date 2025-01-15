import { useEffect } from "react";
import { useElectron } from "./useElectron";

export function useSubscribe(message, onEventTriggered) {
  const { eventBus } = useElectron();
  useEffect(() => {
    console.log("useSubscribe", message);
    const completedListener = eventBus.on(message, (event, status) => {
      onEventTriggered(status);
    });

    return () => {
      eventBus.removeListener(message, completedListener);
    };
  }, []);
}
