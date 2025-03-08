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