class FrameEditor {
  constructor(animationController, showNotification) {
    this.animationController = animationController;
    this.showNotification = showNotification;
  }

  show(sign, frameInfoElement) {
    const modal = this.createFrameEditorModal(sign);
    document.body.appendChild(modal);

    const elements = this.getFrameEditorElements(modal);
    this.setupFrameEditorEventListeners(elements, sign, frameInfoElement);
  }

  // Create the frame editor modal structure
  createFrameEditorModal(sign) {
    const modal = document.createElement("div");
    modal.className = "frame-editor-modal";
    modal.innerHTML = `
      <div class="frame-editor-content">
        <div class="frame-editor-header">
          <h3>Edit Frame Timing - ${sign.name}</h3>
          <button class="frame-editor-close">×</button>
        </div>
        <div class="frame-editor-body">
          <div class="frame-control">
            <label for="start-frame">Start Frame: <span id="start-value">${sign.start}</span></label>
            <input type="range" id="start-frame" value="${sign.start}" min="0" max="200" step="1" class="frame-slider">
          </div>
          <div class="frame-control">
            <label for="end-frame">End Frame: <span id="end-value">${sign.end}</span></label>
            <input type="range" id="end-frame" value="${sign.end}" min="1" max="250" step="1" class="frame-slider">
          </div>
          <div class="frame-preview">
            <p>Original: ${sign.start} - ${sign.end} (${sign.end - sign.start} frames)</p>
            <div class="frame-preview-live">
              <p id="frame-preview-text">Preview: ${sign.start} - ${sign.end} (${sign.end - sign.start} frames)</p>
            </div>
          </div>
          <div class="frame-editor-actions">
            <button class="test-button">🎬 Test Animation</button>
            <button class="save-button">💾 Save Changes</button>
            <button class="cancel-button">Cancel</button>
          </div>
        </div>
      </div>
    `;
    return modal;
  }

  // Get all necessary elements from the modal
  getFrameEditorElements(modal) {
    return {
      startInput: modal.querySelector("#start-frame"),
      endInput: modal.querySelector("#end-frame"),
      startValueSpan: modal.querySelector("#start-value"),
      endValueSpan: modal.querySelector("#end-value"),
      previewText: modal.querySelector("#frame-preview-text"),
      closeButton: modal.querySelector(".frame-editor-close"),
      testButton: modal.querySelector(".test-button"),
      saveButton: modal.querySelector(".save-button"),
      cancelButton: modal.querySelector(".cancel-button"),
      modal: modal
    };
  }

  // Setup all event listeners for the frame editor
  setupFrameEditorEventListeners(elements, sign, frameInfoElement) {
    let autoTestTimeout;

    const updatePreview = () => {
      const start = parseInt(elements.startInput.value) || 0;
      const end = parseInt(elements.endInput.value) || 1;
      const duration = Math.max(0, end - start);
      
      elements.startValueSpan.textContent = start;
      elements.endValueSpan.textContent = end;
      elements.previewText.textContent = `Preview: ${start} - ${end} (${duration} frames)`;

      const isValid = start < end;
      elements.previewText.style.color = isValid ? '#333' : '#F44336';
      elements.saveButton.disabled = !isValid;
      elements.testButton.disabled = !isValid;
    };

    const autoTestAnimation = () => {
      const newStart = parseInt(elements.startInput.value) || 0;
      const newEnd = parseInt(elements.endInput.value) || 1;
      
      if (newStart >= newEnd) return;

      clearTimeout(autoTestTimeout);
      autoTestTimeout = setTimeout(async () => {
        const originalStart = sign.start;
        const originalEnd = sign.end;
        
        sign.start = newStart;
        sign.end = newEnd;
        
        this.animationController.clearCachedAnimation(sign.name);
        
        try {
          await this.animationController.playSign(sign.name);
        } catch (error) {
          console.error('Error auto-testing animation:', error);
        }
        
        sign.start = originalStart;
        sign.end = originalEnd;
        this.animationController.clearCachedAnimation(sign.name);
      }, 800);
    };

    const closeModal = () => {
      if (autoTestTimeout) {
        clearTimeout(autoTestTimeout);
      }
      document.body.removeChild(elements.modal);
    };

    const handleTestAnimation = async () => {
      const newStart = parseInt(elements.startInput.value) || 0;
      const newEnd = parseInt(elements.endInput.value) || 1;
      
      if (newStart >= newEnd) return;

      elements.testButton.disabled = true;
      elements.testButton.innerHTML = "🎬 Testing...";

      const originalStart = sign.start;
      const originalEnd = sign.end;
      
      sign.start = newStart;
      sign.end = newEnd;
      
      try {
        await this.animationController.playSign(sign.name);
      } catch (error) {
        console.error('Error testing animation:', error);
        this.showNotification('⚠️ Error testing animation', 'error');
      }
      
      sign.start = originalStart;
      sign.end = originalEnd;
      this.animationController.clearCachedAnimation(sign.name);
      
      elements.testButton.disabled = false;
      elements.testButton.innerHTML = "🎬 Test Animation";
    };

    const handleSaveChanges = async () => {
      const newStart = parseInt(elements.startInput.value) || 0;
      const newEnd = parseInt(elements.endInput.value) || 1;
      
      if (newStart >= newEnd) {
        this.showNotification('End frame must be greater than start frame!', 'error');
        return;
      }

      elements.saveButton.disabled = true;
      elements.saveButton.innerHTML = "💾 Saving...";

      try {
        this.animationController.clearCachedAnimation(sign.name);
        sign.start = newStart;
        sign.end = newEnd;
        this.animationController.updateSignInMap(sign.name, newStart, newEnd);
        frameInfoElement.textContent = `Frames: ${sign.start} - ${sign.end}`;
        await this.animationController.saveSignsToFile();
        closeModal();
      } catch (error) {
        console.error('Error saving changes:', error);
        this.showNotification('Error saving changes', 'error');
        elements.saveButton.disabled = false;
        elements.saveButton.innerHTML = "💾 Save Changes";
      }
    };

    // Add event listeners
    elements.startInput.addEventListener("input", () => {
      updatePreview();
      autoTestAnimation();
    });
    elements.endInput.addEventListener("input", () => {
      updatePreview();
      autoTestAnimation();
    });
    elements.closeButton.onclick = closeModal;
    elements.cancelButton.onclick = closeModal;
    elements.modal.onclick = (e) => {
      if (e.target === elements.modal) {
        closeModal();
      }
    };
    elements.testButton.onclick = handleTestAnimation;
    elements.saveButton.onclick = handleSaveChanges;

    // Initial preview update
    updatePreview();
    elements.modal.focus();
  }
}

export default FrameEditor; 