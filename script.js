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
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const progressFill = document.getElementById('progress-fill');
    const currentStepText = document.getElementById('current-step');
    const steps = document.querySelectorAll('.step');
    
    // Initialize the wizard
    let currentStep = 1;
    updateProgressBar();
    
    // Initialize form elements
    initializeFormElements();
    
    // URL validation
    const websiteUrlInput = document.getElementById('org-website');
    const urlValidationMessage = document.getElementById('url-validation-message');
    
    if (websiteUrlInput) {
        websiteUrlInput.addEventListener('input', validateUrl);
        websiteUrlInput.addEventListener('blur', validateUrl);
    }
    
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
                const dataTypes = document.querySelectorAll('.data-collection-options input[type="checkbox"]:checked');
                
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
                // Validate data sharing - simplified to just check if an option is selected
                const dataSharing = document.querySelector('input[name="data-sharing"]:checked');
                
                if (!dataSharing) {
                    alert('Please select an option for data sharing.');
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
    
    // Add event listener for generate button
    const generateButton = document.getElementById('generate-policy');
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            // Validate the final step
            if (validateCurrentStep(5)) {
                // Generate and display the policy
                generateAndDisplayPolicy();
            }
        });
    }
    
    // Toggle wizard visibility
    const toggleWizardBtn = document.getElementById('toggle-wizard-btn');
    if (toggleWizardBtn) {
        toggleWizardBtn.addEventListener('click', function() {
            const wizardContainer = document.getElementById('wizard-container');
            if (wizardContainer.style.display === 'none') {
                wizardContainer.style.display = 'block';
                this.innerHTML = '<i class="fas fa-chevron-up"></i> Hide Form';
            } else {
                wizardContainer.style.display = 'none';
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Show Form';
            }
        });
    }
    
    // Copy buttons functionality
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            const policyContentElement = document.getElementById('policy-content');
            const markdown = policyContentElement.getAttribute('data-markdown');
            
            let contentToCopy;
            
            switch(format) {
                case 'markdown':
                    contentToCopy = markdown;
                    break;
                case 'plaintext':
                    // Convert markdown to plain text (remove markdown syntax)
                    contentToCopy = markdown
                        .replace(/^# (.*$)/gm, '$1\n')
                        .replace(/^## (.*$)/gm, '$1\n')
                        .replace(/^### (.*$)/gm, '$1\n')
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/\*(.*?)\*/g, '$1')
                        .replace(/- (.*$)/gm, '- $1\n');
                    break;
                case 'richtext':
                    // Use the HTML content
                    contentToCopy = policyContentElement.innerHTML;
                    break;
                default:
                    contentToCopy = markdown;
            }
            
            // Copy to clipboard
            navigator.clipboard.writeText(contentToCopy).then(() => {
                // Show temporary success message
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
                alert('Failed to copy to clipboard. Please try again.');
            });
        });
    });
    
    // Function to initialize form elements
    function initializeFormElements() {
        // DATA COLLECTION LOGIC - Question 2
        const noDataCollectionCheckbox = document.getElementById('no-data-collection');
        const dataCollectionOptions = document.querySelector('.data-collection-options');
        
        if (noDataCollectionCheckbox && dataCollectionOptions) {
            const dataTypeCheckboxes = document.querySelectorAll('.data-collection-options input[type="checkbox"]');
            
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
        }
        
        // COOKIE USAGE LOGIC - Question 3
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
                            // Re-enable all cookie checkboxes
                            cookieCheckboxes.forEach(cb => {
                                cb.disabled = false;
                            });
                        }
                    });
                }
            });
        }
    }
    
    // Function to generate and display the policy
    function generateAndDisplayPolicy() {
        // Collect form data
        const formData = {
            organization: {
                name: document.getElementById('org-name')?.value.trim() || 'Your Organization',
                website: document.getElementById('org-website')?.value.trim() || 'Your Website'
            },
            dataCollection: {
                collectsNoData: document.getElementById('no-data-collection')?.checked || false,
                types: Array.from(document.querySelectorAll('.data-collection-options input[type="checkbox"]:checked')).map(cb => cb.value)
            },
            cookieUsage: Array.from(document.querySelectorAll('input[name="cookie-type"]:checked')).map(cb => cb.value),
            dataSharing: {
                type: document.querySelector('input[name="data-sharing"]:checked')?.value || 'no'
            },
            contact: {
                email: document.getElementById('contact-email')?.value.trim() || 'contact@example.com'
            }
        };
        
        // Format data for template
        const personalDataTypes = formData.dataCollection.collectsNoData 
            ? "We do not collect any personal information from our website visitors or supporters."
            : formatDataTypes(formData.dataCollection.types);
            
        const cookieTypes = formData.cookieUsage.includes('none')
            ? "Our website does not use cookies. We prioritize your privacy and minimize data collection."
            : formatCookieTypes(formData.cookieUsage);
            
        const dataSharingText = formatDataSharing(formData.dataSharing.type);
        
        // Generate the privacy policy content
        const policyContent = generatePolicyContent(formData, personalDataTypes, cookieTypes, dataSharingText);
        
        // Display the policy
        displayPolicy(policyContent);
    }
    
    // Function to format data types
    function formatDataTypes(types) {
        if (!types || types.length === 0) {
            return "We do not collect any personal information from our website visitors or supporters.";
        }
        
        let formattedText = "To better serve our community and fulfill our nonprofit mission, we may collect the following types of personal information:\n\n";
        
        const typeDescriptions = {
            'name': "- **Names**: We collect names to personalize our communications and properly acknowledge our supporters.",
            'email': "- **Email Addresses**: We use email addresses to send updates about our work, respond to inquiries, and share impact reports with our community.",
            'address': "- **Physical Addresses**: We collect addresses to send thank-you letters, tax receipts, and occasional printed materials about our work.",
            'phone': "- **Phone Numbers**: We may use phone numbers to follow up on specific inquiries or for important updates about your support of our mission.",
            'donation': "- **Donation Information**: We collect donation details to process contributions, provide tax receipts, and better understand how our community supports our work.",
            'other': "- **Other Information**: We may collect additional information you choose to share with us to better serve your needs and improve our programs."
        };
        
        types.forEach(type => {
            if (typeDescriptions[type]) {
                formattedText += typeDescriptions[type] + "\n";
            }
        });
        
        return formattedText;
    }
    
    // Function to format cookie types
    function formatCookieTypes(types) {
        if (!types || types.length === 0 || types.includes('none')) {
            return "Our website does not use cookies. We prioritize your privacy and minimize data collection.";
        }
        
        let formattedText = "To improve your experience on our website and better serve our mission, we use cookies and similar technologies. You can manage your cookie preferences through your browser settings. The types of cookies we use include:\n\n";
        
        const cookieDescriptions = {
            'essential': "- **Essential Cookies**: These cookies are necessary for our website to function properly. They enable basic functions like page navigation and access to secure areas of the website.",
            'analytics': "- **Analytics Cookies**: These help us understand how visitors interact with our website by collecting anonymous information. This helps us improve our site and better serve our community.",
            'marketing': "- **Marketing Cookies**: These cookies help us understand the effectiveness of our outreach efforts. They allow us to reach more people who might be interested in supporting our cause.",
            'social': "- **Social Media Cookies**: These enable you to share our content and engage with us on social media platforms, helping us expand our community and impact."
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
    `We collect the following types of information:
${personalDataTypes}`}

## How We Use Your Information

${formData.dataCollection.collectsNoData ? 
    "Since we don't collect personal information, we don't use your information for any purpose." : 
    `We use the information we collect for:
- Providing and improving our services
- Communicating with you about our programs and services
- Understanding how visitors use our website${formData.dataUsage ? `\n- ${formData.dataUsage}` : ''}`}

## Cookies and Tracking Technologies

${formData.cookieUsage.includes('none') ? 
    "We do not use cookies or other tracking technologies on our website." : 
    `We use the following types of cookies and tracking technologies:
${cookieTypes}`}

## How We Share Your Information

${dataSharingText}

## Data Retention

${formData.dataRetention || "We retain personal information only for as long as necessary to fulfill the purposes for which it was collected, including any legal, accounting, or reporting requirements."}

## Data Protection

${formData.dataProtection || "We implement reasonable precautions to protect your information. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security."}

## Your Rights

${formData.userRights || "Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data."}

## Children's Privacy

${formData.childrenPrivacy || "Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13."}

## Changes to This Privacy Policy

${formData.policyChanges || "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page."}

## Contact Us

If you have any questions about this Privacy Policy, please contact us at:
- Email: ${formData.contact.email || "[your contact email]"}
${formData.contactInfo ? `- ${formData.contactInfo}` : ''}

Last updated: ${new Date().toLocaleDateString()}`;
    }
    
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
                </style>
                ${convertMarkdownToHTML(policyContent)}
            `;
            
            policyContentElement.innerHTML = styledHTML;
            
            // Store the raw markdown for copy functions
            policyContentElement.setAttribute('data-markdown', policyContent);
        }
    }
    
    // Function to convert markdown to HTML with improved formatting
    function convertMarkdownToHTML(markdown) {
        // First, trim any leading or trailing whitespace
        markdown = markdown.trim();
        
        // Process the markdown content
        let html = markdown
            // Handle headings
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            
            // Handle text formatting
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            
            // Handle lists - create tighter lists
            .replace(/- (.*$)/gm, '<li>$1</li>')
            
            // Replace single newlines with spaces to reduce whitespace
            .replace(/([^>\n])\n([^<\n])/g, '$1 $2')
            
            // Replace double newlines with a single paragraph break
            .replace(/\n\n+/g, '</p><p>');
        
        // Wrap content in paragraph tags if not already
        if (!html.startsWith('<h1>') && !html.startsWith('<p>')) {
            html = '<p>' + html + '</p>';
        }
        
        // Wrap list items in ul tags with tight-list class
        html = html.replace(/<li>(.*?)<\/li>/g, function(match) {
            return '<ul class="tight-list">' + match + '</ul>';
        });
        
        // Remove adjacent ul tags
        html = html.replace(/<\/ul><ul class="tight-list">/g, '');
        
        // Fix any broken paragraph tags around lists
        html = html.replace(/<p>(<ul)/g, '$1');
        html = html.replace(/<\/ul>(<\/p>)/g, '</ul>');
        
        return html;
    }
}); 