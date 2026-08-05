JavaScript
// Available items parents can tap on-screen
export const availableItems = [
  { id: "socks", label: "🧦 Socks" },
  { id: "tape", label: "🎞️ Tape" },
  { id: "cups", label: "🥤 Cups" },
  { id: "cushions", label: "🛋️ Cushions" },
  { id: "blankets", label: "🛏️ Blankets" },
  { id: "boxes", label: "📦 Cardboard Boxes" },
  { id: "spoons", label: "🥄 Wooden Spoons" },
  { id: "paper", label: "📄 Paper Sheets" }
];

// Activity Database
export const activitiesDatabase = [
  {
    id: "sock-island",
    title: "Sock Island Lava Jump",
    requiredItems: ["socks", "tape"],
    energy: "high",
    prepMinutes: 1,
    steps: [
      "Roll 5 pairs of socks into tight balls.",
      "Use tape to mark a target circle (the 'Island') on the carpet 6 feet away.",
      "Balance on one foot and toss all 5 socks into the target!"
    ],
    twist: "Try throwing with your non-dominant hand or with your eyes closed!"
  },
  {
    id: "cup-stacker",
    title: "Pyramid Speed Collapse",
    requiredItems: ["cups"],
    energy: "low",
    prepMinutes: 1,
    steps: [
      "Stack 10 plastic cups into a 4-tier pyramid.",
      "Start a timer and see how fast you can collapse them back into a single stack without dropping any!"
    ],
    twist: "Can you do it in under 10 seconds?"
  },
  {
    id: "cushion-cave",
    title: "Couch Cushion Cave Crawl",
    requiredItems: ["cushions", "blankets"],
    energy: "high",
    prepMinutes: 2,
    steps: [
      "Arrange couch cushions into a narrow tunnel on the floor.",
      "Drape a blanket over the top to complete the cave.",
      "Crawl through from one end to the other without letting the blanket collapse!"
    ],
    twist: "Carry a stuffed animal on your back like a backpack!"
  },
  {
    id: "spoon-balance",
    title: "Spoon Slalom Obstacle Course",
    requiredItems: ["spoons", "socks"],
    energy: "high",
    prepMinutes: 1,
    steps: [
      "Place rolled-up socks on the floor as slalom markers.",
      "Hold a wooden spoon with a rolled sock balanced on it.",
      "Weave through the markers as fast as possible without dropping the sock."
    ],
    twist: "Hold the spoon handle with your non-dominant hand!"
  },
  {
    id: "paper-airplane-landing",
    title: "Precision Airplane Runway",
    requiredItems: ["paper", "tape"],
    energy: "low",
    prepMinutes: 2,
    steps: [
      "Fold a simple paper airplane.",
      "Tape a runway zone on a table or carpet.",
      "Take 5 test flights from 8 feet away and try to land inside the runway."
    ],
    twist: "Add paper clip weights to the nose to test how far it flies!"
  }
];