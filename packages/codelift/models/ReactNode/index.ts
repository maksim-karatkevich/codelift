import { Instance, types } from "mobx-state-tree";

export interface IReactNode extends Instance<typeof ReactNode> {}

export const ReactNode = types
  .model("ReactNode", {
    id: types.optional(types.identifierNumber, () => Math.random())
  })
  .volatile(self => ({
    instance: null as any
  }))
  .views(self => ({
    // TODO elementId
    // TODO elementClassNames?
    get children(): IReactNode[] {
      const children = [];
      let child = self.instance.child;

      // child/sibling are a linked list, so children = child + siblings
      while (child) {
        children.push(createReactNode(child));
        child = child.sibling;
      }

      return children;
    },

    get classNames(): string[] {
      if (!this.element) {
        return [];
      }

      return [...this.element.classList];
    },

    // TODO Create an ElementNode, which should be Node
    // This would remove classNames/id & other concerns from this
    get element(): null | HTMLElement {
      if (!this.isElement) {
        return null;
      }

      return self.instance.stateNode;
    },

    get isComponent() {
      return typeof self.instance.elementType !== "string";
    },

    get isElement() {
      return typeof self.instance.elementType === "string";
    },

    get isUserCode() {
      return Boolean(self.instance._debugSource);
    },

    get name(): string {
      const { elementType } = self.instance;

      if (this.isComponent) {
        if (elementType.name) {
          return String(elementType.name);
        }

        return "Anonymous";
      }

      return String(elementType);
    }
  }))
  .actions(self => ({
    setInstance(instance: any) {
      self.instance = instance;
    }
  }));

export const createReactNode = (instance: any) => {
  const node = ReactNode.create({
    id: instance._debugID
  });

  node.setInstance(instance);

  return node;
};

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
