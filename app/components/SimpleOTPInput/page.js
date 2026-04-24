"use client";

export default function SimpleOTPInput({ value, onChange, numInputs = 4 }) {
  const [otpValues, setOtpValues] = useState(Array(numInputs).fill(''));

  const handleInputChange = (index, e) => {
    const val = e.target.value;
    if (val.length <= 1) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = val;
      setOtpValues(newOtpValues);
      
      const otpString = newOtpValues.join('');
      if (onChange) {
        onChange(otpString);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpValues[index]) {
      e.preventDefault();
      const newOtpValues = [...otpValues];
      newOtpValues[index] = '';
      setOtpValues(newOtpValues);
      
      const otpString = newOtpValues.join('');
      if (onChange) {
        onChange(otpString);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('Text');
    if (pastedData) {
      const digits = pastedData.replace(/\D/g, '').slice(0, numInputs);
      const newOtpValues = digits.split('');
      setOtpValues(newOtpValues);
      
      if (onChange) {
        onChange(digits.join(''));
      }
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: numInputs }, (_, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={otpValues[index] || ''}
          onChange={(e) => handleInputChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          className="w-12 h-12 text-center text-2xl border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-500"
          style={{
            width: '3rem',
            height: '3rem',
            margin: '0px 5px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            textAlign: 'center',
            fontSize: '20px'
          }}
        />
      ))}
    </div>
  );
}
