// map a path to a view ... that's all it needs to do

type Path = "/" | "/member" | `/member/${string}` | "/staff";

const createView = (path: string): HTMLElement => {
  const view = document.createElement("p");
  view.textContent = path;
  return view;
};

type RouteConfig = {
  match: (path: string) => boolean;
  matchExact: (path: string) => boolean;
  view: (path: string) => HTMLElement;
  children: RouteConfig[];
};

const routeTree: RouteConfig = {
  match: (path: string) => path.startsWith("/"),
  matchExact: (path: string) => path === "/",
  view: createView,
  children: [
    {
      match: (path: string) => path.startsWith("/member"),
      matchExact: (path: string) => path === "/member",
      view: createView,
      children: [
        {
          match: (path: string) => {
            const regex = new RegExp("/member/[a-z]+");
            const match = regex.test(path);
            return match;
          },
          matchExact: (path: string) => path === "/member",
          view: createView,
          children: [],
        },
      ],
    },
    {
      match: (path: string) => path.startsWith("/staff"),
      matchExact: (path: string) => path === "/staff",
      view: createView,
      children: [],
    },
  ],
};

const content = document.getElementById("content");
if (content === null) throw new Error("content is null");

const createLink = (path: Path): HTMLLIElement => {
  const a = document.createElement("a");
  a.textContent = path;
  a.href = path;

  const li = document.createElement("li");
  li.appendChild(a);

  return li;
};

const ul = document.createElement("ul");
ul.append(
  ...[
    createLink("/"),
    createLink("/member"),
    createLink("/member/abc"),
    createLink("/staff"),
  ]
);

content.appendChild(ul);

const getView = (config: RouteConfig, path: string): RouteConfig | false => {
  if (config.matchExact(path)) return config;

  for (const child of config.children) {
    if (child.match(path)) return getView(child, path);
  }

  return false;
};

const init = (path: string, container: HTMLElement): true => {
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
