import ModelController from "./ModelControl";

const name_en = ["File", "Model", "Analysis", "Design", "Display", "Assembly", "Measure", "Facets", "Repair", "Prepare", "Workbench", "Detail", "Sheet_Metal", "Tools", "KeyShot"];
const name_zh = ["文件", "建模", "静态分析", "设计", "展示", "装配", "测量", "平面", "修复", "预处理", "工作台", "详细", "金属薄板", "工具", "渲染"];
// 0: 大图标 1:中图标 2:小图标 
const toolModules = [
    // 文件
    [
        {
            name: "标准",
            tools: [
                {
                    title: "新建",
                    icon: "icon-newfile",
                    type: 0,
                },
                {
                    title: "打开",
                    icon: "icon-open",
                    type: 0,
                },
                {
                    title: "保存",
                    icon: "icon-Save",
                    type: 0,
                },
                {
                    title: "导出",
                    icon: "icon-daochumoxing",
                    type: 0,
                    sons: [
                        {
                            title: " .stl",
                            id: 0,
                        },
                        {
                            title: ".ply",
                            id: 1,
                        },
                    ],
                },
            ]
        }
    ],
    // 建模
    [
        {
            name: "模型",
            tools: [
                {
                    title: ModelController.ModelName[0],
                    icon: ModelController.ModelIcon[0],
                    type: 1,
                },
                {
                    title: ModelController.ModelName[1],
                    icon: ModelController.ModelIcon[1],
                    type: 1,
                },
                {
                    title: ModelController.ModelName[2],
                    icon: ModelController.ModelIcon[2],
                    type: 1,
                },
                {
                    title: ModelController.ModelName[3],
                    icon: ModelController.ModelIcon[3],
                    type: 1,
                },
                {
                    title: ModelController.ModelName[5],
                    icon: ModelController.ModelIcon[5],
                    type: 0,
                },
            ]
        },
        {
            name: "直接草图",
            tools: [
                {
                    title: "草图",
                    icon: ModelController.FileIcon[3],
                    type: 0,
                },
                {
                    title: ModelController.SketchName[0],
                    icon: ModelController.SketchIcon[0],
                    type: 1,

                },
                {
                    title: ModelController.SketchName[1],
                    icon: ModelController.SketchIcon[1],
                    type: 1,

                },
                {
                    title: ModelController.SketchName[2],
                    icon: ModelController.SketchIcon[2],
                    type: 1,

                },
                {
                    title: ModelController.SketchName[3],
                    icon: ModelController.SketchIcon[3],
                    type: 1,
                }
            ]
        },
        {
            name: "布尔运算",
            tools: [
                {
                    title: "布尔运算",
                    icon: "icon-bueryunsuan",
                    type: 0,
                },
                {
                    title: "交运算",
                    icon: "icon-bueryunsuan_AND",
                    type: 2,
                },
                {
                    title: "差运算",
                    icon: "icon-bueryunsuan_A-B",
                    type: 2,
                },
                {
                    title: "并运算",
                    icon: "icon-bueryunsuan_OR",
                    type: 2,
                },
            ]
        },
        {
            name: "特征",
            tools: [
                {
                    title: "移动",
                    icon: "icon-jianmo-pingyi",
                    type: 2,
                },
                {
                    title: "旋转",
                    icon: "icon-xuanzhuan",
                    type: 2,
                },
                {
                    title: "伸缩",
                    icon: "icon-50-scale",
                    type: 2,
                },
                {
                    title: "拉伸",
                    icon: "icon-lashenx",
                    type: 2,
                },
                {
                    title: "抽壳",
                    icon: "icon-a-3Dchouke",
                    type: 2,
                },
                {
                    title: "倒角",
                    icon: "icon-a-3Dyuanjiaodaojiao",
                    type: 2,
                },
                {
                    title: "回旋",
                    icon: "icon-huixuanjiaodu",
                    type: 2,
                },
                {
                    title: "扫略",
                    icon: "icon-90zhuanwanjiaodaiji",
                    type: 2,
                },
                {
                    title: "镜像",
                    icon: "icon-caozuojiemiantubiao---_jingxiang",
                    type: 2,
                },
            ]
        },
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
    [
        {

        }
    ],
]
const MenuBar = []
for (let i = 0; i < name_en.length; i++) {
    MenuBar.push({
        name_en: name_en[i],
        name_zh: name_zh[i],
        id: "nav-" + name_en[i] + "-tab",
        target: "#nav-" + name_en[i],
        controls: "nav-" + name_en[i],
        toolModules: toolModules[i],
    })
}

export default MenuBar;
