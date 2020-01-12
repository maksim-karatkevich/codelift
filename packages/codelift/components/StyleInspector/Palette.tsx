import { groupBy } from "lodash";
import { FunctionComponent } from "react";

import { useStore, observer } from "../../store";
import { Menu } from "./Menu";
import { Swatch } from "./Swatch";
import { ICSSRule } from "../../models/CSSRule";

type PaletteProps = {
  label: string;
  filter: (cssRule: ICSSRule) => boolean;
  value: (cssRule: ICSSRule) => string | undefined;
};

export const Palette: FunctionComponent<PaletteProps> = observer(
  ({ label, filter, value }) => {
    const store = useStore();
    const rules = store.cssRules.filter(filter);

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
            <div
              className="flex"
              key={group}
              style={{
                background:
                  "linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)",
                backgroundPosition:
                  "0 0, 0 0.5rem, 0.5rem -0.5rem, -0.5rem 0px",
                backgroundSize: "1rem 1rem"
              }}
            >
              {groupRules.map(groupRule => (
                <button
                  className="flex-grow py-3 hover:shadow-outline hover:z-10"
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
                  style={{ background: value(groupRule) }}
                />
              ))}
            </div>
          ))}
        </Menu>
      </>
    );
  }
);
