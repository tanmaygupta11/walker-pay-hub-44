import { useState } from "react";
import { LoginPage } from "./login-page";
import { BasicDetailsPage } from "./basic-details-page";
import { PayoutDetailsPage } from "./payout-details-page";
import { DaywiseDetailsPage } from "./daywise-details-page";
import { VerificationDialog } from "./verification-dialog";
import { WalkerConcernPage } from "./walker-concern-page";
import { ConfirmationPage } from "./confirmation-page";
import { ConcernSubmittedPage } from "./concern-submitted-page";
import { WalkerDetails } from "@/types/walker";

type Step = 'login' | 'basic-details' | 'payout-details' | 'daywise-details' | 'verification' | 'walker-concern' | 'confirmation' | 'concern-submitted';

export function WalkerPortal() {
  const [currentStep, setCurrentStep] = useState<Step>('login');
  const [walkerData, setWalkerData] = useState<WalkerDetails | null>(null);
<<<<<<< HEAD
  const [selectedBillingCycle, setSelectedBillingCycle] = useState<string>("");

  const handleLoginSuccess = (data: WalkerDetails) => {
    setWalkerData(data);
    setCurrentStep('payout-details');
=======

  const handleLoginSuccess = (data: WalkerDetails) => {
    setWalkerData(data);
    setCurrentStep('basic-details');
>>>>>>> dcf3ddfc010611596681cae27ad1869038839c93
  };

  const handleBackToHome = () => {
    setCurrentStep('login');
    setWalkerData(null);
  };

  return (
    <>
      {currentStep === 'login' && (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      )}

<<<<<<< HEAD
      {currentStep === 'basic-details' && walkerData && null}

      {currentStep === 'payout-details' && (
        <PayoutDetailsPage
          onBack={() => setCurrentStep('login')}
          onViewDaywise={() => setCurrentStep('daywise-details')}
          onProceed={() => setCurrentStep('verification')}
          selectedBillingCycle={selectedBillingCycle}
          setSelectedBillingCycle={setSelectedBillingCycle}
          walkerData={walkerData}
=======
      {currentStep === 'basic-details' && walkerData && (
        <BasicDetailsPage
          walkerData={walkerData}
          onProceed={() => setCurrentStep('payout-details')}
          onBack={() => setCurrentStep('login')}
        />
      )}

      {currentStep === 'payout-details' && (
        <PayoutDetailsPage
          onBack={() => setCurrentStep('basic-details')}
          onViewDaywise={() => setCurrentStep('daywise-details')}
          onProceed={() => setCurrentStep('verification')}
>>>>>>> dcf3ddfc010611596681cae27ad1869038839c93
        />
      )}

      {currentStep === 'daywise-details' && (
        <DaywiseDetailsPage
          onBack={() => setCurrentStep('payout-details')}
<<<<<<< HEAD
          onBackWithState={() => setCurrentStep('payout-details')}
=======
>>>>>>> dcf3ddfc010611596681cae27ad1869038839c93
          onProceed={() => setCurrentStep('verification')}
        />
      )}

      {currentStep === 'verification' && (
        <VerificationDialog
          onBack={() => setCurrentStep('payout-details')}
          onYes={() => setCurrentStep('confirmation')}
<<<<<<< HEAD
          onConcernSubmitted={() => setCurrentStep('concern-submitted')}
=======
          onNo={() => setCurrentStep('walker-concern')}
>>>>>>> dcf3ddfc010611596681cae27ad1869038839c93
        />
      )}

      {currentStep === 'walker-concern' && (
        <WalkerConcernPage
          onBack={() => setCurrentStep('verification')}
          onSubmit={() => setCurrentStep('concern-submitted')}
        />
      )}

      {currentStep === 'confirmation' && (
        <ConfirmationPage onBackToHome={handleBackToHome} />
      )}

      {currentStep === 'concern-submitted' && (
        <ConcernSubmittedPage onBackToHome={handleBackToHome} />
      )}
    </>
  );
}