export default function Step1Intro({ nextStep, currentStep, totalSteps }) {
  return (
    <>
      <p className="step-text">
        Step {currentStep} of {totalSteps}
      </p>

      <h1 className="title">Submit Your Layoff Story</h1>
      <p className="subtitle">
        This short form will guide you through sharing your experience.
      </p>

      <div className="button-row">
        <div />
        <button onClick={nextStep}>Start</button>
      </div>
    </>
  );
}