import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Settings, LogOut, User, Lock, Upload } from 'lucide-react';

export default function Profile() {
  const [profileImage, setProfileImage] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=John');
  
  const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: errorsProfile } } = useForm({
    defaultValues: {
      fullName: 'John Doe',
      email: 'john.doe@example.com'
    }
  });
  
  const { register: registerPassword, handleSubmit: handleSubmitPassword, watch, formState: { errors: errorsPassword } } = useForm();
  
  const newPassword = watch('newPassword');
  
  const onSubmitProfile = (data) => {
    console.log('Profile Data:', data);
    alert('Profile updated successfully!');
  };
  
  const onSubmitPassword = (data) => {
    console.log('Password Data:', data);
    alert('Password updated successfully!');
  };
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Link className="w-6 h-6 text-blue-600" />
                <span className="font-semibold text-lg">Koda Shortlink</span>
              </div>
              
              <nav className="hidden md:flex space-x-1">
                <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  📊 Dashboard
                </button>
                <button className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center space-x-1">
                  <Link className="w-4 h-4" />
                  <span>Links</span>
                </button>
                <button className="px-3 py-2 text-sm text-blue-600 border-b-2 border-blue-600 flex items-center space-x-1">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
            
            <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-2 mb-6">
            <User className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
          </div>

          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-gray-100"
                />
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Photo
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...registerProfile('fullName', { required: 'Full name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorsProfile.fullName && (
                <p className="text-red-500 text-sm mt-1">{errorsProfile.fullName.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...registerProfile('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorsProfile.email && (
                <p className="text-red-500 text-sm mt-1">{errorsProfile.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Lock className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Change Password</h2>
          </div>

          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                {...registerPassword('currentPassword', { required: 'Current password is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorsPassword.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errorsPassword.currentPassword.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                {...registerPassword('newPassword', { 
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorsPassword.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errorsPassword.newPassword.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                {...registerPassword('confirmPassword', { 
                  required: 'Please confirm your password',
                  validate: value => value === newPassword || 'Passwords do not match'
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errorsPassword.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errorsPassword.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <Lock className="w-4 h-4 mr-2" />
              Update Password
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}