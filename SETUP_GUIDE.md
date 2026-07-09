# PropertyFlow - Enhanced Rental Management System
# Setup Guide & Environment Configuration

## 🎯 Project Overview

PropertyFlow is a premium, professional rental management system enhanced with:
- ✨ Modern dark theme with epic particle effects
- 🔐 Google Sign-In with IP verification (authorized: isowekesa@gmail.com only)
- 📋 Terms of Use & Privacy Policy modals
- 🎨 Professional typography (Urbanist, Sora, Inter fonts)
- 💫 Smooth animations and transitions
- 🌙 Glass morphism effects and gradient UI
- 📱 Fully responsive design
- ⚡ Performance optimized with Framer Motion

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the frontend directory:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

**How to get Google Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web Application)
5. Add authorized redirect URIs:
   - http://localhost:3000
   - http://localhost:3000/auth
   - Your production domain

### 3. Start Development Server

```bash
npm start
```

The app will open at http://localhost:3000

## 📁 Project Structure

```
frontend/src/
├── App.js                          # Main app with auth logic
├── index.js                        # React entry point
├── index-modern.css                # Global modern styles
├── theme-modern.js                 # Epic theme configuration
│
├── components/
│   ├── ParticleEffects.js         # Particle background & glow effects
│   ├── GoogleAuth.js              # Google Sign-In & IP verification
│   ├── TermsModal.js              # Terms & Privacy modal
│   ├── GlobalStyles.js            # Deprecated (use index-modern.css)
│   └── ui.js                      # UI utilities
│
├── pages/
│   ├── LoginPage.js               # ✨ NEW Epic login page
│   ├── Dashboard.js               # Main dashboard (needs redesign)
│   ├── HousesPage.js              # Properties management
│   ├── TenantsPage.js             # Tenant management
│   ├── PaymentsPage.js            # Payment tracking
│   ├── ReportsPage.js             # Analytics & reports
│   └── SmsPage.js                 # SMS notifications
│
└── public/
    ├── index.html                  # Updated with Google Sign-In & fonts
    └── sw.js                       # Service worker for PWA
```

## 🔑 Key Features Implemented

### Authentication
- ✅ Google Sign-In (isowekesa@gmail.com only)
- ✅ IP address tracking on first login
- ✅ New location detection modal
- ✅ Secure token storage in localStorage
- ✅ Auto-session restore

### Security & Compliance
- ✅ Terms of Use modal with version control
- ✅ Privacy Policy modal
- ✅ IP address logging for security audit
- ✅ First-login IP verification flow
- ✅ Acceptance tracking with timestamps

### UI/UX Enhancements
- ✅ Modern dark theme (#0F172A background)
- ✅ Gradient primary color (5581FF → 6BA7F9)
- ✅ Particle background effects
- ✅ Glass morphism cards
- ✅ Neon shadow effects
- ✅ Premium typography (Urbanist, Sora, Inter)
- ✅ Smooth animations & transitions
- ✅ Responsive mobile design

## 🎨 Theme Colors

**Primary Gradient:** #5581FF → #6BA7F9
**Secondary Accent:** #6BA7F9
**Success:** #22C55E (Emerald)
**Warning:** #F59E0B (Amber)
**Error:** #F43F5E (Rose)
**Background:** #0F172A (Very dark blue)
**Surface:** #1E293B (Dark slate)

## 🔐 Security Features

1. **IP Verification on New Login**
   - Detects new IP addresses
   - Prompts user for verification
   - Stores login history (last 10 sessions)

2. **Email Whitelist**
   - Only isowekesa@gmail.com can access
   - Custom error message for unauthorized users

3. **Token Management**
   - JWT tokens stored securely
   - Token validation on app load
   - Clear on logout

4. **Terms & Privacy**
   - Version-controlled acceptance
   - Prompted before first use
   - Stored in localStorage with timestamp

## 🚀 Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

### Pre-deployment Checklist
- [ ] Update REACT_APP_GOOGLE_CLIENT_ID in environment
- [ ] Update REACT_APP_API_URL to production API
- [ ] Verify all authorized redirect URIs in Google Cloud Console
- [ ] Test Google Sign-In with authorized email
- [ ] Test IP verification flow
- [ ] Verify Terms & Privacy modals appear
- [ ] Test on mobile devices
- [ ] Performance test (Lighthouse)

## 🧪 Testing

Run tests with:
```bash
npm test
```

Test checklist:
- [ ] Google Sign-In flow
- [ ] IP detection and verification
- [ ] Terms modal acceptance
- [ ] Session restoration
- [ ] Logout functionality
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Particle effects performance
- [ ] Font loading

## 📊 Performance Optimization

Current optimizations:
- Code splitting with React.lazy
- Image optimization
- Font subsetting
- CSS minification
- Service Worker for offline support
- Particle effect canvas optimization

## 🐛 Known Issues & TODOs

- [ ] Dashboard pages need full redesign with new theme
- [ ] Charts need theme color updates
- [ ] Mobile navigation needs improvement
- [ ] Add dark/light mode toggle (currently dark only)
- [ ] Implement proper IP verification backend
- [ ] Add email verification for new IPs
- [ ] Add 2FA support

## 📚 Additional Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [Modern CSS Techniques](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [React Best Practices](https://react.dev)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Support & Maintenance

For issues or feature requests:
1. Check existing documentation
2. Review error logs in browser console
3. Test with Google Chrome DevTools
4. Report with reproducible steps

## 📄 License

© 2026 PropertyFlow. All rights reserved.

---

**Last Updated:** July 7, 2026
**Theme Version:** Epic Modern v1.0
**Font Stack:** Urbanist, Sora, Inter
