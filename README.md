# ⚡ stromME - Real-time Electricity Price Dashboard

A modern, wall-mounted cockpit display for monitoring real-time electricity prices and consumption data using the Tibber API. Designed for high visibility with large fonts, high-contrast colors, and a single-viewport layout perfect for wall displays.

![stromME Dashboard](https://img.shields.io/badge/Status-Live-brightgreen) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)

## 🚀 Features

### 📊 Real-time Price Monitoring
- **Current electricity price** in Euro cents/kWh
- **Price level indicators** (CHEAP, NORMAL, EXPENSIVE)
- **Daily price range** with today's high and low prices
- **Automatic price updates** every 5 minutes

### 📈 Consumption Tracking
- **Today's usage visualization** with circular progress indicator
- **24-hour consumption chart** with hourly breakdown
- **Daily consumption totals** in kWh
- **Consumption vs. daily average** percentage

### 🧮 Device Cost Calculator
- **Real-time cost estimation** for household devices
- **Pre-configured devices**: Washing Machine, Tumble Dryer, Induction Cooker, Baking Oven, TV
- **Next-hour pricing** for optimal device scheduling
- **Persistent device selection** with localStorage

### 🖥️ Wall Display Optimized
- **High-contrast colors** for maximum visibility
- **Large typography** readable from across the room
- **Single viewport layout** - no scrolling required
- **Responsive 12-column grid** system
- **Glowing visual effects** for enhanced visibility

## 🛠️ Technology Stack

- **Frontend**: TypeScript + Vite
- **Styling**: Tailwind CSS with custom high-contrast theme
- **API**: Tibber GraphQL API integration
- **Charts**: HTML5 Canvas with custom rendering
- **Deployment**: GitHub Pages with automated CI/CD

## 📋 Prerequisites

- **Tibber Account**: You need a Tibber electricity contract
- **Tibber API Token**: Generate from your Tibber account settings
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/stromME.git
cd stromME
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure API Token
Edit `src/utils/constants.ts` and replace the API token:
```typescript
export const API_CONFIG: ApiConfig = {
  baseUrl: 'https://api.tibber.com/v1-beta/gql',
  token: 'YOUR_TIBBER_API_TOKEN_HERE', // Replace with your token
  timeout: 10000
};
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
Navigate to `http://localhost:3000` to see your dashboard.

## 🔧 Configuration

### API Configuration
Located in `src/utils/constants.ts`:
- **API_CONFIG**: Tibber API settings
- **LOCATION**: Your location for sunrise/sunset calculations
- **UPDATE_INTERVALS**: Data refresh frequencies

### Device Configuration
Add or modify devices in `src/utils/constants.ts`:
```typescript
export const DEVICES: Device[] = [
  {
    id: 'custom-device',
    name: 'Custom Device',
    powerKw: 1.5, // Power consumption in kW
    icon: '🔌'
  }
];
```

### Theme Configuration
Customize colors in `styles/main.css`:
```css
:root {
  --accent-primary: #00ff88;    /* Main accent color */
  --accent-secondary: #ff6b35;  /* Secondary accent */
  --accent-tertiary: #00d4ff;   /* Tertiary accent */
}
```

## 📱 Usage

### Wall Display Setup
1. **Full Screen**: Press F11 for full-screen mode
2. **Auto-refresh**: Data updates automatically
3. **No Interaction**: Designed for passive monitoring
4. **High Visibility**: Optimized for viewing from 2-5 meters

### Device Cost Calculator
1. Select a device from the dropdown
2. View real-time cost for the next hour
3. Selection is automatically saved
4. Costs update with current electricity prices

### Price Monitoring
- **Green**: Cheap electricity prices
- **Orange**: Normal electricity prices  
- **Red**: Expensive electricity prices
- **Automatic updates** every 5 minutes

## 🚀 Deployment

### GitHub Pages (Recommended)
1. **Fork this repository**
2. **Enable GitHub Pages** in repository settings
3. **Configure API token** in your fork
4. **Automatic deployment** via GitHub Actions

### Manual Deployment
```bash
npm run build
npm run preview  # Test production build
```

Deploy the `dist/` folder to any static hosting service.

## 🔌 API Integration

### Tibber API
- **GraphQL endpoint**: `https://api.tibber.com/v1-beta/gql`
- **Authentication**: Bearer token
- **Rate limits**: Respects Tibber's API limits
- **Error handling**: Graceful fallback to mock data

### Data Sources
- **Price data**: Real-time from Tibber API
- **Consumption data**: From Tibber Pulse (if available)
- **Fallback**: Realistic mock data for demonstration

## 🎨 Customization

### Colors
Modify the CSS custom properties in `styles/main.css` for different color schemes.

### Layout
Adjust the grid layout in `index.html` - currently uses a 12-column system.

### Devices
Add custom devices in `src/utils/constants.ts` with power consumption values.

### Update Intervals
Configure refresh rates in `src/utils/constants.ts`:
```typescript
export const UPDATE_INTERVALS = {
  PRICE_DATA: 5 * 60 * 1000,      // 5 minutes
  CONSUMPTION_DATA: 15 * 60 * 1000, // 15 minutes
};
```

## 🐛 Troubleshooting

### Common Issues

**CORS Errors**
- Ensure you're using a valid Tibber API token
- Check browser console for detailed error messages

**No Data Displayed**
- Verify your Tibber API token is correct
- Check network connectivity
- Enable mock data mode for testing

**Layout Issues**
- Ensure browser zoom is at 100%
- Try refreshing the page
- Check browser compatibility

### Debug Mode
Enable debug logging in `src/utils/constants.ts`:
```typescript
export const DEV_CONFIG = {
  DEBUG_MODE: true,
  MOCK_DATA: false
};
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/stromME/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/stromME/discussions)
- **Tibber API**: [Tibber Developer Portal](https://developer.tibber.com/)

## 🙏 Acknowledgments

- **Tibber** for providing the excellent electricity API
- **Vite** for the fast development experience
- **Tailwind CSS** for the utility-first styling approach
- **TypeScript** for type safety and developer experience

## 📊 Project Stats

- **Bundle Size**: ~200KB (gzipped)
- **Load Time**: <2 seconds
- **Update Frequency**: 5-15 minutes
- **Browser Support**: Modern browsers (ES2020+)

---

**Made with ⚡ for smart energy monitoring**
