import { groupBy } from "lodash";
import { FunctionComponent } from "react";

import { useStore, observer } from "../../store";
import { Menu } from "./Menu";
import { Swatch } from "./Swatch";
import { useUpdateClassName } from "../../hooks/useUpdateClassName";

type PaletteProps = {
  label: string;
  match: string | string[];
};

export const Palette: FunctionComponent<PaletteProps> = observer(
  ({ label, match }) => {
    const store = useStore();
    const [res, updateClassName] = useUpdateClassName();
    const keys = Array.isArray(match) ? match : [match];
    const rules = store.cssRules.filter(cssRule => {
      return (
        cssRule.className.indexOf(":") === -1 &&
        String(Object.keys(cssRule.style)) === String(keys)
      );
    });

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
                  disabled={res.fetching}
                  key={groupRule.className}
                  onMouseLeave={() => store.selected?.element?.cancelPreview()}
                  onMouseOver={() =>
                    store.selected?.element?.previewRule(groupRule)
                  }
                  onClick={updateClassName}
                  style={{ background: groupRule.style[keys[0]] }}
                />
              ))}
            </div>
          ))}
        </Menu>
      </>
    );
  }
);
