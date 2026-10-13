const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Member = require("./models/Member");
const Profile = require("./models/Profile");
const Workout = require("./models/Workout");
const Diet = require("./models/Diet");

const connectWithFallback = async () => {
  const uri =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/prime_fitness_gym";
  try {
    const conn = await mongoose.connect(uri);
    console.log(`Connected to MongoDB Atlas: ${conn.connection.host}`);
  } catch (err) {
    console.error(`⚠️ Could not connect to Atlas URI (${uri}): ${err.message}`);
    if (uri !== "mongodb://127.0.0.1:27017/prime_fitness_gym") {
      console.log("🔄 Falling back to local MongoDB for seeding...");
      const localConn = await mongoose.connect(
        "mongodb://127.0.0.1:27017/prime_fitness_gym",
      );
      console.log(`Connected to Local MongoDB: ${localConn.connection.host}`);
    } else {
      throw err;
    }
  }
};

const seedData = async () => {
  try {
    await connectWithFallback();

    // 1. Create Default Admin User
    const adminEmail = (
      process.env.ADMIN_EMAIL || "admin@primefitness.com"
    ).toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || "Admin09876";

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPass, salt);

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: "Prime Gym Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
      });
      console.log(`Default Admin created successfully: ${adminEmail}`);
    } else {
      admin.password = hashedPassword;
      admin.role = "admin";
      await admin.save();
      console.log(
        `Admin account password & role updated successfully: ${adminEmail}`,
      );
    }

    // 2. Seed Workouts (Weight Loss, Weight Gain, Fitness)
    await Workout.deleteMany({});
    const workoutPlans = [
      {
        fitnessGoal: "Weight Loss",
        schedule: [
          {
            day: "Monday",
            title: "High-Intensity Cardio & Core",
            guidance:
              "Keep your heart rate elevated and take short 45s rest intervals.",
            exercises: [
              {
                name: "Treadmill Incline Interval Run",
                setsReps: "20 mins",
                rest: "45 secs",
              },
              {
                name: "Jumping Jacks",
                setsReps: "4 sets x 40 reps",
                rest: "30 secs",
              },
              {
                name: "Bodyweight Squats",
                setsReps: "4 sets x 25 reps",
                rest: "45 secs",
              },
              {
                name: "Mountain Climbers",
                setsReps: "3 sets x 30 secs",
                rest: "30 secs",
              },
              {
                name: "Plank Hold",
                setsReps: "3 sets x 60 secs",
                rest: "45 secs",
              },
            ],
          },
          {
            day: "Tuesday",
            title: "Upper Body Fat Burn Circuit",
            guidance:
              "Focus on explosive movements and controlled eccentric phases.",
            exercises: [
              {
                name: "Push-Ups",
                setsReps: "4 sets x 15 reps",
                rest: "45 secs",
              },
              {
                name: "Dumbbell Rows",
                setsReps: "4 sets x 15 reps",
                rest: "60 secs",
              },
              {
                name: "Dumbbell Shoulder Press",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Bicep Curls to Overhead Press",
                setsReps: "3 sets x 15 reps",
                rest: "45 secs",
              },
              {
                name: "Rowing Machine HIIT",
                setsReps: "15 mins",
                rest: "60 secs",
              },
            ],
          },
          {
            day: "Wednesday",
            title: "Active Recovery & Flexibility",
            guidance:
              "Low intensity steady state movement and full body stretching.",
            exercises: [
              {
                name: "Brisk Outdoor / Treadmill Walking",
                setsReps: "35 mins",
                rest: "None",
              },
              {
                name: "Dynamic Hamstring & Quadriceps Stretch",
                setsReps: "10 mins",
                rest: "Self-paced",
              },
              {
                name: "Foam Rolling Major Muscles",
                setsReps: "15 mins",
                rest: "Self-paced",
              },
            ],
          },
          {
            day: "Thursday",
            title: "Lower Body & Explosive Plyometrics",
            guidance: "Engage glutes and core; drink water between circuits.",
            exercises: [
              {
                name: "Goblet Squats",
                setsReps: "4 sets x 15 reps",
                rest: "60 secs",
              },
              {
                name: "Walking Lunges",
                setsReps: "3 sets x 20 steps",
                rest: "45 secs",
              },
              {
                name: "Kettlebell Swings",
                setsReps: "4 sets x 20 reps",
                rest: "45 secs",
              },
              {
                name: "Jump Squats",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Elliptical Cardio Finisher",
                setsReps: "15 mins",
                rest: "60 secs",
              },
            ],
          },
          {
            day: "Friday",
            title: "Full Body HIIT Blast",
            guidance: "Maximum effort during work intervals.",
            exercises: [
              {
                name: "Burpees",
                setsReps: "4 sets x 12 reps",
                rest: "45 secs",
              },
              {
                name: "Dumbbell Thrusters",
                setsReps: "4 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Battle Ropes Slam",
                setsReps: "4 sets x 30 secs",
                rest: "30 secs",
              },
              {
                name: "Russian Twists with Weight",
                setsReps: "3 sets x 30 reps",
                rest: "45 secs",
              },
              {
                name: "Cycling Sprint Intervals",
                setsReps: "15 mins",
                rest: "45 secs",
              },
            ],
          },
          {
            day: "Saturday",
            title: "Core Conditioning & Cardio Endurance",
            guidance: "Build stamina and abdominal endurance.",
            exercises: [
              {
                name: "Stairmaster / Incline Walk",
                setsReps: "25 mins",
                rest: "60 secs",
              },
              {
                name: "Bicycle Crunches",
                setsReps: "4 sets x 25 reps",
                rest: "30 secs",
              },
              {
                name: "Hanging Leg Raises",
                setsReps: "3 sets x 12 reps",
                rest: "45 secs",
              },
              {
                name: "Side Planks",
                setsReps: "3 sets x 45 secs/side",
                rest: "45 secs",
              },
            ],
          },
          {
            day: "Sunday",
            title: "Complete Rest Day",
            guidance:
              "Allow muscles to rebuild and get adequate 8 hours sleep.",
            exercises: [
              {
                name: "Gentle Light Stretching",
                setsReps: "15 mins",
                rest: "Self-paced",
              },
            ],
          },
        ],
      },
      {
        fitnessGoal: "Weight Gain",
        schedule: [
          {
            day: "Monday",
            title: "Heavy Chest & Triceps Hypertrophy",
            guidance: "Focus on heavy compound lifts and progressive overload.",
            exercises: [
              {
                name: "Barbell Bench Press",
                setsReps: "4 sets x 8 reps",
                rest: "90 secs",
              },
              {
                name: "Incline Dumbbell Press",
                setsReps: "4 sets x 10 reps",
                rest: "90 secs",
              },
              {
                name: "Chest Dips (Weighted if possible)",
                setsReps: "3 sets x 10 reps",
                rest: "60 secs",
              },
              {
                name: "Tricep Cable Pushdowns",
                setsReps: "4 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Skull Crushers",
                setsReps: "3 sets x 10 reps",
                rest: "60 secs",
              },
            ],
          },
          {
            day: "Tuesday",
            title: "Heavy Back & Biceps Width",
            guidance: "Maintain strict form; squeeze at contraction.",
            exercises: [
              {
                name: "Barbell Deadlifts",
                setsReps: "4 sets x 6 reps",
                rest: "120 secs",
              },
              {
                name: "Lat Pulldowns",
                setsReps: "4 sets x 10 reps",
                rest: "75 secs",
              },
              {
                name: "Bent-Over Barbell Rows",
                setsReps: "4 sets x 8 reps",
                rest: "90 secs",
              },
              {
                name: "Standing Barbell Bicep Curls",
                setsReps: "4 sets x 10 reps",
                rest: "60 secs",
              },
              {
                name: "Hammer Curls",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
            ],
          },
          {
            day: "Wednesday",
            title: "Rest & Muscle Recovery",
            guidance: "Eat high protein and calorie surplus meals.",
            exercises: [
              {
                name: "Light Walk & Mobility Drills",
                setsReps: "20 mins",
                rest: "Self-paced",
              },
            ],
          },
          {
            day: "Thursday",
            title: "Heavy Leg Day (Quads & Hamstrings)",
            guidance: "Push hard through the heels; stay hydrated.",
            exercises: [
              {
                name: "Barbell Back Squats",
                setsReps: "4 sets x 8 reps",
                rest: "120 secs",
              },
              {
                name: "Leg Press",
                setsReps: "4 sets x 10 reps",
                rest: "90 secs",
              },
              {
                name: "Romanian Deadlifts",
                setsReps: "4 sets x 10 reps",
                rest: "90 secs",
              },
              {
                name: "Leg Curls & Extensions Supersized",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Standing Calf Raises",
                setsReps: "4 sets x 15 reps",
                rest: "45 secs",
              },
            ],
          },
          {
            day: "Friday",
            title: "Shoulders & Traps Mass Builder",
            guidance: "Focus on full range of motion for shoulder cap growth.",
            exercises: [
              {
                name: "Overhead Barbell Military Press",
                setsReps: "4 sets x 8 reps",
                rest: "90 secs",
              },
              {
                name: "Dumbbell Lateral Raises",
                setsReps: "4 sets x 12 reps",
                rest: "45 secs",
              },
              {
                name: "Front Dumbbell Raises",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Face Pulls for Rear Delts",
                setsReps: "4 sets x 15 reps",
                rest: "45 secs",
              },
              {
                name: "Dumbbell Shrugs",
                setsReps: "4 sets x 12 reps",
                rest: "60 secs",
              },
            ],
          },
          {
            day: "Saturday",
            title: "Arm & Abs Specialization",
            guidance: "Focus on peak biceps pump and forearm strength.",
            exercises: [
              {
                name: "Preacher Curls",
                setsReps: "4 sets x 10 reps",
                rest: "60 secs",
              },
              {
                name: "Overhead Dumbbell Tricep Extension",
                setsReps: "4 sets x 10 reps",
                rest: "60 secs",
              },
              {
                name: "Cable Rope Curls",
                setsReps: "3 sets x 12 reps",
                rest: "45 secs",
              },
              {
                name: "Weighted Abdominal Crunches",
                setsReps: "4 sets x 15 reps",
                rest: "45 secs",
              },
            ],
          },
          {
            day: "Sunday",
            title: "Complete Rest & Growth Day",
            guidance: "Relax, hydrate, and prepare for the upcoming week.",
            exercises: [
              { name: "Rest and Recovery", setsReps: "All Day", rest: "None" },
            ],
          },
        ],
      },
      {
        fitnessGoal: "Fitness",
        schedule: [
          {
            day: "Monday",
            title: "Upper Body Functional Strength",
            guidance:
              "Balanced push-pull supersets for general athletic fitness.",
            exercises: [
              {
                name: "Dumbbell Bench Press",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Seated Cable Rows",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Overhead Dumbbell Press",
                setsReps: "3 sets x 10 reps",
                rest: "60 secs",
              },
              {
                name: "Lat Pulldowns",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Core Plank Hold",
                setsReps: "3 sets x 45 secs",
                rest: "45 secs",
              },
            ],
          },
          {
            day: "Tuesday",
            title: "Cardio & Stamina Building",
            guidance:
              "Moderate steady-state cardio combined with core exercises.",
            exercises: [
              {
                name: "Running / Cycling",
                setsReps: "30 mins",
                rest: "60 secs",
              },
              {
                name: "Bodyweight Lunges",
                setsReps: "3 sets x 15 steps",
                rest: "45 secs",
              },
              {
                name: "Russian Twists",
                setsReps: "3 sets x 20 reps",
                rest: "30 secs",
              },
              {
                name: "Jumping Rope",
                setsReps: "3 sets x 2 mins",
                rest: "45 secs",
              },
            ],
          },
          {
            day: "Wednesday",
            title: "Lower Body & Balance",
            guidance: "Improve mobility, leg endurance, and ankle stability.",
            exercises: [
              {
                name: "Bodyweight / Weighted Squats",
                setsReps: "4 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Step-ups onto Bench",
                setsReps: "3 sets x 12 reps/leg",
                rest: "45 secs",
              },
              {
                name: "Hamstring Swiss Ball Curls",
                setsReps: "3 sets x 12 reps",
                rest: "45 secs",
              },
              {
                name: "Calf Raises",
                setsReps: "3 sets x 15 reps",
                rest: "30 secs",
              },
            ],
          },
          {
            day: "Thursday",
            title: "Active Mobility & Yoga Flow",
            guidance: "Flexibility, joint health, and posture alignment.",
            exercises: [
              {
                name: "Sun Salutations Yoga Flow",
                setsReps: "20 mins",
                rest: "Self-paced",
              },
              {
                name: "Cat-Cow Spinal Stretches",
                setsReps: "3 sets x 10 cycles",
                rest: "Self-paced",
              },
              {
                name: "Hip Opener Stretches",
                setsReps: "10 mins",
                rest: "Self-paced",
              },
            ],
          },
          {
            day: "Friday",
            title: "Full Body Conditioning Circuit",
            guidance: "Light weights, smooth tempo, great full body pump.",
            exercises: [
              {
                name: "Kettlebell Deadlifts",
                setsReps: "3 sets x 12 reps",
                rest: "60 secs",
              },
              {
                name: "Incline Push-ups",
                setsReps: "3 sets x 15 reps",
                rest: "45 secs",
              },
              {
                name: "Medicine Ball Slams",
                setsReps: "3 sets x 15 reps",
                rest: "45 secs",
              },
              {
                name: "Treadmill Incline Walk",
                setsReps: "20 mins",
                rest: "60 secs",
              },
            ],
          },
          {
            day: "Saturday",
            title: "Outdoor Sports / Recreational Fitness",
            guidance:
              "Enjoy outdoor swimming, badminton, football, or trail walking.",
            exercises: [
              {
                name: "Recreational Sport / Swimming",
                setsReps: "45 mins",
                rest: "Self-paced",
              },
            ],
          },
          {
            day: "Sunday",
            title: "Rest & Mental Wellness",
            guidance: "Rest, meditate, and recharge.",
            exercises: [
              {
                name: "Mindful Breathing & Rest",
                setsReps: "15 mins",
                rest: "None",
              },
            ],
          },
        ],
      },
    ];

    await Workout.insertMany(workoutPlans);
    console.log("Workouts seeded successfully.");

    // 3. Seed Diets (Weight Loss, Weight Gain, Fitness) with Indian food options
    await Diet.deleteMany({});
    const dietPlans = [
      {
        fitnessGoal: "Weight Loss",
        calorieTarget: 1800,
        proteinTarget: "120g",
        waterTarget: "3.5 - 4 Liters",
        meals: [
          {
            name: "Breakfast",
            timing: "8:00 AM",
            items: [
              "Moong Dal Chilla / Oats Upma with Vegetables",
              "Boiled Egg Whites (3) or Paneer (50g)",
              "Green Tea / Black Coffee (No Sugar)",
            ],
            calories: 350,
            protein: "22g",
            vegAlternative:
              "Substitute egg whites with 100g Sprouts or Low-fat Paneer.",
          },
          {
            name: "Lunch",
            timing: "1:00 PM",
            items: [
              "Multigrain Roti (1-2) or Brown Rice (1 cup)",
              "Grilled Chicken Breast (120g) or Soya Chunks Curry (100g)",
              "Dal Tadka & Cucumber Salad",
            ],
            calories: 550,
            protein: "40g",
            vegAlternative:
              "Replace chicken with 150g Tofu or Soya Chunks curry.",
          },
          {
            name: "Snacks",
            timing: "5:00 PM",
            items: [
              "Roasted Makhana (Lotus seeds) or Handful of Roasted Chana",
              "1 Apple or Guava",
              "Green Tea",
            ],
            calories: 200,
            protein: "8g",
            vegAlternative: "Naturally 100% Vegetarian.",
          },
          {
            name: "Dinner",
            timing: "8:00 PM",
            items: [
              "Steamed Fish or Palak Paneer (Light Oil)",
              "Mixed Vegetable Soup",
              "Cucumber & Tomato Salad",
            ],
            calories: 450,
            protein: "35g",
            vegAlternative:
              "Replace fish with 150g Paneer Bhurji with light spices.",
          },
        ],
      },
      {
        fitnessGoal: "Weight Gain",
        calorieTarget: 3000,
        proteinTarget: "150g",
        waterTarget: "4 Liters",
        meals: [
          {
            name: "Breakfast",
            timing: "8:00 AM",
            items: [
              "Whole Eggs (3) Omelette with Cheese",
              "Whole Wheat Toast (3 slices) with Peanut Butter",
              "Banana Oats Shake (Oats + Milk + Peanut Butter + Honey)",
            ],
            calories: 750,
            protein: "38g",
            vegAlternative:
              "Paneer Paratha (2) with curd & high-calorie Banana Peanut Butter Smoothie.",
          },
          {
            name: "Lunch",
            timing: "1:30 PM",
            items: [
              "Steamed Basmati Rice (2 cups) or 3 Chapattis",
              "Chicken Curry (200g) or Paneer Butter Masala (180g)",
              "Rajma / Chole Curry & Curd (1 bowl)",
            ],
            calories: 850,
            protein: "48g",
            vegAlternative: "Paneer Makhani with Rajma and thick Curd.",
          },
          {
            name: "Snacks",
            timing: "5:30 PM",
            items: [
              "Boiled Sweet Potato (200g)",
              "Handful of Almonds, Walnuts & Raisins",
              "Whey Protein / Soya Milk Shake",
            ],
            calories: 500,
            protein: "25g",
            vegAlternative: "Soya Shake with Dry Fruits.",
          },
          {
            name: "Dinner",
            timing: "9:00 PM",
            items: [
              "Mixed Veg Pulao / 3 Chapatis with Ghee",
              "Fish Fry / Egg Curry / Paneer Tikka",
              "Dal Makhani & Full Fat Milk at bedtime",
            ],
            calories: 750,
            protein: "40g",
            vegAlternative: "Paneer Tikka with Dal Makhani and warm Milk.",
          },
        ],
      },
      {
        fitnessGoal: "Fitness",
        calorieTarget: 2200,
        proteinTarget: "130g",
        waterTarget: "3 - 3.5 Liters",
        meals: [
          {
            name: "Breakfast",
            timing: "8:00 AM",
            items: [
              "Oats Porridge with Chia Seeds & Berries",
              "Boiled Eggs (2 whole) or Besan Chilla",
              "Fresh Fruit Juice or Coffee",
            ],
            calories: 450,
            protein: "25g",
            vegAlternative: "Besan Chilla with Paneer filling.",
          },
          {
            name: "Lunch",
            timing: "1:00 PM",
            items: [
              "Roti (2) or Rice (1.5 cups)",
              "Grilled Chicken / Paneer Curry (150g)",
              "Yellow Dal, Mix Veg Curry & Salad",
            ],
            calories: 650,
            protein: "38g",
            vegAlternative: "Paneer & Soya Chunks Curry.",
          },
          {
            name: "Snacks",
            timing: "5:00 PM",
            items: [
              "Sprouted Moong Salad with Lemon",
              "Handful of Mixed Nuts",
              "Black Coffee / Green Tea",
            ],
            calories: 250,
            protein: "12g",
            vegAlternative: "Naturally 100% Vegetarian.",
          },
          {
            name: "Dinner",
            timing: "8:30 PM",
            items: [
              "Grilled Fish / Tofu Tikka (150g)",
              "Clear Vegetable Soup & Salad",
              "1 Roti / Quinoa bowl",
            ],
            calories: 500,
            protein: "35g",
            vegAlternative: "Tofu or Paneer Grilled Tikka.",
          },
        ],
      },
    ];

    await Diet.insertMany(dietPlans);
    console.log("Diets seeded successfully.");

    // 4. Seed Sample Member Accounts
    const sampleMembersData = [
      {
        name: "Rahul Sharma",
        email: "rahul@example.com",
        phone: "9876543210",
        age: 26,
        gender: "Male",
        height: 175,
        weight: 78,
        bloodGroup: "B+",
        plan: "Premium",
      },
      {
        name: "Priya Patel",
        email: "priya@example.com",
        phone: "9812345678",
        age: 24,
        gender: "Female",
        height: 162,
        weight: 55,
        bloodGroup: "O+",
        plan: "VIP",
      },
    ];

    for (const sm of sampleMembersData) {
      const existing = await User.findOne({ email: sm.email });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("MemberPass123!", salt);
        const user = await User.create({
          name: sm.name,
          email: sm.email,
          password: hashedPassword,
          role: "member",
        });

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 3);

        await Member.create({
          user: user._id,
          fullName: sm.name,
          email: sm.email,
          phone: sm.phone,
          age: sm.age,
          gender: sm.gender,
          height: sm.height,
          weight: sm.weight,
          bloodGroup: sm.bloodGroup,
          membershipPlan: sm.plan,
          startDate,
          durationMonths: 3,
          endDate,
          status: "Active",
        });

        await Profile.create({
          user: user._id,
          age: sm.age,
          gender: sm.gender,
          height: sm.height,
          weight: sm.weight,
          bloodGroup: sm.bloodGroup,
          phone: sm.phone,
          bmi: 24.5,
          fitnessGoal: "Fitness",
        });

        console.log(`Sample Member created: ${sm.email}`);
      }
    }

    console.log("Database Seeding Complete!");
    process.exit(0);
  } catch (err) {
    console.error(`Seeding Failed: ${err.message}`);
    process.exit(1);
  }
};

seedData();
