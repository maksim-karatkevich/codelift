import { FunctionComponent } from "react";

import { observer, useStore } from "../../store";
import { IReactNode } from "../../models/ReactNode";

type NodeProps = {
  node: IReactNode;
};

const Label: FunctionComponent<NodeProps> = observer(({ node }) => {
  const store = useStore();
  const isSelected = node === store.selectedReactNode;

  return (
    <button
      className={`my-1 pl-2 rounded-l text-left truncate w-full ${
        isSelected
          ? "bg-white text-black font-bold shadow-sm"
          : "text-gray-400 text-normal hover:bg-gray-800 hover:font-bold"
      }`}
      onClick={() => store.selectReactNode(node)}
      onMouseEnter={() => store.targetReactNode(node)}
      style={{ transition: "all 100ms ease-in-out" }}
    >
      {node.name}
      <small className="text-xs text-gray-600 font-normal">
        {node.element && node.element.id && `#${node.element.id}`}
        {node.classNames.length > 0 && `.${node.classNames.join(".")}`}
      </small>
    </button>
  );
});

const List: FunctionComponent<NodeProps> = observer(({ node }) => {
  if (!node.isUserCode) {
    return (
      <>
        {node.children.map(child => (
          <List key={child.id} node={child} />
        ))}
      </>
    );
  }

  // TODO Track depth and change border color to be lighter
  return (
    <ol className="border-l border-gray-800 -ml-3 pl-6">
      <li>
        <div className="flex">
          <Label node={node} />
          {/* <Menus node={node} /> */}
        </div>

        {node.children.map(child => (
          <List key={child.id} node={child} />
        ))}
      </li>
    </ol>
  );
});

const Menu: FunctionComponent<NodeProps> = observer(({ node }) => {
  return (
    <button className="px-2 font-mono fill-current">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
      >
        <path
          className="heroicon-ui"
          d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"
        />
      </svg>
    </button>
  );
});

export const ComponentInspector: FunctionComponent = observer(() => {
  const store = useStore();

  if (!store.rootInstance) {
    return null;
  }

  return (
    <nav className="bg-gray-900 font-thin w-full m-auto text-xs text-gray-400 py-4">
      <List node={store.rootInstance} />
    </nav>
  );

  // return (
  //     <ol className="ml-6">
  //       <li>
  //         <a href="#">
  //           div
  //           <small className="text-xs text-gray-600">#root</small>
  //         </a>
  //         <ol className="border-l border-gray-800 -ml-3 pl-6 list-disc">
  //           <a href="#" className="text-white font-bold">
  //             Nav
  //           </a>
  //           <ol className="-ml-3 pl-6 border-l border-gray-700">
  //             <li className="flex">
  //               <a href="#" className="truncate">
  //                 ol
  //                 <small className="text-xs text-gray-600 whitespace-no-wrap">
  //                   .-ml-3.pl-6.border-l.border-gray-700.text-xs.text-gray-600
  //                 </small>
  //               </a>
  //               <button className="px-2 font-mono fill-current">
  //                 <svg
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   viewBox="0 0 24 24"
  //                   width="24"
  //                   height="24"
  //                 >
  //                   <path
  //                     className="heroicon-ui"
  //                     d="M15.3 9.3a1 1 0 0 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 1.4-1.4l3.3 3.29 3.3-3.3z"
  //                   />
  //                 </svg>
  //               </button>
  //             </li>
  //           </ol>
  //         </ol>
  //       </li>
  //     </ol>
  //   </nav>
  // );
});
