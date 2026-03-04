# City Map Poster Generator

City Map Poster Generator is a full-stack web application that lets users generate beautiful, high-resolution map posters for any city in the world.

Users enter a city name, country, and styling preferences through a web interface, and the application generates a printable poster using OpenStreetMap data. The generated poster can be previewed and downloaded directly from the browser.

---

## ✨ Features

- Generate detailed city map posters from OpenStreetMap data
- Multiple visual themes and styles
- High-resolution output suitable for printing
- Simple web-based user interface
- On-demand poster generation

---

## 🛠️ Tech Stack

### Backend

- **Python** — core language
- **FastAPI** — REST API framework
- **Celery** — background job queue for async poster generation
- **Redis** — message broker and job result store

### Frontend

- **React** — UI framework
- **TypeScript** — type safety
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling
- **shadcn/ui** — component library

### Data

- **OpenStreetMap** — map data source

---
