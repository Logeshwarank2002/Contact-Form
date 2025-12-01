function initContactForm() {
    const form = document.getElementById('fb-ContactForm');
    const resultDiv = document.getElementById('result');
    const submitBtn = document.getElementById('fb-submitBtn');

    if (!form || !resultDiv || !submitBtn) {
        console.error('Contact form elements not found');
        return;
    }

    const API_URL = 'https://86a866df8824.ngrok-free.app/api/contact';
    const SHOP_DOMAIN = window?.Shopify?.shop || '';
    const DEFAULT_BUTTON_TEXT = submitBtn.textContent.trim();

    function clearMessages() {
        document.querySelectorAll('.error-text').forEach((el) => (el.textContent = ''));
        resultDiv.textContent = '';
        resultDiv.className = 'result-message';
    }

    function getFormData() {
        const data = new FormData(form);
        return {
            firstName: data.get('contact[name]')?.trim() || '',
            lastName: data.get('contact[last_name]')?.trim() || '',
            email: data.get('contact[email]')?.trim() || '',
            phone: data.get('contact[phone]')?.trim() || '',
            message: data.get('contact[body]')?.trim() || '',
        };
    }

    function validateForm(formData) {
        const errors = {};

        if (!formData.firstName) {
            errors.name = 'First name is required';
        }

        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Invalid email format';
        }

        if (formData.phone && !/^[+\d\-\s\(\)]{6,20}$/.test(formData.phone)) {
            errors.phone = 'Invalid phone number format';
        }

        return errors;
    }

    function displayErrors(errors) {
        const errorElements = document.querySelectorAll('.error-text');
        const errorMap = {
            name: 0,
            email: 1,
            phone: 2,
        };

        Object.keys(errors).forEach((key) => {
            const index = errorMap[key];
            if (index !== undefined && errorElements[index]) {
                errorElements[index].textContent = errors[key];
            }
        });
    }

    function showResultMessage(message, type) {
        resultDiv.classList.add(type);
        resultDiv.textContent = message;
    }

    function setButtonState(disabled, text) {
        submitBtn.disabled = disabled;
        submitBtn.textContent = text;
    }

    async function submitToAPI(formData) {
        const payload = {
            shop: SHOP_DOMAIN,
            name: formData.firstName,
            last_name: formData.lastName,
            phoneNumber: formData.phone,
            email: formData.email,
            body: formData.message,
        };

        console.log('Submitting payload:', payload);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Unknown error');
        }

        return data;
    }

    submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        clearMessages();

        const formData = getFormData();
        const errors = validateForm(formData);

        if (Object.keys(errors).length > 0) {
            displayErrors(errors);
            return;
        }

        setButtonState(true, 'Submitting...');

        try {
            await submitToAPI(formData);
            showResultMessage('Form submitted successfully!', 'success');
            // Submit to Shopify
            form.submit();
        } catch (error) {
            console.error('Submission error:', error);
            showResultMessage(`Error: ${error.message}`, 'error');
            setButtonState(false, DEFAULT_BUTTON_TEXT);
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm);
} else {
    initContactForm();
}