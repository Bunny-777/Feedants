const Competition = require('../models/Competition');
const Registration = require('../models/Registration');
const Submission = require('../models/Submission');
const User = require('../models/User');

async function seedDatabase() {
  console.log('Seeding Feedants Competition data...');

  // 1. Seed demo users
  await User.deleteMany({});
  const users = [
    {
      userId: 'user_registered_01',
      name: 'Kushal Sharma',
      email: 'kushal@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    },
    {
      userId: 'user_unregistered_02',
      name: 'Priya Patel',
      email: 'priya@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    },
    {
      userId: 'user_submitted_03',
      name: 'Rohit Verma',
      email: 'rohit@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    },
  ];
  await User.insertMany(users);

  // 2. Clear and seed Competition
  await Competition.deleteMany({});

  // Countdown: 1 day, 6 hours, 28 minutes, 32 seconds from now to match the screenshot!
  const now = new Date();
  const deadline = new Date(now.getTime() + (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000);

  const competitionData = {
    slug: 'feedants-classical-dance',
    title: 'Feedants Classical Dance',
    category: 'Dance',
    badges: ['Dance', 'Multi-Win'],
    perks: 'Winners get certificate',
    prizePool: 1500,
    entryFee: 99,
    totalSpots: 20,
    bookedSpots: 1, // Matches design: "Only 19 spots left", "1 / 20 Booked"
    judge: {
      name: 'Manju Dubey',
      role: 'Professional Kathak Dancer',
      experience: '12+ Years of Experience',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    importantDates: {
      registerBefore: new Date(now.getTime() + (1 * 86400 + 6 * 3600 + 28 * 60 + 32) * 1000),
      submissionStarts: new Date(now.getTime() - 2 * 86400 * 1000),
      submissionEnds: new Date(now.getTime() + 15 * 86400 * 1000),
      resultDate: new Date(now.getTime() + 20 * 86400 * 1000),
    },
    registrationDeadline: deadline,
    about: {
      en: {
        short: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
        full: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance. Whether you practice Bharatanatyam, Kathak, Odissi, Kuchipudi, or Mohiniyattam, this stage celebrates rhythm, expression, and storytelling heritage. All participants receive verified feedback and certificate of participation.',
      },
      hi: {
        short: 'यह सभी आयु वर्ग के लिए एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। कहीं से भी भाग लें और अपनी प्रतिभा का प्रदर्शन करें। पारंपरिक नृत्य के माध्यम से अपने जुनून को व्यक्त करें।',
        full: 'यह सभी आयु वर्ग के लिए एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। कहीं से भी भाग लें और अपनी प्रतिभा का प्रदर्शन करें। पारंपरिक नृत्य के माध्यम से अपने जुनून को व्यक्त करें। चाहे आप भरतनाट्यम, कथक, ओडिसी या कुचिपुड़ी करते हों, यह मंच लय, भाव और परंपरा का उत्सव मनाने के लिए समर्पित है। सभी प्रतिभागियों को आधिकारिक प्रमाण पत्र प्राप्त होगा।',
      },
    },
    judgingParameters: [
      {
        title: 'Rhythm & Timing (Laya / Taal)',
        weightage: 30,
        description: 'Command over footwork, synchronicity with musical beats, and rhythmic consistency.',
      },
      {
        title: 'Expressions & Emotion (Abhinaya)',
        weightage: 25,
        description: 'Facial expressions, emotive eye gestures (Drishti Bhedas), and rasa communication.',
      },
      {
        title: 'Choreography & Technique',
        weightage: 25,
        description: 'Authenticity of mudras, body postures (Bhangas), and transitions.',
      },
      {
        title: 'Costume, Makeup & Presentation',
        weightage: 20,
        description: 'Traditional attire, ghungroo clarity, framing, and stage presence.',
      },
    ],
    rulesAndEligibility: [
      'Open to solo classical performers across all age categories.',
      'Allowed classical dance styles: Kathak, Bharatanatyam, Odissi, Kuchipudi, Kathakali, Mohiniyattam, Manipuri, and Sattriya.',
      'Video submission duration must be between 1 minute 30 seconds to 3 minutes.',
      'Continuous, unedited single-take recording. Background audio must be clear.',
      'Submissions must be uploaded via video link (Google Drive, YouTube unlisted, or direct MP4 upload) before the deadline.',
      'Paid registration is required prior to submission uploading.',
    ],
    rewards: [
      { rank: 1, title: '1st Winner', amount: 550, icon: 'trophy-gold' },
      { rank: 2, title: '2nd Winner', amount: 300, icon: 'medal-silver' },
      { rank: 3, title: '3rd Winner', amount: 240, icon: 'medal-bronze' },
      { rank: 4, title: '4th Winner', amount: 200, icon: 'star' },
      { rank: 5, title: '5th Winner', amount: 130, icon: 'star' },
      { rank: 6, title: '6th Winner', amount: 80, icon: 'star' },
    ],
    previousWinners: [
      {
        name: 'Riya Shah',
        rankTitle: '1st Winner',
        photoUrl: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      },
      {
        name: 'Aarav Mehta',
        rankTitle: '1st Winner',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      },
      {
        name: 'Neha Verma',
        rankTitle: '2nd Winner',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      },
      {
        name: 'Ishita Chouhan',
        rankTitle: '3rd Winner',
        photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      },
    ],
    referral: {
      code: 'referral123',
      shareUrl: 'https://feedants.com/r/referral123',
      rewardText: 'You earn ₹10 for every signup',
      discountAmount: 10,
    },
    status: 'registration_open',
    disclaimer: 'Only contributions from paid participants will be considered for judging.',
    supportInfo: {
      prizeMoneyVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      refundPolicyUrl: 'https://feedants.com/refund-policy',
      paymentGateway: 'Razorpay',
    },
  };

  const competition = await Competition.create(competitionData);

  // Additional Competitions for complete app experience across Home, Explore and Competitions list
  await Competition.create({
    slug: 'feedants-bollywood-fusion',
    title: 'Feedants Bollywood & Fusion League',
    category: 'Bollywood',
    badges: ['Bollywood', 'Popular'],
    perks: 'Winners get ₹5,000 + Trophy',
    prizePool: 5000,
    entryFee: 149,
    totalSpots: 40,
    bookedSpots: 12,
    judge: {
      name: 'Terence DSouza',
      role: 'Choreographer & Reality Judge',
      experience: '15+ Years of Industry Experience',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    importantDates: {
      registerBefore: new Date(now.getTime() + 4 * 86400 * 1000),
      submissionStarts: new Date(now.getTime() - 1 * 86400 * 1000),
      submissionEnds: new Date(now.getTime() + 18 * 86400 * 1000),
      resultDate: new Date(now.getTime() + 25 * 86400 * 1000),
    },
    registrationDeadline: new Date(now.getTime() + 4 * 86400 * 1000),
    about: {
      en: {
        short: 'Bring the Bollywood magic alive! Open for solo and duo routines blending cinematic moves and lyrical storytelling.',
        full: 'Bring the Bollywood magic alive! Open for solo and duo routines blending cinematic moves and lyrical storytelling. Showcase your high energy, cinematic expressions, and contemporary hooks to win big.',
      },
      hi: {
        short: 'बॉलीवुड का जादू बिखेरें! फिल्मी गानों और रचनात्मक कोरियोग्राफी के लिए खुला मंच।',
        full: 'बॉलीवुड का जादू बिखेरें! फिल्मी गानों और रचनात्मक कोरियोग्राफी के लिए खुला मंच।',
      },
    },
    rewards: [
      { rank: 1, title: '1st Winner', amount: 2500, icon: 'trophy-gold' },
      { rank: 2, title: '2nd Winner', amount: 1500, icon: 'medal-silver' },
      { rank: 3, title: '3rd Winner', amount: 1000, icon: 'medal-bronze' },
    ],
    status: 'registration_open',
  });

  await Competition.create({
    slug: 'feedants-hiphop-battle',
    title: 'Feedants Hip-Hop Street Clash',
    category: 'Hip-Hop',
    badges: ['Hip-Hop', 'Fast-Filling'],
    perks: 'Winners get spotlight reel promotion',
    prizePool: 3000,
    entryFee: 99,
    totalSpots: 30,
    bookedSpots: 28, // "Only 2 spots left!"
    judge: {
      name: 'Rohan Popping King',
      role: 'International Street Dance Champion',
      experience: '10+ Years Battle Experience',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    importantDates: {
      registerBefore: new Date(now.getTime() + 2 * 86400 * 1000),
      submissionStarts: new Date(now.getTime() - 3 * 86400 * 1000),
      submissionEnds: new Date(now.getTime() + 10 * 86400 * 1000),
      resultDate: new Date(now.getTime() + 14 * 86400 * 1000),
    },
    registrationDeadline: new Date(now.getTime() + 2 * 86400 * 1000),
    about: {
      en: {
        short: 'Unleash your raw energy, breaking, popping, and urban freestyle dance moves in this high-voltage street challenge.',
        full: 'Unleash your raw energy, breaking, popping, and urban freestyle dance moves in this high-voltage street challenge.',
      },
      hi: {
        short: 'हिप-हॉप, पॉपिंग और अर्बन डांस का सबसे बड़ा ऑनलाइन मुकाबला।',
        full: 'हिप-हॉप, पॉपिंग और अर्बन डांस का सबसे बड़ा ऑनलाइन मुकाबला।',
      },
    },
    rewards: [
      { rank: 1, title: '1st Winner', amount: 1500, icon: 'trophy-gold' },
      { rank: 2, title: '2nd Winner', amount: 1000, icon: 'medal-silver' },
      { rank: 3, title: '3rd Winner', amount: 500, icon: 'medal-bronze' },
    ],
    status: 'registration_open',
  });

  await Competition.create({
    slug: 'feedants-folk-heritage',
    title: 'Feedants Folk & Regional Dance Fest',
    category: 'Folk',
    badges: ['Folk', 'Cultural'],
    perks: 'State Verified Heritage Certificate',
    prizePool: 2000,
    entryFee: 49,
    totalSpots: 50,
    bookedSpots: 5,
    judge: {
      name: 'Sunita Rawat',
      role: 'Folk Arts Researcher & Performer',
      experience: '18+ Years Experience',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      introVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    importantDates: {
      registerBefore: new Date(now.getTime() + 8 * 86400 * 1000),
      submissionStarts: new Date(now.getTime() - 1 * 86400 * 1000),
      submissionEnds: new Date(now.getTime() + 25 * 86400 * 1000),
      resultDate: new Date(now.getTime() + 30 * 86400 * 1000),
    },
    registrationDeadline: new Date(now.getTime() + 8 * 86400 * 1000),
    about: {
      en: {
        short: 'Celebrate the rich regional heritage of India with Garba, Bhangra, Bihu, Ghoomar, and Lavani traditions.',
        full: 'Celebrate the rich regional heritage of India with Garba, Bhangra, Bihu, Ghoomar, and Lavani traditions.',
      },
      hi: {
        short: 'गरबा, भांगड़ा, बीहू, घूमर और लावणी जैसे पारंपरिक लोक नृत्यों का भव्य उत्सव।',
        full: 'गरबा, भांगड़ा, बीहू, घूमर और लावणी जैसे पारंपरिक लोक नृत्यों का भव्य उत्सव।',
      },
    },
    rewards: [
      { rank: 1, title: '1st Winner', amount: 1000, icon: 'trophy-gold' },
      { rank: 2, title: '2nd Winner', amount: 600, icon: 'medal-silver' },
      { rank: 3, title: '3rd Winner', amount: 400, icon: 'medal-bronze' },
    ],
    status: 'registration_open',
  });

  // 3. Seed 1 existing registration for User 1 (to match "Registered" status & "1 / 20 Booked" in screenshot!)
  await Registration.deleteMany({});
  await Registration.create({
    competitionId: competition._id,
    userId: 'user_registered_01',
    userName: 'Kushal Sharma',
    userEmail: 'kushal@example.com',
    amount: 99,
    paymentStatus: 'paid',
    paymentId: 'pay_feedants_init_001',
  });

  // Seed user 3 with a submission
  await Submission.deleteMany({});
  await Registration.create({
    competitionId: competition._id,
    userId: 'user_submitted_03',
    userName: 'Rohit Verma',
    userEmail: 'rohit@example.com',
    amount: 99,
    paymentStatus: 'paid',
    paymentId: 'pay_feedants_init_002',
  });
  await Submission.create({
    competitionId: competition._id,
    userId: 'user_submitted_03',
    userName: 'Rohit Verma',
    title: 'Thumri in Raag Desh - Kathak Solo',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    danceForm: 'Kathak',
    description: 'A 2.5-minute portrayal of Radha longing for Krishna with intricate tatkar footwork.',
  });

  // Update bookedSpots to 2 total registered
  competition.bookedSpots = 1; // Keep at 1 for the default view to strictly match "1 / 20 Booked" and "19 spots left"
  await competition.save();

  console.log('Seed completed successfully! Competition ID:', competition._id.toString());
  return competition;
}

module.exports = seedDatabase;
