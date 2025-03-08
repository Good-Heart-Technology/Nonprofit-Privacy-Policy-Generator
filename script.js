// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// FAQ Toggle functionality
function toggleFAQ() {
    const faqContent = document.getElementById('faq-answer');
    const faqIcon = document.getElementById('faq-icon');
    const toggleIcon = faqIcon.closest('.toggle-icon');
    
    faqContent.classList.toggle('show');
    
    // Toggle icon
    if (faqContent.classList.contains('show')) {
        faqIcon.classList.remove('fa-chevron-down');
        faqIcon.classList.add('fa-chevron-up');
        // Rotate the icon container
        if (toggleIcon) {
            toggleIcon.classList.add('rotated');
        }
    } else {
        faqIcon.classList.remove('fa-chevron-up');
        faqIcon.classList.add('fa-chevron-down');
        // Reset the icon container rotation
        if (toggleIcon) {
            toggleIcon.classList.remove('rotated');
        }
    }
}

// Generator launch function
function launchGenerator(path, event) {
    // If this function was called from an onclick event on an <a> tag,
    // prevent the default behavior to handle it ourselves
    if (event) {
        event.preventDefault();
    }
    
    // Open in a new tab
    window.open(path, '_blank');
}

document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Wizard navigation
    const questionCards = document.querySelectorAll('.question-card');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const generateButton = document.getElementById('generate-policy');
    const progressFill = document.getElementById('progress-fill');
    const currentStepText = document.getElementById('current-step');
    const steps = document.querySelectorAll('.step');
    
    // Form elements
    const websiteUrlInput = document.getElementById('org-website');
    const urlValidationMessage = document.getElementById('url-validation-message');
    const noDataCollectionCheckbox = document.getElementById('no-data-collection');
    const dataCollectionOptions = document.querySelector('.data-collection-options');
    const dataTypeCheckboxes = document.querySelectorAll('.data-collection-options input[name="data-type"]');
    
    // Initialize the wizard
    let currentStep = 1;
    updateProgressBar();
    
    // URL validation
    websiteUrlInput.addEventListener('input', validateUrl);
    websiteUrlInput.addEventListener('blur', validateUrl);
    
    function validateUrl() {
        const url = websiteUrlInput.value.trim();
        
        // If empty, don't show validation yet
        if (!url) {
            urlValidationMessage.textContent = '';
            return true;
        }
        
        // Check if URL has a protocol
        if (!url.match(/^https?:\/\//i)) {
            urlValidationMessage.textContent = 'URL should start with http:// or https://';
            return false;
        }
        
        // Check if URL is valid
        try {
            new URL(url);
            urlValidationMessage.textContent = '';
            return true;
        } catch (e) {
            urlValidationMessage.textContent = 'Please enter a valid URL';
            return false;
        }
    }
    
    // "We don't collect any personal information" checkbox
    noDataCollectionCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Disable and uncheck all other data collection options
            dataTypeCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
                checkbox.disabled = true;
            });
            dataCollectionOptions.classList.add('disabled');
        } else {
            // Enable all data collection options
            dataTypeCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
            });
            dataCollectionOptions.classList.remove('disabled');
        }
    });
    
    // Other data collection checkboxes should uncheck "We don't collect any personal information"
    dataTypeCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked && noDataCollectionCheckbox.checked) {
                noDataCollectionCheckbox.checked = false;
                // Re-enable all checkboxes
                dataTypeCheckboxes.forEach(cb => {
                    cb.disabled = false;
                });
                dataCollectionOptions.classList.remove('disabled');
            }
        });
    });
    
    // Next button click handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Simple validation before proceeding
            if (validateCurrentStep(currentStep)) {
                // Hide current question
                document.getElementById(`question-${currentStep}`).classList.remove('active');
                
                // Show next question
                document.getElementById(`question-${nextStep}`).classList.add('active');
                
                // Update current step
                currentStep = nextStep;
                updateProgressBar();
            }
        });
    });
    
    // Back button click handlers
    backButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            
            // Hide current question
            document.getElementById(`question-${currentStep}`).classList.remove('active');
            
            // Show previous question
            document.getElementById(`question-${prevStep}`).classList.add('active');
            
            // Update current step
            currentStep = prevStep;
            updateProgressBar();
        });
    });
    
    // Data sharing radio buttons
    const dataSharingRadios = document.querySelectorAll('input[name="data-sharing"]');
    const sharingDetails = document.querySelector('.sharing-details');
    
    dataSharingRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'yes' || this.value === 'limited') {
                sharingDetails.style.display = 'block';
            } else {
                sharingDetails.style.display = 'none';
            }
        });
    });
    
    // "We Don't Use Cookies" checkbox logic
    const cookieCheckboxes = document.querySelectorAll('input[name="cookie-type"]');
    const noCookiesCheckbox = document.querySelector('input[value="none"]');
    
    noCookiesCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Uncheck and disable all other cookie options
            cookieCheckboxes.forEach(checkbox => {
                if (checkbox.value !== 'none') {
                    checkbox.checked = false;
                    checkbox.disabled = true;
                }
            });
        } else {
            // Enable all cookie options and check only the essential cookies by default
            cookieCheckboxes.forEach(checkbox => {
                checkbox.disabled = false;
                if (checkbox.id === 'essential-cookies') {
                    checkbox.checked = true;
                }
            });
        }
    });
    
    // Other cookie checkboxes should uncheck "We Don't Use Cookies"
    cookieCheckboxes.forEach(checkbox => {
        if (checkbox.value !== 'none') {
            checkbox.addEventListener('change', function() {
                if (this.checked && noCookiesCheckbox.checked) {
                    noCookiesCheckbox.checked = false;
                    // Re-enable all checkboxes
                    cookieCheckboxes.forEach(cb => {
                        cb.disabled = false;
                    });
                }
            });
        }
    });
    
    // Generate button click handler
    generateButton.addEventListener('click', function() {
        if (validateCurrentStep(currentStep)) {
            generatePrivacyPolicy();
        }
    });
    
    // Update progress bar and step indicators
    function updateProgressBar() {
        // Update progress percentage
        const progressPercentage = ((currentStep - 1) / 4) * 100;
        progressFill.style.width = `${progressPercentage}%`;
        
        // Update step text
        currentStepText.textContent = currentStep;
        
        // Update step indicators
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            
            if (stepNumber < currentStep) {
                step.classList.add('completed');
                step.classList.add('active');
            } else if (stepNumber === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
    }
    
    // Validate current step
    function validateCurrentStep(step) {
        switch(step) {
            case 1:
                // Validate organization info
                const orgName = document.getElementById('org-name').value.trim();
                const orgWebsite = document.getElementById('org-website').value.trim();
                
                if (!orgName) {
                    alert('Please enter your organization name.');
                    return false;
                }
                
                if (!orgWebsite) {
                    alert('Please enter your website URL.');
                    return false;
                }
                
                // Validate URL format
                if (!validateUrl()) {
                    return false;
                }
                
                return true;
                
            case 2:
                // Validate data collection (at least one checkbox)
                const noDataCollection = document.getElementById('no-data-collection').checked;
                const dataTypes = document.querySelectorAll('.data-collection-options input[name="data-type"]:checked');
                
                if (!noDataCollection && dataTypes.length === 0) {
                    alert('Please select at least one type of data that you collect or select "We don\'t collect any personal information".');
                    return false;
                }
                
                return true;
                
            case 3:
                // Validate cookie usage (at least one checkbox)
                const cookieTypes = document.querySelectorAll('input[name="cookie-type"]:checked');
                
                if (cookieTypes.length === 0) {
                    alert('Please select at least one option for cookie usage.');
                    return false;
                }
                
                return true;
                
            case 4:
                // Validate data sharing
                const dataSharing = document.querySelector('input[name="data-sharing"]:checked');
                
                if (!dataSharing) {
                    alert('Please select an option for data sharing.');
                    return false;
                }
                
                // If "Yes" or "Limited" is selected, validate details
                if ((dataSharing.value === 'yes' || dataSharing.value === 'limited') && 
                    document.getElementById('sharing-details').value.trim() === '') {
                    alert('Please provide details about your data sharing practices.');
                    return false;
                }
                
                return true;
                
            case 5:
                // Validate contact email
                const contactEmail = document.getElementById('contact-email').value.trim();
                
                if (!contactEmail) {
                    alert('Please enter a contact email for privacy inquiries.');
                    return false;
                }
                
                // Simple email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(contactEmail)) {
                    alert('Please enter a valid email address.');
                    return false;
                }
                
                return true;
                
            default:
                return true;
        }
    }
    
    // Generate privacy policy
    function generatePrivacyPolicy() {
        // Collect all form data
        const formData = {
            organization: {
                name: document.getElementById('org-name').value.trim(),
                website: document.getElementById('org-website').value.trim()
            },
            dataCollection: {
                collectsNoData: document.getElementById('no-data-collection').checked,
                types: Array.from(document.querySelectorAll('.data-collection-options input[name="data-type"]:checked')).map(cb => cb.value)
            },
            cookieUsage: Array.from(document.querySelectorAll('input[name="cookie-type"]:checked')).map(cb => cb.value),
            dataSharing: {
                type: document.querySelector('input[name="data-sharing"]:checked').value,
                details: document.getElementById('sharing-details').value.trim()
            },
            contact: {
                email: document.getElementById('contact-email').value.trim()
            }
        };
        
        console.log('Form data collected:', formData);
        
        // In a real implementation, you would:
        // 1. Send this data to a server
        // 2. Generate the policy document
        // 3. Display it to the user or offer a download
        
        // For now, we'll just show an alert
        alert('Your privacy policy is being generated! In a real implementation, you would see your completed policy here or be able to download it.');
        
        // You could redirect to a results page
        // window.location.href = 'policy-result.html';
    }
}); 