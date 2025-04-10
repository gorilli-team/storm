"use client";
import { ReactNode } from "react";
import { PrivyProvider } from '@privy-io/react-auth';

export function Providers({ children }: { children: ReactNode }) {
  return (
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            appearance: {
              theme: 'light',
              accentColor: '#3B82F6',
            },
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
            },
            loginMethods: ['email', 'google', 'apple', 'discord', 'twitter', 'wallet'],
            fundingMethodConfig: {
              moonpay: {
                paymentMethod: 'credit_debit_card',
                uiConfig: {
                  accentColor: '#696FFD',
                  theme: 'light'
                },
              },
            },
          }}
        >
          {children}
        </PrivyProvider>
  );
}