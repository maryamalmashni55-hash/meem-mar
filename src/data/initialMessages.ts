export interface MessageItem {
  id: string;
  studentName: string;
  grade: string;
  messageEn: string;
  messageArTranslation?: string;
  timestamp: string;
  likes: number;
  isLikedByUser?: boolean;
  schoolName: string;
  isBonusAwarded: boolean;
}

export const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: "msg-1",
    studentName: "ريم عبدالله الدوسري",
    grade: "الصف الثالث متوسط (3/1)",
    messageEn: "Thank you to our brave soldiers who sacrifice their comfort and stay awake day and night at the borders so we can live in peace and safety. You are our true heroes!",
    messageArTranslation: "شكراً لجنودنا الشجعان الذين يضحون براحتهم ويسهرون ليل نهار على الحدود لننعم بالأمن والسلام. أنتم أبطالنا الحقيقيون!",
    timestamp: "قبل 15 دقيقة",
    likes: 42,
    schoolName: "المتوسطة الأولى بالراكة",
    isBonusAwarded: true,
  },
  {
    id: "msg-2",
    studentName: "سارة خالد القحطاني",
    grade: "الصف الثاني متوسط (2/2)",
    messageEn: "To the protectors of our beloved Kingdom: Your courage and dedication inspire us every single day. We pray for your victory, strength, and safe return to your families.",
    messageArTranslation: "لحماة مملكتنا الحبيبة: شجاعتكم وتفانيكم يلهمنا كل يوم. ندعو لكم بالنصر والقوة والعودة سالمين لعائلاتكم.",
    timestamp: "قبل 45 دقيقة",
    likes: 38,
    schoolName: "المتوسطة الأولى بالراكة",
    isBonusAwarded: true,
  },
  {
    id: "msg-3",
    studentName: "ليان فهد العتيبي",
    grade: "الصف الأول متوسط (1/3)",
    messageEn: "Words cannot express how grateful we are for your honorable duty. Because of your bravery, we can come to school every morning with peace of mind. God bless Saudi Arabia and its heroes!",
    messageArTranslation: "تعجز الكلمات عن التعبير عن مدى شكرنا لواجبكم المشرف. بفضل شجاعتكم نأتي لمدرستنا كل صباح بطمأنينة. حفظ الله السعودية وأبطالها!",
    timestamp: "قبل ساعتين",
    likes: 56,
    schoolName: "المتوسطة الأولى بالراكة",
    isBonusAwarded: true,
  },
  {
    id: "msg-4",
    studentName: "جود إبراهيم الشمري",
    grade: "الصف الثالث متوسط (3/2)",
    messageEn: "A heartfelt salute to the brave men of the Saudi armed forces and security officers. You stand like an unbreakable shield defending our holy land and nation.",
    messageArTranslation: "تحية إجلال من القلب لرجال القوات المسلحة ورجال الأمن البواسل. تقفون كالدرع الحصين دفاعاً عن أرض الحرمين ووطننا الغالي.",
    timestamp: "قبل 3 ساعات",
    likes: 29,
    schoolName: "المتوسطة الأولى بالراكة",
    isBonusAwarded: true,
  },
  {
    id: "msg-5",
    studentName: "نورة محمد الخالدي",
    grade: "الصف الثاني متوسط (2/1)",
    messageEn: "Thank you for being the steadfast guardians of our security and future. May Allah protect you wherever you are, bless your steps, and grant you supreme victory.",
    messageArTranslation: "شكراً لكونكم الحراس الأوفياء لأمننا ومستقبلنا. حمى الله خطاكم في كل ميدان ورعاكم وكتب لكم النصر والتمكين.",
    timestamp: "قبل 5 ساعات",
    likes: 34,
    schoolName: "المتوسطة الأولى بالراكة",
    isBonusAwarded: true,
  }
];

export const QUICK_SUGGESTIONS = [
  {
    title: "أبطالنا الحقيقيون (Our True Heroes)",
    en: "Thank you to the brave soldiers who sacrifice everything to keep our beloved Saudi Arabia safe. You are our true heroes!",
    ar: "شكراً للجنود البواسل الذين يضحون بكل شيء للحفاظ على أمن مملكتنا الحبيبة. أنتم أبطالنا الحقيقيون!"
  },
  {
    title: "درع الوطن الحصين (Shield of the Homeland)",
    en: "To the brave guardians of our nation: Your courage protects our present and builds our peaceful future. We are so proud of you!",
    ar: "إلى حراس الوطن الشجعان: شجاعتكم تحمي حاضرنا وتبني مستقبلنا الآمن. نحن فخورون بكم جداً!"
  },
  {
    title: "امتنان ودعاء بالنصر (Gratitude & Prayers)",
    en: "We salute your sleepless eyes guarding our borders with honor. May Allah bless you, protect you, and grant you victory.",
    ar: "نحيي عيونكم الساهرة التي تحرس حدودنا بكل شرف. حفظكم الله ورعاكم ونصركم نصراً عزيزاً."
  },
  {
    title: "أمننا بفضل تضحياتكم (Peace & Security)",
    en: "Because of your unwavering bravery, we study, learn, and grow in safety. Thank you for your noble service to the Kingdom of Saudi Arabia!",
    ar: "بفضل شجاعتكم الراسخة ندرس ونتعلم ونكبر في أمان وسلام. شكراً لخدمتكم النبيلة للمملكة العربية السعودية!"
  },
  {
    title: "فخر الأمة والقيادة (Pride of the Nation)",
    en: "Under the leadership of our nation, you stand steadfast with pride and honor. We salute every officer and soldier protecting our sacred land.",
    ar: "في ظل قيادة وطننا الغالي تقفون بثبات وفخر وعزة. نحيي كل ضابط وجندي يحمي أرضنا الطاهرة."
  }
];
