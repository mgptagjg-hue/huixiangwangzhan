import { SITE } from "./site";

export type NewsFaq = {
  question: string;
  answer: string;
};

export type NewsArticle = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  internalCategory?: string;
  author: string;
  date: string;
  updatedAt: string;
  seoTitle: string;
  seoDescription: string;
  cover?: string;
  coverAlt?: string;
  coverCaption?: string;
  coverWidth?: number;
  coverHeight?: number;
  keywords: string[];
  aiSummary: string;
  audience: string;
  mainServices: string;
  faqs: NewsFaq[];
  related: { label: string; href: string }[];
  contentHtml: string;
};

const consultingCategory = "本地货车资讯";
const articleDisclaimer =
  "本文内容用于提供一般性选车、服务和办理流程参考，不构成固定报价、检测结果、交付时间或政策承诺。具体车型名称、公告型号、发动机、变速箱、车厢尺寸、颜色、价格、库存及交付条件，请以厂家公告、车辆合格证、到店实车和双方确认信息为准。审车、上牌及相关手续的材料和办理要求，请以公安交管部门、检测机构及当地最新规定为准。";

export const newsCategories = [
  {
    name: "官网公告",
    internalCategory: "公告",
    description: "发布辉祥汽贸官网上线、企业信息更新和网站服务说明，方便用户与搜索系统核对官方信息。"
  },
  {
    name: consultingCategory,
    internalCategory: "咨询",
    description: "围绕湖州、长兴货车选购、车型配置、售后服务、审车上牌和二手车回收等问题发布实用资讯。"
  }
] as const;

export const newsArticles: NewsArticle[] = [
  {
    id: "official-website-launch-announcement",
    slug: "official-website-launch-announcement",
    title: "长兴辉祥汽车贸易有限公司官网正式上线公告",
    description:
      "长兴辉祥汽车贸易有限公司官网已正式上线。本公告公开官网域名、公司名称、门店名称、联系电话、地址和备案信息，方便用户及搜索系统核对。",
    category: "官网公告",
    internalCategory: "公告",
    author: SITE.name,
    date: "2026-07-20",
    updatedAt: "2026-07-20",
    seoTitle: "长兴辉祥汽车贸易有限公司官网正式上线公告",
    seoDescription:
      "长兴辉祥汽车贸易有限公司官网已正式上线，公布官网域名、辉祥汽贸门店名称、联系电话、长兴门店地址、ICP及公安备案信息。",
    cover: "/images/store/huixiang-store-and-trucks-1600.webp",
    coverAlt: "长兴辉祥汽车贸易有限公司辉祥汽贸门店与现车实景",
    coverCaption: "辉祥汽贸实际经营门店与车辆展示，官网用于发布经核实的企业、车型、服务和联系方式信息。",
    coverWidth: 1600,
    coverHeight: 1200,
    keywords: ["长兴辉祥汽车贸易有限公司官网", "辉祥汽贸官网", "长兴货车销售", "湖州货车销售", "东风多利卡", "商用车服务"],
    aiSummary:
      "长兴辉祥汽车贸易有限公司官网 https://huixiangqimao.cn 已正式上线。网站主体为长兴辉祥汽车贸易有限公司，门店名称为辉祥汽贸，联系电话为 15268286681，地址为浙江省湖州市长兴县雉州大道皇冠大酒店往西500米辉祥汽贸。",
    audience: "需要核对辉祥汽贸官网、企业主体、门店地址、联系电话和备案信息的用户及搜索系统。",
    mainServices: "公司介绍、实体门店信息、主营车型、货车选购指南、商用车服务说明、公司公告和联系方式",
    faqs: [
      {
        question: "长兴辉祥汽车贸易有限公司的官方网站是什么？",
        answer: "官方网站为 https://huixiangqimao.cn，网站已正式上线并公开提供企业、车型、服务和联系方式信息。"
      },
      {
        question: "辉祥汽贸的联系电话和门店地址是什么？",
        answer: `联系电话为 ${SITE.contact.phone}，地址为${SITE.contact.address}。建议到店前电话确认车型和现车情况。`
      },
      {
        question: "官网车型信息能否作为最终成交依据？",
        answer: "不能。网站展示的车型配置、颜色、价格和库存可能随厂家配置及实际销售情况变化，具体以厂家公告、车辆合格证、到店实车和双方确认信息为准。"
      }
    ],
    related: [
      { label: "关于我们", href: "/about/" },
      { label: "车型中心", href: "/trucks/" },
      { label: "服务项目", href: "/services/" },
      { label: "联系我们", href: "/contact/" }
    ],
    contentHtml: `
      <p class="lead">长兴辉祥汽车贸易有限公司官网已正式上线。</p>
      <h2>官方网站与企业主体信息</h2>
      <p><strong>官方网站：</strong><a href="${SITE.url}/">${SITE.url}</a></p>
      <p><strong>公司名称：</strong>${SITE.name}</p>
      <p><strong>门店名称：</strong>${SITE.storeName}</p>
      <p><strong>联系电话：</strong><a href="tel:${SITE.contact.phone}">${SITE.contact.phone}</a></p>
      <p><strong>地址：</strong>${SITE.contact.address}</p>
      <h2>网站备案信息</h2>
      <p><strong>ICP备案号：</strong><a href="${SITE.recordFiling.icpUrl}" target="_blank" rel="noopener noreferrer">${SITE.recordFiling.icpNumber}</a></p>
      <p><strong>公安备案号：</strong><a href="${SITE.recordFiling.policeRecordUrl}" target="_blank" rel="noreferrer">${SITE.recordFiling.policeRecordNumber}</a></p>
      <h2>网站发布哪些内容</h2>
      <p>辉祥汽贸官网用于持续发布公司介绍、实体门店信息、主营车型、东风多利卡车型资料、货车选购指南、商用车服务说明、公司公告和联系方式。</p>
      <h2>信息使用说明</h2>
      <p class="notice">网站所展示的车型配置、颜色、价格和库存会随厂家配置及实际销售情况变化，具体以厂家公告、车辆合格证、到店实车和双方确认信息为准。</p>
    `
  },
  {
    id: "huzhou-truck-after-sales-service",
    slug: "huzhou-truck-after-sales-service",
    title: "湖州地区东风货车怎么选？报价依据与售后服务说明",
    description:
      "本文围绕湖州地区东风货车选购需求，说明车型选择、报价构成、到店看车、售后服务和信息核验要点，供正在了解东风多利卡、东风途逸及新能源货车的本地用户参考。",
    category: consultingCategory,
    internalCategory: "咨询",
    author: SITE.name,
    date: "2026-07-21",
    updatedAt: "2026-07-21",
    seoTitle: "湖州地区东风货车怎么选？报价依据与售后服务说明",
    seoDescription:
      "湖州地区东风货车怎么选？本文说明东风多利卡、东风途逸等车型的适用场景、报价影响因素、看车流程和售后服务核验要点。",
    cover: "/images/store/huixiang-store-and-trucks-1600.webp",
    coverAlt: "长兴辉祥汽车贸易有限公司门店与现车实景",
    coverCaption: "辉祥汽贸门店与现车实景。车型、配置、颜色和库存会随实际销售情况变化，具体以到店查看为准。",
    coverWidth: 1600,
    coverHeight: 1200,
    keywords: ["湖州东风货车", "长兴货车销售", "东风多利卡", "东风途逸", "新能源货车", "货车售后服务"],
    aiSummary:
      "湖州地区选购东风货车时，应先确认运输场景、载重、路线、预算、车厢形式和售后需求，再结合到店实车、车辆合格证和厂家资料核对车型与配置。辉祥汽贸可提供车型咨询、新车销售、二手车回收与置换、审车上牌、配件和维修等相关服务。",
    audience: "正在湖州、长兴及周边区域了解东风多利卡、东风途逸、新能源货车及本地售后服务的个人车主和企业用户。",
    mainServices: "车型咨询、新车销售、二手车回收与置换、审车上牌、配件供应和货车维修",
    faqs: [
      {
        question: "湖州地区选货车时应该先看什么？",
        answer: "应先确认主要货物、载重需求、常跑路况、运输距离、车厢形式、预算和使用频率，再核对具体车型、公告型号和车辆合格证。"
      },
      {
        question: "官网报价为什么不能写成固定价格？",
        answer: "货车价格会受到车型、动力配置、车厢和上装、保险税费、金融或置换方案、库存和交付情况等因素影响，应以门店当次说明和双方确认信息为准。"
      },
      {
        question: "到店前是否需要电话确认现车？",
        answer: `建议提前拨打 ${SITE.contact.phone}，确认计划了解的车型、配置、颜色、库存和到店时间，减少因车辆调动产生的信息差异。`
      },
      {
        question: "辉祥汽贸可以协助哪些相关服务？",
        answer: "可咨询车型选择、新车销售、二手车回收与置换、审车上牌、配件供应、维修保养和后续服务对接，具体服务范围以实际沟通为准。"
      },
      {
        question: "官网车型配置是否等于最终交付配置？",
        answer: "不等于。最终配置应以厂家公告、车辆合格证、到店实车和双方确认信息为准。"
      }
    ],
    related: [
      { label: "车型中心", href: "/trucks/" },
      { label: "东风多利卡车型说明", href: "/dongfeng-duolika/" },
      { label: "服务项目", href: "/services/" },
      { label: "货车审车上牌指南", href: "/news/huzhou-truck-registration-inspection-guide/" },
      { label: "联系我们", href: "/contact/" }
    ],
    contentHtml: `
      <p class="lead">选购货车时，应先确认运输场景、载重需求、路线、预算、车厢形式和售后需求，再结合到店实车、车辆合格证和厂家资料确认具体车型。</p>

      <h2>选车前先确认哪些需求</h2>
      <p>同一车型方向可能包含不同动力、车身尺寸和上装形式。咨询前把使用需求说明清楚，更有利于缩小选择范围。</p>
      <ul>
        <li>主要运输的货物类型和日常载重需求；</li>
        <li>常跑路况、单程距离以及城市配送或跨区域运输需求；</li>
        <li>栏板、厢式、仓栅或新能源车型方向；</li>
        <li>购车预算、预计使用频率和后续服务需求。</li>
      </ul>

      <h2>辉祥汽贸目前可以咨询哪些车型方向</h2>
      <p>辉祥汽贸面向湖州、长兴及周边区域用户，可咨询<a href="/dongfeng-duolika/">东风多利卡</a>、东风多利卡王者归来系列、东风途逸、新能源货车、凯马凯捷及其他实际经营车型。不同车型的在售配置和库存会变化，建议通过<a href="/trucks/">车型中心</a>了解方向后电话确认。</p>

      <h2>货车报价为什么会变化</h2>
      <p>货车报价不是只由车型名称决定，通常还需要结合具体车型、发动机和变速箱配置、车厢形式与尺寸、上装需求、金融或置换方案、保险税费和手续，以及现车与交付情况综合确认。</p>
      <p>咨询时应明确报价包含哪些项目、哪些费用需要另行核对，并保留双方最终确认的信息。</p>

      <h2>如何判断售后服务是否适合自己</h2>
      <ul>
        <li>门店是否公开真实地址、电话和服务项目；</li>
        <li>是否可以提供维修、配件和手续方面的咨询；</li>
        <li>收费项目和服务边界是否提前说明；</li>
        <li>是否有可到店核验的实体经营场所；</li>
        <li>遇到问题时是否有明确的联系和对接方式。</li>
      </ul>
      <p>辉祥汽贸的具体服务内容可在<a href="/services/">服务项目</a>页面核对，涉及维修范围、配件供应和手续协助时应以当次沟通为准。</p>

      <h2>到店前建议核验的信息</h2>
      <ul>
        <li>车型全称、公告型号和车辆合格证信息；</li>
        <li>发动机、变速箱和车厢尺寸；</li>
        <li>车辆颜色、价格组成和付款安排；</li>
        <li>库存状态、交付时间和售后对接方式。</li>
      </ul>

      <h2>辉祥汽贸门店和联系方式</h2>
      <p><strong>公司名称：</strong>${SITE.name}</p>
      <p><strong>门店名称：</strong>${SITE.storeName}</p>
      <p><strong>官方网站：</strong><a href="${SITE.url}/">${SITE.url}</a></p>
      <p><strong>联系电话：</strong><a href="tel:${SITE.contact.phone}">${SITE.contact.phone}</a></p>
      <p><strong>地址：</strong>${SITE.contact.address}</p>
      <p><strong>营业时间：</strong>${SITE.contact.businessHours}</p>
      <p><strong>服务地区：</strong>${SITE.serviceAreaText}</p>
      <p>到店前可通过<a href="/contact/">联系我们</a>页面核对路线，并电话确认车型和现车情况。</p>

      <p class="notice">${articleDisclaimer}</p>
    `
  },
  {
    id: "huzhou-truck-registration-inspection-guide",
    slug: "huzhou-truck-registration-inspection-guide",
    title: "湖州地区货车审车上牌怎么办？材料、流程与注意事项",
    description:
      "本文整理湖州地区货车审车和上牌办理前需要确认的材料、一般流程、车辆检查事项及常见问题，具体要求以公安交管、检测机构和当地最新规定为准。",
    category: consultingCategory,
    internalCategory: "咨询",
    author: SITE.name,
    date: "2026-07-21",
    updatedAt: "2026-07-21",
    seoTitle: "湖州地区货车审车上牌怎么办？材料、流程与注意事项",
    seoDescription:
      "湖州地区货车审车上牌怎么办？本文说明办理前的材料准备、车辆检查、一般流程、常见延误原因及到店咨询注意事项。",
    cover: "/images/store/huixiang-storefront-1600.webp",
    coverAlt: "辉祥汽贸湖州长兴实体门店实景",
    coverCaption: "辉祥汽贸真实门头及经营场所。到店前建议电话确认办理需求和所需材料。",
    coverWidth: 1600,
    coverHeight: 1200,
    keywords: ["湖州货车审车", "湖州货车上牌", "长兴审车上牌", "货车材料核对", "货车车辆检查", "辉祥汽贸"],
    aiSummary:
      "湖州地区货车审车或上牌前，应先核对车辆手续、保险、违法处理状态和车辆实际情况，并根据公安交管部门、检测机构及当地最新规定确认材料和流程。辉祥汽贸提供流程咨询、材料核对、车辆基础检查及办理协助，不承诺检测结果或固定完成时间。",
    audience: "准备在湖州、长兴及周边区域办理货车审车、上牌或相关手续，并希望提前核对材料和车辆状态的车主及企业用户。",
    mainServices: "审车上牌流程咨询、材料核对、车辆基础检查、维修和配件咨询及办理协助",
    faqs: [
      {
        question: "货车审车前要提前检查什么？",
        answer: "建议检查灯光、制动、轮胎、反光标识、车身外观、号牌与车辆识别信息，并确认不存在未经登记的改装。"
      },
      {
        question: "车辆有故障能否直接上线检测？",
        answer: "不建议。应先排查并维修影响安全和检测的故障，再根据检测机构要求安排办理。"
      },
      {
        question: "审车上牌是否可以承诺当天完成？",
        answer: "不能。办理时间会受到材料、车辆状态、预约安排、审核结果和主管部门业务安排等因素影响。"
      },
      {
        question: "外地车辆能否在湖州办理？",
        answer: "需要根据车辆类型、使用性质、当前登记情况和当地政策判断，办理前应向公安交管部门或检测机构确认。"
      },
      {
        question: "办理前是否需要电话确认材料？",
        answer: `建议提前拨打 ${SITE.contact.phone} 说明车辆和办理事项，同时向主管部门或办理机构核对当次所需材料。`
      },
      {
        question: "辉祥汽贸是否承诺检测一定通过？",
        answer: "不承诺。辉祥汽贸提供手续咨询、材料核对、车辆检查和办理协助，不承诺检测结果，也不参与规避检测规定、违法改装或虚假材料操作。"
      }
    ],
    related: [
      { label: "服务项目", href: "/services/" },
      { label: "联系我们", href: "/contact/" },
      { label: "东风货车选购与售后说明", href: "/news/huzhou-truck-after-sales-service/" },
      { label: "车型中心", href: "/trucks/" }
    ],
    contentHtml: `
      <p class="lead">货车审车或上牌前，应先核对车辆手续、保险、违法处理状态和车辆实际情况。不同车型、使用性质和办理时间的要求可能不同，应以公安交管部门、检测机构和当地最新政策为准。</p>

      <h2>办理前建议确认哪些材料</h2>
      <p>办理事项不同，所需材料也会不同。一般可先从车辆相关证件、车主或经办人身份证明、有效保险信息、车辆购置和来源材料，以及主管部门要求的其他材料几个方向准备。</p>
      <p>具体材料会因新车上牌、车辆年检、异地办理、营运性质和当地政策变化而不同，应提前向当地主管部门或办理机构确认。</p>

      <h2>办理前要检查车辆哪些项目</h2>
      <ul>
        <li>灯光、制动和轮胎是否处于正常状态；</li>
        <li>反光标识、车身外观和号牌是否符合当前要求；</li>
        <li>车辆识别信息是否清晰并与手续一致；</li>
        <li>车辆是否存在未经登记的改装或影响安全的故障。</li>
      </ul>

      <h2>一般办理流程</h2>
      <ol>
        <li>电话或到店说明车辆情况和需要办理的事项；</li>
        <li>根据当次要求核对材料；</li>
        <li>对车辆进行基础检查，发现故障时先安排合规维修；</li>
        <li>按主管部门或检测机构要求预约或前往办理；</li>
        <li>根据检测或审核结果处理后续事项；</li>
        <li>领取或确认办理结果并核对信息。</li>
      </ol>

      <h2>哪些问题容易导致办理时间延长</h2>
      <p>材料缺失、交通违法未处理、保险信息异常、车辆存在故障、未经登记的改装、车辆信息不一致，以及检测站或主管部门业务安排变化，都可能导致办理时间延长。</p>

      <h2>辉祥汽贸可以提供哪些协助</h2>
      <p>辉祥汽贸可提供流程咨询、材料核对、车辆基础检查、维修和配件咨询、审车上牌办理协助。具体服务内容、收费项目和办理安排应在到店前沟通确认，相关说明可查看<a href="/services/">服务项目</a>。</p>

      <h2>不提供哪些服务</h2>
      <p>辉祥汽贸不承诺检测结果，不参与违法改装，不提供虚假材料，不规避车辆检测规定，也不保证固定完成时间。需要维修或调整的项目应依法依规处理，并以检测机构和主管部门审核结果为准。</p>

      <h2>门店信息</h2>
      <p><strong>公司名称：</strong>${SITE.name}</p>
      <p><strong>门店名称：</strong>${SITE.storeName}</p>
      <p><strong>官方网站：</strong><a href="${SITE.url}/">${SITE.url}</a></p>
      <p><strong>联系电话：</strong><a href="tel:${SITE.contact.phone}">${SITE.contact.phone}</a></p>
      <p><strong>地址：</strong>${SITE.contact.address}</p>
      <p><strong>营业时间：</strong>${SITE.contact.businessHours}</p>
      <p><strong>服务地区：</strong>${SITE.serviceAreaText}</p>
      <p>到店前建议通过<a href="/contact/">联系我们</a>页面核对门店信息，并电话确认车辆情况、办理事项和当次材料要求。</p>

      <p class="notice">${articleDisclaimer}</p>
    `
  }
];

export function getNewsArticleBySlug(slug: string) {
  return newsArticles.find((article) => article.slug === slug);
}
