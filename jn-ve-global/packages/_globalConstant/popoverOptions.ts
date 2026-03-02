export const getPopoverOptions = (options?: Record<string, any>): Record<string, any> => {
    return {
        ...options,
        modifiers: [
            {
                name: 'preventOverflow',
                options: {
                    rootBoundary: document.querySelector('html')
                }
            },
            {
                name: 'flip',
                options: {
                    rootBoundary: document.querySelector('html')
                }
            }
        ]
    }
}
