import { groupBy } from "lodash";
import { FunctionComponent } from "react";

import { useStore } from "../../store";

type PaletteProps = {
  hidden: boolean;
  match: RegExp;
};

export const Palette: FunctionComponent<PaletteProps> = ({ hidden, match }) => {
  const store = useStore();
  const rules = store.cssRules.filter(cssRule =>
    cssRule.className.match(match)
  );

  const groups = groupBy(rules, rule => {
    const [, group] = rule.className.match(match);

    return group;
  });

  return (
    <>
      {Object.entries(groups).map(([group, groupRules]) => (
        <div className="flex">
          {groupRules.map(groupRule => (
            <button
              className={`${groupRule.className.replace(
                /^\w+/,
                "bg"
              )} flex-grow py-3 hover:shadow-outline hover:z-50`}
              hidden={hidden}
              key={groupRule.className}
              onMouseLeave={() => store.selected?.element?.cancelPreview()}
              onMouseOver={() =>
                store.selected?.element?.previewRule(groupRule)
              }
              onClick={() => {
                throw new Error(
                  "TODO Move mutation to it's own hook or preview/apply rule for use with Slider & Palette"
                );
              }}
            />
          ))}
        </div>
      ))}
    </>
  );
};
