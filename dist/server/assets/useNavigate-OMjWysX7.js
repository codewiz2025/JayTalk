import { a as __toESM } from "./rolldown-runtime-7_rZTKki.js";
import { t as require_react } from "./react-BDhxiwV5.js";
import { n as useLayoutEffect } from "./utils-RRgVwoHU.js";
import { t as useRouter } from "./useRouter-B3-b4d5V.js";
//#region node_modules/@tanstack/react-router/dist/esm/useNavigate.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Imperative navigation hook.
*
* Returns a stable `navigate(options)` function to change the current location
* programmatically. Prefer the `Link` component for user-initiated navigation,
* and use this hook from effects, callbacks, or handlers where imperative
* navigation is required.
*
* Options:
* - `from`: Optional route base used to resolve relative `to` paths.
*
* @returns A function that accepts `NavigateOptions`.
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/useNavigateHook
*/
function useNavigate(_defaultOpts) {
	const router = useRouter();
	return import_react.useCallback((options) => {
		return router.navigate({
			...options,
			from: options.from ?? _defaultOpts?.from
		});
	}, [_defaultOpts?.from, router]);
}
/**
* Component that triggers a navigation when rendered. Navigation executes
* in an effect after mount/update.
*
* Props are the same as `NavigateOptions` used by `navigate()`.
*
* @returns null
* @link https://tanstack.com/router/latest/docs/framework/react/api/router/navigateComponent
*/
function Navigate(props) {
	const router = useRouter();
	const navigate = useNavigate();
	const previousPropsRef = import_react.useRef(null);
	useLayoutEffect(() => {
		if (previousPropsRef.current !== props) {
			navigate(props);
			previousPropsRef.current = props;
		}
	}, [
		router,
		props,
		navigate
	]);
	return null;
}
//#endregion
export { useNavigate as n, Navigate as t };

//# sourceMappingURL=useNavigate-OMjWysX7.js.map