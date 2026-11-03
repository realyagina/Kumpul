import React, { useState } from 'react';
import { X, UserCheck, Sparkles, Smartphone, ShieldCheck } from 'lucide-react';
import { User } from '../types';
import { Language, translations } from '../translations';

interface LoginModalProps {
  language: Language;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

const DEMO_ACCOUNTS = [
  { name: 'Budi Santoso', phone: '081234567890', initial: 'BS', avatarColor: 'bg-emerald-600' },
  { name: 'Sarah Jenkins', phone: '082198765432', initial: 'SJ', avatarColor: 'bg-[#FF8A3D]' },
  { name: 'Gede Pratama', phone: '081912345678', initial: 'GP', avatarColor: 'bg-indigo-600' },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  language,
  onClose,
  onLoginSuccess,
}) => {
  const t = translations[language];
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Silakan masukkan nama dan nomor telepon Anda.');
      return;
    }

    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const newUser: User = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      avatarColor: 'bg-[#0F9D8A]',
      initial: initials || 'K',
      isLoggedIn: true,
    };

    onLoginSuccess(newUser);
  };

  const handleSelectDemo = (demo: typeof DEMO_ACCOUNTS[0]) => {
    const user: User = {
      id: 'usr-demo-' + demo.initial.toLowerCase(),
      name: demo.name,
      phone: demo.phone,
      avatarColor: demo.avatarColor,
      initial: demo.initial,
      isLoggedIn: true,
    };
    onLoginSuccess(user);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative my-auto border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-gray-900">{t.loginTitle}</h3>
            <p className="text-xs text-gray-500">{t.loginSubtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.yourName}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Made Aris"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0F9D8A] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                {t.phoneLabel}
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t.phonePlaceholder}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#0F9D8A] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#0F9D8A] hover:bg-[#0b7e6f] active:scale-98 text-white font-extrabold text-sm shadow-md shadow-[#0F9D8A]/20 transition-all cursor-pointer mt-2"
            >
              {t.loginSubmit}
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-2 border-t border-gray-100">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              {t.quickFillTitle}
            </span>
            <div className="space-y-1.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.name}
                  type="button"
                  onClick={() => handleSelectDemo(acc)}
                  className="w-full p-2.5 rounded-xl border border-gray-200 hover:border-[#0F9D8A] hover:bg-teal-50/50 flex items-center justify-between transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-7 h-7 rounded-lg ${acc.avatarColor} text-white font-bold text-xs flex items-center justify-center`}
                    >
                      {acc.initial}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block">{acc.name}</span>
                      <span className="text-[11px] text-gray-500">{acc.phone}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#0F9D8A] bg-[#0F9D8A]/10 px-2 py-0.5 rounded-md">
                    Pilih
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0F9D8A]" />
            <span>{t.privacyNotice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
