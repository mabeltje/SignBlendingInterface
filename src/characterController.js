import {
  ImportMeshAsync,
  TransformNode,
  Vector3,
  SceneLoader,
  ImportAnimationsAsync,
  Animation,
  RuntimeAnimation,
  BoneLookController,
} from "babylonjs";
import { availableSigns, availableSignsMap } from "./availableSigns.js";

// Class to load and control the character
class CharacterController {
  constructor(scene, cameraController, isPlaying) {
    this.scene = scene;
    this.cameraController = cameraController;
    this.isPlaying = isPlaying;
    this.animationGroup = null;
    this.currentAnimationGroup = null;
    this.morphTargetManagers = [];
  }

  async init() {
    this.character = await this.loadMesh();
    this.characterMesh = this.character.meshes[0];
    this.rootMesh = this.makeRootMesh();

    console.log("Character loaded:", this.character);

    // Set camera on bone
    this.cameraController.setCameraOnBone(
      this.characterMesh,
      this.character.skeletons[0]
    );
  }

  /**
   * Loads the character mesh.
   * @returns {Promise} A promise that resolves when the mesh is loaded.
   * This function imports the character mesh from a GLB file.
   */
  async loadMesh() {
    const loadedResults = await ImportMeshAsync(
      "glassesGuySignLab.glb",
      this.scene
    );

    // Always select the character mesh as active mesh
    loadedResults.meshes.forEach((mesh) => {
      mesh.alwaysSelectAsActiveMesh = true;

      if (mesh.morphTargetManager) {
        this.morphTargetManagers.push(mesh.morphTargetManager);
      }
    });

    console.log("Morph target managers:", this.morphTargetManagers);

    return loadedResults;
  }

  /**
   * Loads an animation for the character based on the sign name.
   * @param {string} signName - The name of the sign to load the animation for.
   * @returns {Promise} A promise that resolves to the loaded animation group.
   * This function checks if the animation is already loaded to prevent duplicates,
   * and if not, it imports the animation from the specified file.
   */
  async loadAnimation(signName) {
    try {
      // Get the sign file from the availableSigns array
      const sign = availableSigns.find((sign) => sign.name === signName);

      if (!sign) {
        console.error(`Sign not found: ${signName}`);
        return null;
      }

      // Check if the sign file is not already loaded, to prevent duplicates
      const loadedAnimationGroups = this.scene.animationGroups.filter(
        (group) => group.name === signName
      );
      if (loadedAnimationGroups.length > 0) {
        console.log(`Animation group already loaded: ${signName}`);

        loadedAnimationGroups[0].onAnimationGroupEndObservable.clear();
        return loadedAnimationGroups[0];
      }

      const signFile = sign.file;
      console.log("Loading animation:", signFile);

      const result = await SceneLoader.ImportAnimationsAsync(
        "",
        signFile,
        this.scene,
        false,
        BABYLON.SceneLoaderAnimationGroupLoadingMode.NoSync
      );

      // Find the animationgroup that was just loaded
      let myAnimation = result.animationGroups.find(
        (x, i) => x.name === "Unreal Take" && i != 0
      );

      const retargetedAnimation = this.retargetAnimWithBlendshapes(
        this.character,
        myAnimation,
        signName
      );

      myAnimation.dispose();
      myAnimation = retargetedAnimation;
      console.log("myAnimation:", myAnimation);

      if (!myAnimation) {
        console.error(`Animation group not found in ${signFile}`);
        return null;
      }

      const frameRange = this.getFrameRange(signName, myAnimation);

      console.log(
        `Frame range for ${signName}: start=${frameRange.start}, end=${frameRange.end}`
      );

      // Non-destructive trim of the animation
      myAnimation.normalize(frameRange.start, frameRange.end);

      // Hard trim of the animation, if needed
      // myAnimation = this.hardTrim(myAnimation, startFrame, endFrame);

      myAnimation.targetedAnimations.forEach((targetedAnim) => {
        if (targetedAnim.target !== null && targetedAnim.animation !== null) {
          // Remove the hips animation
          if (targetedAnim.target.name === "Hips") {
            if (
              targetedAnim.animation.targetProperty === "rotationQuaternion"
            ) {
              targetedAnim.animation._keys.forEach((key) => {
                key.value.x = 0;
                key.value.y = 0;
                key.value.z = 0;
              });
            } else if (targetedAnim.animation.targetProperty === "position") {
              targetedAnim.animation._keys.forEach((key) => {
                key.value.x = 0;
                key.value.y = 0;
                key.value.z = 1;
              });
            }
          }
        }
      });

      // Rename the animationgroup to the signName
      myAnimation.name = signName;

      return myAnimation;
    } catch (error) {
      console.error("Error in loadAnimation:", error.message);
      return null;
    }
  }

  /**
   * Gets the frame range for a given sign name and animation group.
   * @param {string} signName - The name of the sign to get the frame range for.
   * @param {BABYLON.AnimationGroup} animationGroup - The animation group to get the frame range from.
   * @returns {Object} An object containing the start and end frames for the animation.
   * This function checks if the sign has predefined start and end frames,
   * and if not, it uses the animation group's from and to values as defaults.
   * If the sign is not found, it logs an error and returns null.
   * If the sign has no start or end frame defined, it will use the animation group's from and to values.
   */
  getFrameRange(signName, animationGroup) {
    const sign = availableSignsMap[signName];
    if (!sign) {
      console.error(`Sign not found: ${signName}`);
      return null;
    }

    let startFrame;
    if (availableSignsMap[signName].start == null) {
      startFrame = animationGroup.from;
      console.warn(
        `No start frame defined for ${signName}, using animation start frame: ${startFrame}`
      );
      availableSignsMap[signName].start = startFrame;
    } else {
      startFrame = availableSignsMap[signName].start;
    }

    let endFrame;
    if (availableSignsMap[signName].end == null) {
      endFrame = animationGroup.to;
      console.warn(
        `No end frame defined for ${signName}, using animation end frame: ${endFrame}`
      );
      availableSignsMap[signName].end = endFrame;
    } else {
      endFrame = availableSignsMap[signName].end;
    }

    console.log(availableSignsMap);

    return {
      start: startFrame,
      end: endFrame,
    };
  }

  /**
   * Retargets an animation to the target mesh with blendshapes.
   * @param {BABYLON.AbstractMesh} targetMeshAsset - The target mesh to retarget the animation to.
   * @param {BABYLON.AnimationGroup} animGroup - The animation group to retarget.
   * @param {string} cloneName - The name for the cloned animation group, defaults to "anim".
   * @returns {BABYLON.AnimationGroup} The retargeted animation group.
   * This function clones the animation group and sets the targets to the linked transform nodes
   * of the target mesh's skeleton bones or morph targets.
   * If the target name does not match any bone, it will look for morph targets.
   * If no morph target is found, it will return the last morph target used.
   * If the target mesh does not have a skeleton, it will return null.
   * @throws Will throw an error if the morph target manager is not found.
   */
  retargetAnimWithBlendshapes(targetMeshAsset, animGroup, cloneName = "anim") {
    console.log("Retargeting animation to target mesh...");

    let morphName = null;
    let curMTM = 0;
    let morphIndex = 0;
    let mtm;

    return animGroup.clone(cloneName, (target) => {
      if (!target) {
        console.log("No target.");
        return null;
      }

      // First set all bone targets to the linkedTransformNode
      let idx = targetMeshAsset.skeletons[0].getBoneIndexByName(target.name);
      let targetBone = targetMeshAsset.skeletons[0].bones[idx];
      if (targetBone) {
        return targetBone._linkedTransformNode;
      }

      // Iterate over morphManagers if we don't have a new morph target
      // Otherwise reset the index
      if (morphName !== target.name) {
        curMTM = 0;
        morphName = target.name;
      }

      // If we don't have bones anymore, we can assume we are in the morph target section
      morphIndex = this.getMorphTargetIndex(
        this.morphTargetManagers[curMTM],
        target.name
      );

      // Sometimes a mesh has extra bits of clothing like glasses, which are not part of the morph targets.
      // Because we don't know the order of the morph targets, we need to copy these values to the previous one.
      if (morphIndex === -1) {
        if (!mtm) {
          return null;
        } else {
          return mtm;
        }
      }

      mtm = this.morphTargetManagers[curMTM].getTarget(morphIndex);
      curMTM++;

      return mtm;
    });
  }

  // Helper function to get the morph target index, since babylon only provides
  // morph targets through the index. Which follow GLTF standards but is not useful for us.
  getMorphTargetIndex(morphTargetManager, targetName) {
    if (!morphTargetManager) {
      console.error("Morph target manager not found.");
      return -1;
    }

    for (let i = 0; i < morphTargetManager.numTargets; i++) {
      if (morphTargetManager.getTarget(i).name === targetName) {
        return i;
      }
    }

    return -1;
  }

  hardTrim(animationGroup, start, end) {
    animationGroup.targetedAnimations.forEach((e) => {
      let keys = e.animation.getKeys();
      const startIndex = keys.findIndex((e) => e.frame >= start);
      const endIndex = keys.findIndex((e) => e.frame >= end);
      keys = e.animation.getKeys().slice(startIndex, endIndex);
      keys = keys.map((key) => ({
        ...key,
        frame: key.frame - start,
      }));

      e.animation.setKeys(keys);
    });
    animationGroup.normalize(0, end - start);

    return animationGroup;
  }

  // Load multiple animations and add them to the queue
  async loadMultipleAnimations(signNames) {
    const animationResult = [];

    for (const signName of signNames) {
      const result = await this.loadAnimation(signName);
      animationResult.push(result);
      console.log("Loaded:", signName);
    }

    return animationResult;
  }

  // Play a single animation using the sign name
  async playAnimation(signName) {
    return new Promise((resolve, reject) => {
      try {
        // Play the animation
        if (
          this.scene.animationGroups &&
          this.scene.animationGroups.length > 0
        ) {
          console.log(
            `Found ${
              this.scene.animationGroups.length
            } animation groups: ${this.scene.animationGroups
              .map((group) => group.name)
              .join(", ")}`
          );

          // Stop any currently playing animation
          if (this.currentAnimationGroup) {
            this.currentAnimationGroup.stop();
            console.log(
              `Stopped animation: ${this.currentAnimationGroup.name}`
            );
          }

          // Get the correct animation group by name
          const animationGroup = this.scene.animationGroups.find(
            (group) => group.name === signName
          );
          this.currentAnimationGroup = animationGroup;

          // Set up position
          this.addAnimationToRootMesh(animationGroup);

          // Set up an onAnimationEnd observer to know when the animation completes
          const observer = animationGroup.onAnimationEndObservable.add(() => {
            console.log(`Animation ${animationGroup.name} ended`);
            // Remove the observer to prevent memory leaks
            animationGroup.onAnimationEndObservable.remove(observer);
            this.isPlaying = false;
            resolve();
          });

          // Normalize the animation group to the start and end frames
          animationGroup.normalize(
            availableSignsMap[signName].start,
            availableSignsMap[signName].end
          );

          // Start the animation (not looping)
          animationGroup.start(false);

          this.isPlaying = true;
          console.log(`Animation ${animationGroup.name} started`);
        } else {
          console.error("No animation groups found in the scene");
          this.isPlaying = false;
          reject("No animation groups found");
        }
      } catch (error) {
        console.error("Error playing animation:", error);
        this.isPlaying = false;
        reject(error);
      }
    });
  }

  // Play the given animation group
  async playAnimationGroup(animationGroup) {
    return new Promise((resolve, reject) => {
      try {
        // Stop any currently playing animation
        if (this.currentAnimationGroup) {
          this.currentAnimationGroup.stop();
          console.log(`Stopped animation: ${this.currentAnimationGroup.name}`);
        }

        // Set up position
        this.addAnimationToRootMesh(animationGroup);

        // Set up an onAnimationEnd observer to know when the animation completes
        const observer = animationGroup.onAnimationEndObservable.add(() => {
          console.log(`Animation ${animationGroup.name} ended`);
          // Remove the observer to prevent memory leaks
          animationGroup.onAnimationEndObservable.remove(observer);
          this.isPlaying = false;
          resolve();
        });

        // Start the animation (not looping)
        animationGroup.start(false);

        this.isPlaying = true;
        console.log(`Animation ${animationGroup.name} started`);
      } catch (error) {
        console.error("Error playing animation:", error);
        this.isPlaying = false;
        reject(error);
      }
    });
  }

  // Add the animation to the root mesh and set its position
  addAnimationToRootMesh(animationGroup) {
    animationGroup.parent = this.rootMesh;

    // Adjust the position of the root mesh to be in the center of the scene
    this.rootMesh.position = new Vector3(0, 0, -0.25);

    return animationGroup;
  }

  // Create a root mesh to hold the character and its animations
  makeRootMesh() {
    const rootMesh = new TransformNode("rootMesh", this.scene);
    this.characterMesh.parent = rootMesh;

    rootMesh.rotation = new Vector3(0, Math.PI, 0);

    return rootMesh;
  }
}

export default CharacterController;
