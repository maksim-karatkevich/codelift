import { assign, Machine } from "xstate";

export const { machine } = Machine(
  {
    id: "app",
    initial: "hidden",
    context: {
      target: undefined
    },
    states: {
      hidden: {
        on: {
          SHOW: "selecting"
        }
      },
      selecting: {
        on: {
          CANCEL: "hidden",
          SELECT: {
            target: "inspecting",
            actions: "setTarget"
          }
        }
      },
      inspecting: {
        on: {
          CANCEL: "selecting"
        }
      }
    }
  },
  {
    actions: {
      setTarget: assign({
        target: (ctx: any, event: any) => event.target
      })
    }
  }
);
