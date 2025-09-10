
import React from 'react';
import { useRfpForm } from './context/RfpFormContext';
import StepIndicator from './steps/StepIndicator';
import BasicInfoStep from './steps/BasicInfoStep';
import ProductCategoryStep from './steps/ProductCategoryStep';
import AttributesStep from './steps/AttributesStep';
import VendorSelectionStep from './steps/VendorSelectionStep';
import TimelineStep from './steps/TimelineStep';
import ReviewStep from './steps/ReviewStep';
import RfpDraftPreviewStep from './steps/RfpDraftPreviewStep';
import { productCategories } from './rfp-form-data';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft, Save } from 'lucide-react';

const RfpFormContent: React.FC = () => {
  const { 
    step, 
    title, 
    setTitle, 
    selectedCategory, 
    setSelectedCategory, 
    mrvSubcategories, 
    toggleSubcategory, 
    environmentalAttributes, 
    toggleAttribute,
    customAttributes,
    setCustomAttributes,
    vendorOptions, 
    toggleVendorOption,
    vendorContacts,
    handleNext,
    handlePrevious,
    handleSubmit,
    saveDraft,
    isNextDisabled,
    generatedDraft,
    isGeneratingDraft,
    generateDraft,
    timeline,
    updateTimelineItem
  } = useRfpForm();

  const totalSteps = 7;

  return (
    <>
      <div className="space-y-4 py-4">
        <StepIndicator currentStep={step} totalSteps={totalSteps} />
        {step === 1 && <BasicInfoStep title={title} setTitle={setTitle} />}
        {step === 2 && (
          <ProductCategoryStep
            productCategories={productCategories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            mrvSubcategories={mrvSubcategories}
            toggleSubcategory={toggleSubcategory}
          />
        )}
        {step === 3 && (
          <AttributesStep
            environmentalAttributes={environmentalAttributes}
            toggleAttribute={toggleAttribute}
            customAttributes={customAttributes}
            setCustomAttributes={setCustomAttributes}
          />
        )}
        {step === 4 && (
          <VendorSelectionStep
            vendorOptions={vendorOptions}
            toggleVendorOption={toggleVendorOption}
          />
        )}
        {step === 5 && (
          <TimelineStep
            timeline={timeline}
            updateTimelineItem={updateTimelineItem}
          />
        )}
        {step === 6 && <ReviewStep />}
        {step === 7 && (
          <RfpDraftPreviewStep
            generatedDraft={generatedDraft}
            isGenerating={isGeneratingDraft}
            regenerateDraft={generateDraft}
          />
        )}
      </div>
      <div className="flex flex-row justify-between space-x-2">
        <div>
          {step > 1 && (
            <Button variant="outline" onClick={handlePrevious}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          )}
        </div>
        <div className="flex space-x-2">
          {step >= 2 && step < 7 && (
            <Button variant="outline" onClick={saveDraft} type="button">
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
          )}
          {step < 6 ? (
            <Button disabled={isNextDisabled()} onClick={handleNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : step === 6 ? (
            <Button 
              onClick={() => {
                generateDraft();
                handleNext();
              }}
            >
              Generate Draft
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Create RFP
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default RfpFormContent;
