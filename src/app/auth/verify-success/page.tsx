"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function VerifySuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <Image
              src="/Logo.png"
              alt="Gear Up Logo"
              width={60}
              height={60}
              className="h-15 w-auto"
            />
            <span className="text-3xl font-bold text-white">Gear Up</span>
          </Link>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your email has been verified. You can now log in to your account.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Redirecting to login in 5 seconds...
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary hover:bg-secondary transition-colors duration-200"
            >
              Go to Login Now
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-sm text-ternary">
            Need help?{' '}
            <Link href="/contact" className="font-medium text-white hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
