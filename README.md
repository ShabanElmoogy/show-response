# JSON Response Parser

A modern React application for parsing and visualizing JSON data in an interactive grid format. Built with Vite, TypeScript, and Material-UI.

## Features

- 📊 **Interactive Data Grid** - View JSON data in a sortable, filterable table
- 🔧 **JSON Fixer** - Automatically fix common JSON formatting issues
- 🎨 **Collapsible Interface** - Minimize input panel for better data viewing
- 📋 **Copy to Clipboard** - Easy JSON copying functionality
- ⚡ **Real-time Parsing** - Instant JSON validation and grid updates
- 🎯 **Error Handling** - Clear error messages for invalid JSON

## Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **Data Grid**: AG Grid Community
- **Styling**: Emotion (CSS-in-JS)

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd show-response
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Input JSON**: Paste or type your JSON data in the left panel
2. **Auto-Parse**: The grid automatically updates as you type
3. **Fix JSON**: Use the "Fix JSON" button to correct common formatting issues
4. **View Data**: Explore your data in the interactive grid on the right
5. **Collapse Panel**: Click the arrow to minimize the input panel for better viewing

### Example JSON Input
```json
[
  {"id": 1, "name": "Alice", "email": "alice@example.com"},
  {"id": 2, "name": "Bob", "email": "bob@example.com"}
]
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/          # React components
│   ├── JsonGrid.tsx     # Data grid component
│   └── JsonParserContainer.tsx  # Main container
├── hooks/              # Custom React hooks
│   └── useJsonGrid.ts  # JSON parsing logic
├── styles/             # Global styles and themes
│   ├── globals.css
│   ├── muiTheme.ts
│   └── theme.ts
├── assets/             # Static assets
├── utils/              # Utility functions
└── App.tsx             # Main app component
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- UI components from [Material-UI](https://mui.com/)
- Data grid powered by [AG Grid](https://ag-grid.com/)
