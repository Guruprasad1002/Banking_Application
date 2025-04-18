import { useState } from "react";
import { Sun, Moon, User, Lock, Bell, Shield, LogOut, Globe } from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} p-6`}>
      <div className="max-w-3xl p-8 mx-auto space-y-6 bg-white shadow-lg dark:bg-gray-800 rounded-xl">
        <h2 className="flex items-center gap-2 mb-4 text-2xl font-semibold">
          <Sun size={22} className="text-yellow-500" />
          Settings
        </h2>

        <ul className="space-y-4">
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={20} className="text-gray-500" />
              <span>Update Profile</span>
            </div>
            <button className="text-blue-600 hover:underline">Edit</button>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock size={20} className="text-gray-500" />
              <span>Change Password</span>
            </div>
            <button className="text-blue-600 hover:underline">Change</button>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-gray-500" />
              <span>Notification Preferences</span>
            </div>
            <button className="text-blue-600 hover:underline">Set Preferences</button>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-500" />
              <span>Two-Factor Authentication</span>
            </div>
            <button className="text-blue-600 hover:underline">Enable</button>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon size={20} className="text-gray-500" />
              ) : (
                <Sun size={20} className="text-yellow-500" />
              )}
              <span>Dark Mode</span>
            </div>
            <button onClick={toggleDarkMode} className="text-blue-600 hover:underline">
              {darkMode ? "Disable" : "Enable"}
            </button>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-gray-500" />
              <span>Language</span>
            </div>
            <select className="px-3 py-1 text-gray-700 bg-white border rounded dark:bg-gray-700 dark:text-white">
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-gray-500" />
              <span>Privacy Settings</span>
            </div>
            <button className="text-blue-600 hover:underline">Manage</button>
          </li>

          <li className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-red-500">
              <LogOut size={20} className="text-red-500" />
              <span>Logout</span>
            </div>
            <button className="text-red-500 hover:underline">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
