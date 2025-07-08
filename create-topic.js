// JavaScript for Create Topic page

document.addEventListener('DOMContentLoaded', function() {
    const requestAnalysisBtn = document.getElementById('requestAnalysis');
    const analysisPreview = document.getElementById('analysisPreview');
    const publishBtn = document.getElementById('publishTopic');
    const editBtn = document.getElementById('editAnalysis');
    const topicForm = document.getElementById('topicForm');
    
    // Request AI Analysis
    if (requestAnalysisBtn) {
        requestAnalysisBtn.addEventListener('click', function() {
            const title = document.getElementById('topicTitle').value;
            const description = document.getElementById('topicDescription').value;
            const category = document.getElementById('topicCategory').value;
            
            if (!title || !description || !category) {
                LogikMeter.showNotification('Please fill in all required fields first', 'warning');
                return;
            }
            
            // Show loading state
            LogikMeter.showLoading(this);
            
            // Simulate AI analysis
            setTimeout(() => {
                LogikMeter.hideLoading(this);
                showAnalysisPreview();
                LogikMeter.showNotification('AI analysis completed!', 'success');
            }, 3000);
        });
    }
    
    // Show analysis preview
    function showAnalysisPreview() {
        if (analysisPreview) {
            analysisPreview.style.display = 'block';
            analysisPreview.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Publish topic
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            LogikMeter.showLoading(this);
            
            // Simulate publishing
            setTimeout(() => {
                LogikMeter.hideLoading(this);
                LogikMeter.showNotification('Topic published successfully!', 'success');
                
                // Redirect to topic page after a short delay
                setTimeout(() => {
                    window.location.href = 'topic.html';
                }, 1500);
            }, 2000);
        });
    }
    
    // Edit analysis
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            const modal = new bootstrap.Modal(document.getElementById('editAnalysisModal'));
            
            // Populate modal with current analysis
            populateEditModal();
            modal.show();
        });
    }
    
    // Populate edit modal with current analysis
    function populateEditModal() {
        const keyPoints = document.getElementById('keyPoints');
        const argumentsFor = document.getElementById('argumentsFor');
        const argumentsAgainst = document.getElementById('argumentsAgainst');
        const discussionQuestions = document.getElementById('discussionQuestions');
        
        if (keyPoints) {
            document.getElementById('editKeyPoints').value = getListText(keyPoints);
        }
        if (argumentsFor) {
            document.getElementById('editArgumentsFor').value = getListText(argumentsFor);
        }
        if (argumentsAgainst) {
            document.getElementById('editArgumentsAgainst').value = getListText(argumentsAgainst);
        }
        if (discussionQuestions) {
            document.getElementById('editDiscussionQuestions').value = getListText(discussionQuestions);
        }
    }
    
    // Helper function to get text from list items
    function getListText(listElement) {
        const items = listElement.querySelectorAll('li');
        return Array.from(items).map(item => item.textContent).join('\n');
    }
    
    // Save analysis changes
    const saveAnalysisBtn = document.getElementById('saveAnalysisChanges');
    if (saveAnalysisBtn) {
        saveAnalysisBtn.addEventListener('click', function() {
            // Get edited content
            const editedKeyPoints = document.getElementById('editKeyPoints').value;
            const editedArgumentsFor = document.getElementById('editArgumentsFor').value;
            const editedArgumentsAgainst = document.getElementById('editArgumentsAgainst').value;
            const editedDiscussionQuestions = document.getElementById('editDiscussionQuestions').value;
            
            // Update the preview
            updateAnalysisPreview({
                keyPoints: editedKeyPoints,
                argumentsFor: editedArgumentsFor,
                argumentsAgainst: editedArgumentsAgainst,
                discussionQuestions: editedDiscussionQuestions
            });
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editAnalysisModal'));
            modal.hide();
            
            LogikMeter.showNotification('Analysis updated successfully!', 'success');
        });
    }
    
    // Update analysis preview with edited content
    function updateAnalysisPreview(content) {
        updateListFromText('keyPoints', content.keyPoints);
        updateListFromText('argumentsFor', content.argumentsFor);
        updateListFromText('argumentsAgainst', content.argumentsAgainst);
        updateListFromText('discussionQuestions', content.discussionQuestions);
    }
    
    // Helper function to update list from text
    function updateListFromText(listId, text) {
        const listElement = document.getElementById(listId);
        if (listElement && text) {
            const lines = text.split('\n').filter(line => line.trim());
            listElement.innerHTML = lines.map(line => `<li>${line.trim()}</li>`).join('');
        }
    }
    
    // Auto-save form data
    function autoSaveForm() {
        const formData = {
            title: document.getElementById('topicTitle')?.value || '',
            description: document.getElementById('topicDescription')?.value || '',
            category: document.getElementById('topicCategory')?.value || '',
            tags: document.getElementById('topicTags')?.value || ''
        };
        
        LogikMeter.saveToStorage('draftTopic', formData);
    }
    
    // Load saved form data
    function loadSavedForm() {
        const savedData = LogikMeter.loadFromStorage('draftTopic');
        if (savedData) {
            const titleField = document.getElementById('topicTitle');
            const descriptionField = document.getElementById('topicDescription');
            const categoryField = document.getElementById('topicCategory');
            const tagsField = document.getElementById('topicTags');
            
            if (titleField) titleField.value = savedData.title || '';
            if (descriptionField) descriptionField.value = savedData.description || '';
            if (categoryField) categoryField.value = savedData.category || '';
            if (tagsField) tagsField.value = savedData.tags || '';
        }
    }
    
    // Set up auto-save
    const formFields = document.querySelectorAll('#topicTitle, #topicDescription, #topicCategory, #topicTags');
    formFields.forEach(field => {
        field.addEventListener('input', autoSaveForm);
    });
    
    // Load saved data on page load
    loadSavedForm();
    
    // Character counter for description
    const descriptionField = document.getElementById('topicDescription');
    if (descriptionField) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'form-text text-end';
        counter.style.marginTop = '5px';
        descriptionField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - descriptionField.value.length;
            counter.textContent = `${remaining} characters remaining`;
            counter.className = `form-text text-end ${remaining < 100 ? 'text-warning' : ''}`;
        }
        
        descriptionField.addEventListener('input', updateCounter);
        updateCounter();
    }
    
    // Tag input enhancement
    const tagsField = document.getElementById('topicTags');
    if (tagsField) {
        tagsField.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = this.value.trim();
                if (value && !value.endsWith(',')) {
                    this.value = value + ', ';
                }
            }
        });
        
        // Show tag suggestions
        const commonTags = [
            'artificial-intelligence', 'machine-learning', 'technology', 'future-of-work',
            'remote-work', 'sustainability', 'climate-change', 'education', 'healthcare',
            'politics', 'economics', 'social-media', 'privacy', 'security', 'innovation'
        ];
        
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'tag-suggestions mt-2';
        suggestionsContainer.innerHTML = `
            <small class="text-muted">Popular tags:</small><br>
            ${commonTags.slice(0, 8).map(tag => 
                `<span class="badge bg-light text-dark me-1 mb-1 tag-suggestion" style="cursor: pointer;">${tag}</span>`
            ).join('')}
        `;
        
        tagsField.parentNode.appendChild(suggestionsContainer);
        
        // Handle tag suggestion clicks
        suggestionsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('tag-suggestion')) {
                const tag = e.target.textContent;
                const currentTags = tagsField.value.split(',').map(t => t.trim()).filter(t => t);
                
                if (!currentTags.includes(tag)) {
                    tagsField.value = currentTags.length > 0 ? 
                        currentTags.join(', ') + ', ' + tag : tag;
                    autoSaveForm();
                }
            }
        });
    }
    
    // Clear draft when topic is published
    if (publishBtn) {
        publishBtn.addEventListener('click', function() {
            localStorage.removeItem('draftTopic');
        });
    }
});