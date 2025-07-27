import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationStatus, setVerificationStatus] = useState<null | 'success' | 'error' | 'expired'>(null);

  useEffect(() => {
    // Check for token in URL on component mount
    const token = searchParams.get('token');
    if (token) {
      setVerificationCode(token);
      handleVerifyEmail(token);
    }
  }, [searchParams]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleVerifyEmail = async (token = verificationCode) => {
    if (!token.trim()) return;

    setIsVerifying(true);
    setVerificationStatus(null);
    
    try {
      const success = await verifyEmail(token);

      if (success) {
        setVerificationStatus('success');
        setVerificationCode("");
        onVerified?.();
        // Redirect after a short delay to show success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setVerificationStatus('error');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      if (error.message?.includes('expired')) {
        setVerificationStatus('expired');
      } else {
        setVerificationStatus('error');
      }
    } finally {
      setIsVerifying(false);
    }
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
    setVerificationCode(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && verificationCode) {
      handleVerifyEmail();
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please log in to verify your email.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

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

          {verificationStatus === 'success' ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Email verified successfully! Redirecting you to your dashboard...
              </AlertDescription>
            </Alert>
          ) : verificationStatus === 'expired' ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This verification link has expired. Please request a new one.
              </AlertDescription>
            </Alert>
          ) : verificationStatus === 'error' ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Invalid verification token. Please check the link or request a new one.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="verification-code"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Token
                </label>
                <Input
                  id="verification-code"
                  type="text"
                  value={verificationCode}
                  onChange={handleCodeChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Paste your verification token here"
                  disabled={isVerifying}
                  className="text-base h-12"
                />
              </div>
              <Button
                onClick={() => handleVerifyEmail()}
                disabled={!verificationCode || isVerifying}
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

              <div className="text-center space-y-3 pt-4 border-t border-gray-200 mt-4">
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
