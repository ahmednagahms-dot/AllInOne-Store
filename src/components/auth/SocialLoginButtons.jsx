function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 7.294C4.672 5.167 6.656 3.58 9 3.58z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <path fill="#1877F2" d="M36 18c0-9.94-8.06-18-18-18S0 8.06 0 18c0 8.98 6.58 16.41 15.19 17.76V23.13h-4.57V18h4.57v-3.97c0-4.51 2.69-7.01 6.8-7.01 1.97 0 4.03.35 4.03.35v4.43h-2.27c-2.24 0-2.94 1.39-2.94 2.81V18h5.01l-.8 5.13h-4.21v12.63C29.42 34.41 36 26.98 36 18z" />
      <path fill="#fff" d="M25.01 23.13L25.81 18h-5.01v-3.39c0-1.42.7-2.81 2.94-2.81h2.27V7.37s-2.06-.35-4.03-.35c-4.11 0-6.8 2.5-6.8 7.01V18h-4.57v5.13h4.57v12.63a18.15 18.15 0 005.62 0V23.13h4.21z" />
    </svg>
  );
}

export default function SocialLoginButtons({ onGoogleClick, onFacebookClick }) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button
        type="button"
        onClick={onGoogleClick}
        className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-primary-300 hover:bg-slate-50"
      >
        <GoogleIcon />
        Google
      </button>

      <button
        type="button"
        onClick={onFacebookClick}
        className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-primary-300 hover:bg-slate-50"
      >
        <FacebookIcon />
        Facebook
      </button>
    </div>
  );
}