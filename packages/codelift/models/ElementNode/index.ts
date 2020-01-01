import { getRoot, IAnyModelType, Instance, types } from "mobx-state-tree";

import { ICSSRule } from "../CSSRule";
import { IApp } from "../App";

export interface IElementNode extends Instance<typeof ElementNode> {}

export const getReactInstance = (element: HTMLElement) => {
  if ("_reactRootContainer" in element) {
    // @ts-ignore Property '_reactRootContainer' does not exist on type 'never'.ts(2339)
    return element._reactRootContainer._internalRoot.current.child;
  }

  for (const key in element) {
    if (key.startsWith("__reactInternalInstance$")) {
      // @ts-ignore No index signature with a parameter of type 'string' was found on type 'HTMLElement'.ts(7053)
      return element[key];
    }
  }
};

// To preview the node, we have to mutate `element.classList`.
// We track `element.classList` as `classNames` initially, so
// that `classList.add|remove` can be used to preview rules.
export const ElementNode = types
  .model("ElementNode", {
    classNames: types.array(types.string),
    childNodes: types.array(types.late((): IAnyModelType => ElementNode)),
    uuid: types.optional(types.identifierNumber, () => Math.random())
  })
  .volatile(self => ({
    element: document.createElement("null")
  }))
  .views(self => ({
    get className() {
      return [...self.element.classList].join(" ");
    },

    get componentName() {
      return this.reactElement.return.type.name;
    },

    get debugSource() {
      if (!this.reactElement._debugSource) {
        throw new Error(`Selected element is missing _debugSource property`);
      }

      return this.reactElement._debugSource;
    },

    getBoundingClientRect() {
      return self.element.getBoundingClientRect();
    },

    hasRule(rule: ICSSRule) {
      return self.classNames.includes(rule.className);
    },

    get id() {
      return self.element.getAttribute("id");
    },

    get isPreviewing() {
      return this.className !== self.element.className;
    },

    get isSelected(): boolean {
      return this.store.selected ? this.store.selected.element === self : false;
    },

    get isTargeted(): boolean {
      return this.store.targeted ? this.store.targeted.element === self : false;
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
      if (self.hasRule(rule)) {
        self.element.classList.remove(rule.className);
      } else {
        self.element.classList.add(rule.className);
      }

      self.classNames.replace([...self.element.classList]);
    },

    cancelPreview() {
      self.element.className = self.classNames.join(" ");
    },

    previewRule(rule: ICSSRule) {
      this.cancelPreview();

      const keys = String(Object.keys(rule.style));

      // TODO This is O(n) and potentially slow.
      // Instead, we need a map of cssRulesByClassName, cssRulesByKeys
      self.store.cssRules.forEach(rule => {
        const sameStyles = String(Object.keys(rule.style)) === keys;

        if (sameStyles && self.classNames.includes(rule.className)) {
          self.element.classList.remove(rule.className);
        }
      });

      self.element.classList.add(rule.className);
    },

    removeRule(rule: ICSSRule) {
      this.cancelPreview();

      self.element.classList.remove(rule.className);
      self.isPreviewing = true;
    },

    save() {
      self.classNames.replace([...self.element.classList]);
      self.isPreviewing = false;
      console.log("Save", self.classNames.join(" "));
      // TODO This should useMutation and instead of toggleClassName should use setClassName
    },

    setElement(element: HTMLElement) {
      self.element = element;

      self.childNodes.replace(createChildNodes(element));
      self.classNames.replace([...element.classList]);
    }
  }));

export const createNode = (element: HTMLElement) => {
  const node = ElementNode.create();
  node.setElement(element);

  return node;
};

export const createChildNodes = (element: HTMLElement) => {
  const children = [...element.children] as HTMLElement[];

  return children.map((child: HTMLElement) => createNode(child));
};

export const flattenNodes = (nodes: IElementNode[]) => {
  return nodes.reduce((acc, node) => {
    acc.push(node);
    acc.push(...flattenNodes(node.childNodes));

    return acc;
  }, [] as IElementNode[]);
};
