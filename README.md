# Eye Emergency Clinical Decision Support Tool - Updated v2.0

## 🚨 IMPORTANT: Cache Update Instructions

If you're updating from a previous version and not seeing changes:

### For Desktop/Laptop:
1. **Hard Refresh**: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
2. **Clear Site Data**: Go to browser settings → Clear browsing data → Select "Cookies and site data" for your GitHub Pages URL
3. **Developer Tools**: Press F12 → Application tab → Storage → Clear storage

### For Mobile:
1. **Clear Browser Cache**: Go to browser settings and clear cache/data
2. **Use Private/Incognito Mode**: Open your PWA in private browsing mode
3. **Restart Browser**: Close and reopen your browser app

### GitHub Pages Update:
- Wait 2-3 minutes after uploading files for GitHub Pages to rebuild
- Check the Actions tab in your repository to see if deployment is complete

## New Algorithms Added (Total: 9)

### Original 3:
1. **Red Eye Basic Algorithm** - Systematic red eye assessment
2. **Flashing Lights and Floaters** - Assessment of acute vitreous symptoms  
3. **Double Vision and New Onset Strabismus** - Adult diplopia evaluation

### New 6 Algorithms:
4. **Managing Ocular Trauma** - Open vs closed globe injury assessment
5. **Sudden Visual Loss** - Including GCA and vascular occlusions
6. **Optic Disc Swelling** - Differentiating true swelling from pseudopapilloedema
7. **The Painful Eyeball** - Systematic approach to ocular pain
8. **Corneal Defects and Foreign Bodies** - Managing corneal injuries and infections
9. **Periorbital and Orbital Cellulitis** - Distinguishing preseptal from orbital cellulitis

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

## Quick Deployment to GitHub Pages
1. **Download** the updated ZIP file
2. **Delete** old files from your GitHub repository
3. **Upload** all new files (drag and drop the extracted folder contents)
4. **Commit changes** (green button at bottom)
5. **Wait 2-3 minutes** for GitHub Pages to rebuild
6. **Hard refresh** your browser when accessing the site

## File Structure
```
eye-emergency-pwa/
├── index.html          # Main application structure
├── styles.css          # Dark mode styling and responsive design
├── app.js              # Core application logic (v2.0 - updated)
├── sw.js              # Service Worker (v2.0 - cache busting)
├── manifest.json       # PWA configuration
├── README.md          # This file
└── data/              # Algorithm JSON files (9 total)
    ├── red-eye.json
    ├── flashes-floaters.json
    ├── double-vision.json
    ├── ocular-trauma.json
    ├── sudden-visual-loss.json
    ├── disc-swelling.json
    ├── painful-eyeball.json
    ├── corneal-ulcers.json
    └── cellulitis.json
```

## Technical Updates in v2.0
- **Cache Busting**: Prevents old versions from being cached
- **Enhanced Mobile Support**: Better clipboard functionality for mobile devices
- **Improved Error Handling**: Better user feedback and error messages
- **Service Worker Updates**: Automatic detection and prompting for updates
- **9 Complete Algorithms**: All major eye emergency presentations covered

## Usage
1. **Browse Algorithms**: Use search, favourites, or browse all algorithms
2. **Start Algorithm**: Click any algorithm card to begin step-by-step assessment
3. **Follow Steps**: Answer questions to navigate through clinical decision tree
4. **View Red Flags**: Toggle the warning section for key clinical points
5. **Copy ESR Report**: At completion, copy formatted report for patient records

## Browser Support
- Chrome/Edge 80+
- Firefox 75+
- Safari 13+
- Mobile browsers with PWA support

## Support
This tool is designed for clinical decision support only and should not replace clinical judgment or established protocols.
