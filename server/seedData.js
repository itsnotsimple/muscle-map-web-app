const data = [
  // --- ГЛАВНИ ГРУПИ ---
  {
    key: "chest",
    title: "Chest",
    subTitle: "Pectoralis Major, Pectoralis Minor",
    exercises: [
      {
        name: "Bench Press",
        text: "The king of chest exercises.",
        difficulty: "Intermediate",
        equipment: "Barbell", location: "Gym", gif: "/images/demos/bench.gif",
        steps: ["Lie on bench", "Lower bar to chest", "Press up"]
      },
      {
        name: "Incline Dumbbell Press",
        text: "Targets upper chest.",
        difficulty: "Beginner",
        equipment: "Dumbbells", location: "Gym", gif: "/images/demos/incline.gif",
        steps: ["Set bench to 30 degrees", "Press weights up", "Lower slowly"]
      }
    ]
  },
  {
    key: "shoulders",
    title: "Shoulders",
    subTitle: "Deltoids (Front, Side, Rear)",
    exercises: [
      {
        name: "Overhead Press",
        text: "Builds massive shoulders.",
        difficulty: "Intermediate",
        equipment: "Barbell", location: "Gym", gif: "/images/demos/Overhead_Press.gif",
        steps: ["Stand straight", "Press bar overhead", "Lower slowly"]
      },
      {
        name: "Lateral Raises",
        text: "Widens the shoulders.",
        difficulty: "Beginner",
        equipment: "Dumbbells", location: "Home/Gym", gif: "/images/demos/lateral_raise.gif",
        steps: ["Lift arms to side", "Keep elbows bent", "Lower"]
      }
    ]
  },
  {
    key: "biceps",
    title: "Biceps",
    subTitle: "Biceps Brachii",
    exercises: [
      {
        name: "Dumbbell Curls",
        text: "Isolation for biceps.",
        difficulty: "Beginner",
        equipment: "Dumbbells", location: "Home/Gym", gif: "/images/demos/Dumbbell_Curls.gif",
        steps: ["Hold dumbbells", "Curl up", "Squeeze"]
      },
      {
        name: "Hammer Curls",
        text: "Targets biceps and brachialis.",
        difficulty: "Beginner",
        equipment: "Dumbbells", location: "Home/Gym", gif: "/images/demos/hammer.gif",
        steps: ["Palms facing in", "Curl up", "Lower"]
      }
    ]
  },
  {
    key: "triceps",
    title: "Triceps",
    subTitle: "Triceps Brachii",
    exercises: [
      {
        name: "Pushdowns",
        text: "Cable pushdowns for horseshoe triceps.",
        difficulty: "Beginner",
        equipment: "Cable", location: "Gym", gif: "/images/demos/tricepdown.gif",
        steps: ["Grab rope", "Push down", "Extend arms"]
      },
      {
        name: "Skullcrushers",
        text: "Mass builder for triceps.",
        difficulty: "Intermediate",
        equipment: "Barbell", location: "Gym", gif: "/images/demos/skull-crusher.gif",
        steps: ["Lie on bench", "Lower bar to forehead", "Extend up"]
      }
    ]
  },

  // --- SPECIAL GROUPS ---

  {
    key: "upper_back",
    title: "Upper Back",
    subTitle: "Rhomboids, Middle Trapezius",
    exercises: [
      {
        name: "Face Pulls",
        text: "Crucial for posture and rear delts.",
        difficulty: "Intermediate",
        equipment: "Cable Machine", location: "Gym", gif: "/images/demos/facepull.gif",
        steps: ["Set cable to eye level", "Pull rope to face", "Squeeze shoulder blades"]
      },
      {
        name: "Reverse Flys",
        text: "Targets the muscles between the shoulder blades.",
        difficulty: "Beginner",
        equipment: "Dumbbells", location: "Home/Gym", gif: "/images/demos/reverse_flys.gif",
        steps: ["Bend over", "Lift arms to side", "Squeeze upper back"]
      },
      {
        name: "Bent Over Rows",
        text: "Compound movement for back thickness.",
        difficulty: "Intermediate",
        equipment: "Barbell", location: "Gym", gif: "/images/demos/seatedrow.gif",
        steps: ["Bend hips back", "Pull bar to stomach", "Keep back straight"]
      }
    ]
  },

  {
    key: "obliques",
    title: "Obliques",
    subTitle: "External & Internal Obliques",
    exercises: [
      {
        name: "Russian Twists",
        text: "Rotational exercise for the core.",
        difficulty: "Intermediate",
        equipment: "Medicine Ball / Bodyweight", location: "Home/Gym", gif: "/images/demos/Russian_Twists.gif",
        steps: ["Sit on floor", "Lift feet", "Twist torso side to side"]
      },
      {
        name: "Side Planks",
        text: "Static hold for side abs stability.",
        difficulty: "Beginner",
        equipment: "Mat", location: "Home", gif: "/images/demos/Side_Planks.gif",
        steps: ["Lie on side", "Lift hips", "Hold straight line"]
      }
    ]
  },
  {
    key: "forearms",
    title: "Forearms",
    subTitle: "Flexors & Extensors",
    exercises: [
      {
        name: "Wrist Curls",
        text: "Isolates the forearm flexors.",
        difficulty: "Beginner",
        equipment: "Dumbbell", location: "Home/Gym", gif: "/images/demos/Wrist_Curls.gif",
        steps: ["Rest arm on bench", "Hold dumbbell", "Curl wrist up"]
      },
      {
        name: "Farmers Walk",
        text: "Builds grip strength and traps.",
        difficulty: "Intermediate",
        equipment: "Heavy Dumbbells", location: "Gym", gif: "/images/demos/Farmers_Walk.gif",
        steps: ["Pick up heavy weights", "Walk straight", "Keep posture tight"]
      }
    ]
  },
  {
    key: "lower_back",
    title: "Lower Back",
    subTitle: "Erector Spinae",
    exercises: [
      {
        name: "Back Extensions",
        text: "Strengthens the lower back safely.",
        difficulty: "Beginner",
        equipment: "Machine / Bench", location: "Gym", gif: "/images/demos/back-extension.gif",
        steps: ["Lock feet in machine", "Lower torso", "Raise back up"]
      },
      {
        name: "Superman",
        text: "Bodyweight exercise for spinal erectors.",
        difficulty: "Beginner",
        equipment: "Mat", location: "Home", gif: "/images/demos/superman.gif",
        steps: ["Lie on stomach", "Lift arms and legs", "Hold"]
      }
    ]
  },
  {
    key: "lats",
    title: "Lats (Back)",
    subTitle: "Latissimus Dorsi",
    exercises: [
      {
        name: "Lat Pulldown",
        text: "Builds back width.",
        difficulty: "Beginner",
        equipment: "Cable Machine", location: "Gym", gif: "/images/demos/latpulldown.gif",
        steps: ["Grip wide", "Pull to chest", "Control up"]
      },
      {
        name: "Pull Ups",
        text: "The best bodyweight back builder.",
        difficulty: "Advanced",
        equipment: "Bar", location: "Home/Gym", gif: "/images/demos/pull_up.gif",
        steps: ["Hang from bar", "Pull chin over bar", "Lower all the way"]
      }
    ]
  },
  {
    key: "neck",
    title: "Neck",
    subTitle: "Cervical Muscles",
    exercises: [
      {
        name: "Neck Curls",
        text: "Strengthens the front of the neck.",
        difficulty: "Beginner",
        equipment: "Weight Plate", location: "Gym / Home", gif: "/images/demos/neck_curl.gif",
        steps: ["Lie on bench face up", "Place plate on forehead", "Curl neck upward"]
      },
      {
        name: "Neck Extensions",
        text: "Strengthens the back of the neck.",
        difficulty: "Intermediate",
        equipment: "Weight Plate / Harness", location: "Gym", gif: "/images/demos/neck_extension.gif",
        steps: ["Lie on bench face down", "Place plate on back of head", "Extend neck upward"]
      }
    ]
  },
  {
    key: "traps",
    title: "Traps",
    subTitle: "Trapezius",
    exercises: [
      {
        name: "Dumbbell Shrugs",
        text: "Isolates the upper traps.",
        difficulty: "Beginner",
        equipment: "Dumbbells", location: "Gym", gif: "/images/demos/dumbbell_shrug.gif",
        steps: ["Hold heavy dumbbells", "Shrug shoulders to ears", "Lower"]
      }
    ]
  },
  {
    key: "abs",
    title: "Abs",
    subTitle: "Rectus Abdominis",
    exercises: [
      { name: "Crunches", text: "Basic ab movement.", difficulty: "Beginner", equipment: "None", location: "Home", steps: ["Lie down", "Crunch up"], gif: "/images/demos/Crunches.gif" }
    ]
  },
  {
    key: "quads",
    title: "Quads",
    subTitle: "Quadriceps",
    exercises: [
      { name: "Squats", text: "Leg builder.", difficulty: "Advanced", equipment: "Barbell", location: "Gym", steps: ["Squat down", "Stand up"], gif: "/images/demos/squat.gif" }
    ]
  },
  {
    key: "hamstrings",
    title: "Hamstrings",
    subTitle: "Back of thigh",
    exercises: [
      { name: "Leg Curls", text: "Isolate hamstrings.", difficulty: "Beginner", equipment: "Machine", location: "Gym", steps: ["Curl legs", "Release"], gif: "/images/demos/Leg_Curls.gif" }
    ]
  },
  {
    key: "glutes",
    title: "Glutes",
    subTitle: "Buttocks",
    exercises: [
      { name: "Hip Thrust", text: "Best for glutes.", difficulty: "Intermediate", equipment: "Bench", location: "Gym", steps: ["Thrust hips", "Squeeze"], gif: "/images/demos/Hip_Thrust.gif" }
    ]
  },
  {
    key: "calves",
    title: "Calves",
    subTitle: "Lower leg",
    exercises: [
      { name: "Calf Raise", text: "For calves.", difficulty: "Beginner", equipment: "None", location: "Any", steps: ["Lift heels", "Lower"], gif: "/images/demos/Calf Raise.gif" }
    ]
  }
];

module.exports = data;