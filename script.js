// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Initialize form navigation
    initializeFormNavigation();
    
    // Initialize form elements and their interactions
    initializeFormElements();
    
    // Initialize policy generation
    initializePolicyGeneration();
});

// ===== FORM NAVIGATION =====
function initializeFormNavigation() {
    // Get navigation elements
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentStepText = document.getElementById('current-step');
    const steps = document.querySelectorAll('.step');
    
    // Initialize the wizard
    let currentStep = 1;
    updateProgressBar();
    
    // Next button click handlers
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            let nextStep = parseInt(this.getAttribute('data-next'));
            
            // Check if we should skip the next step based on conditions
            const skipIfElementId = this.getAttribute('data-skip-if');
            if (skipIfElementId && document.getElementById(skipIfElementId)?.checked) {
                // If the element specified in data-skip-if is checked, skip to the step after next
                nextStep = nextStep + 1;
            }
            
            // Validate before proceeding
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
    
    // Toggle wizard button
    const toggleWizardBtn = document.getElementById('toggle-wizard-btn');
    const wizardContainer = document.getElementById('wizard-container');
    
    if (toggleWizardBtn && wizardContainer) {
        toggleWizardBtn.addEventListener('click', function() {
            if (wizardContainer.style.display === 'none') {
                wizardContainer.style.display = 'block';
                this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Form';
            } else {
                wizardContainer.style.display = 'none';
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Show Form';
            }
        });
    }
    
    // Update progress bar and step indicators
    function updateProgressBar() {
        // Update progress percentage (5 total steps)
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
}

// ===== FORM VALIDATION =====
// Validate URL format
function validateUrl() {
    const websiteInput = document.getElementById('org-website');
    const url = websiteInput.value.trim();
    
    if (!url) {
        return true; // Empty URL is valid (optional field)
    }
    
    // Check if URL has a protocol, if not add https://
    if (!/^https?:\/\//i.test(url)) {
        websiteInput.value = 'https://' + url;
    }
    
    try {
        new URL(websiteInput.value);
        return true;
    } catch (e) {
        return false;
    }
}

// Validate email format
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show validation message
function showValidationMessage(message) {
    alert(message); // Simple alert for now
}

// Validate current step
function validateCurrentStep(step) {
    switch(step) {
        case 1:
            // Validate organization name and website
            const orgName = document.getElementById('org-name').value.trim();
            const website = document.getElementById('org-website').value.trim();
            
            if (!orgName) {
                showValidationMessage('Please enter your organization name.');
                return false;
            }
            
            if (website && !validateUrl()) {
                showValidationMessage('Please enter a valid website URL.');
                return false;
            }
            
            return true;
            
        case 2:
            // Validate data collection
            const noDataCollectionCheckbox = document.getElementById('no-data-collection');
            const dataTypeCheckboxes = document.querySelectorAll('input[name="data-type"]:checked');
            
            // Either "We don't collect any personal information" should be checked OR at least one data type should be selected
            if (!noDataCollectionCheckbox.checked && dataTypeCheckboxes.length === 0) {
                showValidationMessage('Please select at least one type of data you collect, or select "We don\'t collect any personal information".');
                return false;
            }
            
            // If collecting specific data types, validate third-party services and data sharing
            const anyDataTypeSelected = Array.from(document.querySelectorAll('.data-collection-options input[type="checkbox"]:checked')).length > 0;
            if (anyDataTypeSelected) {
                const thirdPartyServices = document.getElementById('third-party-services').value.trim();
                if (!thirdPartyServices) {
                    showValidationMessage('Please provide information about your third-party service providers.');
                    return false;
                }

                const dataSharingRadios = document.querySelectorAll('input[name="data-sharing"]:checked');
                if (dataSharingRadios.length === 0) {
                    showValidationMessage('Please select whether you share user data with third parties.');
                    return false;
                }
            }
            
            return true;
            
        case 3:
            // Validate cookie usage
            const cookieCheckboxes = document.querySelectorAll('input[name="cookie-type"]:checked');
            
            if (cookieCheckboxes.length === 0) {
                showValidationMessage('Please select at least one cookie option.');
                return false;
            }
            
            return true;
            
        case 4:
            // Validate contact email
            const contactEmail = document.getElementById('contact-email').value.trim();
            
            if (!contactEmail) {
                showValidationMessage('Please enter a contact email address.');
                return false;
            }
            
            if (!validateEmail(contactEmail)) {
                showValidationMessage('Please enter a valid email address.');
                return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

// ===== FORM ELEMENTS INITIALIZATION =====
function initializeFormElements() {
    // Initialize URL validation
    const websiteUrlInput = document.getElementById('org-website');
    if (websiteUrlInput) {
        websiteUrlInput.addEventListener('input', validateUrl);
        websiteUrlInput.addEventListener('blur', validateUrl);
    }
    
    // DATA COLLECTION LOGIC - Question 2
    const noDataCollectionCheckbox = document.getElementById('no-data-collection');
    const dataCollectionOptions = document.querySelector('.data-collection-options');
    const thirdPartyServicesContainer = document.getElementById('third-party-services-container');
    const dataSharingContainer = document.getElementById('data-sharing-container');
    
    if (noDataCollectionCheckbox && dataCollectionOptions) {
        const dataTypeCheckboxes = document.querySelectorAll('.data-collection-options input[type="checkbox"]');
        
        // Function to check if any data type is selected and show/hide third-party services accordingly
        function updateDataCollectionVisibility() {
            const anyDataTypeSelected = Array.from(dataTypeCheckboxes).some(checkbox => checkbox.checked);
            
            if (thirdPartyServicesContainer) {
                if (anyDataTypeSelected) {
                    thirdPartyServicesContainer.style.display = 'block';
                    dataSharingContainer.style.display = 'block';
                } else {
                    thirdPartyServicesContainer.style.display = 'none';
                    dataSharingContainer.style.display = 'none';
                    // Clear the fields when hiding them
                    const thirdPartyServices = document.getElementById('third-party-services');
                    if (thirdPartyServices) {
                        thirdPartyServices.value = '';
                    }
                    // Uncheck data sharing radios
                    document.querySelectorAll('input[name="data-sharing"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
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
                
                // Hide third-party services and data sharing fields
                if (thirdPartyServicesContainer) {
                    thirdPartyServicesContainer.style.display = 'none';
                    dataSharingContainer.style.display = 'none';
                    const thirdPartyServices = document.getElementById('third-party-services');
                    if (thirdPartyServices) {
                        thirdPartyServices.value = '';
                    }
                    // Uncheck data sharing radios
                    document.querySelectorAll('input[name="data-sharing"]').forEach(radio => {
                        radio.checked = false;
                    });
                }
            } else {
                // Enable all data collection options
                dataTypeCheckboxes.forEach(checkbox => {
                    checkbox.disabled = false;
                });
                dataCollectionOptions.classList.remove('disabled');
                
                // Check if any data type is selected and show/hide third-party services
                updateDataCollectionVisibility();
            }
        });
        
        // Other data collection checkboxes
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
                
                // Check if any data type is selected and show/hide third-party services
                updateDataCollectionVisibility();
            });
        });
        
        // Initialize the third-party services field visibility
        updateDataCollectionVisibility();
    }
    
    // COOKIE USAGE LOGIC - Question 4
    const cookieCheckboxes = document.querySelectorAll('input[name="cookie-type"]');
    const noCookiesCheckbox = document.querySelector('input[name="cookie-type"][value="none"]');
    
    if (noCookiesCheckbox) {
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
                // Enable all cookie options and check the default ones
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
                        // Enable all cookie options
                        cookieCheckboxes.forEach(cb => {
                            if (cb.value !== 'none') {
                                cb.disabled = false;
                            }
                        });
                    }
                });
            }
        });
    }
}

// ===== POLICY GENERATION =====
function initializePolicyGeneration() {
    // Generate button click handler
    const generateButton = document.getElementById('generate-policy');
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            // Validate the final step
            if (validateCurrentStep(4)) {
                // Generate and display the policy
                generateAndDisplayPolicy();
            }
        });
    }
    
    // Copy buttons click handlers
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const policyContent = document.getElementById('policy-content');
            let textToCopy = '';
            
            if (policyContent) {
                if (format === 'markdown') {
                    // Use the original markdown
                    textToCopy = policyContent.getAttribute('data-markdown') || '';
                } else if (format === 'plaintext') {
                    // Get the raw markdown and convert it to plain text with proper line breaks
                    const markdown = policyContent.getAttribute('data-markdown') || '';
                    
                    // Convert markdown to plain text with proper formatting
                    textToCopy = convertMarkdownToPlainText(markdown);
                } else if (format === 'richtext') {
                    // Use the HTML content but remove the style tag
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = policyContent.innerHTML;
                    const styleTag = tempDiv.querySelector('style');
                    if (styleTag) {
                        styleTag.remove();
                    }
                    textToCopy = tempDiv.innerHTML;
                }
            }
            
            // Copy to clipboard
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                // Reset button text after 2 seconds
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
        });
    });
}

// Function to convert markdown to plain text with proper line breaks
function convertMarkdownToPlainText(markdown) {
    return markdown
        // Remove markdown heading syntax but keep the text
        .replace(/^# (.*$)/gm, '$1\n')
        .replace(/^## (.*$)/gm, '\n$1\n')
        .replace(/^### (.*$)/gm, '\n$1\n')
        
        // Remove bold and italic formatting but keep the text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        
        // Ensure proper line breaks for list items
        .replace(/- (.*$)/gm, '- $1\n')
        
        // Ensure double line breaks between sections
        .replace(/\n\n+/g, '\n\n')
        
        // Ensure the text starts and ends cleanly
        .trim();
}

// Function to generate and display the privacy policy
function generateAndDisplayPolicy() {
    // Check if no data collection is selected
    const collectsNoData = document.getElementById('no-data-collection').checked;
    const anyDataTypeSelected = Array.from(document.querySelectorAll('.data-collection-options input[type="checkbox"]:checked')).length > 0;
    
    // Collect form data
    const formData = {
        organization: {
            name: document.getElementById('org-name').value.trim(),
            website: document.getElementById('org-website').value.trim()
        },
        dataCollection: {
            collectsNoData: collectsNoData,
            anyDataTypeSelected: anyDataTypeSelected
        },
        thirdPartyServices: collectsNoData ? 
            "We do not use any third-party services to process personal data as we do not collect any personal information." : 
            (anyDataTypeSelected ? document.getElementById('third-party-services')?.value.trim() || null : null),
        cookieUsage: Array.from(document.querySelectorAll('input[name="cookie-type"]:checked')).map(cb => cb.value),
        dataSharing: document.querySelector('input[name="data-sharing"]:checked')?.value || 'no',
        contact: {
            email: document.getElementById('contact-email').value.trim()
        }
    };
    
    // Format the data types collected
    const dataTypes = Array.from(document.querySelectorAll('input[name="data-type"]:checked')).map(cb => cb.value);
    const personalDataTypes = formatDataTypes(dataTypes);
    
    // Format the cookie types used
    const cookieTypes = formatCookieTypes(formData.cookieUsage);
    
    // Format the data sharing text
    const dataSharingText = formatDataSharing(formData.dataSharing);
    
    // Generate the policy content
    const policyContent = generatePolicyContent(formData, personalDataTypes, cookieTypes, dataSharingText);
    
    // Display the policy
    displayPolicy(policyContent);
    
    // Show success message
    const successMessage = document.getElementById('success-message');
    if (successMessage) {
        successMessage.style.display = 'block';
    }
}

// ===== CONTENT FORMATTING =====
// Function to format data types
function formatDataTypes(types) {
    if (types.includes('none') || types.length === 0) {
        return "We do not collect any personal information.";
    }
    
    let formattedText = "";
    
    // Data type descriptions
    const dataTypeDescriptions = {
        'name': "- **Names**: We collect names to personalize our communications with you.",
        'email': "- **Email Addresses**: We collect email addresses to communicate with you about our programs and services.",
        'address': "- **Physical Addresses**: We collect physical addresses for donation receipts and occasional physical mailings.",
        'phone': "- **Phone Numbers**: We collect phone numbers to contact you about important updates or opportunities.",
        'donation': "- **Donation Information**: We collect donation information to process your contributions and provide tax receipts.",
        'other': "- **Other Information**: We may collect other information as specified in our communications with you."
    };
    
    types.forEach(type => {
        if (dataTypeDescriptions[type]) {
            formattedText += dataTypeDescriptions[type] + "\n";
        }
    });
    
    return formattedText;
}

// Function to format cookie types
function formatCookieTypes(types) {
    if (types.includes('none') || types.length === 0) {
        return "We do not use cookies on our website.";
    }
    
    let formattedText = "";
    
    // Cookie type descriptions
    const cookieDescriptions = {
        'essential': "- **Essential/Functional Cookies**: These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.",
        'analytics': "- **Analytics Cookies**: We use these cookies to collect information about how visitors use our website. This helps us improve our site and your experience.",
        'marketing': "- **Marketing/Advertising Cookies**: These cookies track your online activity to help advertisers deliver more relevant advertising or to limit how many times you see an ad.",
        'social': "- **Social Media Cookies**: These cookies enable social media features on our website, such as sharing content on social platforms."
    };
    
    types.forEach(type => {
        if (cookieDescriptions[type]) {
            formattedText += cookieDescriptions[type] + "\n";
        }
    });
    
    return formattedText;
}

// Function to format data sharing
function formatDataSharing(type) {
    let baseText = "As a nonprofit organization committed to transparency, we may share information under these specific circumstances:\n\n";
    baseText += "- **Service Providers**: With trusted partners who help us operate our website, process donations, or deliver our programs.\n";
    baseText += "- **Legal Requirements**: When required by law, such as in response to a valid legal request or to protect our rights.\n";
    baseText += "- **With Your Permission**: When you've explicitly asked us to share your information.\n\n";
    
    switch(type) {
        case 'yes':
            return baseText + "**Additional Sharing**: We may also share information with other organizations that align with our mission and values. We carefully select these partners and ensure they maintain appropriate privacy and security standards. This sharing helps us extend our impact and better serve our community.";
        case 'no':
        default:
            return baseText + "**Limited Sharing**: Beyond the circumstances described above, we do not share your personal information with other organizations. We value the trust you place in us and are committed to protecting your privacy.";
    }
}

// Function to generate policy content
function generatePolicyContent(formData, personalDataTypes, cookieTypes, dataSharingText) {
    // Generate the policy content based on the form data
    return `# Privacy Policy
**${formData.organization.name}** is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website ${formData.organization.website ? `(${formData.organization.website})` : ''}.

## Information We Collect

${formData.dataCollection.collectsNoData ? 
    "We do not collect any personal information about you when you visit our website." : 
    formData.dataCollection.anyDataTypeSelected ?
    `We collect the following types of information:
${personalDataTypes}` :
    "We collect minimal information necessary to provide our services."}

## How We Use Your Information

${formData.dataCollection.collectsNoData ? 
    "Since we don't collect personal information, we don't use your information for any purpose." : 
    `We use the information we collect for:
- Providing and improving our services
- Communicating with you about our programs and services
- Understanding how visitors use our website`}

${formData.dataCollection.anyDataTypeSelected && formData.thirdPartyServices ? 
    `\n## Third-Party Service Providers\n\nWe work with third-party providers, such as ${formData.thirdPartyServices}. These providers process data on our behalf in compliance with this policy.` : ''}

## Cookies and Tracking Technologies

${formData.cookieUsage.includes('none') ? 
    "We do not use cookies or other tracking technologies on our website." : 
    `We use the following types of cookies and tracking technologies:
${cookieTypes}`}

${!formData.dataCollection.collectsNoData ? `
## How We Share Your Information

${dataSharingText}

## Data Retention

We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including any legal, accounting, or reporting requirements.` : ''}

## Data Protection

We implement reasonable precautions to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.

## Your Rights

${formData.dataCollection.collectsNoData ? 
    "Since we don't collect personal information, there is no personal data for you to access, correct, or delete." :
    "Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data.\n\nTo exercise your privacy rights, please email " + (formData.contact.email || "[your contact email]") + " with 'Privacy Request' in the subject line. We will verify your identity and respond within 30 days as required by law."}

## Children's Privacy

Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.

## Changes to This Privacy Policy

We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.

## Contact Us

If you have any questions about this Privacy Policy, please contact us at ${formData.contact.email || "[your contact email]"}.

**Effective Date:** ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
}

// ===== POLICY DISPLAY =====
// Function to display the policy
function displayPolicy(policyContent) {
    // Hide the wizard container
    const wizardContainer = document.getElementById('wizard-container');
    if (wizardContainer) {
        wizardContainer.style.display = 'none';
    }
    
    // Show the toggle button
    const toggleWizardContainer = document.getElementById('toggle-wizard-container');
    if (toggleWizardContainer) {
        toggleWizardContainer.style.display = 'block';
    }
    
    // Show the policy display section
    const policyDisplay = document.getElementById('policy-display');
    if (policyDisplay) {
        policyDisplay.style.display = 'block';
    }
    
    // Set the policy content
    const policyContentElement = document.getElementById('policy-content');
    if (policyContentElement) {
        // Trim any whitespace from the policy content
        policyContent = policyContent.trim();
        
        // Add CSS for better formatting
        const styledHTML = `
            <style>
                .policy-content {
                    padding-top: 0;
                    margin-top: 0;
                }
                .policy-content h1 {
                    font-size: 28px;
                    margin-top: 0;
                    margin-bottom: 20px;
                    color: #333;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 10px;
                }
                .policy-content h2 {
                    font-size: 22px;
                    margin-top: 20px;
                    margin-bottom: 10px;
                    color: #444;
                }
                .policy-content h3 {
                    font-size: 18px;
                    margin-top: 15px;
                    margin-bottom: 8px;
                    color: #555;
                }
                .policy-content p {
                    margin-bottom: 10px;
                    margin-top: 0;
                    line-height: 1.5;
                }
                .policy-content ul {
                    margin-left: 20px;
                    margin-bottom: 5px;
                    margin-top: 0;
                    padding-left: 0;
                }
                .policy-content li {
                    margin-bottom: 0;
                    padding-bottom: 0;
                    line-height: 1.2;
                }
                .policy-content br {
                    display: block;
                    margin: 5px 0;
                    content: "";
                }
                .tight-list {
                    margin-bottom: 0 !important;
                    padding-bottom: 0 !important;
                    margin-top: 0 !important;
                    line-height: 1.2 !important;
                }
                .tight-item {
                    margin-bottom: 0 !important;
                    padding-bottom: 0 !important;
                    line-height: 1.2 !important;
                }
            </style>
            ${convertMarkdownToHTML(policyContent)}
        `;
        
        policyContentElement.innerHTML = styledHTML;
        
        // Store the raw markdown for copy functions
        policyContentElement.setAttribute('data-markdown', policyContent);
    }
}

// ===== MARKDOWN TO HTML CONVERSION =====
// Function to convert markdown to HTML with improved formatting
function convertMarkdownToHTML(markdown) {
    // First, trim any leading or trailing whitespace
    markdown = markdown.trim();
    
    // Process the markdown content
    let html = markdown
        // Handle headings - ensure no extra space before the first heading
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        
        // Handle text formatting
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        
        // Handle lists - create tighter lists with no extra space
        .replace(/- (.*$)/gm, '<li>$1</li>')
        
        // Replace single newlines with spaces to reduce whitespace
        .replace(/([^>\n])\n([^<\n])/g, '$1 $2')
        
        // Replace double newlines with paragraph breaks
        .replace(/\n\n+/g, '</p><p>');
    
    // Wrap content in paragraph tags if not already
    if (!html.startsWith('<h1>') && !html.startsWith('<p>')) {
        html = '<p>' + html + '</p>';
    }
    
    // Wrap list items in ul tags with tight-list class
    html = html.replace(/<li>(.*?)<\/li>/g, '<li class="tight-item">$1</li>');
    
    // Group consecutive list items into a single ul
    html = html.replace(/(<li class="tight-item">.*?<\/li>)+/g, function(match) {
        return '<ul class="tight-list">' + match + '</ul>';
    });
    
    // Fix any broken paragraph tags around lists
    html = html.replace(/<p>(<ul)/g, '$1');
    html = html.replace(/<\/ul>(<\/p>)/g, '</ul>');
    
    return html;
}

// ===== UTILITY FUNCTIONS =====
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