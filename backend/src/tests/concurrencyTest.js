const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const seedDatabase = require('../seed/seedData');

async function runConcurrencyTest() {
  console.log('--- Starting Feedants Concurrency & Data Consistency Tests ---');

  // 1. Setup in-memory DB
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  console.log('✓ Connected to test In-Memory MongoDB');

  // 2. Seed database
  const competition = await seedDatabase();
  console.log('✓ Seeded test competition data');

  // 3. Set competition to have exactly 3 spots remaining (17 booked out of 20)
  competition.bookedSpots = 17;
  await competition.save();
  console.log(`✓ Setup stage: Total spots = ${competition.totalSpots}, Booked spots = ${competition.bookedSpots}. Exactly 3 spots remaining.`);

  // 4. Fire 25 concurrent registration attempts
  console.log('>>> Simulating 25 concurrent users clicking [Register Now] at the exact same millisecond...');
  const promises = [];
  const concurrencyCount = 25;

  for (let i = 0; i < concurrencyCount; i++) {
    const userId = `concurrent_tester_${i}`;
    promises.push(
      (async () => {
        try {
          // Atomic reservation condition
          const updated = await Competition.findOneAndUpdate(
            {
              _id: competition._id,
              $expr: { $lt: ['$bookedSpots', '$totalSpots'] },
            },
            { $inc: { bookedSpots: 1 } },
            { new: true }
          );

          if (!updated) {
            return { success: false, userId, error: 'SOLD_OUT' };
          }

          // Insert registration
          const reg = await Registration.create({
            competitionId: competition._id,
            userId,
            userName: `Tester ${i}`,
            userEmail: `${userId}@test.com`,
            amount: competition.entryFee,
          });

          return { success: true, userId, regId: reg._id };
        } catch (err) {
          // Rollback
          await Competition.findByIdAndUpdate(competition._id, { $inc: { bookedSpots: -1 } });
          return { success: false, userId, error: err.message };
        }
      })()
    );
  }

  const results = await Promise.all(promises);

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✓ Results: ${successful.length} succeeded, ${failed.length} rejected.`);

  // 5. Verification Assertions
  const finalCompetition = await Competition.findById(competition._id);
  console.log(`✓ Final DB State: Booked Spots = ${finalCompetition.bookedSpots} / ${finalCompetition.totalSpots}`);

  if (successful.length === 3 && finalCompetition.bookedSpots === 20) {
    console.log('✅ PASS: Exactly 3 registrations succeeded and total capacity was strictly enforced without overselling!');
  } else {
    console.error(`❌ FAIL: Expected 3 successes and 20 booked spots, got ${successful.length} and ${finalCompetition.bookedSpots}`);
    process.exitCode = 1;
  }

  // 6. Test Idempotency / Duplicate Prevention
  console.log('\n>>> Testing duplicate user registration prevention...');
  try {
    const winnerUser = successful[0].userId;
    await Registration.create({
      competitionId: competition._id,
      userId: winnerUser, // same user!
      userName: 'Duplicate Tester',
      userEmail: `${winnerUser}@test.com`,
      amount: 99,
    });
    console.error('❌ FAIL: Duplicate registration did not throw unique index error!');
    process.exitCode = 1;
  } catch (dupErr) {
    if (dupErr.code === 11000) {
      console.log('✅ PASS: Unique compound index [competitionId, userId] successfully rejected duplicate registration!');
    } else {
      console.error('❌ FAIL: Unexpected error:', dupErr);
      process.exitCode = 1;
    }
  }

  console.log('\n--- All Backend Concurrency and Data Consistency Tests Passed! ---');
  await mongoose.disconnect();
  await mongod.stop();
  process.exit(0);
}

runConcurrencyTest().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
