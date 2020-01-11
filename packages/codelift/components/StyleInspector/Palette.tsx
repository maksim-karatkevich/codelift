import { groupBy } from "lodash";
import { FunctionComponent } from "react";

import { useStore, observer } from "../../store";
import { Menu } from "./Menu";
import { Swatch } from "./Swatch";

type PaletteProps = {
  label: string;
  match: RegExp;
};

export const Palette: FunctionComponent<PaletteProps> = observer(
  ({ label, match }) => {
    const store = useStore();
    const rules = store.cssRules.filter(cssRule =>
      cssRule.className.match(match)
    );

    const rule = store.selected
      ? rules.find(rule => store.selected?.element?.hasRule(rule))
      : undefined;

    const groups = groupBy(rules, rule => {
      const [, group, shade] = rule.className.split("-");

      // Only group colors that have a common shade
      return shade ? group : undefined;
    });

    return (
      <>
        <Menu icon={<Swatch {...{ rule }} />} label={label}>
          {Object.entries(groups).map(([group, groupRules]) => (
            <div className="flex" key={group}>
              {groupRules.map(groupRule => (
                <button
                  className={`${groupRule.className.replace(
                    /^\w+/,
                    "bg"
                  )} flex-grow py-3 hover:shadow-outline hover:z-10`}
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
        </Menu>
      </>
    );
  }
);
