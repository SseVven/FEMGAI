
const picker = [
    {
        name: "体拾取",
        icon: "icon-component-full",
    },
    {
        name: "点拾取",
        icon: "icon-dian",
    },
    {
        name: "线拾取",
        icon: "icon-xian",
    },
    {
        name: "面拾取",
        icon: "icon-mian",
    },
];

const view = [
    {
        name: "正视图",
        icon: "icon-zhengshitu",
    },
    {
        name: "左视图",
        icon: "icon-shituzuoshitu",
    },
    {
        name: "俯视图",
        icon: "icon-shangshitu",
    },
    {
        name: "后视图",
        icon: "icon-shituhoushitu",
    },
    {
        name: "右视图",
        icon: "icon-shituyoushitu",
    },
    {
        name: "仰视图",
        icon: "icon-xiashitu",
    },
];

for (let i = 0; i < picker.length; i++) {
    picker[i].toolId = i;
}
for (let i = 0; i < view.length; i++) {
    view[i].toolId = i + picker.length;
}

export { picker, view };





