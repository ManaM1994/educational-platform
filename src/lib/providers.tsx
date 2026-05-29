"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { theme as antdTheme } from "antd";
import { queryClient } from "./queryClient";
import { store } from "@/store/store";
import ThemeProvider from "@/components/ThemeProvider";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppProviders>{children}</AppProviders>
    </Provider>
  );
}

function AppProviders({ children }: { children: React.ReactNode }) {
  const themeMode = useAppSelector(
    (s: RootState) => s.theme.mode as "light" | "dark",
  );

  const configTheme = {
    algorithm:
      themeMode === "dark"
        ? antdTheme.darkAlgorithm
        : antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: "#7C3AED",
      colorLink: "#7C3AED",
      colorSuccess: "#10B981",
      colorWarning: "#F59E0B",
      colorError: "#EF4444",
      colorBgBase: themeMode === "dark" ? "#0f1724" : "#ffffff",
      borderRadius: 12,
      fontFamily: "IranSansX",
    },
    components: {
      Button: {
        borderRadius: 12,
        controlHeight: 40,
        fontWeight: 500,
      },
      Input: {
        borderRadius: 10,
        controlHeight: 44,
      },
      Card: {
        borderRadius: 16,
      },
    },
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AntdRegistry>
          <ConfigProvider direction="rtl" theme={configTheme}>
            {children}
          </ConfigProvider>
        </AntdRegistry>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
