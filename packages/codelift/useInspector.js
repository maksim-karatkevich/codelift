const { getReactInstance } = require("./utils/getReactInstance");

module.exports = function useInspector(props, Inspector) {
  const { React } = window;

  if (!React) {
    throw new Error(
      "React was not registered.  Did you add `register({ React, ReactDOM });` to the top of your application?"
    );
  }

  const { useCallback, useState } = React;
  const [previewedProps, previewProps] = useState(props);

  const ref = useCallback(
    (node) => {
      if (!node) {
        return;
      }

      const { type } = getReactInstance(node)._debugOwner;

      type.Inspector = ({ props, setProps }) => {
        return React.createElement(Inspector, {
          props,
          // setProps for codelift and for the original component
          setProps(newProps) {
            setProps(newProps);
            previewProps(newProps);
          },
        });
      };
    },
    [props, Inspector]
  );

  return [ref, previewedProps];
};