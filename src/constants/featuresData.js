// featuresData.js
// ============================================
// FEATURES SLIDES DATA CONFIGURATION
// ============================================
// 
// All images are in .webp format located in /slides/ folder
// 
// SLIDE TYPES:
// - splitBackground: Two sections with different backgrounds
// - threeArchitects: 3 architect photos horizontally
// - architectIndividual: Single architect bio page
// - buildingShowcase: Large building image with text space
// - buildingElements: Elements breakdown with small images
// - fullImage: Full background image
// - mapSlide: Map layout
// - portfolioSlide: Portfolio buildings showcase
//
// NOTE: All styling is handled in Features.jsx
// This file contains only content data
//
// accentSquares: Array of 2 colors for the solid color boxes
// seaBoxSrc: Path to the seaBox image
// squaresPosition: "left" or "right" - where the squares are on the page
//   - "left" = squares on left side, seaBox goes on rightmost position
//   - "right" = squares on right side, seaBox goes on leftmost position
//
// ============================================

export const type1SlidesData = [
  // ============================================
  // SLIDE 1 - Boman Irani (splitBackground)
  // ============================================
  {
    id: 1,
    slideType: "splitBackground",
    leftSection: {
      imageSrc: "/slides/boman.webp",
    },
    rightSection: {
      backgroundSrc: "/slides/bg.webp",
      topText: "Boman R. Irani",
      topSubtext: "Chairman & Managing Director,\nRustomjee Group",
      paragraphs: [
        "Some places change the way you think about building. Mount Mary is one of them.",
        "This is a part of Mumbai where nothing new can truly come again. What exists here is finite and that scarcity brings with it a responsibility. When something is this rare, it demands restraint. Every decision has to be considered, edited, intentional.",
        "That is where the three disciplines came together - architecture, interiors, and landscape; not as separate expressions, but as one composed thought. Sanjay Puri brings a clarity of form that allows the building to stand as an urban icon, without excess. Patty Mak's interiors are understated, international, and timeless. And Kunal Maniar's landscapes create pauses that are rare in the city.",
        "Mount Mary remains the most protected edge of Bandra Bay, elevated, inward-looking, and quietly connected. Cliff Tower reflects that sensibility. Just a handful of residences, carefully edited. Privacy here is not an amenity, it is a principle.",
        "This is not a building that will be replicated. It is a moment shaped by scarcity, and unlikely to come again.",
      ],
      accentSquares: ["#1a3a4a", "#2d4a5a"],
      seaBoxSrc: "/slides/seaBox.webp",
      squaresPosition: "right",
    },
  },

  // ============================================
  // SLIDE 2 - 3 Architects Together (threeArchitects)
  // ============================================
  {
    id: 2,
    slideType: "threeArchitects",
    backgroundSrc: "/slides/bg.webp",
    title: "A LEGACY ADDRESS,\nLEGENDARY PARTNERS",
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "left",
    architects: [
      {
        src: "/slides/sanjay.webp",
        name: "SANJAY PURI",
        title: "PRINCIPAL ARCHITECT",
        description: "As the lead architect of his much-awarded, eponymous practice, Sanjay Puri is known for shaping buildings of strong urban presence and considered individuality. Cliff Tower reflects this approach through its composed form, refined detailing, and residences that feel both distinctive and deliberately rare.",
      },
      {
        src: "/slides/patty.webp",
        name: "PATTY MAK",
        title: "PRINCIPAL DESIGNER",
        description: "Known for her refined, international design sensibility, Patty Mak is among the foremost interior designers of her generation. Her work is defined by restraint and warmth, creating interiors that feel timeless, composed, and quietly inviting.",
      },
      {
        src: "/slides/kunal.webp",
        name: "KUNAL MANIAR",
        title: "LANDSCAPE DESIGN PARTNER",
        description: "Known within discerning circles for his refined landscape vision, Kunal Maniar brings nature and architecture into quiet dialogue. His work animates even the most compact and vertical spaces, transforming terraces, decks, and gardens into composed sanctuaries of balance, beauty, and calm.",
      },
    ],
  },

  // ============================================
  // SLIDE 3 - Sanjay Puri Individual (Image LEFT, Text RIGHT)
  // ============================================
  {
    id: 3,
    slideType: "architectIndividual",
    layoutDirection: "imageLeft",
    backgroundSrc: "/slides/bg.webp",
    imageSrc: "/slides/sanjay-bio.webp",
    name: "SANJAY PURI",
    title: "PRINCIPAL ARCHITECT",
    paragraphs: [
      "Rustomjee Cliff Tower is conceived as a sculptural response to light, height, and horizon. Positioned at the highest point of Mount Mary, the architecture engages directly with elevation, openness, and expansive sightlines, allowing the building to act as a frame for the sky and sea.",
      "The tower's geometry evolves from a carefully edited footprint, opening outward to capture uninterrupted vistas on multiple sides. By limiting the building to just two residences per floor, the design ensures clarity of planning, privacy, and uninterrupted visual corridors.",
      "Generous floor-to-floor heights and deep outdoor decks are integral to the architecture, lifting the line of sight above the urban foreground and extending living spaces toward the horizon. The façade is defined by soft curves and a restrained white palette, creating a timeless presence shaped by light and shadow throughout the day. Rustomjee Cliff Tower is designed to remain relevant, elegant, and enduring over time.",
    ],
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "right",
  },

  // ============================================
  // SLIDE 4 - Patty Mak Individual (Text LEFT, Image RIGHT)
  // ============================================
  {
    id: 4,
    slideType: "architectIndividual",
    layoutDirection: "imageRight",
    backgroundSrc: "/slides/bg.webp",
    imageSrc: "/slides/patty-bio.webp",
    name: "PATTY MAK",
    title: "PRINCIPAL DESIGNER",
    paragraphs: [
      "Rustomjee Cliff Tower is a refined convergence of architecture, nature, and lifestyle, guided by a philosophy of fluidity that seamlessly connects the built environment to its surroundings.",
      "The interior spaces are crafted to be a canvas for the homeowner's individuality, with open-plan designs that invite residents to imprint their personal narrative and style. This flexibility allows for a deep sense of ownership and connection, as each resident crafts their own unique sanctuary amidst the breathtaking backdrop of the ocean horizon.",
      "The tower's luminous white façade, shaped by gentle curves, dissolves into the sky, animated by a quiet interplay of light and shadow.",
      "Every detail, from the Main Lobby Lounge to the Sky Club Lounge, has been curated with a bespoke palette of timeless elegance, where each material and texture is woven together to create spaces that transcend time. The careful selection of materials, colors, and textures creates a sense of warmth and sophistication, inviting residents to unwind and indulge in the luxurious lifestyle that Cliff Tower embodies.",
    ],
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "left",
  },

  // ============================================
  // SLIDE 5 - Kunal Maniar Individual (Image LEFT, Text RIGHT)
  // ============================================
  {
    id: 5,
    slideType: "architectIndividual",
    layoutDirection: "imageLeft",
    backgroundSrc: "/slides/bg.webp",
    imageSrc: "/slides/kunal-bio.webp",
    name: "KUNAL MANIAR",
    title: "LANDSCAPE DESIGN PARTNER",
    paragraphs: [
      "The landscape at Rustomjee Cliff Tower is conceived as a quiet counterpoint to the architecture - soft, layered, and deliberately restrained. The intent is not to impose nature, but to allow it to emerge naturally, creating moments of calm and sensory pause within the built form.",
      "At ground level, dense planting and textured surfaces choreograph arrival, offering privacy, shade, and a gentle transition from city to sanctuary. Movement is slowed, views are framed, and nature is experienced through foliage, filtered light, and tactile materials.",
      "The rooftop landscape unfolds as an elevated garden retreat. Open decks, water, and pockets of greenery are composed to encourage lingering - whether in solitude or shared moments. Tropical planting softens edges and blends seamlessly with sky and horizon.",
      "The landscape at Rustomjee Cliff Tower is experiential rather than ornamental - designed to reconnect people with nature through rhythm, restraint, and timeless simplicity.",
    ],
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "right",
  },

  // ============================================
  // SLIDE 6 - Building Showcase (Image LEFT, Text RIGHT)
  // ============================================
  {
    id: 6,
    slideType: "buildingShowcase",
    backgroundSrc: "/slides/bg.webp",
    buildingImageSrc: "/slides/cliff-tower.webp",
    title: "AN ADDRESS THE SKYLINE\nWILL REMEMBER",
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "right",
  },

  // ============================================
  // SLIDE 7 - Elements of Building
  // ============================================
  {
    id: 7,
    slideType: "buildingElements",
    backgroundSrc: "/slides/bg.webp",
    mainImageSrc: "/slides/building-element.webp",
    title: "ARCHITECTURE, PERFECTED",
    description: "A double-height arrival, coastal-grade façade, aluminum cladding, and double-glazed glass ensure lasting performance, comfort, and quiet luxury.",
    elements: [
      {
        src: "/slides/curved-balcony.webp",
        text: "CURVED BALCONIES WITH OUTWARD-PUSHED GLASS RAILINGS FOR NEAR 270-DEGREE VIEW.",
      },
      {
        src: "/slides/glass-unit.webp",
        text: "DOUBLE-GLAZED GLASS UNITS (DGU) FOR HEAT CONTROL, ACOUSTIC COMFORT, AND ENERGY EFFICIENCY.",
      },
      {
        src: "/slides/aluminium.webp",
        text: "ALUMINIUM CLADDING AND HIGH-PERFORMANCE FINISHES TO RESIST CORROSION AND WEATHERING.",
      },
      {
        src: "/slides/double-height.webp",
        text: "DOUBLE-HEIGHT GROUND FLOOR LOBBY WITH APPROXIMATELY 5.5 M SLAB-TO-SLAB HEIGHT.",
      },
    ],
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "right",
  },

  // ============================================
  // SLIDE 8 - Materials (Full Width Image)
  // ============================================
  {
    id: 8,
    slideType: "fullImage",
    imageSrc: "/slides/materials.webp",
  },

  // ============================================
  // SLIDE 9 - Map (Text Left, Map Right)
  // ============================================
  {
    id: 9,
    slideType: "mapSlide",
    backgroundSrc: "/slides/bg.webp",
    title: "SEAMLESSLY CONNECTED,\nSERENELY APART",
    mapImageSrc: "/slides/map.webp",
    distances: [
      { place: "Mount Mary", distance: "150 m" },
      { place: "Bandstand Promenade", distance: "450 m" },
      { place: "Bandra Worli Sea Link", distance: "3 km" },
      { place: "Western Express Highway", distance: "2.5 km" },
      { place: "Domestic airport", distance: "8.7 km" },
      { place: "International airport", distance: "11.9 km" },
    ],
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "left",
  },

  // ============================================
  // SLIDE 10 - Rustomjee Portfolio (3 Buildings + Text)
  // ============================================
  {
    id: 10,
    slideType: "portfolioSlide",
    backgroundSrc: "/slides/bg.webp",
    buildings: [
      {
        src: "/slides/parishram.webp",
        name: "RUSTOMJEE PARISHRAM",
        location: "PALI HILL",
        objectPosition: "38% 50%",
      },
      {
        src: "/slides/crescent.webp",
        name: "RUSTOMJEE CRESCENT",
        location: "PALI HILL",
        objectPosition: "45% 50%",
      },
      {
        src: "/slides/panorama.webp",
        name: "RUSTOMJEE PANORAMA",
        location: "PALI HILL",
        objectPosition: "50% 50%",
      },
    ],
    textLines: [
      "EVERY LANDMARK",
      "LEADS TO A RARER ONE",
      "CLIFF TOWER IS THE PINNACLE",
      "OF OUR JOURNEY IN BANDRA",
    ],
    accentSquares: ["#1a3a4a", "#2d4a5a"],
    seaBoxSrc: "/slides/seaBox.webp",
    squaresPosition: "right",
  },
];