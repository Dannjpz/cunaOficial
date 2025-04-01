// Google Translate Integration

// Available languages
const languages = [
    { code: 'es', name: 'Español' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'it', name: 'Italiano' },
    { code: 'ja', name: '日本語' },
    { code: 'zh-CN', name: '中文' },
    { code: 'ru', name: 'Русский' }
];

// Create translate button and dropdown
document.addEventListener('DOMContentLoaded', function () {
    // Load the CSS file
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '/assets/css/translate.css';
    document.head.appendChild(cssLink);

    // Create language dropdown container
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'language-dropdown-container';

    // Create language button
    const languageButton = document.createElement('button');
    languageButton.className = 'language-button';
    languageButton.innerHTML = '<i class="fas fa-language"></i>';
    languageButton.title = 'Cambiar idioma';

    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'language-dropdown-menu';

    // Add language options to dropdown
    languages.forEach(lang => {
        const langOption = document.createElement('div');
        langOption.className = 'language-option';
        langOption.textContent = lang.name;
        langOption.setAttribute('data-lang', lang.code);

        langOption.addEventListener('click', function () {
            changeLanguage(lang.code);
            dropdownMenu.classList.remove('show');
        });

        dropdownMenu.appendChild(langOption);
    });

    // Add event listener to toggle dropdown
    languageButton.addEventListener('click', function () {
        dropdownMenu.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (event) {
        if (!dropdownContainer.contains(event.target)) {
            dropdownMenu.classList.remove('show');
        }
    });

    // Add elements to the DOM
    dropdownContainer.appendChild(languageButton);
    dropdownContainer.appendChild(dropdownMenu);
    document.body.appendChild(dropdownContainer);

    // Add hidden Google Translate element
    const translateElement = document.createElement('div');
    translateElement.id = 'google_translate_element';
    translateElement.style.display = 'none';
    document.body.appendChild(translateElement);

    // Load Google Translate script
    const script = document.createElement('script');
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(script);
});

// Track initialization status
window.googleTranslateInitialized = false;
window.googleTranslateReady = false;

// Function to initialize Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'es',
        includedLanguages: 'en,fr,de,it,pt,ja,zh-CN,ru',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false
    }, 'google_translate_element');
    
    // Mark as initialized
    window.googleTranslateInitialized = true;
    
    // Check for readiness after a short delay
    setTimeout(() => {
        if (document.querySelector('.goog-te-combo')) {
            window.googleTranslateReady = true;
            console.log('Google Translate is ready');
        }
    }, 1000);
}

// Function to change language
function changeLanguage(langCode) {
    // Use cookie-based approach for more reliable translation
    if (langCode === 'es') {
        // Reset to original language
        resetToOriginalLanguage();
        return;
    }
    
    // Set cookie for Google Translate
    document.cookie = `googtrans=/es/${langCode}`;
    
    // Try to find the select element with multiple attempts
    trySelectLanguage(langCode, 5);
}

// Try to select language with multiple attempts
function trySelectLanguage(langCode, attemptsLeft) {
    if (attemptsLeft <= 0) {
        console.error('Failed to find Google Translate element after multiple attempts');
        // Use fallback method - reload page with cookie set
        location.reload();
        return;
    }
    
    const selectElement = document.querySelector('.goog-te-combo');
    
    if (selectElement) {
        // Element found, trigger change
        triggerLanguageChange(selectElement, langCode);
    } else {
        // Element not found, wait and try again
        console.log(`Waiting for Google Translate element, ${attemptsLeft} attempts left`);
        setTimeout(() => {
            trySelectLanguage(langCode, attemptsLeft - 1);
        }, 800);
    }
}

// Helper function to trigger the language change
function triggerLanguageChange(selectElement, langCode) {
    // Set the value
    selectElement.value = langCode;
    
    // Create and dispatch change event
    const event = new Event('change', { bubbles: true });
    selectElement.dispatchEvent(event);
    
    // Also try direct API if available
    if (window.google && window.google.translate) {
        try {
            const instance = google.translate.TranslateElement.getInstance();
            if (instance && typeof instance.setLanguage === 'function') {
                instance.setLanguage(langCode);
            }
        } catch (e) {
            console.log('Could not use Google Translate API directly');
        }
    }
    
    // Force refresh translation
    if (typeof doGTranslate === 'function') {
        doGTranslate('es|' + langCode);
    }
}

// Reset to original language
function resetToOriginalLanguage() {
    // Clear the Google Translate cookie
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + location.hostname;
    
    // Reload the page to reset translation
    location.reload();
}