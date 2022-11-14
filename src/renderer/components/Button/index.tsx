import React, { PropsWithChildren } from 'react';

import styles from './styles.module.sass';

type ButtonProps = PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>

export function Button({ children, className, ...restOfProps }: ButtonProps) {
	const combinedClassNames = [styles.button, className].join(' ');

	return (
		<button type="button" className={combinedClassNames} {...restOfProps}>
			{children}
		</button>
	);
}
