import React, { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";

export function useRefreshOnFocus(queryKey: string[]) {
  const queryClient = useQueryClient();
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      queryClient.refetchQueries({
        queryKey: queryKey,
        stale: true,
        type: "active",
      });
    }, [queryClient])
  );
}
