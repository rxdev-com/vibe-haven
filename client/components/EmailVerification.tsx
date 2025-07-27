import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";

interface EmailVerificationProps {
  onVerified?: () => void;
}

export default function EmailVerification({
  onVerified,
}: EmailVerificationProps) {
  const { user, verifyEmail, resendEmailVerification, isLoading } = useAuth();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyEmail = async () => {
    if (!verificationCode.trim()) return;

    setIsVerifying(true);
    const success = await verifyEmail(verificationCode);

    if (success) {
      setVerificationCode("");
      onVerified?.();
    }

    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    const success = await resendEmailVerification();

    if (success) {
      setCountdown(60); // 1 minute cooldown
    }

    setIsResending(false);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setVerificationCode(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && verificationCode.length === 6) {
      handleVerifyEmail();
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-saffron-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent a verification code to
            <br />
            <strong>{user.email}</strong>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Please verify your email to access all features of JugaduBazar
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="verification-code"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter 6-digit verification code
              </label>
              <Input
                id="verification-code"
                type="text"
                placeholder="123456"
                value={verificationCode}
                onChange={handleCodeChange}
                onKeyPress={handleKeyPress}
                className="text-center text-xl tracking-widest font-mono"
                maxLength={6}
                disabled={isVerifying}
              />
              <p className="text-xs text-gray-500 mt-1 text-center">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            <Button
              onClick={handleVerifyEmail}
              disabled={verificationCode.length !== 6 || isVerifying}
              className="w-full bg-gradient-to-r from-saffron-500 to-orange-500 hover:from-saffron-600 hover:to-orange-600"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Verify Email
                </>
              )}
            </Button>
          </div>

          <div className="text-center space-y-3">
            <p className="text-sm text-gray-600">Didn't receive the code?</p>

            <Button
              variant="outline"
              onClick={handleResendCode}
              disabled={isResending || countdown > 0}
              className="w-full"
            >
              {isResending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : countdown > 0 ? (
                `Resend in ${countdown}s`
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Resend Code
                </>
              )}
            </Button>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                For demo purposes, enter any 6-digit number to verify
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Example: 123456 or 999999
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
