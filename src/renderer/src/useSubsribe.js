import { useEffect } from "react";
import { useElectron } from "./useElectron";

export function useSubscribe(message, onEventTriggered) {
  const { eventBus } = useElectron();
  useEffect(() => {
    const completedListener = eventBus.on(message, (event, status) => {
      onEventTriggered(status);
    });

    return () => {
      eventBus.removeListener(message, completedListener);
    };
  }, [eventBus]);
}
