"use client";

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { type ReactNode } from "react";

const TanstackProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { TanstackProvider };
