import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiLock, 
  FiSave, 
  FiSettings, 
  FiShield,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiDollarSign,
  FiPackage,
  FiRefreshCw
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import ApiService from '../../../services/api';
import styles from './Settings.module.css';

const Settings = () => {
  const { admin, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    username: admin?.username || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Store Settings
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'Good Game Guys (GGG)',
    storeDescription: 'Tunisia\'s premier gaming hardware store',
    storeEmail: 'info@ggguys.store',
    storePhone: '+216 25 910 385',
    storeLocation: 'Carthage, Tunisia',
    businessHours: 'Daily 09:00-23:00',
    currency: 'TND',
    taxRate: 19, // Tunisia VAT rate
    shippingFee: 7.000,
    freeShippingThreshold: 200.000
  });

  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    allowRegistration: false,
    emailNotifications: true,
    smsNotifications: false,
    autoBackup: true,
    sessionTimeout: 30 // minutes
  });

  const tabs = [
    {
      id: 'profile',
      label: 'Profile & Security',
      icon: <FiUser />,
      description: 'Manage your admin account and password'
    },
    {
      id: 'store',
      label: 'Store Settings',
      icon: <FiSettings />,
      description: 'Configure store information and policies'
    },
    {
      id: 'system',
      label: 'System Settings',
      icon: <FiShield />,
      description: 'System configuration and preferences'
    }
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch these from your API
      // For now, we'll use default values
      console.log('Settings loaded');
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStoreChange = (e) => {
    const { name, value, type } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSystemChange = (e) => {
    const { name, checked, value, type } = e.target;
    setSystemSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!profileData.currentPassword || !profileData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (profileData.newPassword !== profileData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (profileData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('ggg-token')}`
        },
        body: JSON.stringify({
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Password changed successfully!');
        setProfileData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSettingsSave = async () => {
    try {
      setLoading(true);
      // In a real app, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Store settings saved successfully!');
    } catch (error) {
      console.error('Error saving store settings:', error);
      toast.error('Failed to save store settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSystemSettingsSave = async () => {
    try {
      setLoading(true);
      // In a real app, save to API
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('System settings saved successfully!');
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast.error('Failed to save system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      toast.info('Logged out successfully');
    }
  };

  return (
    <div className={styles.settings}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your admin account and store configuration</p>
      </div>

      <div className={styles.settingsContainer}>
        {/* Tabs Navigation */}
        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <div className={styles.tabContent}>
                <span className={styles.tabLabel}>{tab.label}</span>
                <span className={styles.tabDescription}>{tab.description}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className={styles.tabPanel}>
          {/* Profile & Security Tab */}
          {activeTab === 'profile' && (
            <div className={styles.profileSettings}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FiUser className={styles.sectionIcon} />
                  Admin Profile
                </h2>
                
                <div className={styles.profileInfo}>
                  <div className={styles.profileAvatar}>
                    <div className={styles.avatarCircle}>
                      <FiUser />
                    </div>
                    <div className={styles.profileDetails}>
                      <h3>{admin?.username || 'Admin'}</h3>
                      <p>System Administrator</p>
                      <p className={styles.lastLogin}>
                        Last login: {new Date().toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FiLock className={styles.sectionIcon} />
                  Change Password
                </h2>
                
                <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleProfileChange}
                      placeholder="Enter current password"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleProfileChange}
                      placeholder="Enter new password (min 6 characters)"
                      required
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleProfileChange}
                      placeholder="Confirm new password"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <FiRefreshCw className={styles.spinner} />
                        Changing...
                      </>
                    ) : (
                      <>
                        <FiSave />
                        Change Password
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FiShield className={styles.sectionIcon} />
                  Security Actions
                </h2>
                
                <div className={styles.securityActions}>
                  <button className={styles.logoutButton} onClick={handleLogout}>
                    Logout from Dashboard
                  </button>
                  <p className={styles.securityNote}>
                    You will be logged out from all devices and need to login again.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Store Settings Tab */}
          {activeTab === 'store' && (
            <div className={styles.storeSettings}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FiGlobe className={styles.sectionIcon} />
                  Store Information
                </h2>
                
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="storeName">Store Name</label>
                    <input
                      id="storeName"
                      type="text"
                      name="storeName"
                      value={storeSettings.storeName}
                      onChange={handleStoreChange}
                      placeholder="Your store name"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="storeEmail">Store Email</label>
                    <div className={styles.inputWithIcon}>
                      <FiMail className={styles.inputIcon} />
                      <input
                        id="storeEmail"
                        type="email"
                        name="storeEmail"
                        value={storeSettings.storeEmail}
                        onChange={handleStoreChange}
                        placeholder="info@ggguys.store"
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="storePhone">Store Phone</label>
                    <div className={styles.inputWithIcon}>
                      <FiPhone className={styles.inputIcon} />
                      <input
                        id="storePhone"
                        type="tel"
                        name="storePhone"
                        value={storeSettings.storePhone}
                        onChange={handleStoreChange}
                        placeholder="+216 25 910 385"
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="storeLocation">Location</label>
                    <div className={styles.inputWithIcon}>
                      <FiMapPin className={styles.inputIcon} />
                      <input
                        id="storeLocation"
                        type="text"
                        name="storeLocation"
                        value={storeSettings.storeLocation}
                        onChange={handleStoreChange}
                        placeholder="Carthage, Tunisia"
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="businessHours">Business Hours</label>
                    <div className={styles.inputWithIcon}>
                      <FiClock className={styles.inputIcon} />
                      <input
                        id="businessHours"
                        type="text"
                        name="businessHours"
                        value={storeSettings.businessHours}
                        onChange={handleStoreChange}
                        placeholder="Daily 09:00-23:00"
                      />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="storeDescription">Store Description</label>
                    <textarea
                      id="storeDescription"
                      name="storeDescription"
                      value={storeSettings.storeDescription}
                      onChange={handleStoreChange}
                      placeholder="Brief description of your store"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FiDollarSign className={styles.sectionIcon} />
                  Pricing & Shipping
                </h2>
                
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="currency">Currency</label>
                    <select
                      id="currency"
                      name="currency"
                      value={storeSettings.currency}
                      onChange={handleStoreChange}
                    >
                      <option value="TND">TND (Tunisian Dinar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (US Dollar)</option>
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="taxRate">Tax Rate (%)</label>
                    <input
                      id="taxRate"
                      type="number"
                      step="0.01"
                      name="taxRate"
                      value={storeSettings.taxRate}
                      onChange={handleStoreChange}
                      placeholder="19.00"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="shippingFee">Shipping Fee (TND)</label>
                    <input
                      id="shippingFee"
                      type="number"
                      step="0.001"
                      name="shippingFee"
                      value={storeSettings.shippingFee}
                      onChange={handleStoreChange}
                      placeholder="7.000"
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="freeShippingThreshold">Free Shipping Threshold (TND)</label>
                    <input
                      id="freeShippingThreshold"
                      type="number"
                      step="0.001"
                      name="freeShippingThreshold"
                      value={storeSettings.freeShippingThreshold}
                      onChange={handleStoreChange}
                      placeholder="200.000"
                    />
                  </div>
                </div>
              </div>

              <button
                className={styles.saveButton}
                onClick={handleStoreSettingsSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className={styles.spinner} />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Store Settings
                  </>
                )}
              </button>
            </div>
          )}

          {/* System Settings Tab */}
          {activeTab === 'system' && (
            <div className={styles.systemSettings}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <FiSettings className={styles.sectionIcon} />
                  System Configuration
                </h2>
                
                <div className={styles.settingsGrid}>
                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>Maintenance Mode</h4>
                      <p>Temporarily disable the store for maintenance</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="maintenanceMode"
                        checked={systemSettings.maintenanceMode}
                        onChange={handleSystemChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>Email Notifications</h4>
                      <p>Receive email alerts for new orders and tickets</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={systemSettings.emailNotifications}
                        onChange={handleSystemChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>SMS Notifications</h4>
                      <p>Receive SMS alerts for urgent matters</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="smsNotifications"
                        checked={systemSettings.smsNotifications}
                        onChange={handleSystemChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>

                  <div className={styles.settingItem}>
                    <div className={styles.settingInfo}>
                      <h4>Auto Backup</h4>
                      <p>Automatically backup data daily</p>
                    </div>
                    <label className={styles.switch}>
                      <input
                        type="checkbox"
                        name="autoBackup"
                        checked={systemSettings.autoBackup}
                        onChange={handleSystemChange}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <label htmlFor="sessionTimeout">Session Timeout (minutes)</label>
                  <input
                    id="sessionTimeout"
                    type="number"
                    name="sessionTimeout"
                    value={systemSettings.sessionTimeout}
                    onChange={handleSystemChange}
                    placeholder="30"
                    min="5"
                    max="120"
                  />
                  <small>Automatically log out after this many minutes of inactivity</small>
                </div>
              </div>

              <button
                className={styles.saveButton}
                onClick={handleSystemSettingsSave}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FiRefreshCw className={styles.spinner} />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save System Settings
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
