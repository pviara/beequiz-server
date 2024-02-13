export function isInvalidStructure(
    checkedObject: Record<string, any>,
    objStructRef: Record<string, any>,
): boolean {
    for (let refProp in objStructRef) {
        const refValue = objStructRef[refProp];
        const checkedValue = checkedObject[refProp];

        const isRefPropNotInParsedObject = !(refProp in checkedObject);
        const areObjectPropsDifferentlyTyped =
            typeof checkedValue !== typeof refValue;

        if (isRefPropNotInParsedObject || areObjectPropsDifferentlyTyped) {
            return true;
        }

        if (typeof refValue === 'object' && refValue !== null) {
            if (Array.isArray(refValue)) {
                if (!Array.isArray(checkedValue)) {
                    return true;
                }

                const objStructRef = refValue[0];
                for (const checkedElement of checkedValue) {
                    const containsInvalidAnswer = isInvalidStructure(
                        checkedElement,
                        objStructRef,
                    );
                    if (containsInvalidAnswer) {
                        return true;
                    }
                }
            } else {
                const isObjectInvalid = isInvalidStructure(
                    checkedValue,
                    refValue,
                );
                if (isObjectInvalid) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function isParsedStringNaN(str: string): boolean {
    const parsedStr = parseInt(str);
    return isNaN(parsedStr);
}
