import {availableSignsMap} from "./availableSigns.js";

// This class handles the frame editing modal for signs in the animation sequence
class FrameEditor {
  constructor(
    scene,
    animationController,
    showNotification,
    updateLibraryUI,
    updateSequenceUI
  ) {
    this.animationController = animationController;
    this.showNotification = showNotification;
    this.UIcontroller = {
      updateLibraryUI: updateLibraryUI,
      updateSequenceUI: updateSequenceUI,
    };
    this.scene = scene;
  }

  // Show the frame editor modal for a specific sign
  // This function creates the modal, sets up event listeners, and handles the frame editing logic
  show(sign, frameInfoElement) {
    const modal = this.createFrameEditorModal(sign);
    document.body.appendChild(modal);

    const elements = this.getFrameEditorElements(modal);
    this.setupFrameEditorEventListeners(elements, sign, frameInfoElement);
  }

  // Create the frame editor modal structure
  createFrameEditorModal(sign) {
    // Find the sign in the available signs map
    console.log("Sign name map", availableSignsMap[sign.name]);

    console.log("Available signs map updated:", availableSignsMap);

    const frameStart = availableSignsMap[sign.name]?.start || 0;
    const frameEnd = availableSignsMap[sign.name]?.end || 600;

    console.log("Sign to edit:", sign);
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
            <label for="start-frame">Start Frame: <span id="start-value">${frameStart}</span></label>
            <input type="range" id="start-frame" value="${frameStart}" min="0" max="250" step="1" class="frame-slider">
          </div>
          <div class="frame-control">
            <label for="end-frame">End Frame: <span id="end-value">${frameEnd}</span></label>
            <input type="range" id="end-frame" value="${frameEnd}" min="1" max="250" step="1" class="frame-slider">
          </div>
          <div class="frame-preview">
            <p>Original: ${frameStart} - ${frameEnd} (${
      frameEnd - frameStart
    } frames)</p>
            <div class="frame-preview-live">
              <p id="frame-preview-text">Preview: ${frameStart} - ${frameEnd} (${
      frameEnd - frameStart
    } frames)</p>
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
      modal: modal,
    };
  }

  // Setup all event listeners for the frame editor
  setupFrameEditorEventListeners(elements, sign, frameInfoElement) {
    let autoTestTimeout;

    // Update the preview text and values based on the current input values
    const updatePreview = (slider) => {
      const start = parseInt(elements.startInput.value) || 0;
      const end = parseInt(elements.endInput.value) || 1;
      const duration = Math.max(0, end - start);

      elements.startValueSpan.textContent = start;
      elements.endValueSpan.textContent = end;
      elements.previewText.textContent = `Preview: ${start} - ${end} (${duration} frames)`;

      availableSignsMap[sign.name] = {
        ...availableSignsMap[sign.name],
        start: start,
        end: end,
      };

      const isValid = start < end;
      console.log("Is valid frame range:", isValid);
      elements.previewText.style.color = isValid ? "#333" : "#F44336";
      elements.saveButton.disabled = !isValid;
      elements.testButton.disabled = !isValid;

      this.UIcontroller.updateLibraryUI();
      this.UIcontroller.updateSequenceUI();
    };

    // Auto-test the animation when the start or end frame changes
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

        try {
          await this.animationController.playSign(sign.name);
        } catch (error) {
          console.error("Error auto-testing animation:", error);
        }

        sign.start = originalStart;
        sign.end = originalEnd;
      }, 800);
    };

    // Close the modal and clean up
    const closeModal = () => {
      if (autoTestTimeout) {
        clearTimeout(autoTestTimeout);
      }
      document.body.removeChild(elements.modal);
    };

    // Handle testing the animation with the current start and end frames
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
        console.error("Error testing animation:", error);
        this.showNotification("⚠️ Error testing animation", "error");
      }

      sign.start = originalStart;
      sign.end = originalEnd;

      elements.testButton.disabled = false;
      elements.testButton.innerHTML = "🎬 Test Animation";
    };

    // Handle saving changes to the start and end frames
    const handleSaveChanges = async () => {
      const newStart = parseInt(elements.startInput.value) || 0;
      const newEnd = parseInt(elements.endInput.value) || 1;

      if (newStart >= newEnd) {
        console.error("End frame must be greater than start frame!");
        this.showNotification(
          "End frame must be greater than start frame!",
          "error"
        );
        return;
      }

      elements.saveButton.disabled = true;
      elements.saveButton.innerHTML = "💾 Saving...";

      try {
        sign.start = newStart;
        sign.end = newEnd;
        console.log("Available signs map after save:", availableSignsMap);
        closeModal();
      } catch (error) {
        console.error("Error saving changes:", error);
        this.showNotification("Error saving changes", "error");
        elements.saveButton.disabled = false;
        elements.saveButton.innerHTML = "💾 Save Changes";
      }
    };

    // Add event listeners
    elements.startInput.addEventListener("input", () => {
      updatePreview("start");
      autoTestAnimation();
    });
    elements.endInput.addEventListener("input", () => {
      updatePreview("end");
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
