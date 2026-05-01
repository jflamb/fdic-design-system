import { css, type CSSResultGroup } from "lit";

/**
 * Wraps component-scoped reduced-motion overrides in one shared media query.
 *
 * Use this for transition and animation suppression that belongs inside a
 * component stylesheet:
 *
 *   ${reducedMotion`
 *     .surface {
 *       transition: none;
 *     }
 *   `}
 */
export function reducedMotion(
  strings: TemplateStringsArray,
  ...values: CSSResultGroup[]
) {
  return css`
    @media (prefers-reduced-motion: reduce) {
      ${css(strings, ...values)}
    }
  `;
}
