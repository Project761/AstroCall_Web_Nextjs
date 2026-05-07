export const customStyle = {
    control: (provided, state) => ({
        ...provided,
        width: '100%',
        border: state.isFocused
            ? '1px solid #F97316'
            : '1px solid #d1d5db',
        borderRadius: '0.5rem',
        padding: '0.375rem 0.75rem',
        fontSize: '0.875rem',
        boxShadow: state.isFocused
            ? '0 0 0 2px rgba(249, 115, 22, 0.2)'
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        minHeight: '38px',
        '&:hover': {
            borderColor: state.isFocused ? '#F97316' : '#d1d5db',
        },
    }),
    placeholder: (provided) => ({
        ...provided,
        color: '#9ca3af',
    }),
};
