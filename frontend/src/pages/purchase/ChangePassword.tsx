import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

function ChangePassword() {
  const navigate = useNavigate();
  const { changePassword } = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsLoading(true);
    try {
      await changePassword({
        currentPassword,
        newPassword,
        confirmPassword
      });
      toast.success('Password changed successfully');
      navigate('/purchase/dashboard');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB] px-4 py-10">
      <div className="w-full max-w-[430px] rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Change Password</h1>
          <p className="mt-2 text-sm text-slate-600">
            Update your password to keep your account secure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700">
              Current Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="h-12 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 pr-20 text-sm focus:border-[#185FA5] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#60A5FA] hover:text-slate-950"
              >
                {showPasswords.current ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="h-12 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 pr-20 text-sm focus:border-[#185FA5] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#60A5FA] hover:text-slate-950"
              >
                {showPasswords.new ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Confirm New Password
            </label>
            <div className="relative mt-2">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="h-12 w-full rounded-[16px] border border-slate-300 bg-[#F8FAFC] px-4 pr-20 text-sm focus:border-[#185FA5] focus:bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#60A5FA] hover:text-slate-950"
              >
                {showPasswords.confirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-6 flex h-12 w-full items-center justify-center rounded-[16px] bg-[#185FA5] px-4 text-sm font-semibold text-white transition hover:bg-[#226fc0] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              'Change Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
