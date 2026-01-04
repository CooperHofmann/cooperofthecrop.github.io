/**
 * IMAGE CONFIGURATION
 * 
 * This file controls which images appear in each portfolio section.
 * To add/remove/reorder images:
 * 1. Add your image files to the corresponding folder in /images/
 * 2. Add the filename to the array below
 * 3. Images will appear in the order listed
 * 
 * Folder structure:
 * /images/track/     - Track & Field photos
 * /images/soccer/    - Soccer photos
 * /images/football/  - Football photos
 * /images/basketball/ - Basketball photos
 * /images/best-of/   - Best of all categories
 */

const portfolioConfig = {
    track: {
        title: "TRACK &<br>FIELD",
        description: "Track & Field Photography",
        images: [
            "TRACK SN DONE (5 of 303).jpg"
            // Add more track images here
            // Example: "track-image-1.jpg",
            // Example: "track-image-2.jpg",
        ]
    },
    soccer: {
        title: "SOCCER",
        description: "Soccer Photography",
        images: [
            // Add soccer images here
            // Example: "soccer-image-1.jpg",
        ]
    },
    football: {
        title: "FOOTBALL",
        description: "Football Photography",
        images: [
            // Add football images here
            // Example: "football-image-1.jpg",
        ]
    },
    basketball: {
        title: "BASKETBALL",
        description: "Basketball Photography",
        images: [
            // Add basketball images here
            // Example: "basketball-image-1.jpg",
        ]
    },
    bestOf: {
        title: "BEST<br>OF",
        description: "Curated Selection",
        images: [
            // Add best-of images here
            // These should be your absolute best shots from any category
            // Example: "best-shot-1.jpg",
        ]
    }
};

// Placeholder images for empty galleries
const placeholderImages = [
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80", // Running
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80", // Soccer
    "https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?w=800&q=80", // Football
    "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80", // Basketball
];
