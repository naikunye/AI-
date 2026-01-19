import { SavedTemplate, TemplateCategory, Platform } from '../types';

export const DEFAULT_TEMPLATES: SavedTemplate[] = [
  // --- POSITIVE (好评回复) ---
  {
    id: 'pos_1',
    title: '标准好评致谢 (亚马逊安全版)',
    contentEnglish: "Thank you so much for your kind words! We're thrilled to hear that you're happy with your purchase. Your support means the world to our small business. If you need anything else, please don't hesitate to reach out.",
    category: TemplateCategory.POSITIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000000,
    tags: ['感谢', '标准', '安全']
  },
  {
    id: 'pos_2',
    title: 'TikTok 热情互动 (带表情)',
    contentEnglish: "OMG! 😍 Thank you for the glowing review! We are doing a happy dance right now! 💃 So glad you love it. Don't forget to tag us in your videos, we'd love to see how you use it! ✨",
    category: TemplateCategory.POSITIVE,
    platform: Platform.TIKTOK_SHOP,
    createdAt: 1715420000001,
    tags: ['热情', '表情符号', '互动']
  },
  {
    id: 'pos_3',
    title: 'Shopify 品牌故事感致谢',
    contentEnglish: "Thank you for sharing your experience! It brings us so much joy to know our product has found a happy home with you. We designed this with care, and hearing feedback like yours makes it all worth it. Welcome to our community!",
    category: TemplateCategory.POSITIVE,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000002,
    tags: ['品牌感', '温情']
  },
  {
    id: 'pos_4',
    title: '老客户回购致谢',
    contentEnglish: "Welcome back! It's fantastic to see your name pop up again. Thank you for your continued trust in our brand. We've packed your order with extra care. Thanks for being such a loyal customer!",
    category: TemplateCategory.POSITIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000003,
    tags: ['复购', '老客户']
  },
  {
    id: 'pos_5',
    title: '赞美产品质量的回复',
    contentEnglish: "Thank you! We pride ourselves on quality, so it's wonderful to hear that it met your expectations. We look forward to serving you again in the future!",
    category: TemplateCategory.POSITIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000004,
    tags: ['质量', '简短']
  },
  {
    id: 'pos_6',
    title: '送礼场景的好评回复',
    contentEnglish: "That's wonderful to hear! We hope the recipient loves it just as much as you do. Thank you for choosing us for such a special gift. 🎁",
    category: TemplateCategory.POSITIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000005,
    tags: ['礼物', '祝福']
  },
  {
    id: 'pos_7',
    title: 'Etsy 手作温情回复',
    contentEnglish: "Thank you so much! Each piece is handmade with love, and I'm so happy it arrived safely. Enjoy using it, and thanks for supporting independent artists!",
    category: TemplateCategory.POSITIVE,
    platform: Platform.ETSY,
    createdAt: 1715420000006,
    tags: ['手作', '个人化']
  },
  {
    id: 'pos_8',
    title: '赞美物流速度的回复',
    contentEnglish: "Glad to hear it arrived quickly! We know how hard it is to wait for a package. Enjoy your new item!",
    category: TemplateCategory.POSITIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000007,
    tags: ['物流快', '致谢']
  },
  {
    id: 'pos_9',
    title: '邀请关注社交媒体 (独立站)',
    contentEnglish: "Thank you for the review! If you haven't already, join us on Instagram for styling tips and sneak peeks at new arrivals. We'd love to see you there!",
    category: TemplateCategory.POSITIVE,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000008,
    tags: ['社交媒体', '引流']
  },
  {
    id: 'pos_10',
    title: '极简致谢 (通用)',
    contentEnglish: "Thanks for the feedback! We appreciate you.",
    category: TemplateCategory.POSITIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000009,
    tags: ['短语', '通用']
  },

  // --- NEGATIVE (差评处理) ---
  {
    id: 'neg_1',
    title: '通用道歉 + 全额退款提议',
    contentEnglish: "I am truly sorry that your experience didn't match your expectations. This is not the standard we strive for. I have gone ahead and issued a full refund to your original payment method immediately. You do not need to return the item. We hope you'll give us another chance in the future.",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000010,
    tags: ['退款', '无需退货', '高优先级']
  },
  {
    id: 'neg_2',
    title: '产品破损 - 补发处理',
    contentEnglish: "Oh no! I'm so sorry to hear the item arrived damaged. It sounds like it had a rough journey. Please reply with a quick photo of the damage, and we will ship a brand new replacement to you immediately, free of charge.",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000011,
    tags: ['破损', '补发']
  },
  {
    id: 'neg_3',
    title: '发错货 - 仅退款 (保留商品)',
    contentEnglish: "I sincerely apologize for the mix-up! That was our mistake. Please keep the item you received as a gift for the inconvenience. I have processed a full refund for your order right now. Sorry for the trouble!",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000012,
    tags: ['发错货', '赠送', '退款']
  },
  {
    id: 'neg_4',
    title: '质量不如预期 - 退货指引',
    contentEnglish: "I'm sorry to hear the product wasn't what you expected. We want you to be 100% satisfied. You can easily initiate a return via the order page for a full refund. We appreciate your feedback and will use it to improve.",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000013,
    tags: ['退货', '流程']
  },
  {
    id: 'neg_5',
    title: '缺少零件 - 紧急补发',
    contentEnglish: "I apologize profusely for the missing part! We usually double-check everything. I have personally arranged for the missing piece to be shipped to you via express mail today. Here is your tracking number: [Tracking Number].",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000014,
    tags: ['漏发', '补发', '加急']
  },
  {
    id: 'neg_6',
    title: 'TikTok 差评挽回 (亲切)',
    contentEnglish: "Hey, I'm really sorry to see this! 😔 We want to make it right. Please DM us your order number so we can fix this for you ASAP! We promise to take care of you.",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.TIKTOK_SHOP,
    createdAt: 1715420000015,
    tags: ['挽回', '私信']
  },
  {
    id: 'neg_7',
    title: '功能不会用 - 提供帮助',
    contentEnglish: "I'm sorry to hear you're having trouble setting it up! It can be a bit tricky at first. I've attached a link to a quick video tutorial that might help. If it still doesn't work, let me know and we'll sort it out!",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000016,
    tags: ['使用教程', '帮助']
  },
  {
    id: 'neg_8',
    title: '物流延误致歉',
    contentEnglish: "I apologize for the delay in your delivery. We know you are excited to receive your order. It looks like the carrier is experiencing some backlog. We are monitoring it closely and will update you as soon as it moves!",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000017,
    tags: ['物流延误', '安抚']
  },
  {
    id: 'neg_9',
    title: '尺码不合 - 换货建议',
    contentEnglish: "Sorry the fit wasn't quite right! Sizing can be difficult online. We'd be happy to exchange it for a different size. Just let us know which size you'd prefer, and we'll guide you through the exchange process.",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000018,
    tags: ['尺码', '换货']
  },
  {
    id: 'neg_10',
    title: '严重投诉 - 转接主管',
    contentEnglish: "I am taking your complaint very seriously. I have escalated this to our management team to investigate what went wrong. Please expect a personal follow-up email from us within 24 hours to resolve this.",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000019,
    tags: ['投诉', '升级处理']
  },

  // --- LOGISTICS (物流问题) ---
  {
    id: 'log_1',
    title: '查询物流状态 (已发货)',
    contentEnglish: "Thanks for reaching out! Your order is on its way. The current tracking status shows it is in transit and expected to arrive by [Date]. You can track it here: [Link]. Let me know if you see any issues!",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000020,
    tags: ['查询', '正常']
  },
  {
    id: 'log_2',
    title: '查询物流 (未发货/准备中)',
    contentEnglish: "Thanks for your patience! Your order is currently being packed with care. We expect to hand it over to the carrier within the next 24 hours. You'll receive an email with the tracking number as soon as it ships!",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000021,
    tags: ['未发货', '打包中']
  },
  {
    id: 'log_3',
    title: '包裹显示签收但未收到',
    contentEnglish: "I'm sorry for the scare! Sometimes carriers mark items as delivered a few hours before they actually drop them off, or they might leave it with a neighbor. Could you please check around your porch or mailbox? If it doesn't show up by tomorrow, let me know and I will file a claim immediately.",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.AMAZON,
    createdAt: 1715420000022,
    tags: ['丢件疑似', '排查']
  },
  {
    id: 'log_4',
    title: '海关/关税问题解释',
    contentEnglish: "I understand your concern about the customs fee. As noted in our shipping policy, international orders may be subject to import duties depending on your country's laws. We unfortunately have no control over these government fees.",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000023,
    tags: ['关税', '解释']
  },
  {
    id: 'log_5',
    title: '确认包裹丢失 - 补发',
    contentEnglish: "It looks like the package has indeed been lost in transit by the carrier. I am terribly sorry about this! I have gone ahead and created a replacement order for you free of charge. It will ship out via priority mail tomorrow.",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000024,
    tags: ['丢件', '确认', '补发']
  },
  {
    id: 'log_6',
    title: '修改地址确认',
    contentEnglish: "No problem! I have updated your shipping address to the one you provided. Since the order hasn't shipped yet, this change is confirmed. Thanks for catching that early!",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000025,
    tags: ['改地址', '成功']
  },
  {
    id: 'log_7',
    title: '无法修改地址 (已发货)',
    contentEnglish: "I'm sorry, but the order has already been handed over to the carrier, so we cannot change the address at this stage. I recommend contacting the carrier directly with your tracking number to see if they can reroute it for you.",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000026,
    tags: ['改地址', '失败']
  },
  {
    id: 'log_8',
    title: '拆单发货通知',
    contentEnglish: "Just a heads up! Since your order contains items from different warehouses, they will be arriving in separate packages. You'll receive separate tracking numbers for each. Don't worry if only one arrives first!",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000027,
    tags: ['拆单', '多包裹']
  },
  {
    id: 'log_9',
    title: '恶劣天气延误通知',
    contentEnglish: "We noticed your shipment is passing through an area currently affected by severe weather. This might cause a slight delay of 1-2 days. Thank you for your patience and understanding!",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000028,
    tags: ['天气', '不可抗力']
  },
  {
    id: 'log_10',
    title: '退件重发确认',
    contentEnglish: "We received your returned package today. As requested, we are preparing to reship it to the updated address you provided. You should see a new tracking number shortly.",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000029,
    tags: ['退件', '重发']
  },

  // --- INQUIRY (售前咨询) ---
  {
    id: 'inq_1',
    title: '尺码建议回复',
    contentEnglish: "Thanks for asking! Based on your measurements, we recommend going with a Size M for a comfortable fit. If you prefer a tighter fit, Size S would work too as the fabric is quite stretchy. Hope that helps!",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000030,
    tags: ['尺码', '建议']
  },
  {
    id: 'inq_2',
    title: '材质/面料咨询',
    contentEnglish: "Great question! This item is made of 100% organic cotton, which makes it super soft and breathable. It's pre-shrunk as well, so it holds its shape nicely after washing.",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000031,
    tags: ['材质', '细节']
  },
  {
    id: 'inq_3',
    title: '批发/大宗采购咨询',
    contentEnglish: "Yes, we do offer wholesale pricing for bulk orders! Please send us a direct message or email us at [Email] with the quantity you are interested in, and we'll send over our price sheet.",
    category: TemplateCategory.INQUIRY,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000032,
    tags: ['批发', 'B2B']
  },
  {
    id: 'inq_4',
    title: '何时补货?',
    contentEnglish: "We're glad you like it! This popular item is currently being manufactured and we expect it back in stock by [Date]. You can sign up for email notifications on the product page to be alerted instantly!",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000033,
    tags: ['补货', '库存']
  },
  {
    id: 'inq_5',
    title: '能否定制?',
    contentEnglish: "At the moment, we sell our products as-is and do not offer custom personalization options. However, we are constantly expanding our range, so keep an eye out for future updates!",
    category: TemplateCategory.INQUIRY,
    platform: Platform.AMAZON,
    createdAt: 1715420000034,
    tags: ['定制', '拒绝']
  },
  {
    id: 'inq_6',
    title: '发货时效咨询',
    contentEnglish: "We typically ship all orders within 24 hours on business days. Standard shipping to the US usually takes 3-5 business days. If you need it sooner, we also offer Express Shipping at checkout.",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000035,
    tags: ['时效', '发货']
  },
  {
    id: 'inq_7',
    title: '退货政策咨询',
    contentEnglish: "We offer a 30-day return policy. If you aren't satisfied with your purchase for any reason, you can return it in its original condition for a full refund. We make the process very simple!",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000036,
    tags: ['退货', '政策']
  },
  {
    id: 'inq_8',
    title: '折扣码无效咨询',
    contentEnglish: "I'm sorry about the code! Please make sure there are no spaces before or after the code. Also, note that this specific code only applies to non-sale items. Let me know if you still have trouble!",
    category: TemplateCategory.INQUIRY,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000037,
    tags: ['折扣', '故障']
  },
  {
    id: 'inq_9',
    title: '电子说明书请求',
    contentEnglish: "Certainly! I have attached the PDF manual to this message. Page 5 covers the setup process you asked about. Let me know if you have any other questions!",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000038,
    tags: ['说明书', '文件']
  },
  {
    id: 'inq_10',
    title: '兼容性咨询',
    contentEnglish: "Yes, this model is fully compatible with [Device Name]. We have tested it extensively to ensure seamless integration. It's plug-and-play!",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000039,
    tags: ['兼容性', '技术']
  },

  // --- OTHER (其他) ---
  {
    id: 'oth_1',
    title: '节假日延迟发货通知',
    contentEnglish: "Please note that due to the upcoming Holiday season, our carriers are busier than usual. While we ship on time, delivery might take 1-2 days longer. We appreciate your patience!",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000040,
    tags: ['节日', '公告']
  },
  {
    id: 'oth_2',
    title: '周末/非工作时间自动回复',
    contentEnglish: "Thanks for your message! Our team is currently out of the office for the weekend. We will be back on Monday and will reply to your message first thing in the morning. Have a great weekend!",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000041,
    tags: ['自动回复', '周末']
  },
  {
    id: 'oth_3',
    title: '发票索取回复',
    contentEnglish: "Here is the invoice for your order #12345. If you need any specific details added for tax purposes, just let me know and I can update it for you.",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000042,
    tags: ['发票', '财务']
  },
  {
    id: 'oth_4',
    title: '取消订单确认',
    contentEnglish: "As requested, I have successfully cancelled your order. You will not be charged. If you change your mind, you are always welcome to place a new order!",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000043,
    tags: ['取消', '确认']
  },
  {
    id: 'oth_5',
    title: '无法取消 (已发货)',
    contentEnglish: "I tried to catch it, but it looks like your order was just scanned by the carrier! We can't cancel it now, but you can simply refuse the package upon delivery or return it once it arrives for a refund.",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000044,
    tags: ['取消', '失败']
  },
  {
    id: 'oth_6',
    title: '感谢客户建议',
    contentEnglish: "That is a brilliant suggestion! Thank you for sharing your thoughts. We love hearing ideas from our customers. I've passed this directly to our product design team.",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000045,
    tags: ['建议', '反馈']
  },
  {
    id: 'oth_7',
    title: '系统故障致歉',
    contentEnglish: "We are currently experiencing a minor technical glitch with our tracking system. Rest assured your order is moving safely! The link should be working again within a few hours. Sorry for the confusion!",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000046,
    tags: ['故障', '系统']
  },
  {
    id: 'oth_8',
    title: '地址核对请求',
    contentEnglish: "We noticed the shipping address provided seems to be missing an apartment number. Could you please confirm if this is correct? We want to make sure it gets to you safely!",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000047,
    tags: ['核对', '地址']
  },
  {
    id: 'oth_9',
    title: '大促活动预热 (Shopify)',
    contentEnglish: "Yes! Our Black Friday sale starts this Friday at midnight. Everything will be 30% off. Keep an eye on your inbox for early access!",
    category: TemplateCategory.OTHER,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000048,
    tags: ['促销', '活动']
  },
  {
    id: 'oth_10',
    title: '礼貌拒绝不合理要求',
    contentEnglish: "While we would love to help, we unfortunately cannot offer a refund on this item as it was purchased over 6 months ago, which is outside our policy window. We hope you understand.",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000049,
    tags: ['拒绝', '政策']
  }
];
