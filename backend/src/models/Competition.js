const mongoose = require('mongoose');

const competitionSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Dance',
    },
    badges: {
      type: [String],
      default: ['Dance', 'Multi-Win'],
    },
    perks: {
      type: String,
      default: 'Winners get certificate',
    },
    prizePool: {
      type: Number,
      required: true,
      default: 1500,
    },
    entryFee: {
      type: Number,
      required: true,
      default: 99,
    },
    totalSpots: {
      type: Number,
      required: true,
      default: 20,
    },
    bookedSpots: {
      type: Number,
      required: true,
      default: 1,
      min: 0,
    },
    judge: {
      name: { type: String, default: 'Manju Dubey' },
      role: { type: String, default: 'Professional Kathak Dancer' },
      experience: { type: String, default: '12+ Years of Experience' },
      avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
      introVideoUrl: { type: String, default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    },
    importantDates: {
      registerBefore: { type: Date, required: true },
      submissionStarts: { type: Date, required: true },
      submissionEnds: { type: Date, required: true },
      resultDate: { type: Date, required: true },
    },
    registrationDeadline: {
      type: Date,
      required: true,
    },
    about: {
      en: {
        short: {
          type: String,
          default: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance.',
        },
        full: {
          type: String,
          default: 'This is an online classical dance competition open for all age groups. Participate from anywhere and showcase your talent. Express your passion through traditional dance. Whether you practice Bharatanatyam, Kathak, Odissi, or Kuchipudi, this stage is designed to celebrate heritage, grace, and storytelling. Top participants receive cash rewards, official Feedants verified e-certificates, and exclusive mentoring spotlight sessions with renowned classical maestros.',
        },
      },
      hi: {
        short: {
          type: String,
          default: 'यह सभी आयु वर्ग के लिए एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। कहीं से भी भाग लें और अपनी प्रतिभा का प्रदर्शन करें। पारंपरिक नृत्य के माध्यम से अपने जुनून को व्यक्त करें।',
        },
        full: {
          type: String,
          default: 'यह सभी आयु वर्ग के लिए एक ऑनलाइन शास्त्रीय नृत्य प्रतियोगिता है। कहीं से भी भाग लें और अपनी प्रतिभा का प्रदर्शन करें। पारंपरिक नृत्य के माध्यम से अपने जुनून को व्यक्त करें। चाहे आप भरतनाट्यम, कथक, ओडिसी या कुचिपुड़ी करते हों, यह मंच भारतीय संस्कृति, लय और भावों का उत्सव मनाने के लिए समर्पित है। शीर्ष विजेताओं को नकद पुरस्कार, आधिकारिक डिजिटल प्रमाण पत्र और प्रसिद्ध जजों से व्यक्तिगत प्रतिक्रिया मिलेगी।',
        },
      },
    },
    judgingParameters: [
      {
        title: { type: String, required: true },
        weightage: { type: Number, required: true },
        description: { type: String },
      },
    ],
    rulesAndEligibility: [
      { type: String },
    ],
    rewards: [
      {
        rank: { type: Number, required: true },
        title: { type: String, required: true },
        amount: { type: Number, required: true },
        icon: { type: String, default: 'trophy' },
      },
    ],
    previousWinners: [
      {
        name: { type: String, required: true },
        rankTitle: { type: String, required: true },
        photoUrl: { type: String, required: true },
        videoUrl: { type: String, default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
      },
    ],
    referral: {
      code: { type: String, default: 'referral123' },
      shareUrl: { type: String, default: 'https://feedants.com/r/referral123' },
      rewardText: { type: String, default: 'You earn ₹10 for every signup' },
      discountAmount: { type: Number, default: 10 },
    },
    status: {
      type: String,
      enum: ['upcoming', 'registration_open', 'submission_open', 'judging', 'completed'],
      default: 'registration_open',
    },
    disclaimer: {
      type: String,
      default: 'Only contributions from paid participants will be considered for judging.',
    },
    supportInfo: {
      prizeMoneyVideoUrl: { type: String, default: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4' },
      refundPolicyUrl: { type: String, default: 'https://feedants.com/refund-policy' },
      paymentGateway: { type: String, default: 'Razorpay' },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for remaining spots
competitionSchema.virtual('spotsLeft').get(function () {
  return Math.max(0, this.totalSpots - this.bookedSpots);
});

// Virtual field for isFull
competitionSchema.virtual('isFull').get(function () {
  return this.bookedSpots >= this.totalSpots;
});

module.exports = mongoose.model('Competition', competitionSchema);
