"use client";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import OTPVerification from "@/components/otp-verification";
import { useAuth } from "@/contexts/authContext";
import { handleSendOtp, verifyOtp } from "@/api/user";

export default function OtpPage() {
	const { user, token } = useAuth();
	const router = useNavigate();
	const hasInitialized = useRef(false);

	const handleVerify = async (otp: string): Promise<boolean> => {
		const result = await verifyOtp(user?.email as string, otp, token as string);
		if (result.error == null) {
			toast({
				title: "OTP Verified",
				description: "Your email has been verified successfully.",
			});
			return true;
		} else {
			toast({
				title: "Invalid OTP",
				description: result.error || "Please try again.",
				variant: "destructive",
			});
			return false;
		}
	};

	const handleResend = async (): Promise<boolean> => {
		const result = await handleSendOtp(user?.email as string, token as string);
		if (result.error == null) {
			toast({ title: "OTP Resent", description: "Check your email inbox." });
			return true;
		} else {
			toast({
				title: "Resend Failed",
				description: result.error,
				variant: "destructive",
			});
			return false;
		}
	};

	const handleBack = () => {
		router(-1);
	};

	useEffect(() => {
		if (hasInitialized.current) return;
		hasInitialized.current = true;

		if (!token || !user || user.isVerified) {
			toast({
				title: "Authentication Failed!",
				description: "Login first to verify.",
				variant: "destructive",
			});
			router("/login");
		} else {
			handleSendOtp(user.email as string, token as string);
		}
	}, []);

	return (
		<OTPVerification
			email={user?.email}
			onVerify={handleVerify}
			onResend={handleResend}
			onBack={handleBack}
		/>
	);
}
