document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('upload-form');
    const fileInput = document.getElementById('file-input');
    const fileNameDisplay = document.querySelector('.file-name');
    const resultContainer = document.querySelector('.result-container');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const resultContent = document.querySelector('.result-content');
    const errorMessage = document.querySelector('.error-message');
    const errorText = document.getElementById('error-text');
    const diseaseResult = document.getElementById('disease-result');
    const severityResult = document.getElementById('severity-result');

    // Update file name display
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            fileNameDisplay.textContent = file.name;
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    });

    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const file = fileInput.files[0];
        if (!file) {
            showError('Please select a file');
            return;
        }

        // Validate file type
        if (!file.type.match('image.*')) {
            showError('Please upload an image file');
            return;
        }

        // Show loading spinner and hide previous results
        loadingSpinner.style.display = 'block';
        resultContent.style.display = 'none';
        errorMessage.style.display = 'none';
        resultContainer.style.display = 'block';

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }

            // Display results
            diseaseResult.textContent = data.disease;
            severityResult.textContent = `${data.severity.toFixed(2)}%`;
            
            // Hide loading spinner and show results
            loadingSpinner.style.display = 'none';
            resultContent.style.display = 'block';

        } catch (error) {
            showError(error.message);
            loadingSpinner.style.display = 'none';
        }
    });

    function showError(message) {
        errorText.textContent = message;
        errorMessage.style.display = 'block';
        resultContainer.style.display = 'none';
    }
}); 