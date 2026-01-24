import { useState, useRef, useLayoutEffect, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft, Check } from "lucide-react";
import TrustedBySection from "@/components/TrustedBySection";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";

function useMeasuredHeight() {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    if (!ref.current) return;

    const measureHeight = () => {
      if (ref.current) {
        setHeight(ref.current.offsetHeight);
      }
    };

    measureHeight();

    const resizeObserver = new ResizeObserver(measureHeight);
    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  return [ref, height] as const;
}

export default function Signup() {
  const [signupStep, setSignupStep] = useState<'domain' | 'method' | 'email' | 'verify'>('domain');
  const [domain, setDomain] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [verificationCode, setVerificationCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [contentRef, contentHeight] = useMeasuredHeight();

  useEffect(() => {
    if (signupStep === 'verify' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [signupStep, timeLeft]);

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {[key: string]: string} = {};
    
    if (!domain.trim()) {
      errors.domain = "Domain is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setFieldErrors({});
    console.log("Domain claimed:", domain);
    setSignupStep('method');
  };

  const handleEmailSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {[key: string]: string} = {};
    
    if (!formData.name) {
      errors.name = "Name is required";
    }
    if (!formData.email) {
      errors.email = "Email is required";
    }
    if (!formData.password) {
      errors.password = "Password is required";
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    setFieldErrors({});
    console.log("Email signup:", { domain, ...formData });
    setSignupStep('verify');
    setTimeLeft(30);
  };

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verification code:", verificationCode);
  };

  const handleResendCode = () => {
    console.log("Resending code");
    setTimeLeft(30);
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked with domain:", domain);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Simple 3x3 Grid Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none grid grid-cols-3 grid-rows-3 gap-8 p-8">
        {/* Row 1 */}
        <div className="bg-muted/25 rounded-[4rem]" />
        <div className="bg-muted/30 rounded-[5rem]" />
        <div className="bg-muted/25 rounded-[4rem]" />
        
        {/* Row 2 */}
        <div className="bg-muted/30 rounded-[5rem]" />
        <div className="bg-muted/25 rounded-[4rem]" />
        <div className="bg-muted/30 rounded-[5rem]" />
        
        {/* Row 3 */}
        <div className="bg-muted/25 rounded-[4rem]" />
        <div className="bg-muted/30 rounded-[5rem]" />
        <div className="bg-muted/25 rounded-[4rem]" />
      </div>
      
      <div className="flex-1 flex flex-col relative z-10">
        <div className="pt-8 pb-4 flex justify-center">
          <Link href="/" className="cursor-pointer" data-testid="link-home">
            <svg width="166" height="33" viewBox="0 0 166 33" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto" data-testid="logo-icon">
            <path d="M15.4028 0.779664C15.6377 -0.259891 17.1189 -0.259886 17.3537 0.779669L18.9775 7.96851C19.1297 8.64225 19.9029 8.9625 20.4869 8.59371L26.7184 4.65866C27.6195 4.08962 28.6669 5.137 28.0979 6.03812L24.1628 12.2696C23.794 12.8537 24.1143 13.6268 24.788 13.779L31.9769 15.4028C33.0164 15.6377 33.0164 17.1189 31.9769 17.3537L24.788 18.9775C24.1143 19.1297 23.794 19.9029 24.1628 20.4869L28.0979 26.7184C28.6669 27.6195 27.6195 28.6669 26.7184 28.0979L20.4869 24.1628C19.9029 23.794 19.1297 24.1143 18.9775 24.788L17.3537 31.9769C17.1189 33.0164 15.6377 33.0164 15.4028 31.9769L13.779 24.788C13.6268 24.1143 12.8537 23.794 12.2696 24.1628L6.03812 28.0979C5.137 28.6669 4.08963 27.6195 4.65866 26.7184L8.59371 20.4869C8.9625 19.9029 8.64225 19.1297 7.96851 18.9775L0.779664 17.3537C-0.259891 17.1189 -0.259886 15.6377 0.779669 15.4028L7.96851 13.779C8.64225 13.6268 8.9625 12.8537 8.59371 12.2696L4.65866 6.03812C4.08962 5.137 5.137 4.08963 6.03812 4.65866L12.2696 8.59371C12.8537 8.9625 13.6268 8.64225 13.779 7.96851L15.4028 0.779664Z" fill="#FF553E"/>
            <path d="M152.495 17.7614C152.495 13.6364 155.72 10.3864 159.745 10.3864C163.27 10.3864 165.645 12.6364 165.645 15.9864C165.645 20.1114 162.445 23.3614 158.395 23.3614C154.87 23.3614 152.495 21.1114 152.495 17.7614ZM155.495 17.5364C155.495 19.4864 156.67 20.7614 158.57 20.7614C160.82 20.7614 162.645 18.7364 162.645 16.2114C162.645 14.2364 161.47 12.9614 159.595 12.9614C157.345 12.9614 155.495 14.9864 155.495 17.5364Z" fill="currentColor"/>
            <path d="M150.066 8.21142C149.166 8.21142 148.541 7.53642 148.541 6.68643C148.541 5.58642 149.516 4.58643 150.641 4.58643C151.516 4.58643 152.166 5.23642 152.166 6.11143C152.166 7.18642 151.166 8.21142 150.066 8.21142ZM146.266 23.0614L148.216 10.7114H151.141L149.191 23.0614H146.266Z" fill="currentColor"/>
            <path d="M143.064 23.0614H140.139L143.064 4.46143H146.014L143.064 23.0614Z" fill="currentColor"/>
            <path d="M125.591 17.7614C125.591 13.6364 128.816 10.3864 132.841 10.3864C136.366 10.3864 138.741 12.6364 138.741 15.9864C138.741 20.1114 135.541 23.3614 131.491 23.3614C127.966 23.3614 125.591 21.1114 125.591 17.7614ZM128.591 17.5364C128.591 19.4864 129.766 20.7614 131.666 20.7614C133.916 20.7614 135.741 18.7364 135.741 16.2114C135.741 14.2364 134.566 12.9614 132.691 12.9614C130.441 12.9614 128.591 14.9864 128.591 17.5364Z" fill="currentColor"/>
            <path d="M118.183 10.7114H119.933L120.183 9.16142C120.683 6.06143 122.408 4.46143 125.233 4.46143C125.733 4.46143 126.283 4.48643 126.733 4.58643L126.333 7.11143C125.983 7.11143 125.658 7.08642 125.308 7.08642C123.983 7.08642 123.308 7.71143 123.083 9.16142L122.833 10.7114H125.733L125.333 13.1614H122.458L120.883 23.0614H117.983L119.558 13.1614H117.783L118.183 10.7114Z" fill="currentColor"/>
            <path d="M106.761 23.0614H103.711V10.7114H106.536L106.786 12.3114C107.561 11.0614 109.061 10.3364 110.736 10.3364C113.836 10.3364 115.436 12.2614 115.436 15.4614V23.0614H112.386V16.1864C112.386 14.1114 111.361 13.1114 109.786 13.1114C107.911 13.1114 106.761 14.4114 106.761 16.4114V23.0614Z" fill="currentColor"/>
            <path d="M87.6544 16.6114C87.6544 13.0114 90.0044 10.3114 93.5294 10.3114C95.3794 10.3114 96.8294 11.0864 97.5544 12.4114L97.7294 10.7114H100.554V22.4364C100.554 26.5614 98.0794 29.1364 94.0794 29.1364C90.5294 29.1364 88.1044 27.1114 87.7294 23.8114H90.7794C90.9794 25.4114 92.2044 26.3614 94.0794 26.3614C96.1794 26.3614 97.5294 25.0364 97.5294 22.9864V20.9364C96.7544 22.0864 95.2294 22.8114 93.4544 22.8114C89.9544 22.8114 87.6544 20.1864 87.6544 16.6114ZM90.7294 16.5364C90.7294 18.6114 92.0544 20.1614 94.0544 20.1614C96.1544 20.1614 97.4544 18.6864 97.4544 16.5364C97.4544 14.4364 96.1794 12.9864 94.0544 12.9864C92.0294 12.9864 90.7294 14.5114 90.7294 16.5364Z" fill="currentColor"/>
            <path d="M83.6782 8.2364C82.6282 8.2364 81.8032 7.4114 81.8032 6.3864C81.8032 5.3614 82.6282 4.5614 83.6782 4.5614C84.6782 4.5614 85.5032 5.3614 85.5032 6.3864C85.5032 7.4114 84.6782 8.2364 83.6782 8.2364ZM82.1532 23.0614V10.7114H85.2032V23.0614H82.1532Z" fill="currentColor"/>
            <path d="M69.631 19.3114H72.531C72.556 20.3864 73.356 21.0614 74.756 21.0614C76.181 21.0614 76.956 20.4864 76.956 19.5864C76.956 18.9614 76.631 18.5114 75.531 18.2614L73.306 17.7364C71.081 17.2364 70.006 16.1864 70.006 14.2114C70.006 11.7864 72.056 10.3364 74.906 10.3364C77.681 10.3364 79.556 11.9364 79.581 14.3364H76.681C76.656 13.2864 75.956 12.6114 74.781 12.6114C73.581 12.6114 72.881 13.1614 72.881 14.0864C72.881 14.7864 73.431 15.2364 74.481 15.4864L76.706 16.0114C78.781 16.4864 79.831 17.4364 79.831 19.3364C79.831 21.8364 77.706 23.3864 74.656 23.3864C71.581 23.3864 69.631 21.7364 69.631 19.3114Z" fill="currentColor"/>
            <path d="M62.1899 23.3864C58.5149 23.3864 55.9399 20.7114 55.9399 16.8864C55.9399 13.0114 58.4649 10.3364 62.0899 10.3364C65.7899 10.3364 68.1399 12.8114 68.1399 16.6614V17.5864L58.8399 17.6114C59.0649 19.7864 60.2149 20.8864 62.2399 20.8864C63.9149 20.8864 65.0149 20.2364 65.3649 19.0614H68.1899C67.6649 21.7614 65.4149 23.3864 62.1899 23.3864ZM62.1149 12.8364C60.3149 12.8364 59.2149 13.8114 58.9149 15.6614H65.1149C65.1149 13.9614 63.9399 12.8364 62.1149 12.8364Z" fill="currentColor"/>
            <path d="M46.2614 23.3864C42.6864 23.3864 40.4614 20.7614 40.4614 16.9364C40.4614 13.0864 42.7114 10.3364 46.4364 10.3364C48.1614 10.3364 49.6864 11.0614 50.4614 12.2864V4.46143H53.4864V23.0614H50.6864L50.4864 21.1364C49.7364 22.5614 48.1364 23.3864 46.2614 23.3864ZM46.9364 20.5864C49.0614 20.5864 50.4364 19.0614 50.4364 16.8364C50.4364 14.6114 49.0614 13.0614 46.9364 13.0614C44.8114 13.0614 43.5114 14.6364 43.5114 16.8364C43.5114 19.0364 44.8114 20.5864 46.9364 20.5864Z" fill="currentColor"/>
          </svg>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card className="bg-white/95 backdrop-blur-sm py-8 px-6 sm:px-8 border-0 rounded-3xl shadow-2xl overflow-hidden">
            <motion.div
              initial={false}
              animate={{ height: contentHeight || "auto" }}
              transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <div ref={contentRef}>
            <AnimatePresence mode="wait" initial={false}>
            {signupStep === 'verify' ? (
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSignupStep('email');
                    setFormData({ name: "", email: "", password: "" });
                    setVerificationCode("");
                  }}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground -ml-2 mb-6 hover-elevate px-2 py-1 rounded-md"
                  data-testid="button-back-to-signup"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>

                <div className="mb-8">
                  <h1 className="font-semibold text-2xl mb-2 text-foreground" data-testid="text-verify-headline">
                    Verify Email
                  </h1>
                  <p className="text-sm text-foreground/60" data-testid="text-verify-description">
                    We have sent an email to with a verification code. Please enter it below confirm your email.
                  </p>
                </div>

                <form onSubmit={handleVerifyEmail} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="verification-code" className="text-sm font-medium text-foreground">
                      Verification code<span className="text-red-500">*</span>
                    </Label>
                    <div className="bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out">
                      <Input
                        id="verification-code"
                        type="text"
                        placeholder="Enter one time code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                        className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-base placeholder:text-muted-foreground/60"
                        data-testid="input-verification-code"
                      />
                    </div>
                    <div className="flex items-center gap-2 text-sm pt-1">
                      {timeLeft > 0 ? (
                        <>
                          <span className="text-foreground/70">Time left: {timeLeft} sec</span>
                          <button
                            type="button"
                            disabled
                            className="text-red-400 font-medium opacity-50 cursor-not-allowed"
                            data-testid="button-resend-code"
                          >
                            Resend code
                          </button>
                        </>
                      ) : (
                        <>
                          <span className="text-foreground/70">Didn't received the code?</span>
                          <button
                            type="button"
                            onClick={handleResendCode}
                            className="text-red-400 hover:text-red-500 font-medium"
                            data-testid="button-resend-code"
                          >
                            Resend code
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors"
                    data-testid="button-confirm"
                  >
                    Confirm
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSignupStep('email');
                        setFormData({ name: "", email: "", password: "" });
                        setVerificationCode("");
                      }}
                      className="text-sm text-foreground/70 hover:text-foreground font-medium hover:underline"
                      data-testid="button-change-email"
                    >
                      Change email address
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : signupStep === 'domain' ? (
              <motion.div
                key="domain"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="text-center mb-8">
                  <h1 className="font-semibold text-2xl mb-2 text-foreground" data-testid="text-signup-headline">
                    First, claim your unique link
                  </h1>
                  <p className="text-sm text-foreground/60" data-testid="text-signup-description">
                    Choose your personal domain to get started
                  </p>
                </div>

                <form onSubmit={handleDomainSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="domain" className="text-sm font-medium text-foreground">
                      Your Domain
                    </Label>
                    <div className="flex items-center bg-white dark:bg-white border-2 border-border rounded-full hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)] transition-all duration-300 ease-out overflow-hidden">
                      <Input
                        id="domain"
                        type="text"
                        placeholder="yourname"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        required
                        className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-base placeholder:text-muted-foreground/60 flex-1"
                        data-testid="input-domain"
                      />
                      <span className="text-sm text-muted-foreground/60 pr-4 whitespace-nowrap">
                        .designfolio.me
                      </span>
                    </div>
                    <AnimatePresence>
                      {domain && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <Check className="w-4 h-4" />
                            <span>{domain}.designfolio.me is available!</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors"
                    disabled={!domain.trim()}
                    data-testid="button-claim-domain"
                  >
                    Continue
                  </Button>

                  <p className="text-center text-sm text-foreground/70 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="hover:underline font-medium" style={{ color: '#FF553E' }} data-testid="link-login">
                      Log in
                    </Link>
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="account"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              >
                <button
                  type="button"
                  onClick={() => signupStep === 'email' ? setSignupStep('method') : setSignupStep('domain')}
                  className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground -ml-2 mb-6 hover-elevate px-2 py-1 rounded-md"
                  data-testid={signupStep === 'email' ? "button-back" : "button-back-to-domain"}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="text-center mb-6">
                  <h1 className="font-semibold text-2xl mb-2 text-foreground" data-testid="text-signup-headline">
                    Now, create your account.
                  </h1>
                  <p className="text-sm text-foreground/60" data-testid="text-signup-description">
                    Just a step away from claiming <span className="font-medium" style={{ color: '#FF553E' }}>{domain}.designfolio.me</span>
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {signupStep === 'method' ? (
                    <motion.div
                      key="method-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                      className="space-y-4"
                    >
                      <div 
                        className="bg-white border border-border rounded-full px-5 py-3 flex items-center justify-center gap-3 hover-elevate cursor-pointer"
                        onClick={handleGoogleSignup}
                        data-testid="button-signup-google"
                      >
                        <img src="/googlesignup.svg" alt="" className="w-5 h-5" />
                        <span className="text-base font-medium text-foreground">
                          Sign up with Google
                        </span>
                      </div>

                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-3 text-muted-foreground font-medium">
                            OR
                          </span>
                        </div>
                      </div>

                      <div 
                        className="bg-white border border-border rounded-full px-5 py-3 flex items-center justify-center gap-3 hover-elevate cursor-pointer"
                        onClick={() => setSignupStep('email')}
                        data-testid="button-signup-email"
                      >
                        <Mail className="w-5 h-5 text-foreground" />
                        <span className="text-base font-medium text-foreground">
                          Sign up with Email
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="email-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >

              <form onSubmit={handleEmailSignup} className="space-y-5">

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="name" className="text-sm font-medium text-foreground">
                    Full name<span className="text-red-500">*</span>
                  </Label>
                  <div className={`bg-white dark:bg-white border-2 rounded-full transition-all duration-300 ease-out ${
                    fieldErrors.name 
                      ? 'border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]' 
                      : 'border-border hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)]'
                  }`}>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) {
                          setFieldErrors({ ...fieldErrors, name: "" });
                        }
                      }}
                      className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-base placeholder:text-muted-foreground/60"
                      data-testid="input-name"
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-sm text-red-500 mt-1" data-testid="error-name">
                      {fieldErrors.name}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email address<span className="text-red-500">*</span>
                  </Label>
                  <div className={`bg-white dark:bg-white border-2 rounded-full transition-all duration-300 ease-out ${
                    fieldErrors.email 
                      ? 'border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]' 
                      : 'border-border hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)]'
                  }`}>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) {
                          setFieldErrors({ ...fieldErrors, email: "" });
                        }
                      }}
                      className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-base placeholder:text-muted-foreground/60"
                      data-testid="input-email"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-sm text-red-500 mt-1" data-testid="error-email">
                      {fieldErrors.email}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password<span className="text-red-500">*</span>
                  </Label>
                  <div className={`bg-white dark:bg-white border-2 rounded-full transition-all duration-300 ease-out ${
                    fieldErrors.password 
                      ? 'border-red-500 shadow-[0_0_0_4px_rgba(239,68,68,0.12)]' 
                      : 'border-border hover:border-foreground/20 focus-within:border-foreground/30 focus-within:shadow-[0_0_0_4px_hsl(var(--foreground)/0.12)]'
                  }`}>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        if (fieldErrors.password) {
                          setFieldErrors({ ...fieldErrors, password: "" });
                        }
                      }}
                      className="border-0 bg-transparent h-11 px-4 focus-visible:ring-0 focus-visible:ring-offset-0 text-base text-foreground placeholder:text-base placeholder:text-muted-foreground/60"
                      data-testid="input-password"
                    />
                  </div>
                  {fieldErrors.password && (
                    <p className="text-sm text-red-500 mt-1" data-testid="error-password">
                      {fieldErrors.password}
                    </p>
                  )}
                  {!fieldErrors.password && (
                    <p className="text-xs text-muted-foreground pt-1">
                      Must be at least 8 characters long
                    </p>
                  )}
                </motion.div>

                <Button
                  type="submit"
                  className="w-full bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none border-0 rounded-full h-11 px-6 text-base font-semibold no-default-hover-elevate no-default-active-elevate transition-colors"
                  data-testid="button-create-account"
                >
                  Create account
                </Button>

                <p className="text-center text-xs text-muted-foreground">
                  By continuing, you agree to Designfolio's{" "}
                  <Link href="/terms-conditions">
                    <a className="hover:underline" style={{ color: '#FF553E' }} data-testid="link-terms">
                      Terms of Service
                    </a>
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy">
                    <a className="hover:underline" style={{ color: '#FF553E' }} data-testid="link-privacy">
                      Privacy Policy
                    </a>
                  </Link>
                </p>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-muted-foreground font-medium">
                      OR
                    </span>
                  </div>
                </div>

                <div 
                  className="bg-white border border-border rounded-full px-5 py-3 flex items-center justify-center gap-3 hover-elevate cursor-pointer"
                  onClick={handleGoogleSignup}
                  data-testid="button-signup-google-alt"
                >
                  <img src="/googlesignup.svg" alt="" className="w-5 h-5" />
                  <span className="text-base font-medium text-foreground">
                    Sign up with Google
                  </span>
                </div>
              </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            </AnimatePresence>
              </div>
            </motion.div>
            </Card>
          </motion.div>
        </div>

        <TrustedBySection backgroundColor="transparent" />
      </div>
    </div>
  );
}
