# VM & Appliance Requirements Calculator

A web application for calculating VM and appliance requirements based on asset count and retention period.

## Inputs

- **Number of Assets** - The total number of assets to be monitored
- **Days of Retention** - How long data should be retained
- **Volume per Asset** - Configurable multiplier (50, 60, or 70 MB, with 60 MB as default). Custom values supported.

## Calculations

### Volume
```
Volume (MB) = Number of Assets × Volume per Asset (MB)
```

### VM Requirements

| Component | Specs | Formula |
|-----------|-------|---------|
| Data Analyzer Worker | 64GB RAM, 16 CPU, 500GB system disk | `roundup(volume / 300)` |
| Data Lake Worker | 128GB RAM, 16 CPU, 500GB system disk, 16TB data disk | `roundup(((volume × retention) / 12700) × 1.05)` |
| MDS Disabled? | Data Lake master has no data storage, +1 node for master | Yes if DL worker ≥ 3 |
| Coordinate Node? | Recommended after 5 data nodes, increases search performance | Yes if DL worker ≥ 5 |

### Appliance Requirements (Base)

| Component | Formula |
|-----------|---------|
| M6000 Appliance (equivalent) | `roundup(((volume × retention) / 11500) × 1.05)` |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
