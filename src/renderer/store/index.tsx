import { useContext, createContext, useState } from 'react';

export interface WindowStore {
	about: {
		isOpen: boolean
		setAboutWindowState: (value: boolean) => void
	}
}

const WindowStoreContext = createContext({} as WindowStore);

export function useWindowStore() {
	return useContext(WindowStoreContext);
}

export function WindowStoreProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const [state, setState] = useState({
		// eslint-disable-next-line @typescript-eslint/no-use-before-define
		about: { isOpen: false, setAboutWindowState },
	});

	function setAboutWindowState(value: boolean) {
		setState((newState) => ({
			...newState,
			about: {
				...newState.about,
				isOpen: value,
			},
		}));
	}

	return (
		<WindowStoreContext.Provider value={state}>
			{children}
		</WindowStoreContext.Provider>
	);
}
