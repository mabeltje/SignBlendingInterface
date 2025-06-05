// Helper function to parse URL query parameters
export function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Function to handle URL sequence playback
export function handleUrlSequence(uiController, animationController, availableSigns) {
  const urlSequence = getQueryParam("sequence");
  if (urlSequence) {
    const signsToPlay = urlSequence.split(",").map(sign => sign.trim()).filter(sign => sign.length > 0);
    if (signsToPlay.length > 0) {
      console.log("Playing sequence from URL:", signsToPlay);
      // Add signs to UI sequence and then play
      signsToPlay.forEach(signName => {
        const signData = availableSigns.find(s => s.name === signName);
        if (signData) {
          uiController.addToSequence(signData);
        }
      });
      // Play the sequence after UI is updated
      // animationController.playSequence(signsToPlay, true, false); // Assuming blending is true and not recording for URL playback
    } else {
      console.warn("URL sequence parameter found but no valid signs to play.");
    }
  }
} 