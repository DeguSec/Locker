/**
 * The interface used to represent objects that can serialise themselfs as JSON.
 */
export interface iJSON {
	/**
	* Return the string JSON representation of the current object.
	*/
	getJSON(): string
}
