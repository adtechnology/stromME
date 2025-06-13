# stromME - Electricity Price Dashboard Development Plan

## 🎯 Project Overview
Create a modern, responsive, client-side web application that displays real-time electricity prices and consumption data from the Tibber GraphQL API, deployable to GitHub Pages.

**Location**: Berlin, Germany (ZIP: 13407)  
**API Key**: DB2730D2CC924F026F7392EC8548B099338A0996A806A77B0F213B2CC08B39FB-1

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **Frontend**: TypeScript + HTML5
- **Styling**: Tailwind CSS
- **Charts**: Custom SVG components + Chart.js for complex visualizations
- **API**: Tibber GraphQL API
- **Build Tool**: Vite
- **Deployment**: GitHub Pages with GitHub Actions

### Visual Design Inspiration
Based on the provided dashboard reference:
- **Theme**: Dark background with teal/blue accent colors (#14B8A6, #0891B2)
- **Layout**: Card-based design with subtle borders
- **Typography**: Large, bold numbers for key metrics
- **Charts**: Circular progress indicators and bar charts
- **Spacing**: Clean, modern spacing with proper visual hierarchy

## 📁 Project Structure
```
stromME-1/
├── index.html                 # Main HTML file
├── src/
│   ├── main.ts               # Application entry point
│   ├── types/
│   │   └── tibber.ts         # TypeScript interfaces
│   ├── services/
│   │   ├── tibberApi.ts      # API service layer
│   │   └── locationService.ts # Sunrise/sunset calculations
│   ├── components/
│   │   ├── PriceDisplay.ts   # Current/min/max price display
│   │   ├── ConsumptionChart.ts # 24h consumption visualization
│   │   ├── DeviceCostCalculator.ts # Device cost estimator
│   │   ├── CircularProgress.ts # Circular progress component
│   │   └── ThemeManager.ts   # Light/dark theme handler
│   └── utils/
│       ├── formatters.ts     # Price/time formatting utilities
│       └── constants.ts      # App constants and config
├── styles/
│   └── main.css             # Custom CSS + Tailwind imports
├── public/
│   └── 404.html            # GitHub Pages SPA fallback
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment
├── package.json            # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── README.md              # Setup and deployment guide
```

## 🎨 UI Layout Design

### Main Dashboard Layout
```
┌─────────────────────────────────────────────────────────────┐
│                    stromME Dashboard                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Today's Low │  │  Current Price  │  │ Today's High    │  │
│  │   +2.1%     │  │     25.896      │  │    +5.2%       │  │
│  │  XX.XX €/kWh │  │    €/kWh        │  │  XX.XX €/kWh    │  │
│  └─────────────┘  └─────────────────┘  └─────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Device Cost Calculator                     │  │
│  │  [Dropdown: Select Device] → Next Hour: XX.XX €        │  │
│  └─────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────────────────────────┐  │
│  │   Consumption   │  │        24h Usage Chart             │  │
│  │   Circular      │  │     ████ ████ ████ ████           │  │
│  │   Progress      │  │     Week1 Week2 Week3 Week4        │  │
│  │     95%         │  │                                     │  │
│  └─────────────────┘  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Color Scheme
- **Primary**: Teal (#14B8A6, #0891B2)
- **Secondary**: Amber (#F59E0B) for highlights
- **Background**: Dark gray (#1F2937, #111827)
- **Text**: Light gray (#F9FAFB, #E5E7EB)
- **Cards**: Dark gray with subtle borders (#374151)

## 🔧 Core Features Implementation

### 1. Price Display Component
**Visual Style**: Large metric cards with percentage indicators
- Current price: Large, bold display (similar to "25 896" in reference)
- Min/Max prices: Smaller cards with percentage change indicators
- Color coding: Green for favorable, red for high prices
- Smooth animations for price updates

**Data Requirements**:
```graphql
query {
  viewer {
    homes {
      currentSubscription {
        priceInfo {
          current {
            total
            energy
            tax
            startsAt
          }
          today {
            total
            energy
            tax
            startsAt
          }
        }
      }
    }
  }
}
```

### 2. Consumption Visualization
**Visual Style**: Combination of circular progress and bar charts
- Circular progress indicator showing daily consumption vs. target
- Bar chart for hourly consumption over 24 hours
- Today's total consumption estimate

**Data Requirements**:
```graphql
query {
  viewer {
    homes {
      consumption(resolution: HOURLY, last: 24) {
        nodes {
          from
          to
          cost
          unitPrice
          unitPriceVAT
          consumption
          consumptionUnit
        }
      }
    }
  }
}
```

### 3. Device Cost Calculator
**Visual Style**: Clean dropdown with cost display
- Device selection dropdown
- Real-time cost calculation for next hour
- Visual cost comparison between devices

**Predefined Devices**:
- Washing machine: 2 kW
- Tumble dryer: 3 kW
- Induction cooker: 2.5 kW
- Baking oven: 3.5 kW
- TV: 0.1 kW

### 4. Theme Management
**Automatic Switching**: Based on Berlin sunrise/sunset times
- Location: 52.5200° N, 13.4050° E (Berlin)
- Timezone: Europe/Berlin
- Manual override option
- Smooth transitions between themes

### 5. Circular Progress Component
**Custom SVG Implementation**:
```typescript
interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color: string;
  backgroundColor: string;
  label: string;
  value: string;
}
```

## 🚀 API Integration Strategy

### Tibber GraphQL Endpoints
- **Base URL**: `https://api.tibber.com/v1-beta/gql`
- **Authentication**: Bearer token in headers
- **CORS**: Handle via proxy or direct requests

### Key Queries

#### 1. Home Information & Current Prices
```graphql
query GetHomeData {
  viewer {
    homes {
      id
      appNickname
      address {
        address1
        postalCode
        city
      }
      currentSubscription {
        priceInfo {
          current {
            total
            energy
            tax
            startsAt
            level
          }
          today {
            total
            energy
            tax
            startsAt
            level
          }
        }
      }
    }
  }
}
```

#### 2. Consumption Data
```graphql
query GetConsumption($homeId: ID!) {
  viewer {
    home(id: $homeId) {
      consumption(resolution: HOURLY, last: 24) {
        nodes {
          from
          to
          cost
          unitPrice
          consumption
          consumptionUnit
        }
      }
    }
  }
}
```

#### 3. Price Forecast
```graphql
query GetPriceForecast($homeId: ID!) {
  viewer {
    home(id: $homeId) {
      currentSubscription {
        priceInfo {
          tomorrow {
            total
            energy
            tax
            startsAt
            level
          }
        }
      }
    }
  }
}
```

## 📱 Responsive Design Strategy

### Breakpoints
- **Mobile**: < 768px (Stacked layout)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (3-column layout)

### Mobile-First Approach
```css
/* Mobile: Stacked cards */
.dashboard-grid {
  @apply grid grid-cols-1 gap-4;
}

/* Tablet: 2-column layout */
@media (min-width: 768px) {
  .dashboard-grid {
    @apply grid-cols-2;
  }
}

/* Desktop: 3-column layout */
@media (min-width: 1024px) {
  .dashboard-grid {
    @apply grid-cols-3;
  }
}
```

## 🔄 Data Flow & State Management

### Application State
```typescript
interface AppState {
  currentPrice: PriceInfo | null;
  todayPrices: PriceInfo[];
  consumption: ConsumptionData[];
  selectedDevice: Device | null;
  theme: 'light' | 'dark' | 'auto';
  loading: boolean;
  error: string | null;
}
```

### Update Intervals
- **Price data**: Every 5 minutes
- **Consumption data**: Every 15 minutes
- **Theme check**: Every hour
- **Sunrise/sunset**: Daily at midnight

## 🚀 Deployment Configuration

### GitHub Actions Workflow
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Vite Configuration
```typescript
export default defineConfig({
  base: '/stromME/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.tibber.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

## 🧪 Development Phases

### Phase 1: Foundation (Day 1)
- [x] Project setup with Vite + TypeScript + Tailwind
- [x] Basic HTML structure and routing
- [x] Tibber API service implementation
- [x] TypeScript interfaces and types

### Phase 2: Core Components (Day 1-2)
- [ ] Price display component with animations
- [ ] Circular progress component
- [ ] Basic consumption chart
- [ ] Device cost calculator

### Phase 3: Advanced Features (Day 2)
- [ ] Theme management system
- [ ] Responsive design implementation
- [ ] Error handling and loading states
- [ ] Data caching and optimization

### Phase 4: Polish & Deploy (Day 2-3)
- [ ] Visual refinements and animations
- [ ] Performance optimization
- [ ] GitHub Actions setup
- [ ] Documentation and README

## 🔧 Configuration Files

### Environment Variables
```env
VITE_TIBBER_API_KEY=DB2730D2CC924F026F7392EC8548B099338A0996A806A77B0F213B2CC08B39FB-1
VITE_LOCATION_LAT=52.5200
VITE_LOCATION_LON=13.4050
VITE_TIMEZONE=Europe/Berlin
```

### Tailwind Configuration
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#14B8A6',
          600: '#0891B2',
        },
        secondary: {
          500: '#F59E0B',
        },
        dark: {
          800: '#1F2937',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
};
```

## 📋 Success Criteria

### Functional Requirements
- ✅ Display current electricity price prominently
- ✅ Show today's min/max prices with timestamps
- ✅ Visualize 24-hour consumption data
- ✅ Calculate device costs for next hour
- ✅ Automatic theme switching based on time
- ✅ Responsive design for all devices
- ✅ Deploy successfully to GitHub Pages

### Performance Requirements
- ✅ Initial load time < 3 seconds
- ✅ API response handling < 1 second
- ✅ Smooth animations (60fps)
- ✅ Mobile-friendly performance

### User Experience Requirements
- ✅ Intuitive navigation and layout
- ✅ Clear visual hierarchy
- ✅ Accessible color contrast
- ✅ Error states and loading indicators
- ✅ Offline-friendly caching

---

## 🚀 Ready for Implementation

This plan provides a comprehensive roadmap for building the stromME electricity price dashboard. The next step is to begin implementation starting with the project foundation and core components.

**Estimated Development Time**: 2-3 days  
**Complexity Level**: Intermediate  
**Key Challenges**: Tibber API integration, responsive chart implementation, theme automation