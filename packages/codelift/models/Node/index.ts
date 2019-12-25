import { getRoot, IAnyModelType, Instance, types } from "mobx-state-tree";

import { ICSSRule } from "../CSSRule";
import { IApp } from "../App";

export interface INode extends Instance<typeof Node> {}

export const getReactInstance = (element: HTMLElement) => {
  for (const key in element) {
    if (key.startsWith("__reactInternalInstance$")) {
      // @ts-ignore No index signature with a parameter of type 'string' was found on type 'HTMLElement'.ts(7053)
      return element[key];
    }
  }
};

export const Node = types
  .model("Node", {
    classNames: types.array(types.string),
    childNodes: types.array(types.late((): IAnyModelType => Node)),
    isPreviewing: false,
    uuid: types.optional(types.identifierNumber, () => Math.random())
  })
  .volatile(self => ({
    element: document.createElement("null")
  }))
  .views(self => ({
    get componentName() {
      if (!this.reactElement) {
        return undefined;
      }

      return this.reactElement.return.type.name;
    },

    get debugSource() {
      if (!this.reactElement) {
        return undefined;
      }

      if (!this.reactElement._debugSource) {
        throw new Error(`Selected element is missing _debugSource property`);
      }

      return this.reactElement._debugSource;
    },

    hasRule(rule: ICSSRule) {
      return self.classNames.includes(rule.className);
    },

    get id() {
      return self.element.getAttribute("id");
    },

    get isSelected(): boolean {
      return this.store.selected === self;
    },

    get isTargeted(): boolean {
      return this.store.target === self;
    },

    get reactElement() {
      return getReactInstance(self.element);
    },

    get selector() {
      let element: HTMLElement | null = self.element;

      const selectors = [];

      while (element) {
        const nthChild = element.parentNode
          ? [...element.parentNode.childNodes]
              .filter(node => node.nodeType === 1)
              .indexOf(element) + 1
          : null;
        const { id, tagName } = element;

        selectors.unshift(
          [
            tagName.toLowerCase(),
            id && `#${element.id}`,
            !id && nthChild && `:nth-child(${nthChild})`
          ]
            .filter(Boolean)
            .join("")
        );

        element = element.parentElement;
      }

      return selectors.join(" > ");
    },

    get store(): IApp {
      return getRoot(self);
    },

    get tagName() {
      return self.element.tagName.toLowerCase();
    }
  }))
  .actions(self => ({
    applyRule(rule: ICSSRule) {
      if (self.element) {
        if (self.hasRule(rule)) {
          self.element.classList.remove(rule.className);
        } else {
          self.element.classList.add(rule.className);
        }

        self.classNames.replace([...self.element.classList]);
      }
    },

    cancelRule(rule: ICSSRule) {
      if (self.element) {
        self.element.className = self.classNames.join(" ");
      }

      self.isPreviewing = false;
    },

    previewRule(rule: ICSSRule) {
      if (self.element) {
        if (self.hasRule(rule)) {
          self.element.classList.remove(rule.className);
        } else {
          self.element.classList.add(rule.className);
        }

        self.isPreviewing = true;
      }
    },

    setElement(element: HTMLElement) {
      self.element = element;

      self.childNodes.replace(createChildNodes(element));
      self.classNames.replace([...element.classList]);
    }
  }));

export const createNode = (element: HTMLElement) => {
  const node = Node.create();
  node.setElement(element);

  return node;
};

export const createChildNodes = (element: HTMLElement) => {
  const children = [...element.children] as HTMLElement[];

  return children.map((child: HTMLElement) => createNode(child));
};

export const flattenNodes = (nodes: INode[]) => {
  return nodes.reduce((acc, node) => {
    acc.push(node);
    acc.push(...flattenNodes(node.childNodes));

    return acc;
  }, [] as INode[]);
};
