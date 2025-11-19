import React from 'react';
import '../css/PageLayout.css';

const PageLayout = ({ 
  title, 
  pagePreview, 
  formFields, 
  footerActions,
  mode = 'details' // 'details' or 'preview'
}) => {
  return (
    <div className="page-layout-container">
      <div className="page-layout-header">
        <h1 className="page-layout-title">{title}</h1>
      </div>

      <div className="page-layout-content">
        {/* Left Section - Page Preview */}
        <div className="page-layout-preview">
          <div className="page-preview-container">
            {pagePreview}
          </div>
        </div>

        {/* Right Section - Form Fields */}
        <div className="page-layout-form">
          <div className="page-form-container">
            {formFields}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      {footerActions && (
        <div className="page-layout-footer">
          {footerActions}
        </div>
      )}
    </div>
  );
};

export default PageLayout;

