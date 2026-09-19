function getPasswordStrength(password) {
  if (!password) return 0;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  return strength;
}

const strengthText = {
  1: "Weak password",
  2: "Fair password",
  3: "Good password",
  4: "Strong password",
};

export default function PasswordStrengthMeter({ password }) {
  const strength = getPasswordStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2.5">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-colors ${
              level <= strength ? "bg-primary-500" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
      <p className="mt-1.5 text-[11px] text-slate-500">
        {strengthText[strength] || "Enter a password"}
      </p>
    </div>
  );
}