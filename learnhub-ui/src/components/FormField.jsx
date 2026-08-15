// Campo de formulario con label. Soporta input, textarea, select y toggle.
export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder = '',
  options = null, // para type="select": [{ value, label }]
  rows = 3,
  min,
  max,
  step,
  maxLength,
  hint,
}) {
  const id = `field-${name}`;

  const control = (() => {
    if (type === 'select') {
      return (
        <select id={id} name={name} value={value ?? ''} onChange={onChange} required={required} className="input-field">
          <option value="" disabled>
            {placeholder || 'Selecciona una opción'}
          </option>
          {(options || []).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }
    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          name={name}
          value={value ?? ''}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          rows={rows}
          maxLength={maxLength}
          className="input-field resize-y"
        />
      );
    }
    if (type === 'toggle') {
      return (
        <button
          type="button"
          id={id}
          role="switch"
          aria-checked={!!value}
          onClick={() => onChange({ target: { name, value: !value, type: 'toggle' } })}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
            value ? 'bg-primary' : 'bg-slate-300'
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
              value ? 'left-[22px]' : 'left-0.5'
            }`}
          />
        </button>
      );
    }
    return (
      <input
        id={id}
        name={name}
        type={type}
        value={value ?? ''}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        maxLength={maxLength}
        className="input-field"
      />
    );
  })();

  return (
    <div className={type === 'toggle' ? 'flex items-center justify-between gap-3' : ''}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-danger">*</span>}
      </label>
      {control}
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}
