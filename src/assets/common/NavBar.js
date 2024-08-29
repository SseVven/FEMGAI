import ModelController from "./ModelControl";

const name_en = ["File", "Model", "Sketch", "Design", "Display", "Assembly", "Measure", "Facets", "Repair", "Prepare", "Workbench", "Detail", "Sheet_Metal", "Tools", "KeyShot"];
const name_zh = ["文件", "建模", "草图", "设计", "展示", "装配", "测量", "平面", "修复", "预处理", "工作台", "详细", "金属薄板", "工具", "渲染"];
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
                }
            ]
        }
    ],
    // 建模
    [
        {
            name: "模型",
            tools: [
                {
                    title: "立方体",
                    icon: ModelController.ModelIcon[0],
                    type: 1,
                },
                {
                    title: "圆柱体",
                    icon: ModelController.ModelIcon[1],
                    type: 1,
                },
                {
                    title: "圆锥",
                    icon: ModelController.ModelIcon[2],
                    type: 1,
                },
                {
                    title: "球体",
                    icon: ModelController.ModelIcon[3],
                    type: 1,
                },
                {
                    title: "导入",
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
                    icon: "icon-sketch",
                    type: 0,
                },
                {
                    title: "曲线",
                    icon: "icon-shuizhiquxian",
                    type: 1,
                },
                {
                    title: "直线",
                    icon: "icon-zhixian",
                    type: 1,
                },
                {
                    title: "矩形",
                    icon: "icon-huajuxing",
                    type: 1,
                },
                {
                    title: "弧线",
                    icon: "icon-quxian",
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
