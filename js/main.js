"use strict";
// map a path to a view ... that's all it needs to do
const createView = (path) => {
    const view = document.createElement("p");
    view.textContent = path;
    return view;
};
const routeTree = {
    match: (path) => path.startsWith("/"),
    matchExact: (path) => path === "/",
    view: createView,
    children: [
        {
            match: (path) => path.startsWith("/member"),
            matchExact: (path) => path === "/member",
            view: createView,
            children: [
                {
                    match: (path) => {
                        const regex = new RegExp("/member/[a-z]+");
                        const match = regex.test(path);
                        return match;
                    },
                    matchExact: (path) => path === "/member",
                    view: createView,
                    children: [],
                },
            ],
        },
        {
            match: (path) => path.startsWith("/staff"),
            matchExact: (path) => path === "/staff",
            view: createView,
            children: [],
        },
    ],
};
const content = document.getElementById("content");
if (content === null)
    throw new Error("content is null");
const createLink = (path) => {
    const a = document.createElement("a");
    a.textContent = path;
    a.href = path;
    const li = document.createElement("li");
    li.appendChild(a);
    return li;
};
const ul = document.createElement("ul");
ul.append(...[
    createLink("/"),
    createLink("/member"),
    createLink("/member/abc"),
    createLink("/staff"),
]);
content.appendChild(ul);
const getView = (config, path) => {
    if (config.matchExact(path))
        return config;
    for (const child of config.children) {
        if (child.match(path))
            return getView(child, path);
    }
    return false;
};
const init = (path, container) => {
    console.log(path);
    const notFound = document.createElement("p");
    notFound.textContent = `${path} Not Found`;
    const view = getView(routeTree, path);
    if (view === false) {
        container.replaceChildren(notFound);
        return true;
    }
    container.replaceChildren(view.view(path));
    return true;
};
const viewContainer = document.createElement("div");
content.appendChild(viewContainer);
init(window.location.pathname, viewContainer);
//# sourceMappingURL=main.js.map