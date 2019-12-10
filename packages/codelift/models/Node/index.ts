import { getRoot, IAnyModelType, Instance, types } from "mobx-state-tree";

import { ICSSRule } from "../CSSRule";
import { IApp } from "../App";

export interface INode extends Instance<typeof Node> {}

export const Node = types
  .model("Node", {
    childNodes: types.array(types.late((): IAnyModelType => Node)),
    isPreviewing: false,
    uuid: types.optional(types.identifierNumber, () => Math.random())
  })
  .volatile(self => ({
    element: document.createElement("null")
  }))
  .actions(self => ({
    setElement(element: HTMLElement) {
      self.element = element;

      self.childNodes.replace(createChildNodes(element));
    }
  }))
  .views(self => ({
    get debugSource() {
      if (!this.reactElement) {
        return undefined;
      }

      if (!this.reactElement._debugSource) {
        throw new Error(`Selected element is missing _debugSource property`);
      }

      return this.reactElement._debugSource;
    },

    get classNames() {
      return [...self.element.classList];
    },

    hasRule(rule: ICSSRule) {
      return this.classNames.includes(rule.className);
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
      for (const key in self.element) {
        if (key.startsWith("__reactInternalInstance$")) {
          // @ts-ignore
          return self.element[key];
        }
      }
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
