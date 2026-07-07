export type DolicaModel = {
  id: string;
  series: string;
  name: string;
  cabSize: "常规车头" | "中型车头" | "大型车头";
  cabCode?: "M" | "L";
  engine: string;
  horsepower: string;
  gearbox: string;
  cargoSize: string;
  keyConfig: string[];
  colors: string[];
  suggestedUse: string[];
  sellingPoint: string;
  note: string;
};

export const dongfengDolicaModels: DolicaModel[] = [
  {
    id: "dolica-d5-q23d-142",
    series: "东风多利卡系列",
    name: "东风多利卡 D5",
    cabSize: "常规车头",
    engine: "Q23D-142",
    horsepower: "约142马力",
    gearbox: "万里扬 5 档",
    cargoSize: "约 3800×1900×400 mm",
    keyConfig: ["全柴 142 马力", "170 等宽车架", "空调", "电窗", "中控", "650R16 轮胎"],
    colors: ["悦动红", "温莎白"],
    suggestedUse: ["城市配送", "乡镇配送", "个体商户短途运输"],
    sellingPoint: "车身相对灵活，适合城市和乡镇短途配送。",
    note: "具体尺寸、颜色、配置和库存以到店实车及厂家公告为准。"
  },
  {
    id: "dolica-d6-m-q23d-142",
    series: "东风多利卡系列",
    name: "东风多利卡 D6-M",
    cabSize: "中型车头",
    cabCode: "M",
    engine: "Q23D-142",
    horsepower: "约142马力",
    gearbox: "万里扬 5 档",
    cargoSize: "约 4200×2100×400 mm",
    keyConfig: ["全柴 142 马力", "170 等宽车架", "空调", "电窗", "中控", "多功能方向盘", "定速巡航"],
    colors: ["悦动红", "炫目蓝"],
    suggestedUse: ["城配运输", "建材五金配送", "中短途货运"],
    sellingPoint: "M 代表中型车头，相比 D5 更适合需要更大货箱空间的用户。",
    note: "具体尺寸、颜色、配置和库存以到店实车及厂家公告为准。"
  },
  {
    id: "dolica-k6-m-yn25-155",
    series: "东风多利卡系列",
    name: "东风多利卡 K6-M 155马力",
    cabSize: "中型车头",
    cabCode: "M",
    engine: "YN25-155",
    horsepower: "约155马力",
    gearbox: "万里扬 6 档",
    cargoSize: "约 4200×2100×550 mm",
    keyConfig: ["云内 155 马力", "万里扬 6 档", "170 等宽车架", "空调", "电窗", "中控", "200L 油箱", "多功能方向盘", "定速巡航"],
    colors: ["悦动红", "星光银"],
    suggestedUse: ["中短途配送", "日用百货运输", "农副产品运输"],
    sellingPoint: "适合希望兼顾动力、货箱空间和日常舒适配置的用户。",
    note: "具体尺寸、颜色、配置和库存以到店实车及厂家公告为准。"
  },
  {
    id: "dolica-k6-m-zd25-170",
    series: "东风多利卡系列",
    name: "东风多利卡 K6-M 170马力",
    cabSize: "中型车头",
    cabCode: "M",
    engine: "ZD25-170",
    horsepower: "约170马力",
    gearbox: "以到店实车配置为准",
    cargoSize: "约 4200×2100×550 mm",
    keyConfig: ["ZD25 170 马力", "中型车头", "空调", "电窗", "中控", "倒车影像或倒车雷达", "蓝牙电话", "多功能方向盘"],
    colors: ["悦动红", "星光银等，具体以到店咨询为准"],
    suggestedUse: ["城配运输", "中短途货运", "对动力要求较高的用户"],
    sellingPoint: "动力配置更高，适合对载货能力和日常使用舒适性有更高要求的用户。",
    note: "库存颜色、优惠政策和具体配置变化较快，请以到店实车和双方确认信息为准。"
  },
  {
    id: "dolica-wangzhe-k6-m-zd25-170",
    series: "东风多利卡王者归来系列",
    name: "东风多利卡王者归来 K6-M",
    cabSize: "中型车头",
    cabCode: "M",
    engine: "ZD25-170",
    horsepower: "约170马力",
    gearbox: "万里扬 6 档",
    cargoSize: "约 4200×2100×550 mm",
    keyConfig: ["ZD25 170 马力", "原厂倒车影像", "蓝牙 / CarPlay / 语音互联", "液晶仪表", "反光镜电动调节加热", "主驾气囊减震座椅", "200L 油箱", "后桥速比约 4.33"],
    colors: ["悦动红"],
    suggestedUse: ["高配置城配", "中短途货运", "关注配置和购车预算的用户"],
    sellingPoint: "东风多利卡王者归来系列属于东风多利卡中的高配置、价格实惠车型方向，配置丰富，适合关注实用配置和购车预算的用户。",
    note: "东风多利卡王者归来系列具体配置、价格、颜色、库存和交付条件，请以到店实车、厂家公告和双方确认信息为准。"
  },
  {
    id: "dolica-k6-l-yn25-155",
    series: "东风多利卡系列",
    name: "东风多利卡 K6-L 155马力",
    cabSize: "大型车头",
    cabCode: "L",
    engine: "YN25-155",
    horsepower: "约155马力",
    gearbox: "万里扬 8 档或同级配置，以实车为准",
    cargoSize: "约 4200×2100×550 mm",
    keyConfig: ["云内 155 马力", "大型车头", "空调", "电窗", "中控", "定速巡航", "120L 油箱", "气囊座椅"],
    colors: ["悦动红"],
    suggestedUse: ["中短途货运", "需要更大驾驶室空间的用户", "长时间驾驶场景"],
    sellingPoint: "L 代表大型车头，适合关注驾驶室空间和驾驶舒适性的用户。",
    note: "具体尺寸、颜色、配置和库存以到店实车及厂家公告为准。"
  },
  {
    id: "dolica-k6-l-zd25-163",
    series: "东风多利卡系列",
    name: "东风多利卡 K6-L 163马力",
    cabSize: "大型车头",
    cabCode: "L",
    engine: "ZD25-163",
    horsepower: "约163马力",
    gearbox: "6 档变速箱",
    cargoSize: "约 4200×2100×550 mm",
    keyConfig: ["ZD25 163 马力", "大型车头", "法士特变速箱相关配置以实车为准", "空调", "电窗", "中控", "USB 充电接口", "气囊座椅"],
    colors: ["悦动红", "炫目蓝", "星光银"],
    suggestedUse: ["中短途运输", "城市及县域配送", "对驾驶室空间有要求的用户"],
    sellingPoint: "兼顾动力和大驾驶室空间，适合中短途运输用户咨询。",
    note: "具体尺寸、颜色、配置和库存以到店实车及厂家公告为准。"
  },
  {
    id: "dolica-k6-l-zd25-170",
    series: "东风多利卡系列",
    name: "东风多利卡 K6-L 170马力",
    cabSize: "大型车头",
    cabCode: "L",
    engine: "ZD25-170",
    horsepower: "约170马力",
    gearbox: "8 档变速箱",
    cargoSize: "约 4200×2100×550 mm",
    keyConfig: ["ZD25 170 马力", "大型车头", "8 档变速箱", "120L 铝合金油箱", "气囊座椅", "倒车雷达", "蓝牙接听电话", "USB 充电接口"],
    colors: ["星光银", "悦动红"],
    suggestedUse: ["中短途货运", "城配运输", "对动力和驾驶舒适性要求较高的用户"],
    sellingPoint: "动力和配置更丰富，适合关注承载能力、舒适性和中短途运输效率的用户。",
    note: "具体尺寸、颜色、配置和库存以到店实车及厂家公告为准。"
  },
  {
    id: "dolica-k6-l-d25-180",
    series: "东风多利卡系列",
    name: "东风多利卡 K6-L 180马力",
    cabSize: "大型车头",
    cabCode: "L",
    engine: "D2.5-180",
    horsepower: "约180马力",
    gearbox: "法士特 8 档或同级配置，以实车为准",
    cargoSize: "约 4200×2100×550 mm",
    keyConfig: ["约180马力", "大型车头", "8 档变速箱", "120L 油箱", "主驾气囊减震座椅", "多功能方向盘", "倒车雷达", "蓝牙 MP3", "全包内饰"],
    colors: ["悦动红"],
    suggestedUse: ["动力需求较高的中短途货运", "城配重载场景", "商户配送"],
    sellingPoint: "马力更高，适合对动力储备和中短途运输效率有更高要求的用户。",
    note: "具体尺寸、颜色、配置和库存以到店实车及厂家公告为准。"
  }
];

export const dolicaConfigNotice =
  "本页车型配置根据门店常见咨询车型整理，具体车型名称、公告型号、发动机、变速箱、车厢尺寸、颜色、价格、库存及交付条件，请以厂家公告、车辆合格证、到店实车和双方确认信息为准。";
