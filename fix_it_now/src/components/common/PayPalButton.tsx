import { useCallback, useEffect, useId, useRef, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { apiBaseUrl, tokens } from "@/lib/api-client";

type PayPalCapture = Record<string, unknown>;

interface PayPalButtonProps {
  amount: number;
  currency: string;
  description: string;
  disabled?: boolean;
  onSuccess: (orderId: string, capture: PayPalCapture) => void | Promise<void>;
  onError?: (error: Error) => void;
}

interface PayPalApproveData {
  orderID: string;
}

interface PayPalButtonsOptions {
  createOrder: () => Promise<string>;
  onApprove: (data: PayPalApproveData) => Promise<void>;
  onCancel: () => void;
  onError: (error: unknown) => void;
  style: {
    color: "gold";
    shape: "rect";
    label: "paypal";
    layout: "vertical";
    height: number;
  };
}

interface PayPalButtonsInstance {
  isEligible?: () => boolean;
  render: (selector: string) => Promise<void>;
  close?: () => Promise<void>;
}

interface PayPalSdk {
  Buttons: (options: PayPalButtonsOptions) => PayPalButtonsInstance;
}

const SCRIPT_ID = "fixitnow-paypal-sdk";

function errorFrom(value: unknown, fallback: string): Error {
  if (value instanceof Error) return value;
  if (typeof value === "string" && value) return new Error(value);
  return new Error(fallback);
}

async function readError(response: Response, fallback: string): Promise<Error> {
  try {
    const body = (await response.json()) as {
      message?: string;
      error?: { message?: string };
    };
    return new Error(body.error?.message ?? body.message ?? fallback);
  } catch {
    return new Error(fallback);
  }
}

function requestHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (tokens.access) headers.Authorization = `Bearer ${tokens.access}`;
  return headers;
}

export function PayPalButton({
  amount,
  currency,
  description,
  disabled = false,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const id = useId().replace(/:/g, "");
  const containerId = `paypal-buttons-${id}`;
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [capturedOrderId, setCapturedOrderId] = useState<string | null>(null);
  const callbacks = useRef({ onSuccess, onError });

  useEffect(() => {
    callbacks.current = { onSuccess, onError };
  }, [onError, onSuccess]);

  const reportError = useCallback((value: unknown, fallback: string) => {
    const error = errorFrom(value, fallback);
    setLoading(false);
    setMessage(error.message);
    callbacks.current.onError?.(error);
  }, []);

  const renderButtons = useCallback(async () => {
    const paypal = window.paypal;
    if (!paypal) {
      reportError(null, "PayPal could not be loaded.");
      return;
    }

    const buttons = paypal.Buttons({
      createOrder: async () => {
        setMessage(null);
        const response = await fetch(`${apiBaseUrl()}/api/v1/payments/paypal/create-order`, {
          method: "POST",
          headers: requestHeaders(),
          body: JSON.stringify({
            amount,
            currency,
            description,
          }),
        });

        if (!response.ok) {
          throw await readError(response, "Unable to start the PayPal payment.");
        }

        const body = (await response.json()) as {
          id?: string;
          orderId?: string;
          order_id?: string;
        };
        const orderId = body.id ?? body.orderId ?? body.order_id;
        if (!orderId) {
          throw new Error("The payment server did not return a PayPal order ID.");
        }
        return orderId;
      },
      onApprove: async ({ orderID }) => {
        setLoading(true);
        setMessage(null);
        try {
          const response = await fetch(`${apiBaseUrl()}/api/v1/payments/paypal/capture-order`, {
            method: "POST",
            headers: requestHeaders(),
            body: JSON.stringify({
              order_id: orderID,
            }),
          });

          if (!response.ok) {
            throw await readError(response, "PayPal approved the order, but capture failed.");
          }

          const capture = (await response.json()) as PayPalCapture;
          setCapturedOrderId(orderID);
          try {
            await callbacks.current.onSuccess(orderID, capture);
          } catch (error) {
            reportError(
              error,
              `Payment completed under PayPal order ${orderID}, but the booking could not be finalized.`,
            );
          }
        } catch (error) {
          reportError(error, "Unable to complete the PayPal payment.");
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => {
        setMessage("Payment cancelled. Your booking has not been created.");
      },
      onError: (error) => {
        reportError(error, "PayPal was unable to process this payment.");
      },
      style: {
        color: "gold",
        shape: "rect",
        label: "paypal",
        layout: "vertical",
        height: 44,
      },
    });

    if (buttons.isEligible && !buttons.isEligible()) {
      reportError(null, "PayPal is not available for this browser or account.");
      return;
    }

    await buttons.render(`#${containerId}`);
    setLoading(false);
    return buttons;
  }, [amount, containerId, currency, description, reportError]);

  useEffect(() => {
    if (disabled) {
      setLoading(false);
      setMessage(null);
      return;
    }

    const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string | undefined;
    if (!clientId) {
      setLoading(false);
      setMessage("PayPal is not configured. Add VITE_PAYPAL_CLIENT_ID to .env.local.");
      return;
    }

    let active = true;
    let buttons: PayPalButtonsInstance | undefined;
    const loadButtons = () => {
      if (!active) return;
      void renderButtons()
        .then((instance) => {
          buttons = instance;
        })
        .catch((error) => reportError(error, "Unable to render PayPal."));
    };

    if (window.paypal) {
      loadButtons();
    } else {
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.async = true;
        script.src =
          `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
          `&currency=${encodeURIComponent(currency)}&intent=capture&components=buttons`;
        document.head.appendChild(script);
      }
      script.addEventListener("load", loadButtons, { once: true });
      script.addEventListener(
        "error",
        () => reportError(null, "Unable to download the PayPal payment controls."),
        { once: true },
      );
    }

    return () => {
      active = false;
      void buttons?.close?.();
      const container = document.getElementById(containerId);
      if (container) container.innerHTML = "";
    };
  }, [containerId, currency, disabled, renderButtons, reportError]);

  if (disabled) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-muted/30 p-4 text-center text-xs text-muted-foreground">
        Accept the terms above to enable PayPal.
      </div>
    );
  }

  if (capturedOrderId) {
    return (
      <p className="rounded-xl bg-emerald-50 p-4 text-xs text-emerald-800" role="status">
        PayPal payment captured. Order: <span className="font-bold">{capturedOrderId}</span>
        {message ? ` — ${message}` : ""}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative min-h-11">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-card/90 text-xs text-muted-foreground">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Loading PayPal…
          </div>
        )}
        <div id={containerId} />
      </div>
      {message && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800" role="status">
          {message}
        </p>
      )}
    </div>
  );
}

declare global {
  interface Window {
    paypal?: PayPalSdk;
  }
}
