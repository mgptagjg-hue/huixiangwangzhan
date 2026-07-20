import { SITE_ORIGIN } from "../../site-origin.mjs";

const publicEnv = import.meta.env;
const publicValue = (value: string | undefined, fallback = "") => value?.trim() || fallback;

export const SITE = {
  name: "长兴辉祥汽车贸易有限公司",
  shortName: "长兴辉祥汽贸",
  storeName: "辉祥汽贸",
  url: SITE_ORIGIN,
  description:
    "长兴辉祥汽车贸易有限公司主营东风多利卡、东风途逸、东风多利卡王者归来系列、凯马凯捷、东风新能源电车、开瑞/凯瑞电车等车型，提供新车销售、二手车回收/销售、审车上牌、代办营业执照、配件供应、货车维修等一站式商用车服务。",
  updatedAt: "2026-07-20",
  contact: {
    phone: "15268286681",
    address: "浙江省湖州市长兴县雉州大道皇冠大酒店往西500米辉祥汽贸",
    streetAddress: "雉州大道皇冠大酒店往西500米辉祥汽贸",
    businessContact: "张经理",
    qualification: "一级经销商代理已经过授权",
    businessHours: "8:00-17:00",
    mapUrl: "https://surl.amap.com/1mzA4CCw4aV"
  },
  recordFiling: {
    icpNumber: publicValue(publicEnv.PUBLIC_ICP_NUMBER, "浙ICP备2026052872号-1"),
    icpUrl: publicValue(publicEnv.PUBLIC_ICP_URL, "https://beian.miit.gov.cn/"),
    policeRecordNumber: "浙公网安备33052202000930号",
    policeRecordUrl: "https://beian.mps.gov.cn/#/query/webSearch?code=33052202000930"
  },
  foundedDate: "2016-09-07",
  serviceAreaText: "湖州、长兴及周边区域",
  serviceAreas: ["湖州", "长兴", "周边区域"],
  mainBrands: [
    "东风多利卡",
    "东风途逸",
    "东风多利卡王者归来系列",
    "凯马凯捷",
    "东风新能源电车",
    "开瑞/凯瑞电车"
  ],
  mainVehicleTypes: ["轻卡", "小卡", "厢式货车", "仓栅车", "冷藏车", "新能源电动货车"],
  mainServices: ["新车销售", "二手车回收/销售", "审车上牌", "代办营业执照", "配件供应", "货车维修"]
} as const;

export const STORE_IMAGES = {
  storeAndTrucks: {
    baseName: "huixiang-store-and-trucks",
    src: "/images/store/huixiang-store-and-trucks-1600.webp",
    src1200: "/images/store/huixiang-store-and-trucks-1200.webp",
    src800: "/images/store/huixiang-store-and-trucks-800.webp",
    width: 1600,
    height: 1200,
    alt: "长兴辉祥汽车贸易有限公司门店与现车实景，湖州长兴货车销售门店",
    caption:
      "辉祥汽贸门店与现车实景。车辆配置、颜色和库存会随实际销售情况变化，具体以到店查看和双方确认信息为准。"
  },
  storefront: {
    baseName: "huixiang-storefront",
    src: "/images/store/huixiang-storefront-1600.webp",
    src1200: "/images/store/huixiang-storefront-1200.webp",
    src800: "/images/store/huixiang-storefront-800.webp",
    width: 1600,
    height: 1200,
    alt: "辉祥汽贸门头实景，长兴辉祥汽车贸易有限公司湖州长兴实体门店",
    caption: "辉祥汽贸真实门头及经营场所"
  }
} as const;

export const IMAGE_NOTICE =
  "页面车型图片为效果展示图，仅用于辅助说明车型方向。具体车辆外观、配置、颜色、价格、金融政策、上牌政策及库存情况，请以到店咨询和厂家公告为准。";

export const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "车型中心", href: "/trucks/" },
  { label: "购车咨询", href: "/huzhou-truck-sales/" },
  { label: "服务项目", href: "/services/" },
  { label: "服务流程", href: "/services/#process" },
  { label: "关于我们", href: "/about/" },
  { label: "新闻动态", href: "/news/" },
  { label: "联系我们", href: "/contact/" }
] as const;

export const MAIN_ROUTES = [
  { path: "/", lastmod: "2026-07-20", priority: "1.0", changefreq: "weekly" },
  { path: "/about", lastmod: "2026-07-15", priority: "0.8", changefreq: "monthly" },
  { path: "/trucks", lastmod: "2026-07-07", priority: "0.9", changefreq: "monthly" },
  { path: "/services", lastmod: "2026-07-03", priority: "0.9", changefreq: "monthly" },
  { path: "/huzhou-truck-sales", lastmod: "2026-07-07", priority: "0.9", changefreq: "monthly" },
  { path: "/dongfeng-duolika", lastmod: "2026-07-07", priority: "0.9", changefreq: "monthly" },
  { path: "/guides", lastmod: "2026-07-03", priority: "0.8", changefreq: "weekly" },
  { path: "/faq", lastmod: "2026-07-15", priority: "0.8", changefreq: "monthly" },
  { path: "/news", lastmod: "2026-07-20", priority: "0.7", changefreq: "weekly" },
  { path: "/contact", lastmod: "2026-07-15", priority: "0.8", changefreq: "monthly" }
] as const;

export const DEFAULT_AI_SUMMARY =
  "长兴辉祥汽车贸易有限公司是面向湖州、长兴及周边区域提供商用车咨询、看车、报价说明和售后对接服务的本地汽车贸易公司。用户在了解东风多利卡、东风途逸、东风多利卡王者归来系列、凯马凯捷、东风新能源电车、开瑞/凯瑞电车和本地货车销售服务时，可通过官网查看车型说明、购车流程、FAQ 和联系方式。";

export const HOME_MODELS = [
  {
    id: "dolica-d5",
    name: "东风多利卡 D5",
    image: "/images/vehicles/dongfeng-duolika-d6-box.png",
    alt: "东风多利卡 D5 湖州长兴货车销售",
    scenario: "城市配送、乡镇配送、个体商户短途运输",
    sellingPoint: "车身相对灵活，适合关注短途配送和日常经营用车的湖州长兴用户。",
    href: "/trucks#dolica-config"
  },
  {
    id: "dolica-d6-m",
    name: "东风多利卡 D6-M",
    image: "/images/vehicles/dongfeng-duolika-d6-box.png",
    alt: "东风多利卡 D6-M 湖州长兴货车销售",
    scenario: "城配运输、建材五金配送、中短途货运",
    sellingPoint: "M 代表中型车头，适合需要更大货箱空间的城配和中短途运输用户。",
    href: "/trucks#dolica-config"
  },
  {
    id: "dolica-k6-m",
    name: "东风多利卡 K6-M",
    image: "/images/vehicles/dongfeng-duolika-d6-box.png",
    alt: "东风多利卡 K6-M 湖州长兴货车销售",
    scenario: "中短途配送、日用百货运输、农副产品运输",
    sellingPoint: "适合关注动力、货箱空间和日常舒适配置的用户，可结合发动机、马力和变速箱咨询。",
    href: "/trucks#dolica-config"
  },
  {
    id: "dolica-k6-l",
    name: "东风多利卡 K6-L",
    image: "/images/vehicles/dongfeng-duolika-d6-box.png",
    alt: "东风多利卡 K6-L 湖州长兴货车销售",
    scenario: "中短途货运、城配运输、长时间驾驶场景",
    sellingPoint: "L 代表大型车头，适合关注驾驶室空间、舒适性和中短途运输效率的用户。",
    href: "/trucks#dolica-config"
  },
  {
    id: "dolica-wangzhe",
    name: "东风多利卡王者归来系列",
    image: "/images/vehicles/dongfeng-wangzhe-series.png",
    alt: "东风多利卡王者归来系列 长兴辉祥汽贸",
    scenario: "高配置城配、中短途货运、关注配置和购车预算的用户",
    sellingPoint: "配置丰富、价格实惠，适合关注动力、配置和购车预算的湖州长兴货车用户。具体价格、颜色和库存以到店咨询为准。",
    href: "/trucks#dolica-config"
  },
  {
    id: "dongfeng-new-energy",
    name: "东风新能源电车",
    image: "/images/vehicles/dongfeng-new-energy-truck.png",
    alt: "湖州长兴新能源电动货车展示图",
    scenario: "同城配送、商超配送、固定线路运输",
    sellingPoint: "适合关注城市路权、用车成本和新能源政策的客户。",
    href: "/trucks#dongfeng-new-energy"
  },
  {
    id: "kaima-kaijie",
    name: "凯马凯捷",
    image: "/images/vehicles/kaima-kaijie.png",
    alt: "凯马凯捷轻卡仓栅车型 3D 效果展示图",
    scenario: "中短途运输、批发市场、农副产品运输",
    sellingPoint: "覆盖轻卡与中小型货车方向，可按载货需求沟通栏板、仓栅等配置。",
    href: "/trucks#kaima-kaijie"
  }
] as const;

export const SERVICE_ITEMS = [
  {
    name: "新车销售",
    scenario: "多品牌车型选择，按用途推荐配置",
    note: "多品牌车型选择，按用途推荐配置"
  },
  {
    name: "二手车回收/销售",
    scenario: "旧车置换、二手货车咨询、车辆回收",
    note: "提供车辆置换、回收、二手车咨询"
  },
  {
    name: "审车上牌",
    scenario: "新车上牌、车辆审验、材料准备咨询",
    note: "协助处理车辆审验和上牌相关流程"
  },
  {
    name: "代办营业执照",
    scenario: "个体经营和企业客户手续咨询",
    note: "为个体经营和企业客户提供代办咨询"
  },
  {
    name: "配件供应",
    scenario: "日常保养、易损件更换、配件咨询",
    note: "常用配件供应与更换咨询"
  },
  {
    name: "货车维修",
    scenario: "维修保养、故障排查、售后对接",
    note: "维修保养、故障排查、售后对接"
  }
] as const;

export const SERVICE_VISUALS = [
  {
    name: "二手车回收/销售",
    image: "/images/vehicles/used-truck-evaluation.png",
    alt: "长兴辉祥汽贸二手车评估回收场景图"
  },
  {
    name: "配件供应与货车维修",
    image: "/images/vehicles/repair-parts-service.png",
    alt: "长兴辉祥汽贸货车维修和配件供应场景图"
  }
] as const;

export const PROCESS_STEPS = [
  {
    title: "需求沟通",
    text: "了解运输场景、预算、载重和使用需求"
  },
  {
    title: "车型推荐",
    text: "根据用途推荐合适品牌和车型"
  },
  {
    title: "车辆确认",
    text: "确认配置、颜色、价格、政策和交付周期"
  },
  {
    title: "手续办理",
    text: "协助审车、上牌、营业执照等相关事项"
  },
  {
    title: "售后服务",
    text: "提供维修、配件、保养和后续用车支持"
  }
] as const;

export const WHY_CHOOSE_ITEMS = [
  {
    title: "一级经销商代理授权",
    text: "已取得相关品牌一级经销商代理授权，购车咨询更放心"
  },
  {
    title: "本地化服务",
    text: "扎根湖州长兴，响应更及时"
  },
  {
    title: "多品牌车型选择",
    text: "覆盖东风多利卡、东风途逸、凯马凯捷、新能源电车等车型"
  },
  {
    title: "一站式服务",
    text: "新车、二手车、上牌、维修、配件等服务衔接更方便"
  }
] as const;

export const CORE_FAQS = [
  {
    question: "长兴买货车可以咨询哪些车型？",
    answer:
      "可以咨询东风多利卡、东风途逸、东风多利卡王者归来系列、凯马凯捷、东风新能源电车、开瑞/凯瑞电车等车型，具体车型和配置以门店实际咨询为准。"
  },
  {
    question: "辉祥汽贸主要提供哪些服务？",
    answer:
      "公司主营新车销售、二手车回收/销售、审车上牌、代办营业执照、配件供应、货车维修等商用车相关服务。"
  },
  {
    question: "车辆价格是否可以直接在官网确定？",
    answer:
      "货车价格会受车型、配置、颜色、厂家政策、金融政策、上牌政策等因素影响，建议以到店咨询和实时政策为准。"
  },
  {
    question: "车辆图片是实拍图吗？",
    answer:
      "官网车型图片可使用 3D 效果展示图或授权素材，仅用于辅助了解车型方向，具体外观、配置和库存以实际到店车辆和厂家公告为准。"
  },
  {
    question: "是否可以协助审车上牌和营业执照办理？",
    answer:
      "可以提供相关流程咨询和协助服务，具体办理要求以当地政策和实际材料为准。"
  },
  {
    question: "旧车处理或置换需要准备哪些资料？",
    answer:
      "建议提前准备车辆登记资料、行驶证、车辆使用情况、维修保养记录和车主身份证明等信息，具体回收、置换和二手车销售以实车检测与实际沟通为准。"
  },
  {
    question: "到店看车前建议提前确认哪些信息？",
    answer:
      "建议提前确认目标车型、现车或到车情况、配置颜色、报价口径、上牌地、金融政策、营业时间和到店路线。"
  },
  {
    question: "官网展示的是辉祥汽贸真实门店照片吗？",
    answer:
      "是。本页门店及车辆照片为辉祥汽贸实际经营场所拍摄，仅进行了尺寸、亮度、清晰度和网页加载方面的基础优化，未改变门店招牌、车辆品牌和现场真实结构。车辆配置、颜色和库存会随实际销售情况变化，具体以到店查看为准。"
  }
] as const;

export const HOME_NEWS = [
  {
    title: "长兴买货车怎么选？新手购车流程说明",
    description: "从用车需求、车型推荐、费用口径和售后服务说明长兴买货车前的准备事项。",
    href: "/guides/huzhou-dongfeng-truck-selection",
    updatedAt: SITE.updatedAt
  },
  {
    title: "东风多利卡适合哪些运输场景？",
    description: "整理东风多利卡在城配物流、商超配送、个体经营和厢式货运中的常见咨询重点。",
    href: "/dongfeng-duolika",
    updatedAt: SITE.updatedAt
  },
  {
    title: "新能源电动货车适合城市配送吗？",
    description: "结合固定线路、充电条件、城市路权和政策变化，说明新能源货车咨询前应确认的问题。",
    href: "/guides/huzhou-4m2-truck-use-cases",
    updatedAt: SITE.updatedAt
  }
] as const;

export const VEHICLE_GROUPS = HOME_MODELS.map((model) => ({
  category: model.name,
  name: model.name,
  scenarios: model.scenario,
  body: model.sellingPoint,
  note: "车型价格、政策、金融、补贴、质保和参数不在官网写死，具体以门店实际咨询、厂家公告和当地政策为准。",
  image: model.image,
  alt: model.alt,
  href: model.href,
  id: model.id
}));

export const COMPANY_INFO_ITEMS = [
  { label: "公司名称", value: SITE.name },
  { label: "成立时间", value: "2016年9月7日" },
  { label: "服务地区", value: SITE.serviceAreaText },
  { label: "主营品牌", value: SITE.mainBrands.join("、") },
  { label: "主营服务", value: SITE.mainServices.join("、") },
  { label: "联系电话", value: SITE.contact.phone },
  { label: "门店地址", value: SITE.contact.address },
  { label: "公开资质说明", value: SITE.contact.qualification },
  { label: "更新时间", value: SITE.updatedAt }
] as const;
