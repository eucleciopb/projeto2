document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('satisfactionForm');
    const submitBtn = form.querySelector('.btn-primary');
    
    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Collect form data
            const formData = collectFormData();
            
            // Save to Firebase
            await saveToFirebase(formData);
            
            // Show success message
            showSuccessMessage();
            
        } catch (error) {
            console.error('Erro ao enviar dados:', error);
            showErrorMessage(error.message);
        } finally {
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Function to collect form data
    function collectFormData() {
        const rating = form.querySelector('input[name="rating"]:checked');
        const comments = form.querySelector('textarea[name="comments"]');
        const email = form.querySelector('input[name="email"]');
        const name = form.querySelector('input[name="name"]');
        
        return {
            rating: rating ? parseInt(rating.value) : null,
            comments: comments ? comments.value.trim() : '',
            email: email ? email.value.trim() : '',
            name: name ? name.value.trim() : '',
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            createdAt: new Date().toISOString()
        };
    }
    
    // Function to save data to Firebase
    async function saveToFirebase(data) {
        try {
            const docRef = await window.db.collection('satisfaction-surveys').add(data);
            console.log('Documento salvo com ID: ', docRef.id);
            return docRef.id;
        } catch (error) {
            console.error('Erro ao salvar no Firebase: ', error);
            throw new Error('Falha ao salvar dados. Tente novamente.');
        }
    }
    
    // Star rating functionality
    const starGroups = document.querySelectorAll('.stars');
    starGroups.forEach(group => {
        const stars = group.querySelectorAll('label');
        const inputs = group.querySelectorAll('input[type="radio"]');
        
        stars.forEach((star, index) => {
            star.addEventListener('mouseenter', () => {
                highlightStars(stars, index);
            });
            
            star.addEventListener('click', () => {
                inputs[index].checked = true;
                setStarRating(stars, index);
            });
        });
        
        group.addEventListener('mouseleave', () => {
            const checkedInput = group.querySelector('input[type="radio"]:checked');
            if (checkedInput) {
                const checkedIndex = Array.from(inputs).indexOf(checkedInput);
                setStarRating(stars, checkedIndex);
            } else {
                resetStars(stars);
            }
        });
    });
    
    // Form validation
    const requiredFields = form.querySelectorAll('input[name="rating"]');
    
    form.addEventListener('change', function() {
        validateForm();
    });
    
    function validateForm() {
        const rating = form.querySelector('input[name="rating"]:checked');
        const isValid = rating !== null;
        
        submitBtn.disabled = !isValid;
        
        if (isValid) {
            submitBtn.style.opacity = '1';
        } else {
            submitBtn.style.opacity = '0.6';
        }
    }
    
    function highlightStars(stars, index) {
        stars.forEach((star, i) => {
            if (i <= index) {
                star.style.color = '#fbbf24';
                star.style.transform = 'scale(1.1)';
            } else {
                star.style.color = '#cbd5e0';
                star.style.transform = 'scale(1)';
            }
        });
    }
    
    function setStarRating(stars, index) {
        stars.forEach((star, i) => {
            if (i <= index) {
                star.style.color = '#22c55e';
                star.style.transform = 'scale(1)';
            } else {
                star.style.color = '#cbd5e0';
                star.style.transform = 'scale(1)';
            }
        });
    }
    
    function resetStars(stars) {
        stars.forEach(star => {
            star.style.color = '#cbd5e0';
            star.style.transform = 'scale(1)';
        });
    }
    
    function showSuccessMessage() {
        // Remove existing messages
        removeExistingMessages();
        
        // Create success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message show';
        successMessage.innerHTML = `
            <h3>✅ Obrigado pelo seu feedback!</h3>
            <p>Sua pesquisa de satisfação foi enviada e salva com sucesso no banco de dados!</p>
            <p><small>Valorizamos muito sua opinião.</small></p>
        `;
        
        // Insert before form
        form.parentNode.insertBefore(successMessage, form);
        
        // Hide form temporarily
        form.style.display = 'none';
        
        // Show form again after 4 seconds
        setTimeout(() => {
            successMessage.remove();
            form.style.display = 'block';
            form.reset();
            resetAllStars();
            validateForm();
        }, 4000);
    }
    
    function showErrorMessage(errorMsg) {
        // Remove existing messages
        removeExistingMessages();
        
        // Create error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message show';
        errorMessage.style.cssText = `
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        `;
        errorMessage.innerHTML = `
            <h3>❌ Erro ao Enviar</h3>
            <p>${errorMsg}</p>
            <p><small>Verifique sua conexão com a internet e tente novamente.</small></p>
        `;
        
        // Insert before form
        form.parentNode.insertBefore(errorMessage, form);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorMessage.remove();
        }, 5000);
    }
    
    function removeExistingMessages() {
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());
    }
    
    function resetAllStars() {
        const stars = document.querySelectorAll('.stars label');
        stars.forEach(star => {
            star.style.color = '#cbd5e0';
            star.style.transform = 'scale(1)';
        });
    }
    
    // Initial validation
    validateForm();
});

// Reset form function
function resetForm() {
    const form = document.getElementById('satisfactionForm');
    const confirmReset = confirm('Tem certeza que deseja limpar todos os campos?');
    
    if (confirmReset) {
        form.reset();
        
        // Reset star ratings visual state
        const stars = document.querySelectorAll('.stars label');
        stars.forEach(star => {
            star.style.color = '#cbd5e0';
            star.style.transform = 'scale(1)';
        });
        
        // Re-validate form
        const submitBtn = form.querySelector('.btn-primary');
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        
        // Show reset confirmation
        showResetMessage();
    }
}

function showResetMessage() {
    const form = document.getElementById('satisfactionForm');
    const resetMessage = document.createElement('div');
    resetMessage.className = 'success-message show';
    resetMessage.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
    resetMessage.innerHTML = `
        <h3>🔄 Formulário Limpo!</h3>
        <p>Todos os campos foram resetados. Você pode começar novamente.</p>
    `;
    
    form.parentNode.insertBefore(resetMessage, form);
    
    setTimeout(() => {
        resetMessage.remove();
    }, 2000);
}

// Add smooth scrolling for better UX
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('focus', function() {
        this.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
        });
    });
});

// Add keyboard navigation for rating options
document.addEventListener('keydown', function(e) {
    const focusedElement = document.activeElement;
    
    if (focusedElement.type === 'radio') {
        const name = focusedElement.name;
        const radios = document.querySelectorAll(`input[name="${name}"]`);
        const currentIndex = Array.from(radios).indexOf(focusedElement);
        
        let nextIndex;
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % radios.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            nextIndex = (currentIndex - 1 + radios.length) % radios.length;
        }
        
        if (nextIndex !== undefined) {
            radios[nextIndex].focus();
            radios[nextIndex].checked = true;
            
            // Trigger change event for validation
            radios[nextIndex].dispatchEvent(new Event('change'));
        }
    }
});
