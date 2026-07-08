import { ShieldCheck, ShieldAlert } from "lucide-react";
import { StatusType } from "../types";

interface StatusDisplayProps {
  status: StatusType;
  rayId: string;
  onRetry?: () => void;
}

export const StatusDisplay = ({ status, rayId, onRetry }: StatusDisplayProps) => {
  if (status === "failed") {
    return (
      <>
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Verification failed
        </h2>
        <p className="text-gray-500 leading-7">
          We could not verify your browser. This may happen on a slow
          connection, an unsupported browser, or if automated access was
          detected.
        </p>

        <div className="mt-8 rounded-2xl border border-red-100 bg-red-50 p-6 flex gap-5 items-center">
          <ShieldAlert size={40} className="text-red-500 shrink-0" />
          <div>
            <h3 className="font-semibold text-lg text-red-800">
              Unable to complete verification
            </h3>
            <p className="text-red-600 mt-1 text-sm">
              Please try again. If this keeps happening, disable browser
              extensions or try a different browser.
            </p>
          </div>
        </div>

        <button
          onClick={onRetry}
          className="mt-8 w-full rounded-xl bg-[#0f172a] text-white font-medium py-3 hover:bg-[#1e293b] transition-colors"
        >
          Try again
        </button>
      </>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-semibold text-gray-800 mb-3">
        {status === "solving"
          ? "Checking your browser"
          : "Verifying your identity"}
      </h2>
      <p className="text-gray-500 leading-7">
        {status === "solving"
          ? "We are verifying that your connection is secure before allowing access to this website."
          : "Please wait while we verify your request with the server."}
      </p>

      <div className="mt-8 rounded-2xl border bg-gray-50 p-6 flex gap-5 items-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-[5px] border-gray-200"></div>
          <div className="absolute inset-0 rounded-full border-[5px] border-transparent border-t-[#2563eb] animate-spin"></div>
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-800">
            {status === "solving"
              ? "Solving security challenge"
              : "Verifying with server"}
          </h3>
          <p className="text-gray-500 mt-1">
            {status === "solving"
              ? "Please wait while Cikawan Shield verifies your browser."
              : "Almost there! Verifying your credentials..."}
          </p>
        </div>
      </div>

      <div className="mt-8">
        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-[loading_4s_linear_forwards]"></div>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          This process usually takes less than 5 seconds.
        </p>
      </div>

      <div className="mt-10 rounded-xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={22} className="text-blue-600 mt-1" />
          <div>
            <p className="font-semibold text-blue-800">
              {status === "solving"
                ? "Verification is automatic"
                : "Processing your request"}
            </p>
            <p className="text-sm text-blue-700 mt-2 leading-6">
              {status === "solving"
                ? "After the verification is complete, you will be redirected automatically. No further action is required."
                : "Your verification is being processed. Please wait..."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};