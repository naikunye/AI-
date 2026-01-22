import { SavedTemplate, TemplateCategory, Platform } from '../types';

export const DEFAULT_TEMPLATES: SavedTemplate[] = [
  // --- POSITIVE (好评回复) ---
  {
    id: 'pos_1',
    title: '标准好评致谢 (亚马逊安全版)',
    contentEnglish: "Thank you so much for your kind words! We're thrilled to hear that you're happy with your purchase. Your support means the world to our small business. If you need anything else, please don't hesitate to reach out.",
    contentChinese: "非常感谢您的美言！听到您对购买感到满意，我们要开心坏了。您的支持对我们的小生意意义重大。如果您还有其他需要，请随时联系我们。",
    category: TemplateCategory.POSITIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000000,
    tags: ['感谢', '标准', '安全']
  },
  {
    id: 'pos_2',
    title: 'TikTok 热情互动 (带表情)',
    contentEnglish: "OMG! 😍 Thank you for the glowing review! We are doing a happy dance right now! 💃 So glad you love it. Don't forget to tag us in your videos, we'd love to see how you use it! ✨",
    contentChinese: "天哪！😍 谢谢您的热情好评！我们现在开心得想跳舞！💃 很高兴您喜欢它。别忘了在视频里标记我们，我们很想看看您是怎么使用的！✨",
    category: TemplateCategory.POSITIVE,
    platform: Platform.TIKTOK_SHOP,
    createdAt: 1715420000001,
    tags: ['热情', '表情符号', '互动']
  },
  {
    id: 'pos_3',
    title: 'Shopify 品牌故事感致谢',
    contentEnglish: "Thank you for sharing your experience! It brings us so much joy to know our product has found a happy home with you. We designed this with care, and hearing feedback like yours makes it all worth it. Welcome to our community!",
    contentChinese: "谢谢您的分享！知道我们的产品在您那里找到了归宿，我们感到无比快乐。这是我们用心设计的，听到像您这样的反馈，一切都值了。欢迎加入我们的社区！",
    category: TemplateCategory.POSITIVE,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000002,
    tags: ['品牌感', '温情']
  },
  {
    id: 'pos_4',
    title: '老客户回购致谢',
    contentEnglish: "Welcome back! It's fantastic to see your name pop up again. Thank you for your continued trust in our brand. We've packed your order with extra care. Thanks for being such a loyal customer!",
    contentChinese: "欢迎回来！很高兴再次看到您的名字。感谢您对我们品牌的一贯信任。我们已经加倍小心地打包了您的订单。谢谢您成为如此忠实的客户！",
    category: TemplateCategory.POSITIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000003,
    tags: ['复购', '老客户']
  },
  {
    id: 'pos_5',
    title: '赞美产品质量的回复',
    contentEnglish: "Thank you! We pride ourselves on quality, so it's wonderful to hear that it met your expectations. We look forward to serving you again in the future!",
    contentChinese: "谢谢！我们以质量为荣，所以很高兴听到它达到了您的期望。期待未来再次为您服务！",
    category: TemplateCategory.POSITIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000004,
    tags: ['质量', '简短']
  },
  {
    id: 'pos_6',
    title: '送礼场景的好评回复',
    contentEnglish: "That's wonderful to hear! We hope the recipient loves it just as much as you do. Thank you for choosing us for such a special gift. 🎁",
    contentChinese: "听到这个真是太好了！我们希望收礼人和您一样喜欢它。谢谢您选择我们送出这份特别的礼物。🎁",
    category: TemplateCategory.POSITIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000005,
    tags: ['礼物', '祝福']
  },
  {
    id: 'pos_7',
    title: 'Etsy 手作温情回复',
    contentEnglish: "Thank you so much! Each piece is handmade with love, and I'm so happy it arrived safely. Enjoy using it, and thanks for supporting independent artists!",
    contentChinese: "非常感谢！每一件作品都是用爱手工制作的，很高兴它安全送达。祝您使用愉快，感谢支持独立艺术家！",
    category: TemplateCategory.POSITIVE,
    platform: Platform.ETSY,
    createdAt: 1715420000006,
    tags: ['手作', '个人化']
  },
  {
    id: 'pos_8',
    title: '赞美物流速度的回复',
    contentEnglish: "Glad to hear it arrived quickly! We know how hard it is to wait for a package. Enjoy your new item!",
    contentChinese: "很高兴听到它很快就到了！我们知道等待包裹有多难熬。享受您的新宝贝吧！",
    category: TemplateCategory.POSITIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000007,
    tags: ['物流快', '致谢']
  },
  {
    id: 'pos_9',
    title: '邀请关注社交媒体 (独立站)',
    contentEnglish: "Thank you for the review! If you haven't already, join us on Instagram for styling tips and sneak peeks at new arrivals. We'd love to see you there!",
    contentChinese: "谢谢您的评价！如果您还没关注，请在 Instagram 上加入我们，获取搭配技巧和新品预览。我们很想在那里见到您！",
    category: TemplateCategory.POSITIVE,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000008,
    tags: ['社交媒体', '引流']
  },
  {
    id: 'pos_10',
    title: '极简致谢 (通用)',
    contentEnglish: "Thanks for the feedback! We appreciate you.",
    contentChinese: "谢谢您的反馈！我们很感激。",
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
    contentChinese: "非常抱歉您的体验没有达到预期。这不符合我们的标准。我已经直接按您的原支付方式全额退款了。您不需要退回商品。希望您能再给我们一次机会。",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000010,
    tags: ['退款', '无需退货', '高优先级']
  },
  {
    id: 'neg_2',
    title: '产品破损 - 补发处理',
    contentEnglish: "Oh no! I'm so sorry to hear the item arrived damaged. It sounds like it had a rough journey. Please reply with a quick photo of the damage, and we will ship a brand new replacement to you immediately, free of charge.",
    contentChinese: "哦不！很抱歉听到物品到达时损坏了。听起来它经历了一段艰难的旅程。请回复一张损坏的照片，我们将立即为您免费补发一个全新的。",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000011,
    tags: ['破损', '补发']
  },
  {
    id: 'neg_3',
    title: '发错货 - 仅退款 (保留商品)',
    contentEnglish: "I sincerely apologize for the mix-up! That was our mistake. Please keep the item you received as a gift for the inconvenience. I have processed a full refund for your order right now. Sorry for the trouble!",
    contentChinese: "我为弄混了真诚道歉！那是我们的失误。请将收到的物品留作礼物，以表歉意。我现在已经为您处理了全额退款。抱歉给您添麻烦了！",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000012,
    tags: ['发错货', '赠送', '退款']
  },
  {
    id: 'neg_4',
    title: '质量不如预期 - 退货指引',
    contentEnglish: "I'm sorry to hear the product wasn't what you expected. We want you to be 100% satisfied. You can easily initiate a return via the order page for a full refund. We appreciate your feedback and will use it to improve.",
    contentChinese: "很抱歉听到产品不是您预期的那样。我们希望您100%满意。您可以通过订单页面轻松发起退货并获得全额退款。感谢您的反馈，我们会加以改进。",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.AMAZON,
    createdAt: 1715420000013,
    tags: ['退货', '流程']
  },
  {
    id: 'neg_5',
    title: '缺少零件 - 紧急补发',
    contentEnglish: "I apologize profusely for the missing part! We usually double-check everything. I have personally arranged for the missing piece to be shipped to you via express mail today. Here is your tracking number: [Tracking Number].",
    contentChinese: "我为缺少零件深表歉意！我们通常会仔细检查一切。我已经亲自安排今天通过快递为您补发缺失的部件。这是您的追踪号码：[Tracking Number]。",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000014,
    tags: ['漏发', '补发', '加急']
  },
  {
    id: 'neg_6',
    title: 'TikTok 差评挽回 (亲切)',
    contentEnglish: "Hey, I'm really sorry to see this! 😔 We want to make it right. Please DM us your order number so we can fix this for you ASAP! We promise to take care of you.",
    contentChinese: "嘿，看到这个我真的很难过！😔 我们想弥补。请私信您的订单号，我们会尽快为您解决！我们要照顾好您。",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.TIKTOK_SHOP,
    createdAt: 1715420000015,
    tags: ['挽回', '私信']
  },
  {
    id: 'neg_7',
    title: '功能不会用 - 提供帮助',
    contentEnglish: "I'm sorry to hear you're having trouble setting it up! It can be a bit tricky at first. I've attached a link to a quick video tutorial that might help. If it still doesn't work, let me know and we'll sort it out!",
    contentChinese: "很抱歉听到您在设置时遇到困难！刚开始确实可能有点棘手。我附上了一个快速视频教程的链接，可能会有帮助。如果还是不行，请告诉我，我们会解决的！",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000016,
    tags: ['使用教程', '帮助']
  },
  {
    id: 'neg_8',
    title: '物流延误致歉',
    contentEnglish: "I apologize for the delay in your delivery. We know you are excited to receive your order. It looks like the carrier is experiencing some backlog. We are monitoring it closely and will update you as soon as it moves!",
    contentChinese: "我为发货延误道歉。我们知道您很期待收到订单。看起来承运商目前有些积压。我们正在密切监控，一旦有动静会立即通知您！",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.GENERAL,
    createdAt: 1715420000017,
    tags: ['物流延误', '安抚']
  },
  {
    id: 'neg_9',
    title: '尺码不合 - 换货建议',
    contentEnglish: "Sorry the fit wasn't quite right! Sizing can be difficult online. We'd be happy to exchange it for a different size. Just let us know which size you'd prefer, and we'll guide you through the exchange process.",
    contentChinese: "抱歉尺寸不太合适！在线确定尺码确实很难。我们很乐意为您更换不同的尺码。只需告诉我们要哪个尺码，我们会指导您完成换货流程。",
    category: TemplateCategory.NEGATIVE,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000018,
    tags: ['尺码', '换货']
  },
  {
    id: 'neg_10',
    title: '严重投诉 - 转接主管',
    contentEnglish: "I am taking your complaint very seriously. I have escalated this to our management team to investigate what went wrong. Please expect a personal follow-up email from us within 24 hours to resolve this.",
    contentChinese: "我非常重视您的投诉。我已经将其升级给管理团队调查出了什么问题。请期待我们在24小时内给您发送个人跟进邮件来解决此事。",
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
    contentChinese: "谢谢您的联系！您的订单正在路上。目前的追踪状态显示它正在运输中，预计 [Date] 到达。您可以在这里追踪：[Link]。如果有任何问题请告诉我！",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000020,
    tags: ['查询', '正常']
  },
  {
    id: 'log_2',
    title: '查询物流 (未发货/准备中)',
    contentEnglish: "Thanks for your patience! Your order is currently being packed with care. We expect to hand it over to the carrier within the next 24 hours. You'll receive an email with the tracking number as soon as it ships!",
    contentChinese: "感谢您的耐心！您的订单目前正在精心打包中。我们预计在接下来的24小时内移交给承运商。发货后您会收到带有追踪号码的电子邮件！",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000021,
    tags: ['未发货', '打包中']
  },
  {
    id: 'log_3',
    title: '包裹显示签收但未收到',
    contentEnglish: "I'm sorry for the scare! Sometimes carriers mark items as delivered a few hours before they actually drop them off, or they might leave it with a neighbor. Could you please check around your porch or mailbox? If it doesn't show up by tomorrow, let me know and I will file a claim immediately.",
    contentChinese: "抱歉让您受惊了！有时承运商会在实际送达前几个小时标记为已送达，或者他们可能放在了邻居家。能请您检查一下门廊或邮箱周围吗？如果明天还没出现，请告诉我，我会立即提出索赔。",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.AMAZON,
    createdAt: 1715420000022,
    tags: ['丢件疑似', '排查']
  },
  {
    id: 'log_4',
    title: '海关/关税问题解释',
    contentEnglish: "I understand your concern about the customs fee. As noted in our shipping policy, international orders may be subject to import duties depending on your country's laws. We unfortunately have no control over these government fees.",
    contentChinese: "我理解您对关税费用的担忧。正如我们的运输政策所述，国际订单可能会根据您所在国家的法律征收进口关税。遗憾的是我们无法控制这些政府费用。",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000023,
    tags: ['关税', '解释']
  },
  {
    id: 'log_5',
    title: '确认包裹丢失 - 补发',
    contentEnglish: "It looks like the package has indeed been lost in transit by the carrier. I am terribly sorry about this! I have gone ahead and created a replacement order for you free of charge. It will ship out via priority mail tomorrow.",
    contentChinese: "看起来包裹确实被承运商弄丢了。我对此感到非常抱歉！我已经为您免费创建了一个补发订单。它明天将通过优先邮件寄出。",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000024,
    tags: ['丢件', '确认', '补发']
  },
  {
    id: 'log_6',
    title: '修改地址确认',
    contentEnglish: "No problem! I have updated your shipping address to the one you provided. Since the order hasn't shipped yet, this change is confirmed. Thanks for catching that early!",
    contentChinese: "没问题！我已经将您的收货地址更新为您提供的地址。由于订单尚未发货，此更改已确认。谢谢您及时发现！",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000025,
    tags: ['改地址', '成功']
  },
  {
    id: 'log_7',
    title: '无法修改地址 (已发货)',
    contentEnglish: "I'm sorry, but the order has already been handed over to the carrier, so we cannot change the address at this stage. I recommend contacting the carrier directly with your tracking number to see if they can reroute it for you.",
    contentChinese: "很抱歉，订单已经移交给承运商，所以我们现阶段无法更改地址。我建议直接用您的追踪号码联系承运商，看他们是否能为您改道。",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000026,
    tags: ['改地址', '失败']
  },
  {
    id: 'log_8',
    title: '拆单发货通知',
    contentEnglish: "Just a heads up! Since your order contains items from different warehouses, they will be arriving in separate packages. You'll receive separate tracking numbers for each. Don't worry if only one arrives first!",
    contentChinese: "温馨提示！由于您的订单包含来自不同仓库的物品，它们将分包裹到达。您会收到各自的追踪号码。如果只有一个先到，请别担心！",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000027,
    tags: ['拆单', '多包裹']
  },
  {
    id: 'log_9',
    title: '恶劣天气延误通知',
    contentEnglish: "We noticed your shipment is passing through an area currently affected by severe weather. This might cause a slight delay of 1-2 days. Thank you for your patience and understanding!",
    contentChinese: "我们注意到您的货物正经过受恶劣天气影响的地区。这可能会导致1-2天的轻微延误。感谢您的耐心和理解！",
    category: TemplateCategory.LOGISTICS,
    platform: Platform.GENERAL,
    createdAt: 1715420000028,
    tags: ['天气', '不可抗力']
  },
  {
    id: 'log_10',
    title: '退件重发确认',
    contentEnglish: "We received your returned package today. As requested, we are preparing to reship it to the updated address you provided. You should see a new tracking number shortly.",
    contentChinese: "我们今天收到了您的退件。按您的要求，我们正准备重新发货到您提供的更新地址。您很快就会看到新的追踪号码。",
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
    contentChinese: "谢谢咨询！根据您的尺寸，为了舒适贴合，我们建议选 M 码。如果您喜欢紧身一点，S 码也可以，因为面料很有弹性。希望这有帮助！",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000030,
    tags: ['尺码', '建议']
  },
  {
    id: 'inq_2',
    title: '材质/面料咨询',
    contentEnglish: "Great question! This item is made of 100% organic cotton, which makes it super soft and breathable. It's pre-shrunk as well, so it holds its shape nicely after washing.",
    contentChinese: "问得好！这款产品由100%有机棉制成，非常柔软透气。它也是预缩水的，所以洗涤后能保持很好的形状。",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000031,
    tags: ['材质', '细节']
  },
  {
    id: 'inq_3',
    title: '批发/大宗采购咨询',
    contentEnglish: "Yes, we do offer wholesale pricing for bulk orders! Please send us a direct message or email us at [Email] with the quantity you are interested in, and we'll send over our price sheet.",
    contentChinese: "是的，我们提供大宗订单批发价！请直接发消息或邮件至 [Email] 告知您感兴趣的数量，我们会发送价格表。",
    category: TemplateCategory.INQUIRY,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000032,
    tags: ['批发', 'B2B']
  },
  {
    id: 'inq_4',
    title: '何时补货?',
    contentEnglish: "We're glad you like it! This popular item is currently being manufactured and we expect it back in stock by [Date]. You can sign up for email notifications on the product page to be alerted instantly!",
    contentChinese: "很高兴您喜欢！这款热门商品目前正在生产中，预计 [Date] 恢复库存。您可以在产品页面注册邮件通知，以便第一时间收到提醒！",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000033,
    tags: ['补货', '库存']
  },
  {
    id: 'inq_5',
    title: '能否定制?',
    contentEnglish: "At the moment, we sell our products as-is and do not offer custom personalization options. However, we are constantly expanding our range, so keep an eye out for future updates!",
    contentChinese: "目前，我们的产品按原样销售，不提供定制个性化选项。不过，我们在不断扩展产品系列，请留意未来的更新！",
    category: TemplateCategory.INQUIRY,
    platform: Platform.AMAZON,
    createdAt: 1715420000034,
    tags: ['定制', '拒绝']
  },
  {
    id: 'inq_6',
    title: '发货时效咨询',
    contentEnglish: "We typically ship all orders within 24 hours on business days. Standard shipping to the US usually takes 3-5 business days. If you need it sooner, we also offer Express Shipping at checkout.",
    contentChinese: "我们通常在工作日24小时内发货。到美国的标准运输通常需要3-5个工作日。如果您急需，我们结账时也提供快递选项。",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000035,
    tags: ['时效', '发货']
  },
  {
    id: 'inq_7',
    title: '退货政策咨询',
    contentEnglish: "We offer a 30-day return policy. If you aren't satisfied with your purchase for any reason, you can return it in its original condition for a full refund. We make the process very simple!",
    contentChinese: "我们提供30天退货政策。如果您因任何原因对购买不满意，可以在原样状态下退回以获得全额退款。我们将流程变得非常简单！",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000036,
    tags: ['退货', '政策']
  },
  {
    id: 'inq_8',
    title: '折扣码无效咨询',
    contentEnglish: "I'm sorry about the code! Please make sure there are no spaces before or after the code. Also, note that this specific code only applies to non-sale items. Let me know if you still have trouble!",
    contentChinese: "关于折扣码很抱歉！请确保代码前后没有空格。另外，请注意此特定代码仅适用于非促销商品。如果您仍有问题请告诉我！",
    category: TemplateCategory.INQUIRY,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000037,
    tags: ['折扣', '故障']
  },
  {
    id: 'inq_9',
    title: '电子说明书请求',
    contentEnglish: "Certainly! I have attached the PDF manual to this message. Page 5 covers the setup process you asked about. Let me know if you have any other questions!",
    contentChinese: "当然！我已将PDF说明书附在此消息中。第5页涵盖了您询问的设置过程。如果您有其他问题请告诉我！",
    category: TemplateCategory.INQUIRY,
    platform: Platform.GENERAL,
    createdAt: 1715420000038,
    tags: ['说明书', '文件']
  },
  {
    id: 'inq_10',
    title: '兼容性咨询',
    contentEnglish: "Yes, this model is fully compatible with [Device Name]. We have tested it extensively to ensure seamless integration. It's plug-and-play!",
    contentChinese: "是的，该型号与 [Device Name] 完全兼容。我们进行了广泛测试以确保无缝集成。它是即插即用的！",
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
    contentChinese: "请注意，由于即将到来的假日季，承运商比平时更忙。虽然我们按时发货，但送达可能会晚1-2天。感谢您的耐心！",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000040,
    tags: ['节日', '公告']
  },
  {
    id: 'oth_2',
    title: '周末/非工作时间自动回复',
    contentEnglish: "Thanks for your message! Our team is currently out of the office for the weekend. We will be back on Monday and will reply to your message first thing in the morning. Have a great weekend!",
    contentChinese: "谢谢您的留言！我们团队目前周末休息。我们周一回来，会第一时间回复您的消息。祝您周末愉快！",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000041,
    tags: ['自动回复', '周末']
  },
  {
    id: 'oth_3',
    title: '发票索取回复',
    contentEnglish: "Here is the invoice for your order #12345. If you need any specific details added for tax purposes, just let me know and I can update it for you.",
    contentChinese: "这是您的订单 #12345 的发票。如果您需要为税务添加任何具体细节，只需告诉我，我可以为您更新。",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000042,
    tags: ['发票', '财务']
  },
  {
    id: 'oth_4',
    title: '取消订单确认',
    contentEnglish: "As requested, I have successfully cancelled your order. You will not be charged. If you change your mind, you are always welcome to place a new order!",
    contentChinese: "按您的要求，我已经成功取消了您的订单。您不会被扣款。如果您改变主意，随时欢迎重新下单！",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000043,
    tags: ['取消', '确认']
  },
  {
    id: 'oth_5',
    title: '无法取消 (已发货)',
    contentEnglish: "I tried to catch it, but it looks like your order was just scanned by the carrier! We can't cancel it now, but you can simply refuse the package upon delivery or return it once it arrives for a refund.",
    contentChinese: "我试图拦截它，但看起来您的订单刚刚被承运商扫描了！我们现在无法取消，但您可以简单地在送达时拒收包裹，或者收到后退回以获得退款。",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000044,
    tags: ['取消', '失败']
  },
  {
    id: 'oth_6',
    title: '感谢客户建议',
    contentEnglish: "That is a brilliant suggestion! Thank you for sharing your thoughts. We love hearing ideas from our customers. I've passed this directly to our product design team.",
    contentChinese: "这是个很棒的建议！谢谢您分享想法。我们喜欢听取客户的点子。我已经直接转达给我们的产品设计团队了。",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000045,
    tags: ['建议', '反馈']
  },
  {
    id: 'oth_7',
    title: '系统故障致歉',
    contentEnglish: "We are currently experiencing a minor technical glitch with our tracking system. Rest assured your order is moving safely! The link should be working again within a few hours. Sorry for the confusion!",
    contentChinese: "我们的追踪系统目前遇到一点小技术故障。请放心，您的订单正在安全运输！链接应该几小时内就会恢复。抱歉造成困扰！",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000046,
    tags: ['故障', '系统']
  },
  {
    id: 'oth_8',
    title: '地址核对请求',
    contentEnglish: "We noticed the shipping address provided seems to be missing an apartment number. Could you please confirm if this is correct? We want to make sure it gets to you safely!",
    contentChinese: "我们注意到提供的收货地址似乎缺少公寓号。能请您确认一下这是否正确吗？我们要确保它安全送达给您！",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000047,
    tags: ['核对', '地址']
  },
  {
    id: 'oth_9',
    title: '大促活动预热 (Shopify)',
    contentEnglish: "Yes! Our Black Friday sale starts this Friday at midnight. Everything will be 30% off. Keep an eye on your inbox for early access!",
    contentChinese: "是的！我们的黑色星期五大促将在本周五午夜开始。所有商品七折。请留意收件箱获取优先参与权！",
    category: TemplateCategory.OTHER,
    platform: Platform.SHOPIFY,
    createdAt: 1715420000048,
    tags: ['促销', '活动']
  },
  {
    id: 'oth_10',
    title: '礼貌拒绝不合理要求',
    contentEnglish: "While we would love to help, we unfortunately cannot offer a refund on this item as it was purchased over 6 months ago, which is outside our policy window. We hope you understand.",
    contentChinese: "虽然我们要很想帮忙，但很遗憾我们无法为此商品提供退款，因为它是6个多月前购买的，这超出了我们的政策期限。希望您能理解。",
    category: TemplateCategory.OTHER,
    platform: Platform.GENERAL,
    createdAt: 1715420000049,
    tags: ['拒绝', '政策']
  }
];
