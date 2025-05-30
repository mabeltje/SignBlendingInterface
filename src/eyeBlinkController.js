class EyeBlinkController {
  constructor(loadedResults) {
    this.loadedResults = loadedResults;
  }

  //   Controller or just regular fucntions?

  createEyeBlinkAnimation(scene) {
    // Get the morph targets for the eyes
    // var morph1 = morphTargetManager.getTargetByName("eyeBlinkLeft");
    // var morph2 = morphTargetManager.getTargetByName("eyeBlinkRight");
    // morph1 = morph1 != null ? morph1 : morphTargetManager.getTarget(57);
    // morph2 = morph2 != null ? morph2 : morphTargetManager.getTarget(58);

    // if (!morph1 || !morph2) {
    //   console.warn("Morph targets for eyes not found");
    //   return;
    // }
    // Create the eye blink animation

    console.log(this.morph1);
    this.eyeBlinkAnimation(this.morph1, this.morph2);

    // Start the animation
    scene.beginAnimation(
      this.morph1,
      0,
      this.morph1.animations[0].getKeys().at(-1).frame,
      true
    );
    // scene.beginAnimation(
    //   morph2,
    //   0,
    //   morph2.animations[0].getKeys().at(-1).frame,
    //   true
    // );
  }

  eyeBlinkAnimation(morph1, morph2) {
    const blinkAnimation = new BABYLON.Animation(
      "blinkAnimation",
      "influence",
      30, // FPS
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    // Keyframes for the blink animation with varied timing
    const blinkKeys = [];

    // Initial state: eyes open
    blinkKeys.push({ frame: 0, value: 0 });

    // First blink (quick)
    blinkKeys.push({ frame: 10, value: 0 }); // Eyes closed
    blinkKeys.push({ frame: 15, value: 1 }); // Eyes closed
    blinkKeys.push({ frame: 20, value: 0 }); // Eyes open

    // Pause (slightly longer)
    blinkKeys.push({ frame: 140, value: 0 }); // Eyes open

    // Double blink
    blinkKeys.push({ frame: 145, value: 0 }); // Eyes Open
    blinkKeys.push({ frame: 150, value: 1 }); // Eyes closed
    blinkKeys.push({ frame: 155, value: 0 }); // Eyes open
    blinkKeys.push({ frame: 170, value: 0 }); // Eyes open
    blinkKeys.push({ frame: 175, value: 1 }); // Eyes closed
    blinkKeys.push({ frame: 180, value: 0 }); // Eyes open

    // Long pause
    blinkKeys.push({ frame: 280, value: 0 }); // Eyes open

    blinkAnimation.setKeys(blinkKeys);

    // Apply the animation to both eye morph targets
    morph1.animations = [blinkAnimation];
    // morph2.animations = [blinkAnimation];
  }

  // Function to stop the eye blink animation
  stopEyeBlinkAnimation(scene, characterController) {
    // Get the morph targets for the eyes
    const morph1 =
      characterController.characterMesh.morphTargetManager.getTarget(57);
    const morph2 =
      characterController.characterMesh.morphTargetManager.getTarget(58);

    if (!morph1 || !morph2) {
      console.warn("Morph targets for eyes not found");
      return;
    }

    // Stop the animation
    scene.stopAnimation(morph1);
    scene.stopAnimation(morph2);

    morph1.animations = [];
    morph2.animations = [];
  }
}

export default EyeBlinkController;
