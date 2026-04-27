import { getDb } from "../api/queries/connection";
import {
  hotels,
  vehicles,
  packageTemplates,
  packageTemplateDays,
  templateInclusions,
  templateExclusions,
  templateChecklist,
  templateRemarks,
} from "./schema";

// Helper to generate day descriptions dynamically based on the route
const getDayDetails = (route: string) => {
  const r = route.toLowerCase();
  let description = "Enjoy a wonderful day exploring the scenic beauty of Kashmir. ";
  let imageUrl = "/images/cover-bg.jpg";

  if (r.includes("arrival srinagar")) {
    description = "Welcome to Kashmir! On arrival at Srinagar Airport, meet our representative and get transferred to your hotel or houseboat. Spend the evening relaxing and enjoying a beautiful Shikara ride on the famous Dal Lake.";
    imageUrl = "/images/srinagar.jpg";
  } else if (r.includes("jammu / katra") && r.includes("srinagar") && r.includes("arrival")) {
    description = "Arrive at Jammu / Katra Station where you will be picked up. Embark on a scenic drive along the national highway towards Srinagar. Enjoy the beautiful valley views before checking into your Srinagar accommodation.";
    imageUrl = "/images/train.jpg";
  } else if (r.includes("srinagar to gulmarg") || r.includes("gulmarg night")) {
    description = "After breakfast, proceed to Gulmarg, the 'Meadow of Flowers'. Enjoy the world-famous Gondola ride (cable car) to Apharwat peak, and take in the panoramic snow-capped mountain views.";
    imageUrl = "/images/gulmarg.jpg";
  } else if (r.includes("srinagar to sonamarg") || r.includes("sonamarg (night stay)")) {
    description = "Take a full day excursion to Sonamarg, the 'Meadow of Gold'. Enjoy the breathtaking views of the Sindh river and glaciers. You can hire ponies to visit Thajiwas Glacier.";
    imageUrl = "/images/cover-bg.jpg";
  } else if (r.includes("srinagar to doodhpathri") || r.includes("doodhoathri")) {
    description = "Visit Doodhpathri, the 'Valley of Milk'. A beautiful meadow with a flowing river and surrounded by snow-clad mountains. Perfect for a peaceful day in nature.";
    imageUrl = "/images/doodhpathri.jpg";
  } else if (r.includes("srinagar to pahalgam") || r.includes("gulmarg to pahalgam")) {
    description = "Journey to Pahalgam, the 'Valley of Shepherds'. En route visit the saffron fields of Pampore and Awantipora ruins. Enjoy the stunning views of the Lidder River upon arrival.";
    imageUrl = "/images/pahalgam.jpg";
  } else if (r.includes("inn pahalgam") || r.includes("in pahalgam")) {
    description = "Spend a relaxing day exploring Pahalgam. You can visit the famous Aru Valley, Betaab Valley, and Chandanwari, taking in the unparalleled natural beauty of the region.";
    imageUrl = "/images/pahalgam2.png";
  } else if (r.includes("local sightseeing")) {
    description = "After breakfast, proceed for local sightseeing in Srinagar. Visit the famous Mughal Gardens (Nishat Bagh, Shalimar Bagh) and the Shankaracharya Temple.";
    imageUrl = "/images/srinagar.jpg";
  } else if (r.includes("srinagar airport") && r.includes("to")) {
    description = "After breakfast, check out and proceed to Srinagar Airport for your onward journey. Carry back wonderful memories of your trip with Kashmir Meridian Tours and Travels.";
    imageUrl = "/images/airport.png";
  } else if (r.includes("jammu/ katra station") && r.includes("to")) {
    description = "Check out and begin your return drive to Jammu / Katra Railway Station for your onward journey, taking with you beautiful memories of your trip.";
    imageUrl = "/images/train.jpg";
  } else if (r.includes("gurez")) {
    description = "Travel to the pristine Gurez Valley, known for its breathtaking landscapes and the Habba Khatoon peak. Experience the unique local culture and unblemished nature.";
    imageUrl = "/images/cover-bg.jpg";
  }

  return { description, imageUrl };
};

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  // ================= HOTELS SEEDING =================
  const hotelList = [
    // 3 STAR HOTELS
    ...["Hotel New Classic Luxury resort", "Hotel Peaceful Morning", "Hotel Pearl Continental", "Hotel Grand Alden", "Hotel GM Castle", "Hotel Twin Towers", "Hotel City Residency", "Hotel Town Center", "Hotel Trident", "Hotel Dar Rehman", "Hotel Stepping Stone", "Hotel Royal Arabia", "Hotel Regal Palace", "The Saffron Hotel"].map(name => ({ name, location: "Srinagar", category: "3-star" })),
    ...["Hotel Signature", "Hotel Apple valley Resort", "Hotel Grand Hill View", "Hotel Noora Resort", "Hotel Gulmarg Inn", "Hotel Mama Palace"].map(name => ({ name, location: "Gulmarg", category: "3-star" })),
    ...["Deluxe Group Houseboats"].map(name => ({ name, location: "Dal Lake", category: "3-star" })),
    ...["Hotel Czara", "Hotel Akbar", "hotel Sonamarg Glacier", "Hotel Glacier Hights"].map(name => ({ name, location: "Sonamarg", category: "3-star" })),
    ...["Rio Resort", "The Cedar Resort", "Chinar Heevan Resort", "Valley Resort", "Labiba Resort", "River View Resort", "Home2 Resort"].map(name => ({ name, location: "Pahalgam", category: "3-star" })),

    // 3 STAR PREMIUM HOTELS
    ...["Hotel Sahara Grand Hills", "Moonstone De Luxury", "Red Bricks", "SIddique Palace", "Luxury Heritage", "Central Park", "Adlife luxury", "Hotel Milad", "The Victory", "Royal Comfort", "Hotel Nehrus", "Lee Heritage", "Royal Batoo", "Hotel Palm Spring", "Soloman Heights"].map(name => ({ name, location: "Srinagar", category: "3-star-premium" })),
    ...["Hotel Green Park", "Hotel Khaleel Palace", "Hotel Zahgeer", "Hotel Poshwan"].map(name => ({ name, location: "Gulmarg", category: "3-star-premium" })),
    ...["Super Deluxe Houseboat"].map(name => ({ name, location: "Dal Lake", category: "3-star-premium" })),
    ...["Hotel Imperial Resort", "Hotel Mount View", "hotel Namrose Resort", "Hotel Harwan Resort", "Divine Inn"].map(name => ({ name, location: "Sonamarg", category: "3-star-premium" })),
    ...["Black Pearl Resort", "white Ater Resort", "Himaliyan Hills Resort", "Pahalgam Pines", "Lavish Resort", "Overa Hills Resort", "Royale Comfort"].map(name => ({ name, location: "Pahalgam", category: "3-star-premium" })),

    // 4 STAR PREMIUM HOTELS
    ...["Hotel Snowland", "Hotel Radisson Blu", "Hotel Vintage", "Hotel Grand Boulevard", "Hotel Golden Leaf", "Hotel R.k Sarovar", "Hotel The Vintage", "Hotel Four Points by Shearton"].map(name => ({ name, location: "Srinagar", category: "4-star-premium" })),
    ...["Hotel Pine Spring", "Hotel Shaw inn", "Hotel Kolahi Green Heights", "Hotel Hilltop", "The vintage Gulmarg", "Grand Mumtaz", "Lupin Gulmarg", "Welcome Gulmarg", "Hotel Royal Park"].map(name => ({ name, location: "Gulmarg", category: "4-star-premium" })),
    ...["Premium Houseboat"].map(name => ({ name, location: "Dal Lake", category: "4-star-premium" })),
    ...["Radisson Sonamarg", "Hotel Tranquil Retreat", "Lemon Tree", "Four Points by Sheraton", "Arco Hotels and Resorts", "Country Inn", "Village walk"].map(name => ({ name, location: "Sonamarg", category: "4-star-premium" })),
    ...["Eden Resort and Spa", "Hotel Heevan", "ITC Fortune", "Sarovar Premier", "The Hermitage", "Hotel Mount View"].map(name => ({ name, location: "Pahalgam", category: "4-star-premium" })),

    // 5 STAR PREMIUM HOTELS
    ...["The Grand Lalit", "Taj Vivanta", "Radisson Collections"].map(name => ({ name, location: "Srinagar", category: "5-star-premium" })),
    ...["Khyber Resort and Spa"].map(name => ({ name, location: "Gulmarg", category: "5-star-premium" })),
    ...["Gurkha Houseboat"].map(name => ({ name, location: "Dal Lake", category: "5-star-premium" })),
    ...["Radisson Sonamarg", "Hotel Tranquil Retreat", "Lemon Tree", "Four Points by Sheraton", "Arco Hotels and Resorts", "Country Inn", "Village walk"].map(name => ({ name, location: "Sonamarg", category: "5-star-premium" })),
    ...["Pine and Peak", "Radisson Golf"].map(name => ({ name, location: "Pahalgam", category: "5-star-premium" })),
  ];

  for (const h of hotelList) {
    await db.insert(hotels).values({
      ...h,
      imageUrl: "/images/cover-bg.jpg",
      description: `Premium accommodation located in ${h.location}`
    });
  }
  console.log("Hotels seeded");

  // ================= VEHICLES SEEDING =================
  const vehicleData = [
    { name: "Sedan (Etios/Dzire)", type: "Sedan", capacity: 4, pricePerDay: "3500" },
    { name: "Innova Crysta", type: "SUV", capacity: 7, pricePerDay: "5500" },
    { name: "Tempo Traveller", type: "Van", capacity: 12, pricePerDay: "8500" },
    { name: "Luxury SUV", type: "SUV", capacity: 6, pricePerDay: "7500" },
  ];
  for (const v of vehicleData) {
    await db.insert(vehicles).values(v);
  }
  console.log("Vehicles seeded");

  // ================= PACKAGE TEMPLATES =================
  const packageDefinitions = [
    { code: "PKG-01", name: "5 Nights 6 Days Srinagar Pickup", durationDays: 6, durationNights: 5, 
      days: ["Arrival Srinagar Airport", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Doodhpathri", "Srinagar to Pahalgam", "Pahalgam to Srinagar Airport"] },
    { code: "PKG-02", name: "5 Nights 6 Days Jammu/Katra Pickup & Drop", durationDays: 6, durationNights: 5, 
      days: ["Arrival Jammu / Katra Station to Srinagar", "Srinagar Local Sightseeing", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Pahalgam", "Pahalgam to Jammu/ Katra Station"] },
    { code: "PKG-03", name: "5 Nights 6 Days Srinagar Pickup & Jammu/Katra Drop", durationDays: 6, durationNights: 5, 
      days: ["Arrival Srinagar Airport", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Doodhpathri", "Srinagar to Pahalgam", "Pahalgam to Jammu/ Katra Station"] },
    { code: "PKG-04", name: "5 Nights 6 Days Katra Kashmir Jammu/Katra Pickup", durationDays: 6, durationNights: 5, 
      days: ["Arrival Jammu / Katra Station to Katra Same Day Darshan", "Katra to Srinagar Local Sightseeing", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Pahalgam", "Pahalgam to Jammu/ Katra Station"] },
    { code: "PKG-05", name: "4 Nights 5 Days Srinagar Pickup", durationDays: 5, durationNights: 4, 
      days: ["Arrival Srinagar Airport", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Pahalgam", "Pahalgam to Srinagar Airport"] },
    { code: "PKG-06", name: "4 Nights 5 Days Jammu/Katra Station Pickup & Drop", durationDays: 5, durationNights: 4, 
      days: ["Jammu / Katra Station to Srinagar", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Pahalgam", "Pahalgam to Jammu / Katra Station"] },
    { code: "PKG-07", name: "6 Nights 7 Days Srinagar Pickup", durationDays: 7, durationNights: 6, 
      days: ["Arrival Srinagar Airport", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Doodhpathri", "Srinagar to Pahalgam", "In Pahalgam", "Pahalgam to Srinagar Airport"] },
    { code: "PKG-08", name: "6 Nights 7 Days with Gulmarg Night Srinagar Pickup", durationDays: 7, durationNights: 6, 
      days: ["Arrival Srinagar Airport", "Srinagar to Sonamarg", "Srinagar to Doodhpathri", "Srinagar to Gulmarg (Night Stay)", "Gulmarg to Pahalgam", "In Pahalgam", "Pahalgam to Srinagar Airport"] },
    { code: "PKG-09", name: "6 Nights 7 Days Jammu/Katra Pickup & Drop", durationDays: 7, durationNights: 6, 
      days: ["Arrival Jammu / Katra Station to Srinagar", "Srinagar Local Sightseeing", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Doodhpathri", "Srinagar to Pahalgam", "Pahalgam to Jammu/ Katra Station"] },
    { code: "PKG-10", name: "6 Nights 7 Days (2 Nights Pahalgam) Jammu/Katra Pickup", durationDays: 7, durationNights: 6, 
      days: ["Arrival Jammu / Katra Station to Srinagar", "Srinagar Local Sightseeing", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Pahalgam", "In Pahalgam", "Pahalgam to Jammu/ Katra Station"] },
    { code: "PKG-11", name: "6 Nights 7 Days (2 Nights Katra) Jammu/Katra Pickup", durationDays: 7, durationNights: 6, 
      days: ["Arrival Jammu / Katra Station to Katra", "Katra Darshan Day", "Katra to Srinagar", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Pahalgam", "Pahalgam to Jammu/ Katra Station"] },
    { code: "PKG-12", name: "7 Nights 8 Days Srinagar Pickup", durationDays: 8, durationNights: 7, 
      days: ["Arrival Srinagar Airport", "Srinagar to Sonamarg (Night Stay in Sonamarg)", "Sonamarg to Srinagar", "Srinagar to Doodhpathri", "Srinagar to Gulmarg", "Gulmarg to Pahalgam", "In Pahalgam", "Pahalgam to Srinagar Airport"] },
    { code: "PKG-13", name: "7 Nights 8 Days Jammu/Katra Pickup & Drop", durationDays: 8, durationNights: 7, 
      days: ["Arrival Jammu / Katra Station to Srinagar", "Srinagar Local Sightseeing", "Srinagar to Sonamarg", "Srinagar to Doodhpathri", "Srinagar to Gulmarg", "Gulmarg to Pahalgam", "In Pahalgam", "Pahalgam to Jammu/ Katra Station"] },
    { code: "PKG-14", name: "7 Nights 8 Days (Gurez 2 Nights) Srinagar Pickup", durationDays: 8, durationNights: 7, 
      days: ["Arrival Srinagar Airport", "Srinagar to Gurez (Night Stay)", "Gurez Adventure", "Gurez to Srinagar", "Srinagar to Gulmarg", "Srinagar to Sonamarg", "Srinagar to Pahalgam", "Pahalgam to Srinagar Airport"] },
    { code: "PKG-15", name: "7 Nights 8 Days (Doodhpathri, Daksum, Sinthantop) SXR Pickup", durationDays: 8, durationNights: 7, 
      days: ["Arrival Srinagar Airport", "Srinagar to Sonamarg", "Srinagar to Doodhpathri", "Srinagar to Gulmarg", "Srinagar to Pahalgam", "Srinagar to Sinthantop", "Pahalgam to Daksum (Night Stay)", "Daksum to Srinagar Airport"] },
  ];

  for (const pkg of packageDefinitions) {
    const templateResult = await db.insert(packageTemplates).values({
      code: pkg.code,
      name: pkg.name,
      subtitle: "Kashmir Meridian Signature Package",
      durationDays: pkg.durationDays,
      durationNights: pkg.durationNights,
      coverImage: "/images/cover-bg.jpg",
    });

    const templateId = Number(templateResult[0].insertId);

    // Insert Days
    for (let i = 0; i < pkg.days.length; i++) {
      const route = pkg.days[i];
      const { description, imageUrl } = getDayDetails(route);
      
      await db.insert(packageTemplateDays).values({
        templateId,
        dayNumber: i + 1,
        title: route,
        subtitle: `DAY ${i + 1}`,
        description,
        imageUrl,
        highlights: JSON.stringify([route]),
      });
    }

    // Insert Inclusions
    const inclusions = ["Welcome drink on arrival", "Accommodation on double sharing basis", "Breakfast and Dinner", "Private vehicle transfers", "Toll tax & parking"];
    for (const item of inclusions) await db.insert(templateInclusions).values({ templateId, item });

    // Insert Exclusions
    const exclusions = ["Airfare / Train fare", "Personal expenses", "Gondola ride tickets", "Entry fees at gardens"];
    for (const item of exclusions) await db.insert(templateExclusions).values({ templateId, item });

    // Insert Checklist
    const checklist = ["Valid ID Proof", "Woolen clothes", "Comfortable shoes"];
    for (const item of checklist) await db.insert(templateChecklist).values({ templateId, item });

    // Insert Remarks
    const remarks = [
      "Accommodation is subject to availability.",
      "If any sightseeing is canceled due to bad weather conditions, no refund will be given.",
      "For 24/7 support during your journey, reach us at 9103654560.",
    ];
    for (const remark of remarks) await db.insert(templateRemarks).values({ templateId, remark });
  }

  console.log("Template days, inclusions, exclusions, remarks seeded.");
  console.log("Done.");
  process.exit(0);
}

seed();