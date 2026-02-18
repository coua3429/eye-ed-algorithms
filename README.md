# Eye Emergency Clinical Decision Support Tool

## Overview
This Progressive Web App (PWA) provides clinical decision support for Eye Emergency departments. It includes algorithms for common ophthalmic conditions with step-by-step decision trees.

## Features
- **Algorithm Wizard**: Step-by-step clinical decision support
- **Search Functionality**: Find algorithms quickly
- **Favourites**: Star frequently used algorithms
- **Recently Used**: Track recently accessed algorithms
- **Red Flags**: Collapsible section showing key clinical points
- **ESR Integration**: Copy formatted reports for Electronic Staff Records
- **Offline Support**: Works without internet connection
- **Mobile Responsive**: Optimized for mobile devices
- **Dark Mode**: Clinical-friendly dark interface

## Algorithms Included
1. **Flashing Lights and Floaters** - Assessment of acute vitreous symptoms
2. **Double Vision and New Onset Strabismus** - Adult diplopia evaluation
3. **Red Eye Basic Algorithm** - Systematic red eye assessment

## Installation
1. Extract the ZIP file to your desired directory
2. Upload all files to your web server or GitHub Pages
3. Access via web browser
4. Install as PWA when prompted

## File Structure
```
eye-emergency-pwa/
├── index.html          # Main application structure
├── styles.css          # Dark mode styling and responsive design
├── app.js              # Core application logic
├── manifest.json       # PWA configuration
├── sw.js              # Service Worker for offline functionality
├── data/              # Algorithm JSON files
│   ├── flashes-floaters.json
│   ├── double-vision.json
│   └── red-eye.json
└── README.md          # This file
```

## Usage
1. **Home Screen**: Browse all algorithms, favourites, and recently used
2. **Search**: Use the search icon to find specific algorithms
3. **Algorithm Wizard**: Click any algorithm to start the step-by-step process
4. **Red Flags**: Toggle the warning section to see key clinical points
5. **Navigation**: Use Back, Undo, and Restart buttons as needed
6. **ESR Copy**: At the end of an algorithm, copy formatted report for ESR

## Technical Details
- **Framework**: Vanilla JavaScript (no dependencies)
- **Storage**: localStorage for favourites and recent algorithms
- **Offline**: Service Worker caches all resources
- **Responsive**: Mobile-first CSS design
- **Accessibility**: High contrast support, keyboard navigation

## Browser Support
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers with PWA support

## Deployment to GitHub Pages
1. Create a new repository on GitHub
2. Upload all files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your app will be available at: https://username.github.io/repository-name

## Customization
- **Add Algorithms**: Create new JSON files in the data/ folder
- **Modify Styling**: Edit styles.css for appearance changes
- **Update Logic**: Modify app.js for functionality changes

## Support
This tool is designed for clinical decision support only and should not replace clinical judgment or established protocols.
