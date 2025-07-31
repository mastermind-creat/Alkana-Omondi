document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('imageUpload');
    const uploadButton = document.getElementById('uploadButton');
    const deleteButton = document.getElementById('deleteButton');
    const galleryGrid = document.getElementById('gallery-grid');

    // Hardcoded passkey (change this to a secure value)
    const correctPasskey = 'mysecretkey';

    // Trigger file input when upload button is clicked
    uploadButton.addEventListener('click', () => imageUpload.click());

    // Handle image upload
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Prompt for passkey with password field
        const passkeyInput = document.createElement('input');
        passkeyInput.type = 'password';
        passkeyInput.placeholder = 'Enter passkey';
        const showPasskeyBtn = document.createElement('button');
        showPasskeyBtn.textContent = '👁️';
        showPasskeyBtn.style.marginLeft = '5px';
        let showPasskey = false;
        showPasskeyBtn.addEventListener('click', () => {
            showPasskey = !showPasskey;
            passkeyInput.type = showPasskey ? 'text' : 'password';
            showPasskeyBtn.textContent = showPasskey ? '🙈' : '👁️';
        });

        const passkeyContainer = document.createElement('div');
        passkeyContainer.style.margin = '10px 0';
        passkeyContainer.appendChild(passkeyInput);
        passkeyContainer.appendChild(showPasskeyBtn);
        document.body.appendChild(passkeyContainer);

        const userPasskey = prompt('Please enter the passkey to upload an image:', '');
        document.body.removeChild(passkeyContainer);

        if (!userPasskey || userPasskey !== correctPasskey) {
            alert('Incorrect or missing passkey. Upload canceled.');
            imageUpload.value = '';
            return;
        }

        // Security checks
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            alert('Please upload only JPEG or PNG images.');
            imageUpload.value = '';
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('Image size must be less than 2MB.');
            imageUpload.value = '';
            return;
        }

        // Confirmation prompt
        if (!confirm('Are you sure you want to upload this image? It will be saved locally.')) {
            imageUpload.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result;
            const key = `uploadedImage_${Date.now()}`;
            localStorage.setItem(key, base64String);

            const newImage = document.createElement('div');
            newImage.className = 'overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition duration-300';
            newImage.dataset.key = key; // Store key for deletion
            newImage.innerHTML = `<img src="${base64String}" alt="User Uploaded Image" class="w-full h-64 object-cover hover:scale-105 transition duration-500" loading="lazy">`;
            galleryGrid.insertBefore(newImage, galleryGrid.firstChild); // Add at the beginning

            imageUpload.value = '';
        };
        reader.readAsDataURL(file);
    });

    // Handle image deletion
    deleteButton.addEventListener('click', () => {
        const selectedImage = galleryGrid.querySelector('.selected');
        if (!selectedImage) {
            alert('Please select an image to delete by clicking it.');
            return;
        }

        // Prompt for passkey with password field
        const passkeyInput = document.createElement('input');
        passkeyInput.type = 'password';
        passkeyInput.placeholder = 'Enter passkey';
        const showPasskeyBtn = document.createElement('button');
        showPasskeyBtn.textContent = '👁️';
        showPasskeyBtn.style.marginLeft = '5px';
        let showPasskey = false;
        showPasskeyBtn.addEventListener('click', () => {
            showPasskey = !showPasskey;
            passkeyInput.type = showPasskey ? 'text' : 'password';
            showPasskeyBtn.textContent = showPasskey ? '🙈' : '👁️';
        });

        const passkeyContainer = document.createElement('div');
        passkeyContainer.style.margin = '10px 0';
        passkeyContainer.appendChild(passkeyInput);
        passkeyContainer.appendChild(showPasskeyBtn);
        document.body.appendChild(passkeyContainer);

        const userPasskey = prompt('Please enter the passkey to delete the image:', '');
        document.body.removeChild(passkeyContainer);

        if (!userPasskey || userPasskey !== correctPasskey) {
            alert('Incorrect or missing passkey. Deletion canceled.');
            return;
        }

        const key = selectedImage.dataset.key;
        if (key && key.startsWith('uploadedImage_')) {
            localStorage.removeItem(key);
            galleryGrid.removeChild(selectedImage);
        }
    });

    // Load saved images on page load (recent first)
    const savedImages = Object.keys(localStorage)
        .filter(key => key.startsWith('uploadedImage_'))
        .sort((a, b) => Number(b.split('_')[1]) - Number(a.split('_')[1])); // Sort by timestamp descending
    savedImages.forEach(key => {
        const base64String = localStorage.getItem(key);
        const newImage = document.createElement('div');
        newImage.className = 'overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition duration-300';
        newImage.dataset.key = key;
        newImage.innerHTML = `<img src="${base64String}" alt="User Uploaded Image" class="w-full h-64 object-cover hover:scale-105 transition duration-500" loading="lazy">`;
        galleryGrid.insertBefore(newImage, galleryGrid.firstChild);
    });

    // Add click to select image for deletion
    galleryGrid.addEventListener('click', (e) => {
        const imageDiv = e.target.closest('div');
        if (imageDiv && imageDiv.querySelector('img')) {
            // Remove selection from all images
            galleryGrid.querySelectorAll('div').forEach(div => div.classList.remove('selected'));
            imageDiv.classList.add('selected');
        }
    });
});