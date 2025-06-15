# Sign Blending Interface

## Description
The Sign Blending Interface is a web application designed to allow users to create and visualize sequences of sign language animations in an interactive 3D environment. It provides a user-friendly interface for selecting, arranging, and playing sign animations with optional blending for smooth transitions.

## Features
*   **Interactive 3D Environment:** Visualize sign language animations on a 3D character model.
*   **Sign Library:** A comprehensive library of available sign language animations that can be easily searched and selected.
*   **Drag-and-Drop Sequence Builder:** Intuitive interface for building custom sign language sequences by dragging signs from the library into a sequence area.
*   **Animation Playback Controls:**
    *   **Play Sequence:** Initiate the playback of the assembled sign sequence.
    *   **Clear All:** Remove all signs from the current sequence.
    *   **Record Sequence:** Play the sequence while also recording the animation.
*   **Blending On/Off:** Enable or disable smooth transitions between consecutive signs in a sequence to enhance visual fluidity.
*   **Babylon.js Integration:** Leverages the Babylon.js framework for efficient 3D rendering, animation management, and model loading.

## Technologies Used
*   **Babylon.js:** A powerful and robust JavaScript framework for building 3D games and experiences in a web browser.
*   **JavaScript (ES6+):** For the core logic and interactivity of the application.
*   **HTML5:** For structuring the web page and the canvas element for 3D rendering.
*   **CSS3:** For styling the user interface.

## Getting Started

To get the project up and running locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd SignBlendingInterface
    ```
2.  **Run the aplication with:**
    ```bash
    npm run dev
    ```
    This will start a development server, and you can access the application in your web browser at ```http://localhost:5173```.

    

## Core Components (Babylon.js)
The application utilizes several core components from Babylon.js to create the 3D experience:
*   **Engine:** Manages the rendering loop and interaction with the HTML `canvas`.
*   **Scene:** The container for all 3D objects, lights, and cameras.
*   **Cameras:** Custom camera controls for navigating the 3D space.
*   **Lights:** Provides basic scene illumination (e.g., `HemisphericLight`).
*   **Meshes:** Includes the 3D character model and environmental elements like the ground.
*   **Animation System:** Manages the playback and blending of character animations.
*   **Loaders:** Used for importing 3D models (e.g., GLTF files) into the scene.
*   **Render Loop:** Continuously redraws the scene to create dynamic visuals.

## Animation Blending
The `AnimationController` class is responsible for managing animation playback and blending. When blending is enabled, it uses Babylon.js's built-in capabilities to smoothly interpolate between the current and next animation in a sequence. This is achieved by setting `enableBlending` to `true` and configuring a `blendingSpeed` for each animation, ensuring a natural transition between different sign language gestures.

## Project Structure (src folder)
*   `main.js`: The entry point of the application, responsible for scene setup and initializing controllers.
*   `UIController.js`: Manages all user interface elements and interactions.
*   `AnimationController.js`: Controls the loading, playing, and blending of character animations.
*   `CharacterController.js`: Handles the 3D character model, and its loading.
*   `sceneController.js`: Responsible for setting up the initial 3D scene (camera, lights, ground).
*   `availableSigns.js`: Defines the list of available sign language animations.
*   `frameEditor.js`: Provides functionality for fine-tuning individual animation frames.
*   `cameraController.js`: Manages camera behavior and controls.
*   `styles.css`: Contains the CSS styling for the user interface.

## Video Recording
The application includes a `VideoRecorder` class that allows users to record the animation sequence as a video. The recorder supports various quality presets and codecs, and can be configured to automatically stop after a specified duration.

### Usage
To record a sequence, click the "Record Sequence" button before playing the animation. The video will be downloaded automatically once the recording is complete.

## URL Feature
The application supports a URL feature that allows users to share and load specific animation sequences directly through a URL. This feature is useful for sharing custom sequences with others or for quickly loading a predefined sequence.

### Usage
To use the URL feature, simply append the sequence of sign names to the URL as a query parameter. For example:
```
http://localhost:5173?sequence=sign1,sign2,sign3
``` 
or 
```
https://signlab.mabbel.nl/?sequence=sign1,sign2,sign3
```
where `sign1`, `sign2`, etc. are the names of the signs in the sequence. 

For example, if you want to load a sequence of the sentence BESTE_REIZIGERS TREIN VAN 5 VOOR HALF 6 NAAR DIEMEN VERTRAAGD you would use:
```
https://signlab.mabbel.nl/?sequence=BESTE_REIZIGERS,TREIN,VAN,5,VOOR,HALF,6,NAAR,DIEMEN,VERTRAAGD
```

When the application loads, it will check for the `sequence` parameter in the URL and automatically populate the sequence builder with the specified signs.
This will automatically load the sequence of signs specified in the URL.
